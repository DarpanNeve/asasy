#!/usr/bin/env python3
"""
Quick script to add default token packages
"""
import asyncio
import sys
import os

sys.path.append(os.path.dirname(__file__))

from app.core.database import init_database
from app.models.token import TokenPackage, TokenPackageType

async def quick_add():
    """Quickly add default token packages"""
    await init_database()
    
    # Default packages
    packages = [
        {
            "name": "Starter Pack",
            "package_type": TokenPackageType.STARTER,
            "tokens": 8000,
            "price_inr": 250000,  # ₹2,500
            "description": "Perfect for getting started with AI reports",
            "sort_order": 1
        },
        {
            "name": "Pro Pack",
            "package_type": TokenPackageType.PRO,
            "tokens": 24000,
            "price_inr": 750000,  # ₹7,500
            "description": "Best value for regular users",
            "sort_order": 2
        },
        {
            "name": "Max Pack",
            "package_type": TokenPackageType.MAX,
            "tokens": 29000,
            "price_inr": 900000,  # ₹9,000
            "description": "Maximum tokens for power users",
            "sort_order": 3
        }
    ]
    
    print("Adding token packages...")
    
    for pkg_data in packages:
        # Check if exists
        existing = await TokenPackage.find_one({"package_type": pkg_data["package_type"]})
        if existing:
            print(f"⚠️  {pkg_data['name']} already exists")
            continue
        
        # Create package
        package = TokenPackage(**pkg_data)
        await package.insert()
        print(f"✅ Added {package.name}: {package.tokens:,} tokens for ₹{package.price_rupees:,.2f}")
    
    print("\n🎉 Done! Token packages added successfully.")

if __name__ == "__main__":
    asyncio.run(quick_add())