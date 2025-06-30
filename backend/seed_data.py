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
    
    try:
        # Clear existing plans
        await Plan.delete_all()
        logger.info("Cleared existing plans")
        
        # Insert plans from DEFAULT_PLANS in models/plan.py
        created_plans = []
        for plan_data in DEFAULT_PLANS:
            # Create plan with the exact data from models
            plan = Plan(**plan_data)
            await plan.insert()
            created_plans.append(plan)
            
            logger.info(f"Created plan: {plan.name}")
            logger.info(f"  - Price: ₹{plan.price_inr/100:.2f}")
            logger.info(f"  - Duration: {plan.duration_days} days")
            logger.info(f"  - Reports limit: {plan.reports_limit if plan.reports_limit else 'Unlimited'}")
            logger.info(f"  - Report formats: {plan.report_formats}")
            logger.info(f"  - Report type: {plan.report_type}")
            logger.info(f"  - Report pages: {plan.report_pages}")
            logger.info(f"  - Features: {len(plan.features)} features")
            logger.info(f"  - Sections: {len(plan.sections)} sections")
            logger.info(f"  - Popular: {plan.is_popular}")
            logger.info(f"  - Has prompt template: {'Yes' if plan.prompt_template else 'No'}")
            logger.info("---")
        
        logger.info(f"Successfully seeded {len(created_plans)} plans!")
        
        # Verify the plans were created correctly
        total_plans = await Plan.find_all().count()
        logger.info(f"Total plans in database: {total_plans}")
        
        # Log a summary of what was created
        for plan in created_plans:
            logger.info(f"✅ {plan.name}: {len(plan.sections)} sections, "
                       f"formats {plan.report_formats}, "
                       f"{'popular' if plan.is_popular else 'standard'}")
        
    except Exception as e:
        logger.error(f"Error seeding plans: {e}")
        import traceback
        traceback.print_exc()
        raise

async def verify_plan_data():
    """Verify that seeded plan data matches DEFAULT_PLANS structure"""
    logger.info("Verifying seeded plan data...")
    
    try:
        plans = await Plan.find_all().to_list()
        
        if len(plans) != len(DEFAULT_PLANS):
            logger.error(f"Plan count mismatch: Expected {len(DEFAULT_PLANS)}, got {len(plans)}")
            return False
        
        # Verify each plan has required attributes
        required_fields = [
            'name', 'description', 'price_inr', 'duration_days', 'reports_limit',
            'features', 'report_formats', 'sections', 'report_pages', 'report_type',
            'is_popular', 'sort_order', 'prompt_template'
        ]
        
        for plan in plans:
            logger.info(f"Verifying plan: {plan.name}")
            
            for field in required_fields:
                if not hasattr(plan, field):
                    logger.error(f"Plan {plan.name} missing field: {field}")
                    return False
            
            # Verify prompt template exists for non-free plans
            if plan.price_inr > 0 and not plan.prompt_template:
                logger.warning(f"Plan {plan.name} (paid) has no prompt template")
            
            # Verify sections list is properly populated
            if not plan.sections or len(plan.sections) == 0:
                logger.error(f"Plan {plan.name} has no sections defined")
                return False
            
            # Verify report formats
            if not plan.report_formats or len(plan.report_formats) == 0:
                logger.error(f"Plan {plan.name} has no report formats defined")
                return False
            
            logger.info(f"✅ Plan {plan.name} verification passed")
        
        logger.info("✅ All plans verified successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error verifying plan data: {e}")
        return False

async def main():
    """Main seeding function"""
    try:
        logger.info("Starting database seeding process...")
        
        # Initialize database connection
        await init_database()
        logger.info("Database connection initialized")
        
        # Seed plan data
        await seed_plans()
        
        # Verify the seeded data
        verification_passed = await verify_plan_data()
        
        if verification_passed:
            logger.info("✅ Database seeding completed successfully!")
            logger.info("All plans have been seeded with proper structure and data")
        else:
            logger.error("❌ Database seeding completed with verification errors")
            sys.exit(1)
        
    except Exception as e:
        logger.error(f"Error during database seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())