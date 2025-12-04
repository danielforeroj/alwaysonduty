from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    database_url: str = Field(..., env="DATABASE_URL")
    jwt_secret: str = Field(..., env="BACKEND_JWT_SECRET")
    jwt_algorithm: str = Field(..., env="BACKEND_JWT_ALGORITHM")

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
