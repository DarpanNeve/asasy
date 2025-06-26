from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from app.core.security import get_current_user
from app.models.user import User
from app.models.report import ReportLog
from app.schemas.user import UserResponse, UserUpdate, UserStats
from datetime import datetime

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse.from_orm(current_user)

@router.patch("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current user profile"""
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    return UserResponse.from_orm(current_user)

@router.get("/me/stats", response_model=UserStats)
async def get_user_stats(current_user: User = Depends(get_current_user)):
    """Get user statistics"""
    
    # Get total reports count
    total_reports = await ReportLog.find({"user_id": str(current_user.id)}).count()
    
    # Get last report date
    last_report = await ReportLog.find({"user_id": str(current_user.id)}).sort([("created_at", -1)]).limit(1).to_list()
    last_report_date = last_report[0].created_at if last_report else None
    
    # Get current subscription
    subscription = await current_user.get_current_subscription()
    active_subscription = None
    subscription_expiry = None
    
    if subscription:
        active_subscription = {
            "plan": subscription.plan_id,
            "status": subscription.status,
            "active_until": subscription.active_until
        }
        subscription_expiry = subscription.active_until
    
    return UserStats(
        reports_generated=current_user.reports_generated,
        total_reports=total_reports,
        active_subscription=active_subscription,
        last_report_date=last_report_date,
        subscription_expiry=subscription_expiry
    )

@router.delete("/me")
async def delete_user_account(current_user: User = Depends(get_current_user)):
    """Delete user account and all associated data"""
    
    # Delete all user reports
    await ReportLog.find({"user_id": str(current_user.id)}).delete()
    
    # Delete user subscriptions
    from app.models.user import Subscription
    await Subscription.find({"user_id": str(current_user.id)}).delete()
    
    # Delete user account
    await current_user.delete()
    
    return {"message": "Account deleted successfully"}