#!/usr/bin/env python3
"""
Script to add default token packages to the database.
Run this script to populate the database with the predefined token packages.
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

async def add_default_packages():
    """Add default token packages to the database"""
    try:
        # Initialize database connection
        await init_database()
        logger.info("Database connection initialized")
        
        # Check if packages already exist
        existing_packages = await TokenPackage.find_all().to_list()
        if existing_packages:
            logger.info(f"Found {len(existing_packages)} existing packages")
            
            # Ask user if they want to continue
            response = input("Token packages already exist. Do you want to add default packages anyway? (y/N): ")
            if response.lower() not in ['y', 'yes']:
                logger.info("Operation cancelled by user")
                return
        
        # Add each default package
        added_count = 0
        for package_data in DEFAULT_TOKEN_PACKAGES:
            try:
                # Check if package with same type already exists
                existing = await TokenPackage.find_one({"package_type": package_data["package_type"]})
                
                if existing:
                    logger.info(f"Package '{package_data['name']}' ({package_data['package_type']}) already exists, skipping...")
                    continue
                
                # Create new package
                package = TokenPackage(**package_data)
                await package.insert()
                
                logger.info(f"✅ Added package: {package.name} - {package.tokens:,} tokens for ${package.price_usd}")
                added_count += 1
                
            except Exception as e:
                logger.error(f"❌ Failed to add package '{package_data['name']}': {e}")
        
        if added_count > 0:
            logger.info(f"\n🎉 Successfully added {added_count} token packages to the database!")
        else:
            logger.info("\n📦 No new packages were added (all packages already exist)")
        
        # Display all packages
        all_packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
        logger.info(f"\n📋 Current packages in database ({len(all_packages)} total):")
        for pkg in all_packages:
            pricing = pkg.get_pricing_details()
            logger.info(f"  • {pkg.name}: {pkg.tokens:,} tokens - ${pricing['base_price']:.2f} (${pricing['total_price']:.2f} with GST)")
        
    except Exception as e:
        logger.error(f"❌ Error adding default packages: {e}")
        raise

async def main():
    """Main function"""
    logger.info("🚀 Adding default token packages to database...")
    logger.info("=" * 50)
    
    try:
        await add_default_packages()
    except KeyboardInterrupt:
        logger.info("\n⚠️  Operation cancelled by user")
    except Exception as e:
        logger.error(f"❌ Script failed: {e}")
        sys.exit(1)
    
    logger.info("=" * 50)
    logger.info("✨ Script completed!")

if __name__ == "__main__":
    asyncio.run(main())