from fastapi import APIRouter, HTTPException, Depends
from app.config.supabase import get_supabase, get_supabase_admin, get_settings
from app.middleware.auth import get_current_user
from app.schemas.models import RegisterRequest, LoginRequest, UpdateProfileRequest, UpdatePasswordRequest

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", status_code=201)
async def register(data: RegisterRequest):
    """
    Register a new farmer or buyer.
    1. Creates Supabase Auth user (email + password)
    2. Inserts profile row (username, name, role, etc.)
    """
    supabase = get_supabase()
    admin    = get_supabase_admin()

    # Check username uniqueness (profiles table)
    existing = admin.table("profiles").select("id").eq("username", data.username).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create Supabase Auth user
    try:
        auth_response = supabase.auth.sign_up({
            "email":    data.email,
            "password": data.password,
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not auth_response.user:
        raise HTTPException(status_code=400, detail="Registration failed")

    user_id = auth_response.user.id

    # Insert into profiles table
    profile = {
        "id":       user_id,
        "username": data.username,
        "name":     data.name,
        "email":    data.email,
        "phone":    data.phone,
        "role":     data.role,
        "address":  data.address.model_dump() if data.address else None,
        "language": data.language,
        "is_active": True,
        "is_verified": False,
    }
    admin.table("profiles").insert(profile).execute()

    return {
        "success": True,
        "message": "Registration successful. Please check your email to confirm your account.",
        "user_id": user_id,
    }


@router.post("/login")
async def login(data: LoginRequest):
    """
    Login with email + password.
    Returns Supabase session (access_token, refresh_token) + profile.
    """
    supabase = get_supabase()
    admin    = get_supabase_admin()

    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email":    data.email,
            "password": data.password,
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not auth_response.session:
        raise HTTPException(status_code=401, detail="Login failed")

    user_id = auth_response.user.id

    # Fetch profile
    profile_res = admin.table("profiles").select("*").eq("id", user_id).single().execute()
    if not profile_res.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile = profile_res.data
    if not profile.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account deactivated. Contact admin.")

    # Update last_login
    admin.table("profiles").update({"last_login": "now()"}).eq("id", user_id).execute()

    return {
        "success":       True,
        "access_token":  auth_response.session.access_token,
        "refresh_token": auth_response.session.refresh_token,
        "token_type":    "Bearer",
        "user":          profile,
    }


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh an expired access token using the refresh_token."""
    supabase = get_supabase()
    try:
        session = supabase.auth.refresh_session(refresh_token)
        return {
            "success":      True,
            "access_token": session.session.access_token,
            "refresh_token": session.session.refresh_token,
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the current logged-in user's full profile."""
    return {"success": True, "user": current_user}


@router.put("/profile")
async def update_profile(
    data: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update name, phone, address, bio, farm info, etc."""
    admin = get_supabase_admin()
    updates = {k: v for k, v in data.model_dump(exclude_none=True).items()}
    if "address" in updates and updates["address"]:
        updates["address"] = updates["address"]  # already a dict from Pydantic

    result = admin.table("profiles").update(updates).eq("id", current_user["id"]).execute()
    return {"success": True, "user": result.data[0] if result.data else current_user}


@router.put("/password")
async def update_password(
    data: UpdatePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update the user's password via Supabase Admin Auth API."""
    admin = get_supabase_admin()
    try:
        admin.auth.admin.update_user_by_id(
            current_user["id"],
            {"password": data.new_password}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"success": True, "message": "Password updated successfully"}
