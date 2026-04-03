# ════════════════════════════════════════════════════════════
#  routes/notifications.py
# ════════════════════════════════════════════════════════════
from fastapi import APIRouter, Depends, Query, HTTPException
from app.config.supabase import get_supabase_admin
from app.middleware.auth import get_current_user

notif_router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@notif_router.get("")
async def list_notifications(
    page:  int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    current_user: dict = Depends(get_current_user),
):
    admin  = get_supabase_admin()
    uid    = current_user["id"]
    offset = (page - 1) * limit

    result = (
        admin.table("notifications")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    unread = admin.table("notifications").select("id", count="exact")\
        .eq("user_id", uid).eq("is_read", False).execute()

    return {"success": True, "unread_count": unread.count or 0, "notifications": result.data}


@notif_router.put("/{notif_id}/read")
async def mark_read(notif_id: str, current_user: dict = Depends(get_current_user)):
    admin  = get_supabase_admin()
    result = admin.table("notifications").update({"is_read": True})\
        .eq("id", notif_id).eq("user_id", current_user["id"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}


@notif_router.put("/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    admin = get_supabase_admin()
    admin.table("notifications").update({"is_read": True})\
        .eq("user_id", current_user["id"]).eq("is_read", False).execute()
    return {"success": True, "message": "All notifications marked as read"}


@notif_router.delete("/{notif_id}")
async def delete_notification(notif_id: str, current_user: dict = Depends(get_current_user)):
    admin = get_supabase_admin()
    admin.table("notifications").delete()\
        .eq("id", notif_id).eq("user_id", current_user["id"]).execute()
    return {"success": True}


# ════════════════════════════════════════════════════════════
#  routes/knowledge.py
# ════════════════════════════════════════════════════════════
from fastapi import APIRouter
from app.middleware.auth import require_roles
from app.schemas.models import CreateModuleRequest, CreateResourceRequest

know_router = APIRouter(prefix="/api/knowledge", tags=["Knowledge"])

@know_router.get("")
async def list_modules(role: str = None):
    admin = get_supabase_admin()
    query = admin.table("knowledge_modules").select("*, resources:knowledge_resources(*)").eq("is_published", True)
    if role:
        query = query.in_("target_role", [role, "all"])
    result = query.order("order", desc=False).execute()
    return {"success": True, "modules": result.data}

@know_router.get("/{module_id}")
async def get_module(module_id: str):
    admin  = get_supabase_admin()
    result = admin.table("knowledge_modules").select("*, resources:knowledge_resources(*)")\
        .eq("id", module_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"success": True, "module": result.data}

@know_router.post("", status_code=201)
async def create_module(data: CreateModuleRequest, current_user: dict = Depends(require_roles("admin"))):
    admin  = get_supabase_admin()
    result = admin.table("knowledge_modules").insert({**data.model_dump(), "created_by": current_user["id"]}).execute()
    return {"success": True, "module": result.data[0]}

@know_router.put("/{module_id}")
async def update_module(module_id: str, data: CreateModuleRequest, current_user: dict = Depends(require_roles("admin"))):
    admin  = get_supabase_admin()
    result = admin.table("knowledge_modules").update(data.model_dump(exclude_none=True)).eq("id", module_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"success": True, "module": result.data[0]}

@know_router.delete("/{module_id}")
async def delete_module(module_id: str, current_user: dict = Depends(require_roles("admin"))):
    admin = get_supabase_admin()
    admin.table("knowledge_resources").delete().eq("module_id", module_id).execute()
    admin.table("knowledge_modules").delete().eq("id", module_id).execute()
    return {"success": True}

@know_router.post("/{module_id}/resources", status_code=201)
async def add_resource(module_id: str, data: CreateResourceRequest, current_user: dict = Depends(require_roles("admin"))):
    admin  = get_supabase_admin()
    result = admin.table("knowledge_resources").insert({**data.model_dump(), "module_id": module_id}).execute()
    return {"success": True, "resource": result.data[0]}

@know_router.put("/{module_id}/resources/{resource_id}")
async def update_resource(module_id: str, resource_id: str, data: CreateResourceRequest, current_user: dict = Depends(require_roles("admin"))):
    admin  = get_supabase_admin()
    result = admin.table("knowledge_resources").update(data.model_dump(exclude_none=True))\
        .eq("id", resource_id).eq("module_id", module_id).execute()
    return {"success": True, "resource": result.data[0] if result.data else None}

@know_router.delete("/{module_id}/resources/{resource_id}")
async def delete_resource(module_id: str, resource_id: str, current_user: dict = Depends(require_roles("admin"))):
    admin = get_supabase_admin()
    admin.table("knowledge_resources").delete().eq("id", resource_id).eq("module_id", module_id).execute()
    return {"success": True}


# ════════════════════════════════════════════════════════════
#  routes/reviews.py
# ════════════════════════════════════════════════════════════
from app.schemas.models import CreateReviewRequest, ReplyReviewRequest

review_router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@review_router.get("/product/{product_id}")
async def get_product_reviews(product_id: str, page: int = Query(1, ge=1), limit: int = Query(10, le=50)):
    admin  = get_supabase_admin()
    offset = (page - 1) * limit
    result = admin.table("reviews").select("*, buyer:profiles!reviews_buyer_id_fkey(name,avatar_url)")\
        .eq("product_id", product_id).order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    total  = admin.table("reviews").select("id", count="exact").eq("product_id", product_id).execute()
    return {"success": True, "total": total.count or 0, "reviews": result.data}

@review_router.get("/farmer/{farmer_id}")
async def get_farmer_reviews(farmer_id: str):
    admin  = get_supabase_admin()
    result = admin.table("reviews").select("*, buyer:profiles!reviews_buyer_id_fkey(name,avatar_url), product:products(title,images)")\
        .eq("farmer_id", farmer_id).order("created_at", desc=True).limit(20).execute()
    return {"success": True, "reviews": result.data}

@review_router.post("", status_code=201)
async def create_review(data: CreateReviewRequest, current_user: dict = Depends(require_roles("buyer"))):
    admin = get_supabase_admin()
    # Verify delivered order containing this product
    order = admin.table("orders").select("farmer_id")\
        .eq("id", data.order_id).eq("buyer_id", current_user["id"])\
        .eq("order_status", "delivered").execute()
    if not order.data:
        raise HTTPException(status_code=403, detail="You can only review products from delivered orders")
    # Check duplicate
    dup = admin.table("reviews").select("id").eq("product_id", data.product_id).eq("buyer_id", current_user["id"]).execute()
    if dup.data:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")

    result = admin.table("reviews").insert({
        "product_id": data.product_id,
        "farmer_id":  order.data[0]["farmer_id"],
        "buyer_id":   current_user["id"],
        "order_id":   data.order_id,
        "rating":     data.rating,
        "comment":    data.comment,
    }).execute()
    return {"success": True, "review": result.data[0]}

@review_router.put("/{review_id}/reply")
async def reply_review(review_id: str, data: ReplyReviewRequest, current_user: dict = Depends(require_roles("farmer"))):
    admin  = get_supabase_admin()
    result = admin.table("reviews").update({"reply_text": data.text, "replied_at": "now()"})\
        .eq("id", review_id).eq("farmer_id", current_user["id"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"success": True, "review": result.data[0]}

@review_router.delete("/{review_id}")
async def delete_review(review_id: str, current_user: dict = Depends(get_current_user)):
    admin = get_supabase_admin()
    filter_q = admin.table("reviews").delete().eq("id", review_id)
    if current_user["role"] != "admin":
        filter_q = filter_q.eq("buyer_id", current_user["id"])
    filter_q.execute()
    return {"success": True}


# ════════════════════════════════════════════════════════════
#  routes/analytics.py
# ════════════════════════════════════════════════════════════
analytics_router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@analytics_router.get("")
async def get_analytics(current_user: dict = Depends(require_roles("admin"))):
    admin = get_supabase_admin()

    farmers_count  = admin.table("profiles").select("id", count="exact").eq("role", "farmer").eq("is_active", True).execute()
    buyers_count   = admin.table("profiles").select("id", count="exact").eq("role", "buyer").eq("is_active", True).execute()
    products_count = admin.table("products").select("id", count="exact").eq("status", "approved").execute()
    pending_count  = admin.table("products").select("id", count="exact").eq("status", "pending").execute()
    orders_count   = admin.table("orders").select("id", count="exact").execute()
    delivered      = admin.table("orders").select("total_amount").eq("order_status", "delivered").execute()
    total_revenue  = sum(o["total_amount"] for o in (delivered.data or []))
    disputes       = admin.table("orders").select("id", count="exact").eq("order_status", "disputed").execute()

    # Orders by status
    statuses = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    orders_by_status = {}
    for s in statuses:
        r = admin.table("orders").select("id", count="exact").eq("order_status", s).execute()
        orders_by_status[s] = r.count or 0

    # Top products by order volume
    top_products = (
        admin.table("reviews")
        .select("product_id, products(title)")
        .limit(5)
        .execute()
    )

    return {
        "success": True,
        "stats": {
            "total_farmers":        farmers_count.count or 0,
            "total_buyers":         buyers_count.count or 0,
            "total_products":       products_count.count or 0,
            "pending_products":     pending_count.count or 0,
            "total_orders":         orders_count.count or 0,
            "total_revenue":        round(total_revenue, 2),
            "active_disputes":      disputes.count or 0,
            "orders_by_status":     orders_by_status,
        },
    }


# ════════════════════════════════════════════════════════════
#  routes/upload.py
# ════════════════════════════════════════════════════════════
from fastapi import UploadFile, File
import os

upload_router = APIRouter(prefix="/api/upload", tags=["Upload"])

@upload_router.post("/product-image")
async def upload_product_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_roles("farmer", "admin")),
):
    """Upload a product image to Supabase Storage."""
    admin    = get_supabase_admin()
    settings = get_supabase_admin()   # re-use admin client
    from app.config.supabase import get_settings
    cfg      = get_settings()
    bucket   = cfg.storage_bucket_products

    contents  = await file.read()
    file_ext  = file.filename.split(".")[-1]
    file_path = f"{current_user['id']}/{os.urandom(8).hex()}.{file_ext}"

    try:
        admin.storage.from_(bucket).upload(file_path, contents, {"content-type": file.content_type})
        url = admin.storage.from_(bucket).get_public_url(file_path)
        return {"success": True, "url": url, "path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@upload_router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a profile avatar to Supabase Storage."""
    admin    = get_supabase_admin()
    from app.config.supabase import get_settings
    cfg      = get_settings()
    bucket   = cfg.storage_bucket_avatars

    contents  = await file.read()
    file_ext  = file.filename.split(".")[-1]
    file_path = f"{current_user['id']}/avatar.{file_ext}"

    try:
        admin.storage.from_(bucket).upload(file_path, contents, {"content-type": file.content_type, "upsert": "true"})
        url = admin.storage.from_(bucket).get_public_url(file_path)
        # Save URL to profile
        admin.table("profiles").update({"avatar_url": url}).eq("id", current_user["id"]).execute()
        return {"success": True, "url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@upload_router.delete("/product-image")
async def delete_product_image(
    path: str,
    current_user: dict = Depends(require_roles("farmer", "admin")),
):
    admin = get_supabase_admin()
    from app.config.supabase import get_settings
    cfg   = get_settings()
    try:
        admin.storage.from_(cfg.storage_bucket_products).remove([path])
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
