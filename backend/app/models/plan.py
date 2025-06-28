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
    
    # Report generation settings
    report_pages: str = Field(..., description="Page range for reports")
    report_type: str = Field(..., description="Type of report generated")
    report_formats: List[int] = Field(default_factory=list, description="Available report formats (1-4)")
    sections: List[str] = Field(default_factory=list, description="Report sections included")
    
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

# Updated plans data with new pricing and sections
DEFAULT_PLANS = [
    {
        "name": "Starter",
        "description": "Free plan - Perfect for getting started",
        "price_inr": 0,  # Free
        "duration_days": 30,
        "reports_limit": 3,
        "report_pages": "1-2 pages",
        "report_type": "Basic Technology Assessment",
        "report_formats": [1],
        "sections": [
            "Executive Summary",
            "Problem/Opportunity Statement", 
            "Technology Overview",
            "Key Benefits",
            "Applications",
            "IP Snapshot",
            "Next Steps"
        ],
        "features": [
            "3 reports per month",
            "Format 1 - Basic Assessment",
            "Basic PDF export",
            "Email support"
        ],
        "is_popular": False,
        "sort_order": 1,
        "highlight_text": "Get Started Free",
        "badge_text": "Free"
    },
    {
        "name": "Explorer",
        "description": "Low-cost option with expanded analysis",
        "price_inr": 1800,  # ₹18
        "duration_days": 30,
        "reports_limit": 10,
        "report_pages": "3-5 pages",
        "report_type": "Intermediate Technology Assessment",
        "report_formats": [1, 2],
        "sections": [
            "Executive Summary",
            "Problem/Opportunity Statement",
            "Technology Overview", 
            "Key Benefits",
            "Applications",
            "IP Snapshot",
            "Next Steps",
            "Expanded Executive Summary",
            "Problem & Solution Fit",
            "Technical Feasibility",
            "IP Summary",
            "Market Signals",
            "Early Competitors",
            "Regulatory/Compliance Overview",
            "Risk Summary and Key Questions"
        ],
        "features": [
            "10 reports per month",
            "Formats 1 & 2 - Basic + Intermediate",
            "Technical feasibility assessment",
            "IP landscape overview",
            "Market signals analysis",
            "Priority email support"
        ],
        "is_popular": True,
        "sort_order": 2,
        "highlight_text": "Most Popular",
        "badge_text": "Best Value"
    },
    {
        "name": "Professional",
        "description": "Comprehensive analysis for serious evaluation",
        "price_inr": 4000,  # ₹40
        "duration_days": 30,
        "reports_limit": 20,
        "report_pages": "5-8 pages",
        "report_type": "Advanced Technology Assessment",
        "report_formats": [1, 2, 3],
        "sections": [
            "Executive Summary",
            "Problem/Opportunity Statement",
            "Technology Overview",
            "Key Benefits", 
            "Applications",
            "IP Snapshot",
            "Next Steps",
            "Expanded Executive Summary",
            "Problem & Solution Fit",
            "Technical Feasibility",
            "IP Summary",
            "Market Signals",
            "Early Competitors",
            "Regulatory/Compliance Overview",
            "Risk Summary and Key Questions",
            "Detailed Business Case",
            "Technology Description",
            "Market & Competition",
            "TRL & Technical Challenges",
            "Detailed IP & Legal Status",
            "Regulatory Pathways",
            "Commercialization Options",
            "Preliminary Financial Estimates",
            "Summary & Go-to-Market Plan"
        ],
        "features": [
            "20 reports per month",
            "Formats 1, 2 & 3 - Full Professional Suite",
            "Detailed business case analysis",
            "TRL assessment and validation",
            "Competitive analysis and SWOT",
            "IP & legal status review",
            "Commercialization options",
            "Preliminary financial analysis",
            "Priority support with dedicated manager"
        ],
        "is_popular": False,
        "sort_order": 3,
        "highlight_text": "Professional Grade",
        "badge_text": "Advanced"
    },
    {
        "name": "Enterprise",
        "description": "Full access with comprehensive IP commercialization",
        "price_inr": 5400,  # ₹54
        "duration_days": 30,
        "reports_limit": 25,
        "report_pages": "10-20 pages",
        "report_type": "Comprehensive IP Commercialization Report",
        "report_formats": [1, 2, 3, 4],
        "sections": [
            "Executive Summary",
            "Problem/Opportunity Statement",
            "Technology Overview",
            "Key Benefits",
            "Applications", 
            "IP Snapshot",
            "Next Steps",
            "Expanded Executive Summary",
            "Problem & Solution Fit",
            "Technical Feasibility",
            "IP Summary",
            "Market Signals",
            "Early Competitors",
            "Regulatory/Compliance Overview",
            "Risk Summary and Key Questions",
            "Detailed Business Case",
            "Technology Description",
            "Market & Competition",
            "TRL & Technical Challenges",
            "Detailed IP & Legal Status",
            "Regulatory Pathways",
            "Commercialization Options",
            "Preliminary Financial Estimates",
            "Summary & Go-to-Market Plan",
            "In-depth IP Claims Analysis",
            "Global Freedom-to-Operate Report",
            "Market Analysis",
            "Business Models",
            "5-Year ROI & Revenue Projections",
            "Funding Strategy",
            "Licensing & Exit Strategy",
            "Team & Strategic Partners Required",
            "Implementation Roadmap",
            "Appendices"
        ],
        "features": [
            "25 reports per month",
            "Full access to Formats 1-4",
            "Comprehensive IP commercialization",
            "Global FTO analysis",
            "5-year ROI & revenue projections",
            "Funding strategy recommendations",
            "Implementation roadmap",
            "24/7 dedicated support",
            "Custom branding and templates",
            "RTTP expert consultation"
        ],
        "is_popular": False,
        "sort_order": 4,
        "highlight_text": "Enterprise Solution",
        "badge_text": "Complete"
    }
]