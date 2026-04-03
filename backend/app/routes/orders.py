from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.config.supabase import get_supabase_admin
from app.middleware.auth import get_current_user, require_roles
from app.schemas.models import CreateOrderRequest, UpdateOrderStatusRequest, RaiseDisputeRequest

router = APIRouter(prefix="/api/orders", tags=["Orders"])

# ── Shipping calculator ───────────────────────────────────────────────────────
SHIPPING = {
    "standard": {"cost": 40,  "eta": "5-7 business days"},
    "express":  {"cost": 100, "eta": "2-3 business days"},
    "priority": {"cost": 200, "eta": "1 business day"},
}

VALID_TRANSITIONS = {
    "placed":           ["confirmed", "cancelled"],
    "confirmed":        ["processing", "cancelled"],
    "processing":       ["ready_to_ship", "cancelled"],
    "ready_to_ship":    ["shipped"],
    "shipped":          ["out_for_delivery"],
    "out_for_delivery": ["delivered"],
    "delivered":        ["disputed"],
}


@router.post("", status_code=201)
async def place_order(
    data: CreateOrderRequest,
    current_user: dict = Depends(require_roles("buyer")),
):
    admin = get_supabase_admin()
    if not data.items:
        raise HTTPException(status_code=400, detail="No items in order")

    subtotal  = 0.0
    farmer_id = None
    order_items = []

    for item in data.items:
        prod_res = (
            admin.table("products")
            .select("id,title,price,unit,stock,farmer_id,status")
            .eq("id", item.product_id)
            .single()
            .execute()
        )
        if not prod_res.data:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        p = prod_res.data

        if p["status"] != "approved":
            raise HTTPException(status_code=400, detail=f'"{p["title"]}" is not available')
        if p["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f'Insufficient stock for "{p["title"]}"')

        # All items must be from the same farmer
        if farmer_id is None:
            farmer_id = p["farmer_id"]
        elif farmer_id != p["farmer_id"]:
            raise HTTPException(status_code=400, detail="All items must be from the same farmer")

        item_subtotal = p["price"] * item.quantity
        subtotal += item_subtotal
        order_items.append({
            "product_id": p["id"],
            "title":      p["title"],
            "price":      p["price"],
            "unit":       p["unit"],
            "quantity":   item.quantity,
            "subtotal":   item_subtotal,
        })

    shipping      = SHIPPING[data.shipping_method]
    shipping_cost = shipping["cost"]
    total_amount  = subtotal + shipping_cost

    # Create order
    order_res = admin.table("orders").insert({
        "buyer_id":         current_user["id"],
        "farmer_id":        farmer_id,
        "items":            order_items,
        "shipping_address": data.shipping_address.model_dump(),
        "shipping_method":  data.shipping_method,
        "shipping_cost":    shipping_cost,
        "shipping_eta":     shipping["eta"],
        "payment_method":   data.payment_method,
        "subtotal":         subtotal,
        "total_amount":     total_amount,
        "order_status":     "placed",
        "payment_status":   "pending",
        "notes":            data.notes,
        "status_history":   [{"status": "placed", "note": "Order placed by buyer"}],
    }).execute()

    order = order_res.data[0]

    # Reduce stock for each product
    for item in data.items:
        prod = next(i for i in order_items if i["product_id"] == item.product_id)
        admin.rpc("decrement_stock", {
            "p_product_id": item.product_id,
            "p_qty": item.quantity,
        }).execute()

    # Notify farmer
    short_id = order["id"][-6:].upper()
    admin.table("notifications").insert({
        "user_id": farmer_id,
        "title":   "New Order Received! 🛒",
        "message": f"Order #{short_id} — ₹{total_amount:.2f}",
        "type":    "order",
        "link":    f"/farmer/orders/{order['id']}",
    }).execute()

    return {"success": True, "order": order}


@router.get("")
async def list_orders(
    status:    Optional[str] = None,
    page:      int = Query(1, ge=1),
    limit:     int = Query(10, le=50),
    start_date: Optional[str] = None,
    end_date:   Optional[str] = None,
    current_user: dict = Depends(get_current_user),
):
    admin  = get_supabase_admin()
    offset = (page - 1) * limit

    query = admin.table("orders").select(
        "*, buyer:profiles!orders_buyer_id_fkey(name,email,phone),"
        "farmer:profiles!orders_farmer_id_fkey(name,farm_name,phone)"
    )

    if current_user["role"] == "buyer":
        query = query.eq("buyer_id", current_user["id"])
    elif current_user["role"] == "farmer":
        query = query.eq("farmer_id", current_user["id"])
    # admin sees all

    if status:     query = query.eq("order_status", status)
    if start_date: query = query.gte("created_at", start_date)
    if end_date:   query = query.lte("created_at", end_date)

    result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return {"success": True, "orders": result.data}


@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
):
    admin = get_supabase_admin()
    result = (
        admin.table("orders")
        .select(
            "*, buyer:profiles!orders_buyer_id_fkey(name,email,phone,address),"
            "farmer:profiles!orders_farmer_id_fkey(name,farm_name,phone,address)"
        )
        .eq("id", order_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")

    order = result.data
    uid   = current_user["id"]
    if current_user["role"] != "admin" and order["buyer_id"] != uid and order["farmer_id"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")

    return {"success": True, "order": order}


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    data:     UpdateOrderStatusRequest,
    current_user: dict = Depends(require_roles("farmer", "admin")),
):
    admin  = get_supabase_admin()
    o_res  = admin.table("orders").select("*").eq("id", order_id).single().execute()
    if not o_res.data:
        raise HTTPException(status_code=404, detail="Order not found")

    order = o_res.data
    if current_user["role"] == "farmer" and order["farmer_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    current_status = order["order_status"]
    if current_user["role"] != "admin":
        if data.status not in VALID_TRANSITIONS.get(current_status, []):
            raise HTTPException(
                status_code=400,
                detail=f"Cannot transition from '{current_status}' to '{data.status}'"
            )

    history = order.get("status_history", [])
    history.append({"status": data.status, "note": data.note or ""})

    updates = {"order_status": data.status, "status_history": history}
    if data.tracking_number: updates["tracking_number"] = data.tracking_number
    if data.tracking_url:    updates["tracking_url"]    = data.tracking_url

    result = admin.table("orders").update(updates).eq("id", order_id).execute()

    # Notify buyer
    admin.table("notifications").insert({
        "user_id": order["buyer_id"],
        "title":   "Order Update",
        "message": f"Order #{order_id[-6:].upper()} is now: {data.status.replace('_', ' ')}",
        "type":    "order",
        "link":    f"/buyer/orders/{order_id}",
    }).execute()

    return {"success": True, "order": result.data[0]}


@router.put("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    reason:   Optional[str] = None,
    current_user: dict = Depends(require_roles("buyer")),
):
    admin = get_supabase_admin()
    o_res = admin.table("orders").select("*").eq("id", order_id).eq("buyer_id", current_user["id"]).single().execute()
    if not o_res.data:
        raise HTTPException(status_code=404, detail="Order not found")
    if o_res.data["order_status"] != "placed":
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage")

    order   = o_res.data
    history = order.get("status_history", [])
    history.append({"status": "cancelled", "note": reason or "Cancelled by buyer"})

    result = admin.table("orders").update({
        "order_status":   "cancelled",
        "status_history": history,
    }).eq("id", order_id).execute()

    # Restore stock
    for item in order.get("items", []):
        admin.rpc("increment_stock", {
            "p_product_id": item["product_id"],
            "p_qty":        item["quantity"],
        }).execute()

    return {"success": True, "order": result.data[0]}


@router.post("/{order_id}/dispute")
async def raise_dispute(
    order_id: str,
    data:     RaiseDisputeRequest,
    current_user: dict = Depends(require_roles("buyer")),
):
    admin = get_supabase_admin()
    o_res = admin.table("orders").select("*").eq("id", order_id).eq("buyer_id", current_user["id"]).single().execute()
    if not o_res.data:
        raise HTTPException(status_code=404, detail="Order not found")

    order = o_res.data
    if order.get("dispute", {}).get("raised"):
        raise HTTPException(status_code=400, detail="Dispute already raised")

    history = order.get("status_history", [])
    history.append({"status": "disputed", "note": data.description})

    result = admin.table("orders").update({
        "order_status":   "disputed",
        "status_history": history,
        "dispute": {"raised": True, "description": data.description},
    }).eq("id", order_id).execute()

    return {"success": True, "order": result.data[0]}
