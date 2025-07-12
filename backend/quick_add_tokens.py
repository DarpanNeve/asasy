#!/usr/bin/env python3
"""
Quick script to add default token packages without prompts.
Use this for automated deployment or when you're sure you want to add the packages.
"""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import init_database
from app.models.token import TokenPackage, DEFAULT_TOKEN_PACKAGES
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def quick_add_packages():
    """Quickly add default token packages to the database"""
    try:
        # Initialize database connection
        await init_database()
        logger.info("Database connection initialized")
        
        added_count = 0
        skipped_count = 0
        
        # Add each default package
        for package_data in DEFAULT_TOKEN_PACKAGES:
            try:
                # Check if package with same type already exists
                existing = await TokenPackage.find_one({"package_type": package_data["package_type"]})
                
                if existing:
                    logger.info(f"⏭️  Package '{package_data['name']}' already exists, skipping...")
                    skipped_count += 1
                    continue
                
                # Create new package
                package = TokenPackage(**package_data)
                await package.insert()
                
                pricing = package.get_pricing_details()
                logger.info(f"✅ Added: {package.name} - {package.tokens:,} tokens for ${pricing['total_price']:.2f}")
                added_count += 1
                
            except Exception as e:
                logger.error(f"❌ Failed to add package '{package_data['name']}': {e}")
        
        # Summary
        logger.info(f"\n📊 Summary:")
        logger.info(f"  • Added: {added_count} packages")
        logger.info(f"  • Skipped: {skipped_count} packages")
        logger.info(f"  • Total: {added_count + skipped_count} packages processed")
        
        if added_count > 0:
            logger.info(f"\n🎉 Successfully added {added_count} new token packages!")
        
    except Exception as e:
        logger.error(f"❌ Error adding packages: {e}")
        raise

async def main():
    """Main function"""
    logger.info("🚀 Quick adding default token packages...")
    
    try:
        await quick_add_packages()
        logger.info("✨ Done!")
    except Exception as e:
        logger.error(f"❌ Script failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())