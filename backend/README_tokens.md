# Token Package Management

This directory contains scripts to manage token packages in your database.

## Quick Setup (Recommended)

To quickly add the default token packages:

```bash
cd backend
python quick_add_tokens.py
```

This will add:
- **Starter Pack**: 8,000 tokens for $30.00 (+ 18% GST = $35.40)
- **Pro Pack**: 24,000 tokens for $90.00 (+ 18% GST = $106.20) (Most Popular)
- **Max Pack**: 29,000 tokens for $108.00 (+ 18% GST = $127.44)

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

## Manual Setup (Advanced)

For more control over the setup process with prompts:

```bash
cd backend
python add_default_token_packages.py
```

This script:
- Shows existing packages
- Asks if you want to clear them
- Adds default packages
- Provides detailed logging

## Scripts Overview

1. **`quick_add_tokens.py`** - Fast, no-prompt addition of default packages
2. **`add_default_token_packages.py`** - Interactive addition with user prompts
3. **`manage_tokens.py`** - Full CRUD management interface

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
- **price_usd**: Price in USD
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
        pricing = pkg.get_pricing_details()
        print(f'{pkg.name}: {pkg.tokens:,} tokens for ${pricing[\"total_price\"]:.2f}')

asyncio.run(check())
"
```