from supabase import create_client, Client
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_jwt_secret: str
    app_env: str = "development"
    app_port: int = 8000
    frontend_url: str = "http://localhost:5173"
    storage_bucket_products: str = "product-images"
    storage_bucket_avatars: str = "avatars"
    storage_bucket_stories: str = "stories"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


def get_supabase() -> Client:
    """
    Standard client — uses anon key.
    Respects Row Level Security (RLS) policies.
    Use for all user-facing queries.
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


def get_supabase_admin() -> Client:
    """
    Admin / service-role client — BYPASSES RLS.
    Use ONLY for server-side operations (seeding, admin tasks, triggers).
    NEVER expose this key to the frontend.
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
