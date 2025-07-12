#!/usr/bin/env python3
"""
Script to add token packages to the database
"""
import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

from app.core.database import init_database
from app.models.token import TokenPackage, TokenPackageType, DEFAULT_TOKEN_PACKAGES
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def add_token_packages():
    """Add token packages to the database"""
    logger.info("Adding token packages to database...")
    
    try:
        # Initialize database connection
        await init_database()
        logger.info("Database connection initialized")
        
        # Clear existing packages (optional)
        existing_count = await TokenPackage.find_all().count()
        logger.info(f"Found {existing_count} existing token packages")
        
        if existing_count > 0:
            response = input("Clear existing packages? (y/N): ")
            if response.lower() == 'y':
                await TokenPackage.delete_all()
                logger.info("Cleared existing token packages")
        
        # Add packages from DEFAULT_TOKEN_PACKAGES
        created_packages = []
        for package_data in DEFAULT_TOKEN_PACKAGES:
            # Check if package already exists
            existing = await TokenPackage.find_one({
                "package_type": package_data["package_type"]
            })
            
            if existing:
                logger.info(f"Package {package_data['name']} already exists, skipping...")
                continue
            
            # Create new package
            package = TokenPackage(**package_data)
            await package.insert()
            created_packages.append(package)
            
            logger.info(f"✅ Created package: {package.name}")
            logger.info(f"   - Type: {package.package_type}")
            logger.info(f"   - Tokens: {package.tokens:,}")
            logger.info(f"   - Price: ₹{package.price_rupees:,.2f}")
            logger.info(f"   - Description: {package.description}")
            logger.info("---")
        
        if created_packages:
            logger.info(f"Successfully added {len(created_packages)} token packages!")
        else:
            logger.info("No new packages were added (all already exist)")
        
        # Verify the packages
        total_packages = await TokenPackage.find_all().count()
        logger.info(f"Total token packages in database: {total_packages}")
        
        # Display all packages
        all_packages = await TokenPackage.find({"is_active": True}).sort([("sort_order", 1)]).to_list()
        logger.info("\n📦 Current Token Packages:")
        for pkg in all_packages:
            logger.info(f"   {pkg.name}: {pkg.tokens:,} tokens for ₹{pkg.price_rupees:,.2f}")
        
    except Exception as e:
        logger.error(f"Error adding token packages: {e}")
        import traceback
        traceback.print_exc()
        raise

async def main():
    """Main function"""
    try:
        await add_token_packages()
        logger.info("✅ Token packages setup completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error during setup: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())