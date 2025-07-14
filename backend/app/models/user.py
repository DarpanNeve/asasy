from beanie import Document, Indexed
from pydantic import Field, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class OAuthProvider(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"


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
    
    # Usage tracking
    reports_generated: int = 0
    
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
    
    async def get_token_balance(self):
        """Get user's token balance"""
        from app.models.token import UserTokenBalance
        
        balance = await UserTokenBalance.find_one({"user_id": str(self.id)})
        if not balance:
            # Create initial balance
            balance = UserTokenBalance(user_id=str(self.id))
            balance.add_tokens(8000)
            await balance.insert()
        return balance
    
    async def can_generate_report(self, tokens_required: int) -> bool:
        """Check if user has enough tokens to generate a report"""
        balance = await self.get_token_balance()
        return balance.can_use_tokens(tokens_required)
    
    async def use_tokens(self, tokens: int) -> bool:
        """Use tokens for report generation"""
        balance = await self.get_token_balance()
        if balance.use_tokens(tokens):
            await balance.save()
            return True
        return False
    
    async def add_tokens(self, tokens: int):
        """Add tokens to user balance"""
        balance = await self.get_token_balance()
        balance.add_tokens(tokens)
        await balance.save()
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        self.updated_at = datetime.utcnow()