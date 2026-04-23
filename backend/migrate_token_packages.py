"""
migrate_token_packages.py
Run once to update token_packages collection with new pricing.

Usage:
    cd backend
    source .venv/bin/activate
    python migrate_token_packages.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.token import TokenPackage, TokenPackageType, DEFAULT_TOKEN_PACKAGES
from app.core.config import settings


async def migrate():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[TokenPackage])

    print("\n--- Clearing old token packages ---")
    deleted = await TokenPackage.find_all().delete()
    print(f"Deleted {deleted.deleted_count if hasattr(deleted, 'deleted_count') else '?'} old packages")

    print("\n--- Inserting new packages ---")
    for pkg_data in DEFAULT_TOKEN_PACKAGES:
        pkg = TokenPackage(**pkg_data)
        await pkg.insert()
        print(f"  ✓ Inserted: {pkg.name} | ₹{pkg.price_inr} / ${pkg.price_usd} | {pkg.tokens} tokens")

    print("\n--- Verifying ---")
    all_pkgs = await TokenPackage.find_all().to_list()
    for p in all_pkgs:
        print(f"  [{p.package_type}] {p.name}: ₹{p.price_inr} / ${p.price_usd} | {p.tokens} tokens | active={p.is_active}")

    print("\n✅ Migration complete.")
    client.close()


if __name__ == "__main__":
    asyncio.run(migrate())
