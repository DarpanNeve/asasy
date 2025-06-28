from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets
import traceback

from app.models.user import User
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
        
        return [
            {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "phone": user.phone or "Not provided"
            }
            for user in users
        ]
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
                "file_url": f"/reports/{report.id}/download" if report.status == "completed" else None,
                "created_at": report.created_at.isoformat(),
                "token_usage": token_usage
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise