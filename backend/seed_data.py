#!/usr/bin/env python3
"""
Seed script to populate the database with initial data
"""
import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.core.database import init_database
from app.models.plan import Plan, DEFAULT_PLANS
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_plans():
    """Seed the database with default plans from models/plan.py"""
    logger.info("Seeding plans from DEFAULT_PLANS...")
    
    # Clear existing plans
    await Plan.delete_all()
    
    # Insert default plans directly from models/plan.py
    for plan_data in DEFAULT_PLANS:
        plan = Plan(**plan_data)
        await plan.insert()
        logger.info(f"Created plan: {plan.name} - ₹{plan.price_inr/100} - Formats: {plan.report_formats}")
    
    logger.info("Plans seeded successfully!")

async def main():
    """Main seeding function"""
    try:
        # Initialize database connection
        await init_database()
        
        # Seed data
        await seed_plans()
        
        logger.info("Database seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())