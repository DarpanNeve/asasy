# Token Package Management

This directory contains scripts to manage token packages in your database.

## Quick Setup (Recommended)

To quickly add the default token packages:

```bash
cd backend
python quick_add_tokens.py
```

This will add:
- **Starter Pack**: 8,000 tokens for ₹2,500
- **Pro Pack**: 24,000 tokens for ₹7,500 (Most Popular)
- **Max Pack**: 29,000 tokens for ₹9,000

## Interactive Management

For full management capabilities:

```bash
cd backend
python manage_tokens.py
```

This provides an interactive menu to:
1. List all packages
2. Add new packages
3. Update existing packages
4. Delete packages

## Advanced Setup

For more control over the setup process:

```bash
cd backend
python add_token_packages.py
```

This script:
- Shows existing packages
- Asks if you want to clear them
- Adds default packages
- Provides detailed logging

## Environment Setup

Make sure your environment variables are set in `backend/.env`:

```env
MONGODB_URL=mongodb://admin:password123@localhost:27017/asasy?authSource=admin
DATABASE_NAME=asasy
# ... other variables
```

## Package Structure

Each token package has:
- **name**: Display name
- **package_type**: starter, pro, max, enterprise
- **tokens**: Number of tokens included
- **price_inr**: Price in paise (₹1 = 100 paise)
- **description**: Package description
- **is_active**: Whether package is available for purchase
- **sort_order**: Display order

## Enterprise Solutions

For enterprise customers requiring custom token packages or bulk pricing, users are directed to contact support directly rather than having a predefined enterprise package.

## Token Usage

Reports consume tokens based on complexity:
- **Basic Report**: 2,500 tokens
- **Advanced Report**: 7,500 tokens
- **Comprehensive Report**: 9,000 tokens

## Verification

After adding packages, verify in your admin panel or check the database directly:

```bash
# Check packages were added
python -c "
import asyncio
from app.core.database import init_database
from app.models.token import TokenPackage

async def check():
    await init_database()
    packages = await TokenPackage.find_all().to_list()
    for pkg in packages:
        print(f'{pkg.name}: {pkg.tokens:,} tokens for ₹{pkg.price_rupees:,.2f}')

asyncio.run(check())
"
```