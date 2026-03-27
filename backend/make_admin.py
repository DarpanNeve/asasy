import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

# Load env file explicitly
backend_dir = os.path.join(os.path.dirname(__file__), "backend")
load_dotenv(os.path.join(backend_dir, ".env"))

# Add backend directory to path so we can import app modules
sys.path.append(backend_dir)

from app.core.config import settings
from app.models.user import User

async def make_admin(email: str):
    """Make the user with this email an admin"""
    print(f"Connecting to database...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User]
    )
    
    user = await User.find_one({"email": email})
    if not user:
        print(f"User with email {email} not found.")
        client.close()
        return
        
    user.is_admin = True
    await user.save()
    print(f"Successfully granted admin privileges to {email} ({user.name})")
    client.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <user_email>")
        print("Example: python make_admin.py admin@example.com")
        sys.exit(1)
        
    email = sys.argv[1]
    asyncio.run(make_admin(email))
