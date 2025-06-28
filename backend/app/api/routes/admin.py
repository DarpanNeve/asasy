from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import List
import secrets

from app.models.user import User
from app.models.report import ReportLog
from app.core.config import settings

router = APIRouter()
security = HTTPBasic()

# Hardcoded admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

def verify_admin_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    is_correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    is_correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials

@router.get("/users")
async def get_all_users(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    """Get all users with basic info"""
    users = await User.find_all().to_list()
    
    return [
        {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_verified": user.is_verified,
            "reports_generated": user.reports_generated,
            "created_at": user.created_at,
            "last_login": user.last_login,
            "oauth_provider": user.oauth_provider
        }
        for user in users
    ]

@router.get("/reports")
async def get_all_reports(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    """Get all reports with metadata and token usage"""
    reports = await ReportLog.find_all().sort([("created_at", -1)]).to_list()
    
    result = []
    for report in reports:
        # Get user info
        user = await User.get(report.user_id)
        
        # Extract token usage from openai_usage
        token_data = {
            "total_tokens": 0,
            "prompt_tokens": 0,
            "completion_tokens": 0
        }
        
        if report.openai_usage:
            usage = report.openai_usage.get("usage", {})
            token_data = {
                "total_tokens": usage.get("total_tokens", 0),
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0)
            }
        
        result.append({
            "id": str(report.id),
            "title": report.title,
            "user": {
                "name": user.name if user else "Unknown",
                "email": user.email if user else "Unknown"
            },
            "status": report.status,
            "created_at": report.created_at,
            "completed_at": report.completed_at,
            "plan_name": report.plan_name,
            "file_size": report.file_size,
            "download_count": report.download_count,
            "generation_time": report.generation_time,
            "token_usage": token_data,
            "download_url": f"/reports/{report.id}/download" if report.status == "completed" else None
        })
    
    return result

@router.get("/stats")
async def get_admin_stats(credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)):
    """Get overall platform statistics"""
    
    # User stats
    total_users = await User.find_all().count()
    verified_users = await User.find({"is_verified": True}).count()
    google_users = await User.find({"oauth_provider": "google"}).count()
    
    # Report stats
    total_reports = await ReportLog.find_all().count()
    completed_reports = await ReportLog.find({"status": "completed"}).count()
    failed_reports = await ReportLog.find({"status": "failed"}).count()
    
    # Token usage stats
    all_reports = await ReportLog.find({"openai_usage": {"$exists": True}}).to_list()
    total_tokens = sum(
        report.openai_usage.get("usage", {}).get("total_tokens", 0)
        for report in all_reports
        if report.openai_usage
    )
    
    return {
        "users": {
            "total": total_users,
            "verified": verified_users,
            "google_auth": google_users,
            "email_auth": total_users - google_users
        },
        "reports": {
            "total": total_reports,
            "completed": completed_reports,
            "failed": failed_reports,
            "success_rate": round((completed_reports / total_reports * 100) if total_reports > 0 else 0, 2)
        },
        "tokens": {
            "total_consumed": total_tokens,
            "average_per_report": round(total_tokens / completed_reports) if completed_reports > 0 else 0
        }
    }