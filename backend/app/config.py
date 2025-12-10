from functools import lru_cache
from typing import Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    database_url: str = Field(..., env="DATABASE_URL")
    jwt_secret: str = Field(..., env="BACKEND_JWT_SECRET")
    jwt_algorithm: str = Field(..., env="BACKEND_JWT_ALGORITHM")
    stripe_secret_key: Optional[str] = Field(None, env="STRIPE_SECRET_KEY")
    stripe_webhook_secret: Optional[str] = Field(None, env="STRIPE_WEBHOOK_SECRET")
    stripe_price_starter: Optional[str] = Field(None, env="STRIPE_PRICE_STARTER")
    stripe_price_growth: Optional[str] = Field(None, env="STRIPE_PRICE_GROWTH")
    stripe_price_premium: Optional[str] = Field(None, env="STRIPE_PRICE_PREMIUM")
    frontend_base_url: str = Field("http://localhost:3000", env="FRONTEND_BASE_URL")
    resend_api_key: Optional[str] = Field(None, env="RESEND_API_KEY")
    resend_from_email: Optional[str] = Field(None, env="RESEND_FROM_EMAIL")
    groq_api_key: Optional[str] = Field(None, env="GROQ_API_KEY")
    # Main source of truth is the env var; the string literal is only a dev fallback
    groq_default_model: str = Field(
        "llama-3.3-70b-versatile",
        env="GROQ_DEFAULT_MODEL",
    )

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
