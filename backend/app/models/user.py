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
    razorpay_order_id: Optional[str] = None
    status: SubscriptionStatus = SubscriptionStatus.PENDING
    active_until: datetime = Field(..., description="Subscription expiry date")
    amount_paid: Optional[int] = None  # Amount in paise
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "subscriptions"
        indexes = [
            "user_id",
            "status",
            "active_until",
            [("user_id", 1), ("status", 1)],
            [("user_id", 1), ("active_until", -1)],
        ]

class User(Document):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., description="User email address")
    phone: Optional[str] = Field(None, description="User phone number")
    password_hash: Optional[str] = None
    oauth_provider: OAuthProvider = OAuthProvider.EMAIL
    oauth_id: Optional[str] = None
    
    # Profile
    is_active: bool = True
    is_verified: bool = False
    
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
            "current_subscription_id",
            [("email", 1), ("oauth_provider", 1)],
        ]
    
    async def get_current_subscription(self) -> Optional[Subscription]:
        """Get user's current active subscription"""
        if not self.current_subscription_id:
            return None
        
        subscription = await Subscription.get(self.current_subscription_id)
        if subscription and subscription.status == SubscriptionStatus.ACTIVE and subscription.active_until > datetime.utcnow():
            return subscription
        
        # If subscription is expired or inactive, clear the reference
        if subscription and (subscription.status != SubscriptionStatus.ACTIVE or subscription.active_until <= datetime.utcnow()):
            self.current_subscription_id = None
            await self.save()
        
        return None
    
    async def has_active_subscription(self) -> bool:
        """Check if user has an active subscription"""
        subscription = await self.get_current_subscription()
        return subscription is not None
    
    async def get_current_plan(self):
        """Get user's current plan"""
        subscription = await self.get_current_subscription()
        
        if subscription:
            from app.models.plan import Plan
            plan = await Plan.get(subscription.plan_id)
            if plan:
                return plan
        
        # Return free/starter plan as default
        from app.models.plan import Plan
        starter_plan = await Plan.find_one({"name": "Starter", "is_active": True})
        if not starter_plan:
            # Fallback if no Starter plan exists
            starter_plan = await Plan.find_one({"price_inr": 0, "is_active": True})
        return starter_plan
    
    async def can_generate_report(self) -> bool:
        """Check if user can generate a report based on their plan"""
        current_plan = await self.get_current_plan()
        
        if not current_plan:
            return False
        
        # If unlimited reports
        if current_plan.reports_limit is None:
            return True
        
        # Check if within limit
        return self.reports_generated < current_plan.reports_limit
    
    async def get_reports_remaining(self) -> int:
        """Get number of reports remaining for user"""
        current_plan = await self.get_current_plan()
        
        if not current_plan:
            return 0
        
        if current_plan.reports_limit is None:
            return -1  # Unlimited
        
        remaining = current_plan.reports_limit - self.reports_generated
        return max(0, remaining)
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        self.updated_at = datetime.utcnow()