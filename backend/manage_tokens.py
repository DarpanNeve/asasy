#!/usr/bin/env python3
"""
Interactive script to manage token packages
"""
import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

from app.core.database import init_database
from app.models.token import TokenPackage, TokenPackageType
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def list_packages():
    """List all token packages"""
    packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
    
    if not packages:
        print("No token packages found.")
        return
    
    print("\n📦 Current Token Packages:")
    print("-" * 80)
    for i, pkg in enumerate(packages, 1):
        status = "✅ Active" if pkg.is_active else "❌ Inactive"
        print(f"{i}. {pkg.name} ({pkg.package_type})")
        print(f"   Tokens: {pkg.tokens:,}")
        print(f"   Price: ₹{pkg.price_rupees:,.2f}")
        print(f"   Status: {status}")
        print(f"   Description: {pkg.description}")
        print("-" * 80)

async def add_package():
    """Add a new token package"""
    print("\n➕ Add New Token Package")
    print("-" * 40)
    
    try:
        name = input("Package name: ").strip()
        if not name:
            print("❌ Package name is required")
            return
        
        print("\nAvailable package types:")
        for pkg_type in TokenPackageType:
            print(f"  - {pkg_type.value}")
        
        package_type = input("Package type: ").strip().lower()
        if package_type not in [t.value for t in TokenPackageType]:
            print("❌ Invalid package type")
            return
        
        tokens = int(input("Number of tokens: "))
        price_rupees = float(input("Price in rupees: "))
        description = input("Description: ").strip()
        
        # Convert rupees to paise
        price_inr = int(price_rupees * 100)
        
        # Get sort order
        max_order = 0
        existing_packages = await TokenPackage.find_all().to_list()
        if existing_packages:
            max_order = max(pkg.sort_order for pkg in existing_packages)
        
        sort_order = max_order + 1
        
        # Create package
        package = TokenPackage(
            name=name,
            package_type=TokenPackageType(package_type),
            tokens=tokens,
            price_inr=price_inr,
            description=description,
            sort_order=sort_order
        )
        
        await package.insert()
        
        print(f"✅ Successfully created package: {name}")
        print(f"   Tokens: {tokens:,}")
        print(f"   Price: ₹{price_rupees:,.2f}")
        
    except ValueError as e:
        print(f"❌ Invalid input: {e}")
    except Exception as e:
        print(f"❌ Error creating package: {e}")

async def update_package():
    """Update an existing package"""
    packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
    
    if not packages:
        print("No packages found to update.")
        return
    
    print("\n✏️ Update Token Package")
    print("-" * 40)
    
    # List packages
    for i, pkg in enumerate(packages, 1):
        print(f"{i}. {pkg.name} - {pkg.tokens:,} tokens - ₹{pkg.price_rupees:,.2f}")
    
    try:
        choice = int(input("\nSelect package number to update: ")) - 1
        if choice < 0 or choice >= len(packages):
            print("❌ Invalid selection")
            return
        
        package = packages[choice]
        print(f"\nUpdating: {package.name}")
        
        # Update fields
        new_name = input(f"Name ({package.name}): ").strip()
        if new_name:
            package.name = new_name
        
        new_tokens = input(f"Tokens ({package.tokens:,}): ").strip()
        if new_tokens:
            package.tokens = int(new_tokens)
        
        new_price = input(f"Price in rupees ({package.price_rupees:,.2f}): ").strip()
        if new_price:
            package.price_inr = int(float(new_price) * 100)
        
        new_description = input(f"Description ({package.description}): ").strip()
        if new_description:
            package.description = new_description
        
        is_active = input(f"Active (y/n) [current: {'y' if package.is_active else 'n'}]: ").strip().lower()
        if is_active in ['y', 'n']:
            package.is_active = is_active == 'y'
        
        await package.save()
        print(f"✅ Successfully updated package: {package.name}")
        
    except ValueError as e:
        print(f"❌ Invalid input: {e}")
    except Exception as e:
        print(f"❌ Error updating package: {e}")

async def delete_package():
    """Delete a package"""
    packages = await TokenPackage.find_all().sort([("sort_order", 1)]).to_list()
    
    if not packages:
        print("No packages found to delete.")
        return
    
    print("\n🗑️ Delete Token Package")
    print("-" * 40)
    
    # List packages
    for i, pkg in enumerate(packages, 1):
        print(f"{i}. {pkg.name} - {pkg.tokens:,} tokens - ₹{pkg.price_rupees:,.2f}")
    
    try:
        choice = int(input("\nSelect package number to delete: ")) - 1
        if choice < 0 or choice >= len(packages):
            print("❌ Invalid selection")
            return
        
        package = packages[choice]
        
        confirm = input(f"Are you sure you want to delete '{package.name}'? (y/N): ").strip().lower()
        if confirm == 'y':
            await package.delete()
            print(f"✅ Successfully deleted package: {package.name}")
        else:
            print("❌ Deletion cancelled")
        
    except ValueError as e:
        print(f"❌ Invalid input: {e}")
    except Exception as e:
        print(f"❌ Error deleting package: {e}")

async def main_menu():
    """Main interactive menu"""
    await init_database()
    
    while True:
        print("\n" + "="*50)
        print("🎯 TOKEN PACKAGE MANAGER")
        print("="*50)
        print("1. List all packages")
        print("2. Add new package")
        print("3. Update package")
        print("4. Delete package")
        print("5. Exit")
        print("-" * 50)
        
        try:
            choice = input("Select option (1-5): ").strip()
            
            if choice == '1':
                await list_packages()
            elif choice == '2':
                await add_package()
            elif choice == '3':
                await update_package()
            elif choice == '4':
                await delete_package()
            elif choice == '5':
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid option. Please select 1-5.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main_menu())