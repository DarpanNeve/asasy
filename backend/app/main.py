from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import init_database
from app.core.security import setup_security_middleware
from app.core.rate_limiter import setup_rate_limiting
from app.api.routes import auth, users, plans, tokens, reports, webhooks, admin, contact
from app.core.exceptions import setup_exception_handlers

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting up Asasy API...")
    await init_database()
    logger.info("Database initialized successfully")

    yield

    # Shutdown
    logger.info("Shutting down Asasy API...")


# Create FastAPI app
app = FastAPI(
    title="Asasy API",
    description="SaaS Analytics Platform for Technology Assessment Reports",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
)

# Security middleware
setup_security_middleware(app)

# Rate limiting
setup_rate_limiting(app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Trusted host middleware for production
if settings.ENVIRONMENT == "production":
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# Exception handlers
setup_exception_handlers(app)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0",
    }


# API routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(plans.router, prefix="/plans", tags=["Plans"])
app.include_router(tokens.router, prefix="/tokens", tags=["Tokens"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(contact.router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Asasy API",
        "docs": "/docs" if settings.ENVIRONMENT == "development" else None,
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
    )