#!/usr/bin/env python3
"""
Interactive script to manage token packages in the database.
Provides options to list, add, update, and delete token packages.
"""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import init_database
from app.models.token import TokenPackage, TokenPackageType, DEFAULT_TOKEN_PACKAGES
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def list_packages():
    """List all token packages"""
    packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
    
    if not packages:
        print("📦 No token packages found in database")
        return
    
    print(f"\n📋 Current Token Packages ({len(packages)} total):")
    print("-" * 80)
    
    for i, pkg in enumerate(packages, 1):
        pricing = pkg.get_pricing_details()
        status = "🟢 Active" if pkg.is_active else "🔴 Inactive"
        
        print(f"{i}. {pkg.name} ({pkg.package_type.upper()})")
        print(f"   Tokens: {pkg.tokens:,}")
        print(f"   Price: ${pricing['base_price']:.2f} (${pricing['total_price']:.2f} with GST)")
        print(f"   Status: {status}")
        print(f"   Description: {pkg.description}")
        print(f"   Sort Order: {pkg.sort_order}")
        print()

async def add_package():
    """Add a new token package"""
    print("\n➕ Add New Token Package")
    print("-" * 30)
    
    try:
        name = input("Package name: ").strip()
        if not name:
            print("❌ Name is required")
            return
        
        print("\nAvailable package types:")
        for pkg_type in TokenPackageType:
            print(f"  - {pkg_type.value}")
        
        package_type_str = input("Package type: ").strip().lower()
        try:
            package_type = TokenPackageType(package_type_str)
        except ValueError:
            print("❌ Invalid package type")
            return
        
        tokens = int(input("Number of tokens: "))
        price_usd = float(input("Price in USD: "))
        description = input("Description: ").strip()
        sort_order = int(input("Sort order (default 0): ") or "0")
        
        # Check if package type already exists
        existing = await TokenPackage.find_one({"package_type": package_type})
        if existing:
            response = input(f"⚠️  Package type '{package_type.value}' already exists. Continue? (y/N): ")
            if response.lower() not in ['y', 'yes']:
                print("❌ Operation cancelled")
                return
        
        # Create package
        package = TokenPackage(
            name=name,
            package_type=package_type,
            tokens=tokens,
            price_usd=price_usd,
            description=description,
            sort_order=sort_order,
            is_active=True
        )
        
        await package.insert()
        pricing = package.get_pricing_details()
        
        print(f"✅ Successfully added package: {name}")
        print(f"   {tokens:,} tokens for ${pricing['total_price']:.2f} (including GST)")
        
    except ValueError as e:
        print(f"❌ Invalid input: {e}")
    except Exception as e:
        print(f"❌ Error adding package: {e}")

async def update_package():
    """Update an existing token package"""
    packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
    
    if not packages:
        print("📦 No packages found to update")
        return
    
    print("\n✏️  Update Token Package")
    print("-" * 25)
    
    # List packages with numbers
    for i, pkg in enumerate(packages, 1):
        print(f"{i}. {pkg.name} - {pkg.tokens:,} tokens - ${pkg.price_usd}")
    
    try:
        choice = int(input(f"\nSelect package to update (1-{len(packages)}): "))
        if choice < 1 or choice > len(packages):
            print("❌ Invalid selection")
            return
        
        package = packages[choice - 1]
        print(f"\nUpdating: {package.name}")
        
        # Update fields
        new_name = input(f"Name ({package.name}): ").strip()
        if new_name:
            package.name = new_name
        
        new_tokens = input(f"Tokens ({package.tokens:,}): ").strip()
        if new_tokens:
            package.tokens = int(new_tokens)
        
        new_price = input(f"Price USD ({package.price_usd}): ").strip()
        if new_price:
            package.price_usd = float(new_price)
        
        new_description = input(f"Description ({package.description}): ").strip()
        if new_description:
            package.description = new_description
        
        new_sort_order = input(f"Sort order ({package.sort_order}): ").strip()
        if new_sort_order:
            package.sort_order = int(new_sort_order)
        
        is_active = input(f"Active ({package.is_active}) [y/n]: ").strip().lower()
        if is_active in ['y', 'yes']:
            package.is_active = True
        elif is_active in ['n', 'no']:
            package.is_active = False
        
        await package.save()
        print(f"✅ Successfully updated package: {package.name}")
        
    except ValueError as e:
        print(f"❌ Invalid input: {e}")
    except Exception as e:
        print(f"❌ Error updating package: {e}")

async def delete_package():
    """Delete a token package"""
    packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
    
    if not packages:
        print("📦 No packages found to delete")
        return
    
    print("\n🗑️  Delete Token Package")
    print("-" * 24)
    
    # List packages with numbers
    for i, pkg in enumerate(packages, 1):
        print(f"{i}. {pkg.name} - {pkg.tokens:,} tokens")
    
    try:
        choice = int(input(f"\nSelect package to delete (1-{len(packages)}): "))
        if choice < 1 or choice > len(packages):
            print("❌ Invalid selection")
            return
        
        package = packages[choice - 1]
        
        # Confirm deletion
        response = input(f"⚠️  Are you sure you want to delete '{package.name}'? (y/N): ")
        if response.lower() not in ['y', 'yes']:
            print("❌ Operation cancelled")
            return
        
        await package.delete()
        print(f"✅ Successfully deleted package: {package.name}")
        
    except ValueError as e:
        print(f"❌ Invalid input: {e}")
    except Exception as e:
        print(f"❌ Error deleting package: {e}")

async def add_default_packages():
    """Add all default packages"""
    print("\n📦 Adding Default Token Packages")
    print("-" * 35)
    
    added_count = 0
    skipped_count = 0
    
    for package_data in DEFAULT_TOKEN_PACKAGES:
        try:
            # Check if package with same type already exists
            existing = await TokenPackage.find_one({"package_type": package_data["package_type"]})
            
            if existing:
                print(f"⏭️  {package_data['name']} already exists, skipping...")
                skipped_count += 1
                continue
            
            # Create new package
            package = TokenPackage(**package_data)
            await package.insert()
            
            pricing = package.get_pricing_details()
            print(f"✅ Added: {package.name} - {package.tokens:,} tokens for ${pricing['total_price']:.2f}")
            added_count += 1
            
        except Exception as e:
            print(f"❌ Failed to add {package_data['name']}: {e}")
    
    print(f"\n📊 Added {added_count} packages, skipped {skipped_count} existing packages")

async def main_menu():
    """Display main menu and handle user choices"""
    while True:
        print("\n" + "=" * 50)
        print("🎯 Token Package Manager")
        print("=" * 50)
        print("1. List all packages")
        print("2. Add new package")
        print("3. Update package")
        print("4. Delete package")
        print("5. Add default packages")
        print("6. Exit")
        print("-" * 50)
        
        try:
            choice = input("Select an option (1-6): ").strip()
            
            if choice == "1":
                await list_packages()
            elif choice == "2":
                await add_package()
            elif choice == "3":
                await update_package()
            elif choice == "4":
                await delete_package()
            elif choice == "5":
                await add_default_packages()
            elif choice == "6":
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid option. Please select 1-6.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

async def main():
    """Main function"""
    try:
        # Initialize database connection
        await init_database()
        logger.info("Database connection initialized")
        
        await main_menu()
        
    except Exception as e:
        logger.error(f"❌ Script failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())