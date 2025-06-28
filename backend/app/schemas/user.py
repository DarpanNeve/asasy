from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.user import OAuthProvider

class UserResponse(BaseModel):
    id: PydanticObjectId
    name: str
    email: EmailStr
    oauth_provider: OAuthProvider
    is_active: bool
    is_verified: bool
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    reports_generated: int
    current_subscription_id: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    job_title: Optional[str] = Field(None, max_length=100)

class UserStats(BaseModel):
    reports_generated: int
    total_reports: int
    reports_remaining: int  # -1 for unlimited
    current_plan: str
    active_subscription: Optional[Dict[str, Any]] = None
    last_report_date: Optional[datetime] = None
    subscription_expiry: Optional[datetime] = None