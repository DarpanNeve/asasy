from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import logging

from app.core.config import settings
from app.models.user import User
from app.models.plan import Plan
from app.models.report import ReportLog
from app.models.contact import ContactSubmission
from app.models.token import TokenPackage, TokenTransaction, UserTokenBalance

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database() -> AsyncIOMotorClient:
    return db.client

async def init_database():
    """Initialize database connection and models"""
    try:
        # Create Motor client
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        
        # Initialize Beanie with models
        await init_beanie(
            database=db.client[settings.DATABASE_NAME],
            document_models=[
                User,
                Plan,
                ReportLog,
                ContactSubmission,
                TokenPackage,
                TokenTransaction,
                UserTokenBalance,
            ]
        )
        
        logger.info("Database initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

async def close_database():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Database connection closed")