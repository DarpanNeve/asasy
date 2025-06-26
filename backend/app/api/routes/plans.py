from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.models.plan import Plan
from app.schemas.plan import PlanResponse

router = APIRouter()

@router.get("", response_model=List[PlanResponse])
async def get_plans():
    """Get all active subscription plans"""
    plans = await Plan.find({"is_active": True}).sort([("sort_order", 1)]).to_list()
    
    return [
        PlanResponse(
            id=str(plan.id),
            name=plan.name,
            description=plan.description,
            price_inr=plan.price_inr,
            price_rupees=plan.price_rupees,
            duration_days=plan.duration_days,
            reports_limit=plan.reports_limit,
            features=plan.features,
            is_popular=plan.is_popular,
            highlight_text=plan.highlight_text,
            badge_text=plan.badge_text
        )
        for plan in plans
    ]

@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan(plan_id: str):
    """Get a specific plan by ID"""
    plan = await Plan.get(plan_id)
    if not plan or not plan.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    return PlanResponse(
        id=str(plan.id),
        name=plan.name,
        description=plan.description,
        price_inr=plan.price_inr,
        price_rupees=plan.price_rupees,
        duration_days=plan.duration_days,
        reports_limit=plan.reports_limit,
        features=plan.features,
        is_popular=plan.is_popular,
        highlight_text=plan.highlight_text,
        badge_text=plan.badge_text
    )