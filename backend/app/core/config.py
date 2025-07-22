from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Asasy"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    MONGODB_URL: str
    DATABASE_NAME: str = "asasy"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    # MSG91 Email Service
    MSG91_API_KEY: Optional[str] = None
    MSG91_TEMPLATE_ID: Optional[str] = None
    MSG91_FROM_EMAIL: Optional[str] = None
    MSG91_DOMAIN: Optional[str] = None

    MSG91_WELCOME_TEMPLATE_ID: Optional[str] = None
    MSG91_REPORT_TEMPLATE_ID: Optional[str] = None
    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str

    # OpenAI - CRITICAL: This must be set correctly
    OPENAI_API_KEY: str
    SERPAPI_API_KEY:str

    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"

    # Email settings (fallback)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "*"
    ]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]

    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds

    # Admin credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    # File upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["pdf", "docx", "txt"]

    # Report generation
    REPORTS_STORAGE_PATH: str = "reports"
    MAX_REPORTS_FREE_USERS: int = 1

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Validate required settings
required_settings = [
    "SECRET_KEY",
    "MONGODB_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
    "OPENAI_API_KEY",
    "SERPAPI_API_KEY"
]

for setting in required_settings:
    if not getattr(settings, setting, None):
        raise ValueError(f"Required setting {setting} is not set")

# Log OpenAI API key status (without exposing the key)
import logging

logger = logging.getLogger(__name__)
if settings.OPENAI_API_KEY:
    logger.info(f"OpenAI API Key configured: {settings.OPENAI_API_KEY[:10]}...{settings.OPENAI_API_KEY[-4:]}")
else:
    logger.error("OpenAI API Key is not configured!")