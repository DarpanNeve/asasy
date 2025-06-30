from beanie import Document
from pydantic import Field
from typing import List, Optional, Dict, Any
from datetime import datetime

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
    
    # Enhanced prompt template for AI generation
    prompt_template: str = Field(default="", description="AI prompt template for this plan")
    
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

# Enhanced plans data with comprehensive AI prompts aligned to specifications
DEFAULT_PLANS = [
    {
        "name": "Basic",
        "description": "Free plan - Perfect for outreach and teasers",
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
            "Basic Technology Assessment",
            "1-2 page reports",
            "Core sections only",
            "PDF export",
            "Email support"
        ],
        "is_popular": False,
        "sort_order": 1,
        "highlight_text": "Get Started Free",
        "badge_text": "Free",
        "prompt_template": """
You are generating a BASIC Technology Assessment Report (1-2 pages) for outreach and teaser purposes.

**Target Audience**: General outreach, initial interest generation
**Analysis Depth**: Surface-level overview
**Use Cases**: Outreach, Teasers

**Required Sections (keep each section concise, 2-3 sentences max)**:
1. Executive Summary: 1-2 line value proposition
2. Problem/Opportunity Statement: Brief market need
3. Technology Overview: Core idea and brief features
4. Key Benefits: Unique Selling Proposition (USP)
5. Applications: Primary markets/use cases
6. IP Snapshot: Status & country
7. Next Steps: Pilot studies, further R&D recommendations

**Tone**: Accessible and engaging for general audience
**Length**: Keep total content under 500 words
**Focus**: High-level overview suitable for initial interest generation
"""
    },
    {
        "name": "Intermediate",
        "description": "In-depth feasibility check for internal reviews",
        "price_inr": 2000,  # ₹20
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
            "Intermediate Technology Assessment",
            "3-5 page reports",
            "TRL Analysis (Initial)",
            "Market Signals analysis",
            "Competitor Analysis",
            "Legal & Regulatory (Basic)",
            "Priority email support"
        ],
        "is_popular": True,
        "sort_order": 2,
        "highlight_text": "Most Popular",
        "badge_text": "Best Value",
        "prompt_template": """
You are generating an INTERMEDIATE Technology Assessment Report (3-5 pages) for institutional feasibility review.

**Target Audience**: Internal stakeholders, limited partners
**Analysis Depth**: Feasibility assessment with go/no-go recommendation
**Use Cases**: Institutional Feasibility

**Required Sections**:
1. Expanded Executive Summary: Go/no-go recommendation with justification
2. Problem & Solution Fit: Background justification and market need validation
3. Technical Feasibility: Prototype status, TRL stage assessment
4. IP Summary: Landscape overview and freedom-to-operate analysis
5. Market Signals: Interest letters, pilot test data, early adoption indicators
6. Early Competitors: Known technologies and patent citations
7. Regulatory/Compliance Overview: Basic regulatory requirements
8. Risk Summary and Key Questions: Technical, market, and IP risks

**Enhanced Features to Include**:
- TRL Analysis (Initial assessment)
- Market Signals analysis
- Competitor Analysis (basic landscape)
- Legal & Regulatory (basic overview)

**Tone**: Professional analytical suitable for internal decision-making
**Length**: 800-1200 words total
**Focus**: Feasibility assessment with actionable recommendations
"""
    },
    {
        "name": "Advanced",
        "description": "Full pre-commercial diligence for investors and incubators",
        "price_inr": 5000,  # ₹50
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
            "Advanced Technology Assessment",
            "5-8 page reports",
            "VC-ready Executive Summary",
            "Detailed TRL Analysis with data",
            "SWOT Analysis & Market Segmentation",
            "Commercialization Pathways",
            "Preliminary ROI Forecasts",
            "Regulatory Pathway Analysis",
            "Priority support with dedicated manager"
        ],
        "is_popular": False,
        "sort_order": 3,
        "highlight_text": "Professional Grade",
        "badge_text": "Advanced",
        "prompt_template": """
You are generating an ADVANCED Technology Assessment Report (5-8 pages) for pre-commercial diligence.

**Target Audience**: Professional investors, incubators, tech-transfer offices
**Analysis Depth**: Full pre-commercial diligence
**Use Cases**: Incubators, Angel/Seed funding

**Required Sections**:
1. Detailed Business Case: VC-ready narrative with investment thesis
2. Technology Description: Core claims, development stage, TRL framework analysis
3. Market & Competition: Segmentation, SWOT analysis, barriers to entry
4. TRL & Technical Challenges: Scale-up readiness assessment
5. Detailed IP & Legal Status: Global patent families, claims analysis, FTO risks
6. Regulatory Pathways: CE, FDA, BIS, AIS approval processes
7. Commercialization Options: Spin-off, licensing, joint ventures analysis
8. Preliminary Financial Estimates: Cost vs ROI model with assumptions
9. Summary & Go-to-Market Plan: Strategic roadmap with milestones

**Enhanced Features to Include**:
- Executive Summary (VC-ready with investment recommendation)
- TRL Analysis (With supporting data and development roadmap)
- IP Snapshot (Enhanced with claim analysis)
- Market Signals (Segmentation and trend analysis)
- Competitor Analysis (SWOT, competitive landscape mapping)
- Commercialization Paths (Multiple options with pros/cons)
- ROI Forecast (Preliminary with key assumptions)

**Tone**: Investment-grade professional suitable for funding decisions
**Length**: 1500-2000 words total
**Focus**: Pre-commercial diligence with investment readiness assessment
"""
    },
    {
        "name": "Comprehensive",
        "description": "Investment-grade commercialization plan for VC funding",
        "price_inr": 10200,  # ₹102
        "duration_days": 30,
        "reports_limit": None,  # Unlimited
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
            "Unlimited reports per month",
            "Comprehensive IP Commercialization",
            "10-20 page reports",
            "Investor-grade Executive Summary",
            "Detailed TRL roadmap",
            "Full IP claims analysis",
            "Global market trends & forecasts",
            "5-year financial projections",
            "Funding strategy with grant mapping",
            "Legal & regulatory by jurisdiction",
            "24/7 dedicated support",
            "Custom branding and templates",
            "RTTP expert consultation"
        ],
        "is_popular": False,
        "sort_order": 4,
        "highlight_text": "Enterprise Solution",
        "badge_text": "Complete",
        "prompt_template": """
You are generating a COMPREHENSIVE IP Commercialization Report (10-20 pages) for investment-grade analysis.

**Target Audience**: Venture capitalists, government grant applications, startup launch
**Analysis Depth**: Investment-grade commercialization plan
**Use Cases**: VC Decks, Government Grants, Licensing Negotiations

**Required Sections**:
1. In-depth IP Claims Analysis: Protection scope, robustness assessment
2. Global Freedom-to-Operate Report: US, EU, India, China analysis
3. Market Analysis: Size, trends, addressable market, adoption barriers
4. Business Models: Licensing, SaaS, product, hybrid model analysis
5. 5-Year ROI & Revenue Projections: Unit cost, pricing, TAM/SAM/SOM
6. Funding Strategy: Grants, accelerators, VC, PE, SBIR mapping
7. Licensing & Exit Strategy: Terms, IP deal structures, valuation
8. Team & Strategic Partners Required: Talent, advisors, partnerships
9. Implementation Roadmap: Milestones, MVP, pilot scaling timeline
10. Appendices: Patent tables, market research data, technical drawings

**Premium Features to Include**:
- Executive Summary (Investor-grade with clear investment thesis)
- TRL Analysis (Detailed roadmap with development milestones)
- IP Snapshot (Full claim analysis with competitive positioning)
- Market Signals (Global trends + forecasts with data sources)
- Competitor Analysis (Market share data and competitive intelligence)
- Commercialization Paths (Financial modeling for each option)
- ROI Forecast (5-year plan with funding requirements)
- Legal & Regulatory (By jurisdiction with timeline estimates)

**Tone**: Institutional-grade professional suitable for board presentations
**Length**: 3000-4000 words total
**Focus**: Complete commercialization strategy with detailed financial modeling
"""
    }
]