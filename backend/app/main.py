"""
main.py — Rural Entrepreneurship Platform Backend
FastAPI + Supabase
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from app.config.supabase import get_settings

# ── Route imports ─────────────────────────────────────────────────────────────
from app.routes.auth     import router as auth_router
from app.routes.products import router as products_router
from app.routes.orders   import router as orders_router
from app.routes.messages import router as messages_router
from app.routes.other_routes import (
    notif_router, know_router, review_router, analytics_router, upload_router
)

# ── Users router (inline for simplicity) ─────────────────────────────────────
from fastapi import APIRouter, Depends, Query, HTTPException
from app.config.supabase import get_supabase_admin
from app.middleware.auth import get_current_user, require_roles
from typing import Optional

users_router = APIRouter(prefix="/api/users", tags=["Users"])

@users_router.get("")
async def list_users(
    role:      Optional[str] = None,
    is_active: Optional[bool] = None,
    search:    Optional[str] = None,
    page:      int = Query(1, ge=1),
    limit:     int = Query(20, le=100),
    current_user: dict = Depends(require_roles("admin")),
):
    admin  = get_supabase_admin()
    offset = (page - 1) * limit
    query  = admin.table("profiles").select("*")
    if role:     query = query.eq("role", role)
    if is_active is not None: query = query.eq("is_active", is_active)
    if search:
        query = query.or_(f"name.ilike.%{search}%,username.ilike.%{search}%,email.ilike.%{search}%")
    result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return {"success": True, "users": result.data}

@users_router.get("/farmers/public")
async def public_farmers():
    admin  = get_supabase_admin()
    result = admin.table("profiles")\
        .select("id,name,farm_name,bio,avatar_url,address,crops,certifications,is_verified,created_at")\
        .eq("role", "farmer").eq("is_active", True).order("created_at", desc=True).execute()
    return {"success": True, "farmers": result.data}

@users_router.get("/{user_id}")
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    admin = get_supabase_admin()
    if current_user["role"] != "admin" and current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    result = admin.table("profiles").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "user": result.data}

@users_router.put("/{user_id}")
async def admin_update_user(user_id: str, updates: dict, current_user: dict = Depends(require_roles("admin"))):
    admin = get_supabase_admin()
    updates.pop("password", None)
    result = admin.table("profiles").update(updates).eq("id", user_id).execute()
    return {"success": True, "user": result.data[0] if result.data else None}

@users_router.delete("/{user_id}")
async def deactivate_user(user_id: str, current_user: dict = Depends(require_roles("admin"))):
    admin = get_supabase_admin()
    admin.table("profiles").update({"is_active": False}).eq("id", user_id).execute()
    return {"success": True, "message": "User deactivated"}

@users_router.put("/{user_id}/verify")
async def verify_farmer(user_id: str, current_user: dict = Depends(require_roles("admin"))):
    admin  = get_supabase_admin()
    result = admin.table("profiles").update({"is_verified": True})\
        .eq("id", user_id).eq("role", "farmer").execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return {"success": True, "message": "Farmer verified"}


# ── Rate Limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    print(f"\n🌾 Rural Entrepreneurship Backend")
    print(f"🚀 Environment: {settings.app_env}")
    print(f"🔗 Supabase: {settings.supabase_url}\n")
    yield
    print("🛑 Shutting down...")


# ── Create App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Rural Entrepreneurship Platform API",
    description="Backend API for empowering farmers in rural India 🌾",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handler ──────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "OK", "message": "Rural Entrepreneurship API is running 🌾"}

# ── Register all routers ──────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(messages_router)
app.include_router(notif_router)
app.include_router(know_router)
app.include_router(review_router)
app.include_router(analytics_router)
app.include_router(upload_router)

# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.app_port, reload=True)
