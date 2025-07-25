from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
import redis.asyncio as redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Create Redis connection for rate limiting
try:
    redis_client = redis.from_url(settings.REDIS_URL)
except Exception as e:
    logger.warning(f"Failed to connect to Redis for rate limiting: {e}")
    redis_client = None


def get_client_ip(request: Request):
    """Get client IP address"""
    # Check for forwarded headers first (for reverse proxy setups)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    # Fallback to direct connection IP
    return get_remote_address(request)


# Create limiter instance
limiter = Limiter(
    key_func=get_client_ip,
    storage_uri=settings.REDIS_URL if redis_client else "memory://",
    default_limits=["1000/hour"]
)


def setup_rate_limiting(app):
    """Setup rate limiting for the app"""
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    logger.info("Rate limiting configured successfully")