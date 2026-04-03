from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config.supabase import get_settings, get_supabase_admin

security = HTTPBearer()


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Decodes and verifies Supabase-issued JWT.
    Returns the decoded payload (contains sub = user UUID, role, etc.)
    """
    settings = get_settings()
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},   # Supabase uses 'authenticated' audience
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(payload: dict = Depends(verify_token)) -> dict:
    """
    Returns the current user's profile from the profiles table.
    Raises 401 if user not found.
    """
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing user ID")

    admin = get_supabase_admin()
    result = admin.table("profiles").select("*").eq("id", user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="User profile not found")

    if not result.data.get("is_active", True):
        raise HTTPException(status_code=403, detail="Your account has been deactivated")

    return result.data


def require_roles(*roles: str):
    """
    Factory for role-based access control.
    Usage: Depends(require_roles("admin", "farmer"))
    """
    def _check(user: dict = Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {', '.join(roles)}"
            )
        return user
    return _check
