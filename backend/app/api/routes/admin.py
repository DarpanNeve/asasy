from datetime import datetime, timedelta
import re
from fastapi import APIRouter, Depends, Query
import traceback

from app.core.security import require_admin
from app.models.user import User
from app.models.report import ReportLog
from app.models.token import TokenTransaction

router = APIRouter()

VALID_TIME_FILTERS = {"today", "week", "month", "year", "all"}
VALID_SORT_OPTIONS = {"latest", "oldest"}
VALID_STATUS_FILTERS = {"all", "completed", "incomplete"}


def get_time_filter_start(time_filter: str):
    now = datetime.utcnow()
    if time_filter == "today":
        return datetime(now.year, now.month, now.day)
    if time_filter == "week":
        start_of_today = datetime(now.year, now.month, now.day)
        return start_of_today - timedelta(days=start_of_today.weekday())
    if time_filter == "month":
        return datetime(now.year, now.month, 1)
    if time_filter == "year":
        return datetime(now.year, 1, 1)
    return None


def build_user_query(search: str, time_filter: str, status_filter: str):
    conditions = []
    search_value = (search or "").strip()
    if search_value:
        safe_pattern = re.escape(search_value[:80])
        conditions.append({
            "$or": [
                {"name": {"$regex": safe_pattern, "$options": "i"}},
                {"email": {"$regex": safe_pattern, "$options": "i"}},
            ]
        })

    start_date = get_time_filter_start(time_filter)
    if start_date:
        conditions.append({"created_at": {"$gte": start_date}})

    if status_filter == "completed":
        conditions.append({"phone": {"$nin": [None, "", "Not provided"]}})
    elif status_filter == "incomplete":
        conditions.append({
            "$or": [
                {"phone": {"$exists": False}},
                {"phone": None},
                {"phone": ""},
                {"phone": "Not provided"},
            ]
        })

    if not conditions:
        return {}
    if len(conditions) == 1:
        return conditions[0]
    return {"$and": conditions}


@router.get("/me")
async def admin_check(admin: User = Depends(require_admin)):
    """Verify the current user has admin access — used by the frontend on page load."""
    return {"is_admin": True, "email": admin.email, "name": admin.name}


@router.get("/users")
async def get_all_users(
    search: str = Query(default=""),
    time_filter: str = Query(default="all"),
    sort: str = Query(default="latest"),
    status_filter: str = Query(default="all"),
    admin: User = Depends(require_admin),
):
    try:
        selected_time_filter = time_filter if time_filter in VALID_TIME_FILTERS else "all"
        selected_sort = sort if sort in VALID_SORT_OPTIONS else "latest"
        selected_status_filter = (
            status_filter if status_filter in VALID_STATUS_FILTERS else "all"
        )
        query = build_user_query(search, selected_time_filter, selected_status_filter)
        sort_direction = -1 if selected_sort == "latest" else 1
        users = await User.find(query).sort([("created_at", sort_direction)]).to_list()
        result = []
        for user in users:
            token_balance = await user.get_token_balance()
            profile_status = (
                "completed"
                if user.phone and user.phone.strip() and user.phone != "Not provided"
                else "incomplete"
            )
            result.append({
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "phone": user.phone or "Not provided",
                "available_tokens": token_balance.available_tokens,
                "total_tokens": token_balance.total_tokens,
                "used_tokens": token_balance.used_tokens,
                "reports_generated": user.reports_generated,
                "is_admin": user.is_admin,
                "profile_status": profile_status,
                "created_at": user.created_at.isoformat(),
                "last_login": user.last_login.isoformat() if user.last_login else None,
            })
        return result
    except Exception:
        traceback.print_exc()
        raise


@router.get("/users/{user_id}/reports")
async def get_user_reports(user_id: str, admin: User = Depends(require_admin)):
    try:
        reports = await ReportLog.find({"user_id": user_id}).sort([("created_at", -1)]).to_list()
        result = []
        for report in reports:
            token_usage = {"prompt": 0, "completion": 0, "total": 0}
            if report.openai_usage and "usage" in report.openai_usage:
                usage = report.openai_usage["usage"]
                token_usage = {
                    "prompt": usage.get("prompt_tokens", 0),
                    "completion": usage.get("completion_tokens", 0),
                    "total": usage.get("total_tokens", 0),
                }
            result.append({
                "id": str(report.id),
                "title": report.title,
                "status": report.status,
                "complexity": report.complexity,
                "tokens_used": report.tokens_used,
                "file_url": f"/reports/{report.id}/download" if report.status == "completed" else None,
                "created_at": report.created_at.isoformat(),
                "token_usage": token_usage,
            })
        return result
    except Exception:
        traceback.print_exc()
        raise


@router.get("/users/{user_id}/transactions")
async def get_user_token_transactions(user_id: str, admin: User = Depends(require_admin)):
    try:
        transactions = await TokenTransaction.find({"user_id": user_id}).sort([("created_at", -1)]).to_list()
        return [
            {
                "id": str(t.id),
                "package_name": t.package_name,
                "tokens_purchased": t.tokens_purchased,
                "status": t.status,
                "amount_paid": t.amount_paid,
                "razorpay_payment_id": t.razorpay_payment_id,
                "razorpay_order_id": t.razorpay_order_id,
                "created_at": t.created_at.isoformat(),
                "completed_at": t.completed_at.isoformat() if t.completed_at else None,
            }
            for t in transactions
        ]
    except Exception:
        traceback.print_exc()
        raise


@router.get("/transactions")
async def get_all_transactions(admin: User = Depends(require_admin)):
    try:
        transactions = await TokenTransaction.find({}).sort([("created_at", -1)]).to_list()
        result = []
        for t in transactions:
            user = await User.get(t.user_id)
            result.append({
                "id": str(t.id),
                "user_name": user.name if user else "Unknown",
                "user_email": user.email if user else "Unknown",
                "package_name": t.package_name,
                "tokens_purchased": t.tokens_purchased,
                "amount_paid": t.amount_paid,
                "status": t.status,
                "razorpay_payment_id": t.razorpay_payment_id,
                "razorpay_order_id": t.razorpay_order_id,
                "created_at": t.created_at.isoformat(),
                "completed_at": t.completed_at.isoformat() if t.completed_at else None,
            })
        return result
    except Exception:
        traceback.print_exc()
        raise


@router.get("/stats")
async def get_admin_stats(admin: User = Depends(require_admin)):
    try:
        total_users = await User.find_all().count()
        total_reports = await ReportLog.find_all().count()
        completed_transactions_count = await TokenTransaction.find({"status": "completed"}).count()
        completed_transactions_list = await TokenTransaction.find({
            "status": "completed",
            "amount_paid": {"$exists": True, "$ne": None},
        }).to_list()
        total_revenue = sum(t.amount_paid for t in completed_transactions_list if t.amount_paid)
        return {
            "total_users": total_users,
            "total_reports": total_reports,
            "completed_transactions": completed_transactions_count,
            "total_revenue": total_revenue,
            "total_revenue_inr": total_revenue / 100,
        }
    except Exception:
        traceback.print_exc()
        raise
