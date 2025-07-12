from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TokenPackageType(str, Enum):
    STARTER = "starter"
    PRO = "pro"
    MAX = "max"
    ENTERPRISE = "enterprise"

class TokenTransactionStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TokenPackage(Document):
    name: str = Field(..., description="Package name")
    package_type: TokenPackageType = Field(..., description="Package type")
    tokens: int = Field(..., description="Number of tokens in package")
    price_inr: int = Field(..., description="Price in INR (paise)")
    description: str = Field(..., description="Package description")
    is_active: bool = True
    sort_order: int = 0
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "token_packages"
        indexes = [
            "package_type",
            "is_active",
            "sort_order",
        ]
    
    @property
    def price_rupees(self) -> float:
        """Convert price from paise to rupees"""
        return self.price_inr / 100

class TokenTransaction(Document):
    user_id: str = Field(..., description="User ID")
    package_id: str = Field(..., description="Token package ID")
    package_name: str = Field(..., description="Package name for display")
    tokens_purchased: int = Field(..., description="Number of tokens purchased")
    amount_paid: int = Field(..., description="Amount paid in paise")
    
    # Razorpay details
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    
    status: TokenTransactionStatus = TokenTransactionStatus.PENDING
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Settings:
        name = "token_transactions"
        indexes = [
            "user_id",
            "status",
            "created_at",
            [("user_id", 1), ("created_at", -1)],
        ]

class UserTokenBalance(Document):
    user_id: str = Field(..., description="User ID", unique=True)
    total_tokens: int = Field(default=0, description="Total tokens purchased")
    used_tokens: int = Field(default=0, description="Tokens used")
    available_tokens: int = Field(default=0, description="Available tokens")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "user_token_balances"
        indexes = [
            "user_id",
        ]
    
    def add_tokens(self, tokens: int):
        """Add tokens to user balance"""
        self.total_tokens += tokens
        self.available_tokens += tokens
        self.updated_at = datetime.utcnow()
    
    def use_tokens(self, tokens: int) -> bool:
        """Use tokens if available"""
        if self.available_tokens >= tokens:
            self.used_tokens += tokens
            self.available_tokens -= tokens
            self.updated_at = datetime.utcnow()
            return True
        return False
    
    def can_use_tokens(self, tokens: int) -> bool:
        """Check if user has enough tokens"""
        return self.available_tokens >= tokens

# Default token packages
DEFAULT_TOKEN_PACKAGES = [
    {
        "name": "Starter Pack",
        "package_type": TokenPackageType.STARTER,
        "tokens": 8000,
        "price_inr": 250000,  # ₹2,500
        "description": "Perfect for getting started with AI reports",
        "sort_order": 1
    },
    {
        "name": "Pro Pack",
        "package_type": TokenPackageType.PRO,
        "tokens": 24000,
        "price_inr": 750000,  # ₹7,500
        "description": "Best value for regular users",
        "sort_order": 2
    },
    {
        "name": "Max Pack",
        "package_type": TokenPackageType.MAX,
        "tokens": 29000,
        "price_inr": 900000,  # ₹9,000
        "description": "Maximum tokens for power users",
        "sort_order": 3
    },
    {
        "name": "Enterprise",
        "package_type": TokenPackageType.ENTERPRISE,
        "tokens": 50000,
        "price_inr": 1500000,  # ₹15,000
        "description": "Custom solution for enterprises",
        "sort_order": 4
    }
]