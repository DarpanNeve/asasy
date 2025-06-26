from beanie import Document, Indexed
from pydantic import Field, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class OAuthProvider(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PENDING = "pending"

class Subscription(Document):
    user_id: str = Field(..., description="User ID")
    plan_id: str = Field(..., description="Plan ID")
    razorpay_payment_id: Optional[str] = None
    razorpay_subscription_id: Optional[str] = None
    status: SubscriptionStatus = SubscriptionStatus.PENDING
    active_until: datetime = Field(..., description="Subscription expiry date")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "subscriptions"

class User(Document):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., description="User email address")
    password_hash: Optional[str] = None
    oauth_provider: OAuthProvider = OAuthProvider.EMAIL
    oauth_id: Optional[str] = None
    
    # Profile
    is_active: bool = True
    is_verified: bool = False
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    
    # Subscription & Usage
    reports_generated: int = 0
    current_subscription_id: Optional[str] = None
    
    # Verification
    email_verification_code: Optional[str] = None
    email_verification_expires: Optional[datetime] = None
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # Settings
    preferences: Dict[str, Any] = Field(default_factory=dict)
    
    class Settings:
        name = "users"
        indexes = [
            "email",
            "oauth_id",
            "created_at",
            [("email", 1), ("oauth_provider", 1)],
        ]
    
    async def get_current_subscription(self) -> Optional[Subscription]:
        """Get user's current active subscription"""
        if not self.current_subscription_id:
            return None
        
        subscription = await Subscription.get(self.current_subscription_id)
        if subscription and subscription.status == SubscriptionStatus.ACTIVE and subscription.active_until > datetime.utcnow():
            return subscription
        
        return None
    
    async def has_active_subscription(self) -> bool:
        """Check if user has an active subscription"""
        subscription = await self.get_current_subscription()
        return subscription is not None
    
    async def can_generate_report(self) -> bool:
        """Check if user can generate a report"""
        # Users with active subscriptions can generate unlimited reports
        if await self.has_active_subscription():
            return True
        
        # Free users can generate limited reports
        from app.core.config import settings
        return self.reports_generated < settings.MAX_REPORTS_FREE_USERS
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def dict_exclude_sensitive(self) -> dict:
        """Return user dict without sensitive fields"""
        return self.dict(exclude={
            "password_hash",
            "email_verification_code", 
            "email_verification_expires",
            "password_reset_token",
            "password_reset_expires"
        })