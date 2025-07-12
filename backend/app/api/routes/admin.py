from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets
import traceback

from app.models.user import User
from app.models.report import ReportLog
from app.models.token import TokenTransaction, UserTokenBalance

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
            # Get token balance
            token_balance = await user.get_token_balance()
            
            result.append({
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "phone": user.phone or "Not provided",
                "available_tokens": token_balance.available_tokens,
                "total_tokens": token_balance.total_tokens,
                "used_tokens": token_balance.used_tokens,
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
                "complexity": report.complexity,
                "tokens_used": report.tokens_used,
                "file_url": f"/reports/{report.id}/download" if report.status == "completed" else None,
                "created_at": report.created_at.isoformat(),
                "token_usage": token_usage
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/users/{user_id}/transactions")
async def get_user_token_transactions(user_id: str, credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        transactions = await TokenTransaction.find({"user_id": user_id}).sort([("created_at", -1)]).to_list()
        
        result = []
        for transaction in transactions:
            result.append({
                "id": str(transaction.id),
                "package_name": transaction.package_name,
                "tokens_purchased": transaction.tokens_purchased,
                "status": transaction.status,
                "amount_paid": transaction.amount_paid,
                "razorpay_payment_id": transaction.razorpay_payment_id,
                "razorpay_order_id": transaction.razorpay_order_id,
                "created_at": transaction.created_at.isoformat(),
                "completed_at": transaction.completed_at.isoformat() if transaction.completed_at else None
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("/transactions")
async def get_all_transactions(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    try:
        transactions = await TokenTransaction.find({}).sort([("created_at", -1)]).to_list()
        
        result = []
        for transaction in transactions:
            user = await User.get(transaction.user_id)
            
            result.append({
                "id": str(transaction.id),
                "user_name": user.name if user else "Unknown",
                "user_email": user.email if user else "Unknown",
                "package_name": transaction.package_name,
                "tokens_purchased": transaction.tokens_purchased,
                "amount_paid": transaction.amount_paid,
                "status": transaction.status,
                "razorpay_payment_id": transaction.razorpay_payment_id,
                "razorpay_order_id": transaction.razorpay_order_id,
                "created_at": transaction.created_at.isoformat(),
                "completed_at": transaction.completed_at.isoformat() if transaction.completed_at else None
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
        completed_transactions = await TokenTransaction.find({"status": "completed"}).count()
        total_revenue = 0
        
        # Calculate total revenue
        completed_transactions_list = await TokenTransaction.find({
            "status": "completed",
            "amount_paid": {"$exists": True, "$ne": None}
        }).to_list()
        total_revenue = sum(trans.amount_paid for trans in completed_transactions_list if trans.amount_paid)
        
        return {
            "total_users": total_users,
            "total_reports": total_reports,
            "completed_transactions": completed_transactions,
            "total_revenue": total_revenue,
            "total_revenue_inr": total_revenue / 100  # Convert paise to rupees
        }
    except Exception as e:
        traceback.print_exc()
        raise