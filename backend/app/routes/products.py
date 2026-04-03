from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.config.supabase import get_supabase_admin
from app.middleware.auth import get_current_user, require_roles
from app.schemas.models import CreateProductRequest, UpdateProductRequest, ModerateProductRequest

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("")
async def browse_products(
    search:       Optional[str] = None,
    category:     Optional[str] = None,
    product_type: Optional[str] = None,
    is_organic:   Optional[bool] = None,
    is_fair_trade: Optional[bool] = None,
    min_price:    Optional[float] = None,
    max_price:    Optional[float] = None,
    farmer_id:    Optional[str] = None,
    location:     Optional[str] = None,
    sort:         str = "created_at.desc",
    page:         int = Query(1, ge=1),
    limit:        int = Query(12, le=50),
):
    """Browse approved products — public endpoint."""
    admin = get_supabase_admin()

    query = (
        admin.table("products")
        .select("*, profiles!products_farmer_id_fkey(id,name,farm_name,avatar_url,is_verified,address)")
        .eq("status", "approved")
        .eq("is_available", True)
        .gt("stock", 0)
    )

    if category:     query = query.eq("category", category)
    if product_type: query = query.eq("product_type", product_type)
    if is_organic:   query = query.eq("is_organic", True)
    if is_fair_trade: query = query.eq("is_fair_trade", True)
    if farmer_id:    query = query.eq("farmer_id", farmer_id)
    if min_price:    query = query.gte("price", min_price)
    if max_price:    query = query.lte("price", max_price)
    if location:     query = query.ilike("location_state", f"%{location}%")

    # Full-text search via Supabase
    if search:
        query = query.text_search("search_vector", search, type="websearch")

    # Sorting
    allowed_sorts = {
        "created_at.desc": ("created_at", False),
        "created_at.asc":  ("created_at", True),
        "price.asc":       ("price", True),
        "price.desc":      ("price", False),
        "average_rating.desc": ("average_rating", False),
    }
    sort_col, ascending = allowed_sorts.get(sort, ("created_at", False))

    offset = (page - 1) * limit
    result = (
        query.order(sort_col, desc=not ascending)
        .range(offset, offset + limit - 1)
        .execute()
    )

    # Get total count
    count_result = (
        admin.table("products")
        .select("id", count="exact")
        .eq("status", "approved")
        .eq("is_available", True)
        .execute()
    )
    total = count_result.count or 0

    return {
        "success":  True,
        "total":    total,
        "page":     page,
        "pages":    -(-total // limit),
        "products": result.data,
    }


@router.get("/my")
async def get_my_products(
    status: Optional[str] = None,
    page:   int = Query(1, ge=1),
    limit:  int = Query(20, le=100),
    current_user: dict = Depends(require_roles("farmer")),
):
    """Farmer: get their own product listings (all statuses)."""
    admin  = get_supabase_admin()
    offset = (page - 1) * limit

    query = admin.table("products").select("*").eq("farmer_id", current_user["id"])
    if status:
        query = query.eq("status", status)

    result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return {"success": True, "products": result.data}


@router.get("/pending")
async def get_pending_products(
    current_user: dict = Depends(require_roles("admin")),
):
    """Admin: get products awaiting moderation."""
    admin  = get_supabase_admin()
    result = (
        admin.table("products")
        .select("*, profiles!products_farmer_id_fkey(name, farm_name)")
        .eq("status", "pending")
        .order("created_at", desc=False)
        .execute()
    )
    return {"success": True, "count": len(result.data), "products": result.data}


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get full product detail with farmer info and recent reviews."""
    admin = get_supabase_admin()

    product_res = (
        admin.table("products")
        .select("*, profiles!products_farmer_id_fkey(id,name,farm_name,avatar_url,phone,is_verified,bio,address)")
        .eq("id", product_id)
        .single()
        .execute()
    )
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")

    reviews_res = (
        admin.table("reviews")
        .select("*, profiles!reviews_buyer_id_fkey(name, avatar_url)")
        .eq("product_id", product_id)
        .order("created_at", desc=True)
        .limit(10)
        .execute()
    )

    product = product_res.data
    product["reviews"] = reviews_res.data
    return {"success": True, "product": product}


@router.post("", status_code=201)
async def create_product(
    data: CreateProductRequest,
    current_user: dict = Depends(require_roles("farmer")),
):
    """Farmer: create a new product listing (starts as 'pending' for admin review)."""
    admin = get_supabase_admin()

    product = {
        **data.model_dump(),
        "farmer_id":       current_user["id"],
        "status":          "pending",
        "is_available":    True,
        "average_rating":  0,
        "review_count":    0,
    }
    result = admin.table("products").insert(product).execute()
    return {"success": True, "product": result.data[0]}


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    data:       UpdateProductRequest,
    current_user: dict = Depends(get_current_user),
):
    """Farmer (own product) or Admin: update a product."""
    admin = get_supabase_admin()

    existing = admin.table("products").select("farmer_id").eq("id", product_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")

    if current_user["role"] == "farmer":
        if existing.data["farmer_id"] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized to edit this product")

    updates = {k: v for k, v in data.model_dump(exclude_none=True).items()}

    # If key fields changed, reset to pending review
    if current_user["role"] == "farmer" and any(k in updates for k in ["title", "price", "description"]):
        updates["status"] = "pending"

    result = admin.table("products").update(updates).eq("id", product_id).execute()
    return {"success": True, "product": result.data[0]}


@router.put("/{product_id}/moderate")
async def moderate_product(
    product_id: str,
    data:       ModerateProductRequest,
    current_user: dict = Depends(require_roles("admin")),
):
    """Admin: approve or reject a product listing."""
    admin = get_supabase_admin()

    updates = {"status": data.status}
    if data.rejection_reason:
        updates["rejection_reason"] = data.rejection_reason

    result = admin.table("products").update(updates).eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")

    product   = result.data[0]
    farmer_id = product["farmer_id"]

    # Create notification for farmer
    msg = (
        f'Your product "{product["title"]}" has been approved and is now live!'
        if data.status == "approved"
        else f'Your product "{product["title"]}" was rejected. Reason: {data.rejection_reason or "Not specified"}'
    )
    admin.table("notifications").insert({
        "user_id": farmer_id,
        "title":   f"Product {data.status.capitalize()}",
        "message": msg,
        "type":    "product",
        "link":    "/farmer/products",
    }).execute()

    return {"success": True, "product": product}


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Farmer (own) or Admin: delete a product."""
    admin    = get_supabase_admin()
    existing = admin.table("products").select("farmer_id").eq("id", product_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")

    if current_user["role"] == "farmer" and existing.data["farmer_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    admin.table("products").delete().eq("id", product_id).execute()
    return {"success": True, "message": "Product deleted"}
