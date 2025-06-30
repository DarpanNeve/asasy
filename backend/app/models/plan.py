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
You are generating a BASIC Technology Assessment Report for outreach and teaser purposes.

**Target Audience**: General outreach, initial interest generation, early-stage evaluation
**Analysis Depth**: Surface-level overview with key highlights
**Use Cases**: Outreach, Teasers, Initial stakeholder presentations

**Content Requirements**:
- Write concise, accessible content suitable for general business audience
- Focus on high-level value proposition and market opportunity
- Include basic feasibility indicators and next steps
- Keep technical details minimal but accurate
- Emphasize commercial potential and market need

**Specific Section Guidelines**:
1. Executive Summary: Clear 1-2 sentence value proposition with market size
2. Problem/Opportunity Statement: Market pain point and opportunity size
3. Technology Overview: Core innovation without deep technical details
4. Key Benefits: 3-4 key competitive advantages and USPs
5. Applications: Primary target markets and use cases
6. IP Snapshot: Basic IP status and protection strategy
7. Next Steps: Immediate actions for development/validation

**Data Requirements**:
- Include basic market size estimates (TAM level)
- Mention relevant industry growth rates
- Reference technology readiness indicators
- Provide realistic development timelines
- Include preliminary competitive landscape

**Tone**: Professional yet accessible, optimistic but realistic
**Focus**: Commercial viability and market opportunity
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
You are generating an INTERMEDIATE Technology Assessment Report for institutional feasibility review.

**Target Audience**: Internal stakeholders, limited partners, institutional decision-makers
**Analysis Depth**: Detailed feasibility assessment with go/no-go recommendation
**Use Cases**: Institutional Feasibility, Internal investment decisions, Partnership evaluation

**Content Requirements**:
- Provide detailed analysis suitable for institutional decision-making
- Include quantitative assessments and data-driven insights
- Offer clear go/no-go recommendations with supporting rationale
- Address key technical, market, and commercial risks
- Include preliminary competitive intelligence

**Enhanced Analysis Areas**:
1. Expanded Executive Summary: Clear investment recommendation with key metrics
2. Problem & Solution Fit: Detailed market validation and solution alignment
3. Technical Feasibility: TRL assessment, development requirements, scalability
4. IP Summary: Patent landscape overview, freedom-to-operate analysis
5. Market Signals: Early adoption indicators, customer validation data
6. Early Competitors: Competitive positioning and differentiation analysis
7. Regulatory/Compliance: Basic regulatory requirements and approval pathways
8. Risk Summary: Technical, market, and commercial risk assessment

**Data Requirements**:
- Include TAM/SAM estimates with growth projections
- Provide TRL assessment with development roadmap
- Reference specific competitors and market positioning
- Include regulatory timeline and cost estimates
- Provide risk-adjusted financial projections

**Tone**: Analytical and professional, suitable for institutional review
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
You are generating an ADVANCED Technology Assessment Report for pre-commercial diligence.

**Target Audience**: Professional investors, incubators, tech-transfer offices, angel investors
**Analysis Depth**: Comprehensive pre-commercial diligence suitable for investment decisions
**Use Cases**: Incubators, Angel/Seed funding, Professional investment evaluation

**Content Requirements**:
- Provide investment-grade analysis suitable for funding decisions
- Include comprehensive market and competitive intelligence
- Offer detailed technical and commercial risk assessment
- Present multiple commercialization pathways with analysis
- Include preliminary financial modeling and projections

**Professional Analysis Areas**:
1. Detailed Business Case: Investment thesis with clear value proposition
2. Technology Description: Comprehensive technical analysis with TRL framework
3. Market & Competition: Detailed market segmentation and competitive landscape
4. TRL & Technical Challenges: Development roadmap with risk assessment
5. Detailed IP & Legal Status: Patent analysis and freedom-to-operate review
6. Regulatory Pathways: Approval processes and regulatory strategy
7. Commercialization Options: Multiple pathways with pros/cons analysis
8. Preliminary Financial Estimates: Revenue models and ROI projections
9. Summary & Go-to-Market Plan: Strategic roadmap with implementation timeline

**Data Requirements**:
- Include detailed TAM/SAM/SOM analysis with market sizing
- Provide comprehensive TRL assessment with development milestones
- Include competitive intelligence with market share data
- Reference specific regulatory requirements and timelines
- Provide financial projections with sensitivity analysis

**Tone**: Investment-grade professional suitable for funding decisions
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
You are generating a COMPREHENSIVE IP Commercialization Report for investment-grade analysis.

**Target Audience**: Venture capitalists, government grant applications, startup launch, licensing negotiations
**Analysis Depth**: Investment-grade commercialization plan suitable for institutional funding
**Use Cases**: VC Decks, Government Grants, Licensing Negotiations, Startup Launch

**Content Requirements**:
- Provide institutional-grade analysis suitable for board presentations
- Include comprehensive global market analysis and competitive intelligence
- Offer detailed financial modeling with multiple scenarios
- Present complete commercialization strategy with implementation roadmap
- Include comprehensive risk assessment and mitigation strategies

**Comprehensive Analysis Areas**:
1. In-depth IP Claims Analysis: Detailed patent protection scope and robustness
2. Global Freedom-to-Operate Report: Multi-jurisdiction IP landscape analysis
3. Market Analysis: Comprehensive market sizing, trends, and opportunity assessment
4. Business Models: Detailed analysis of licensing, SaaS, product, and hybrid models
5. 5-Year ROI & Revenue Projections: Comprehensive financial modeling with scenarios
6. Funding Strategy: Complete funding roadmap including grants, VC, PE, and SBIR
7. Licensing & Exit Strategy: Detailed IP monetization and exit strategies
8. Team & Strategic Partners: Organizational requirements and partnership strategy
9. Implementation Roadmap: Detailed milestone-based execution plan
10. Appendices: Supporting data, patent tables, and technical documentation

**Data Requirements**:
- Include comprehensive global market analysis with regional breakdowns
- Provide detailed 5-year financial projections with multiple scenarios
- Include complete competitive landscape with market share analysis
- Reference specific funding sources and grant opportunities
- Provide detailed regulatory analysis by jurisdiction

**Tone**: Institutional-grade professional suitable for board and investor presentations
**Focus**: Complete commercialization strategy with detailed financial modeling and implementation plan
"""
    }
]