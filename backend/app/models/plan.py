from beanie import Document
from pydantic import Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from decimal import Decimal

class PlanFeature(Document):
    name: str = Field(..., description="Feature name")
    description: str = Field(..., description="Feature description")
    enabled: bool = True

class Plan(Document):
    name: str = Field(..., description="Plan name")
    description: str = Field(..., description="Plan description")
    price_inr: int = Field(..., description="Price in INR (paise)")
    duration_days: int = Field(..., description="Plan duration in days")
    
    # Features
    reports_limit: Optional[int] = None  # None means unlimited
    features: List[str] = Field(default_factory=list)
    
    # Razorpay integration
    razorpay_plan_id: Optional[str] = None
    
    # Display
    is_popular: bool = False
    is_active: bool = True
    sort_order: int = 0
    
    # Marketing
    pdf_url: Optional[str] = None
    highlight_text: Optional[str] = None
    badge_text: Optional[str] = None
    
    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "plans"
        indexes = [
            "is_active",
            "sort_order",
            "price_inr",
        ]
    
    @property
    def price_rupees(self) -> float:
        """Convert price from paise to rupees"""
        return self.price_inr / 100
    
    @property
    def monthly_price(self) -> float:
        """Calculate monthly price for comparison"""
        return (self.price_inr / 100) / (self.duration_days / 30)
    
    def dict_for_display(self) -> dict:
        """Return plan dict with display-friendly pricing"""
        data = self.dict()
        data["price_rupees"] = self.price_rupees
        data["monthly_price"] = self.monthly_price
        return data

# Default plans data for seeding
DEFAULT_PLANS = [
    {
        "name": "Starter",
        "description": "Perfect for individuals and small teams getting started",
        "price_inr": 99900,  # ₹999
        "duration_days": 30,
        "reports_limit": 10,
        "features": [
            "10 AI-powered reports per month",
            "Professional PDF exports",
            "Email support",
            "Basic analytics dashboard",
            "Standard report templates"
        ],
        "is_popular": False,
        "sort_order": 1,
        "highlight_text": "Most Popular for Startups",
        "badge_text": "Best Value"
    },
    {
        "name": "Professional", 
        "description": "Ideal for growing businesses and consultants",
        "price_inr": 299900,  # ₹2999
        "duration_days": 30,
        "reports_limit": 50,
        "features": [
            "50 AI-powered reports per month",
            "Advanced PDF customization",
            "Priority email support",
            "Advanced analytics dashboard", 
            "Custom report templates",
            "API access",
            "Team collaboration tools"
        ],
        "is_popular": True,
        "sort_order": 2,
        "highlight_text": "Most Popular",
        "badge_text": "Recommended"
    },
    {
        "name": "Enterprise",
        "description": "For large organizations with advanced needs",
        "price_inr": 999900,  # ₹9999
        "duration_days": 30,
        "reports_limit": None,  # Unlimited
        "features": [
            "Unlimited AI-powered reports",
            "Custom branding and templates",
            "Dedicated account manager",
            "24/7 phone and email support",
            "Advanced team management",
            "Full API access",
            "Custom integrations",
            "SLA guarantees",
            "On-premise deployment option"
        ],
        "is_popular": False,
        "sort_order": 3,
        "highlight_text": "For Large Teams",
        "badge_text": "Enterprise"
    }
]