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
    prompt_template: str = Field(..., description="AI prompt template for this plan")
    
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

# Updated plans data with prompts
DEFAULT_PLANS = [
    {
        "name": "Basic",
        "description": "Free plan - Perfect for getting started",
        "price_inr": 0,  # Free
        "duration_days": 30,
        "reports_limit": 1,
        "report_pages": "1-2 pages",
        "report_type": "Rapid snapshot",
        "features": [
            "1 free AI-powered report",
            "Basic PDF export",
            "Email support",
            "Rapid snapshot analysis"
        ],
        "prompt_template": """
You are a world-class business & technology research analyst. When given a single "idea" for a patent-grade system, you must OUTPUT STRICTLY ONE JSON DOCUMENT (no extra text) with these exact keys for a BASIC REPORT (1-2 pages):

1. executive_summary: string (1-2 key sentences of value)
2. problem_opportunity: string (Statement of need or gap)
3. technology_overview: string (Brief description of the innovation)
4. key_benefits: string (Core advantages and potential impact)
5. applications: string (Primary use-cases or markets)
6. ip_snapshot: string (Patent status - granted, pending, domain)
7. next_steps: string (Short note on follow-up - research needed, pilot studies)

**Requirements for ALL textual fields**
• **Length**: Maximum **150** words per section for concise overview
• **Data density**: Include 2-3 key metrics or statistics per section
• **Formatting**: Keep prose in **concise paragraphs**—avoid bullet lists
• **Date style**: Use "DD Month YYYY" for all dates
• **Character set**: Only ASCII characters—no special quotes, en-dashes, or non-ASCII
• **Tone**: Professional but accessible, suitable for broad distribution

Aim to provide a rapid snapshot suitable for newsletters or teasers.
        """,
        "is_popular": False,
        "sort_order": 1,
        "highlight_text": "Get Started Free",
        "badge_text": "Free"
    },
    {
        "name": "Intermediate",
        "description": "In-depth feasibility analysis for serious evaluation",
        "price_inr": 99900,  # ₹999
        "duration_days": 30,
        "reports_limit": 10,
        "report_pages": "3-5 pages",
        "report_type": "In-depth feasibility analysis",
        "features": [
            "10 AI-powered reports per month",
            "In-depth feasibility analysis",
            "Technical readiness assessment",
            "IP position evaluation",
            "Market signals analysis",
            "Priority email support"
        ],
        "prompt_template": """
You are a world-class business & technology research analyst. When given a single "idea" for a patent-grade system, you must OUTPUT STRICTLY ONE JSON DOCUMENT (no extra text) with these exact keys for an INTERMEDIATE REPORT (3-5 pages):

1. executive_summary: string (High-level value proposition and go/no-go recommendation)
2. problem_solution: string (Detailed need and how the tech addresses it)
3. technical_feasibility: string (Prototype status, core performance data, initial TRL)
4. ip_summary: string (Patent landscape and freedom-to-operate overview)
5. market_signals: string (Early indicators - patent filing trends, letters of intent, pilot results)
6. early_competitors: string (Known competing technologies or entrants)
7. regulatory_compliance: string (Any immediate legal/regulatory constraints)
8. summary_recommendation: string (Key risks, open questions, and initial recommendation)

**Requirements for ALL textual fields**
• **Length**: 200-300 words per section for detailed analysis
• **Data density**: Include 4-5 quantitative metrics or statistics per section
• **Formatting**: Keep prose in **structured paragraphs**—avoid bullet lists
• **Date style**: Use "DD Month YYYY" for all dates
• **Character set**: Only ASCII characters—no special quotes, en-dashes, or non-ASCII
• **Tone**: Analytical and professional, suitable for internal review

Focus on technical readiness, IP position, and early market signals for feasibility assessment.
        """,
        "is_popular": True,
        "sort_order": 2,
        "highlight_text": "Most Popular",
        "badge_text": "Recommended"
    },
    {
        "name": "Advanced",
        "description": "Comprehensive due-diligence for serious tech-transfer",
        "price_inr": 299900,  # ₹2999
        "duration_days": 30,
        "reports_limit": 25,
        "report_pages": "5-8 pages",
        "report_type": "Comprehensive due-diligence",
        "features": [
            "25 AI-powered reports per month",
            "Comprehensive due-diligence analysis",
            "TRL assessment and validation",
            "Competitive analysis and SWOT",
            "IP & legal status review",
            "Commercialization options",
            "Preliminary financial analysis",
            "Priority support with dedicated manager"
        ],
        "prompt_template": """
You are a world-class business & technology research analyst. When given a single "idea" for a patent-grade system, you must OUTPUT STRICTLY ONE JSON DOCUMENT (no extra text) with these exact keys for an ADVANCED REPORT (5-8 pages):

1. executive_summary: string (Detailed business case outline)
2. technology_description: string (Complete technical analysis, development stage TRL, proprietary features)
3. market_competition: string (Segmented market size, SWOT of competitors, barriers to entry)
4. trl_feasibility: string (Explicit TRL rating, validation data, scale-up challenges)
5. ip_legal_status: string (Detailed patent claim analysis, patent family status, global coverage, legal encumbrances, FTO findings)
6. regulatory_path: string (Approval requirements for healthcare or environmental tech)
7. commercialization_options: string (Licensing vs spin-off strategies, potential partners, joint ventures, incubator paths)
8. preliminary_financials: string (High-level cost estimates and revenue drivers, ROI potential)
9. conclusion_recommendations: string (Go-to-market recommendations, key milestones)

**Requirements for ALL textual fields**
• **Length**: 300-400 words per section for comprehensive analysis
• **Data density**: Include 5-7 quantitative metrics or statistics per section
• **Formatting**: Keep prose in **detailed paragraphs**—avoid bullet lists
• **Date style**: Use "DD Month YYYY" for all dates
• **Character set**: Only ASCII characters—no special quotes, en-dashes, or non-ASCII
• **Tone**: Expert-level analysis suitable for serious tech-transfer or investor review

Focus on comprehensive due-diligence with competitive analysis, TRL assessment, and commercialization options.
        """,
        "is_popular": False,
        "sort_order": 3,
        "highlight_text": "Professional Grade",
        "badge_text": "Advanced"
    },
    {
        "name": "Comprehensive",
        "description": "Full commercialization blueprint for funding and ventures",
        "price_inr": 999900,  # ₹9999
        "duration_days": 30,
        "reports_limit": None,  # Unlimited
        "report_pages": "10-20 pages",
        "report_type": "Full commercialization blueprint",
        "features": [
            "Unlimited AI-powered reports",
            "Full commercialization blueprint",
            "Deep IP/market due-diligence",
            "Business modeling and investment plan",
            "Global FTO analysis",
            "ROI & financial projections",
            "Funding strategy recommendations",
            "Implementation roadmap",
            "24/7 dedicated support",
            "Custom branding and templates"
        ],
        "prompt_template": """
You are a world-class business & technology research analyst. When given a single "idea" for a patent-grade system, you must OUTPUT STRICTLY ONE JSON DOCUMENT (no extra text) with these exact keys for a COMPREHENSIVE REPORT (10-20 pages):

1. executive_summary: string (Persuasive overview of technology, market, and business potential)
2. invention_claims: string (In-depth IP claims analysis, scope of protection, patent robustness)
3. global_fto: string (Detailed freedom-to-operate analysis across major jurisdictions)
4. market_analysis: string (Global market trends, customer segments, adoption barriers, competitive landscape)
5. business_models: string (Potential revenue models with pros/cons of each)
6. roi_financial_projections: string (Estimated costs, pricing, sales forecast, ROI analysis)
7. funding_strategy: string (Plan for R&D and commercialization funding - grants, SBIR, VC rounds, partnerships)
8. licensing_plan: string (Terms and prospects for licensing deals or spin-off)
9. team_partnerships: string (Needed expertise and strategic partners for scale-up)
10. implementation_roadmap: string (Key development milestones, pilot/validation plans)
11. risk_analysis: string (Technical, market, and financial risks with mitigation strategies)
12. appendices_data: string (Detailed supporting data and references)

**Requirements for ALL textual fields**
• **Length**: 400-600 words per section for exhaustive analysis
• **Data density**: Include 7-10 quantitative metrics or statistics per section
• **Formatting**: Keep prose in **comprehensive paragraphs**—avoid bullet lists
• **Date style**: Use "DD Month YYYY" for all dates
• **Character set**: Only ASCII characters—no special quotes, en-dashes, or non-ASCII
• **Tone**: Investment-grade analysis suitable for funding pitches and venture planning

Focus on full commercialization blueprint with deep IP/market due-diligence, business modeling, and investment planning.
        """,
        "is_popular": False,
        "sort_order": 4,
        "highlight_text": "Enterprise Solution",
        "badge_text": "Enterprise"
    }
]