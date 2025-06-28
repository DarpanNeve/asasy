from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets
import traceback

from app.models.user import User, Subscription
from app.models.plan import Plan
from app.models.report import ReportLog

router = APIRouter()
security = HTTPBasic()

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "password"

def verify_admin_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    try:
        is_correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
        is_correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
        
        if not (is_correct_username and is_correct_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials",
                headers={"WWW-Authenticate": "Basic"},
            )
        return credentials
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/users")
async def get_all_users(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        users = await User.find_all().to_list()
        
        result = []
        for user in users:
            # Get current plan
            current_plan = await user.get_current_plan()
            plan_name = current_plan.name if current_plan else "Free"
            
            # Get subscription info
            subscription = await user.get_current_subscription()
            subscription_status = subscription.status if subscription else "none"
            
            result.append({
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "phone": user.phone or "Not provided",
                "plan_name": plan_name,
                "subscription_status": subscription_status,
                "reports_generated": user.reports_generated,
                "created_at": user.created_at.isoformat(),
                "last_login": user.last_login.isoformat() if user.last_login else None
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/users/{user_id}/reports")
async def get_user_reports(user_id: str, credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        reports = await ReportLog.find({"user_id": user_id}).sort([("created_at", -1)]).to_list()
        
        result = []
        for report in reports:
            token_usage = {
                "prompt": 0,
                "completion": 0,
                "total": 0
            }
            
            if report.openai_usage and "usage" in report.openai_usage:
                usage = report.openai_usage["usage"]
                token_usage = {
                    "prompt": usage.get("prompt_tokens", 0),
                    "completion": usage.get("completion_tokens", 0),
                    "total": usage.get("total_tokens", 0)
                }
            
            result.append({
                "id": str(report.id),
                "title": report.title,
                "status": report.status,
                "plan_name": report.plan_name,
                "file_url": f"/reports/{report.id}/download" if report.status == "completed" else None,
                "created_at": report.created_at.isoformat(),
                "token_usage": token_usage
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/users/{user_id}/subscriptions")
async def get_user_subscriptions(user_id: str, credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        subscriptions = await Subscription.find({"user_id": user_id}).sort([("created_at", -1)]).to_list()
        
        result = []
        for subscription in subscriptions:
            plan = await Plan.get(subscription.plan_id)
            
            result.append({
                "id": str(subscription.id),
                "plan_name": plan.name if plan else "Unknown",
                "status": subscription.status,
                "amount_paid": subscription.amount_paid,
                "razorpay_payment_id": subscription.razorpay_payment_id,
                "razorpay_order_id": subscription.razorpay_order_id,
                "active_until": subscription.active_until.isoformat(),
                "created_at": subscription.created_at.isoformat()
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/transactions")
async def get_all_transactions(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        subscriptions = await Subscription.find({"status": {"$in": ["active", "cancelled", "expired"]}}).sort([("created_at", -1)]).to_list()
        
        result = []
        for subscription in subscriptions:
            user = await User.get(subscription.user_id)
            plan = await Plan.get(subscription.plan_id)
            
            result.append({
                "id": str(subscription.id),
                "user_name": user.name if user else "Unknown",
                "user_email": user.email if user else "Unknown",
                "plan_name": plan.name if plan else "Unknown",
                "amount_paid": subscription.amount_paid,
                "status": subscription.status,
                "razorpay_payment_id": subscription.razorpay_payment_id,
                "razorpay_order_id": subscription.razorpay_order_id,
                "active_until": subscription.active_until.isoformat(),
                "created_at": subscription.created_at.isoformat()
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/stats")
async def get_admin_stats(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        total_users = await User.find_all().count()
        total_reports = await ReportLog.find_all().count()
        active_subscriptions = await Subscription.find({"status": "active"}).count()
        total_revenue = 0
        
        # Calculate total revenue
        paid_subscriptions = await Subscription.find({"amount_paid": {"$exists": True, "$ne": None}}).to_list()
        total_revenue = sum(sub.amount_paid for sub in paid_subscriptions if sub.amount_paid)
        
        return {
            "total_users": total_users,
            "total_reports": total_reports,
            "active_subscriptions": active_subscriptions,
            "total_revenue": total_revenue,
            "total_revenue_inr": total_revenue / 100  # Convert paise to rupees
        }
    except Exception as e:
        traceback.print_exc()
        raise