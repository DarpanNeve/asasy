#!/usr/bin/env python3
"""
Seed script to populate the database with token packages
"""
import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.core.database import init_database
from app.models.token import TokenPackage, DEFAULT_TOKEN_PACKAGES
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_token_packages():
    """Seed the database with default token packages"""
    logger.info("Seeding token packages...")
    
    try:
        # Clear existing packages
        await TokenPackage.delete_all()
        logger.info("Cleared existing token packages")
        
        # Insert packages from DEFAULT_TOKEN_PACKAGES
        created_packages = []
        for package_data in DEFAULT_TOKEN_PACKAGES:
            # Create package with the exact data from models
            package = TokenPackage(**package_data)
            await package.insert()
            created_packages.append(package)
            
            logger.info(f"Created package: {package.name}")
            logger.info(f"  - Type: {package.package_type}")
            logger.info(f"  - Tokens: {package.tokens}")
            logger.info(f"  - Price: ₹{package.price_inr/100:.2f}")
            logger.info(f"  - Description: {package.description}")
            logger.info("---")
        
        logger.info(f"Successfully seeded {len(created_packages)} token packages!")
        
        # Verify the packages were created correctly
        total_packages = await TokenPackage.find_all().count()
        logger.info(f"Total token packages in database: {total_packages}")
        
    except Exception as e:
        logger.error(f"Error seeding token packages: {e}")
        import traceback
        traceback.print_exc()
        raise

async def main():
    """Main seeding function"""
    try:
        logger.info("Starting token package seeding process...")
        
        # Initialize database connection
        await init_database()
        logger.info("Database connection initialized")
        
        # Seed token package data
        await seed_token_packages()
        
        logger.info("✅ Token package seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during token package seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())