"""Application configuration via environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 4005

    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_database: str = "sentracx_analytics"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # CRM API
    crm_api_base_url: str = "http://localhost:5005"
    crm_service_token: str = ""

    # Auth
    jwt_secret: str = "dev-secret"
    jwt_issuer: str = "https://localhost:5001/"

    # Groq API
    groq_api_key: str = ""
    groq_model_id: str = "llama-3.1-8b-instant"

    @property
    def is_development(self) -> bool:
        """Check if the application is running in development mode."""
        return self.app_env == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
