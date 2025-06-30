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
        "report_pages": "3-4 pages",
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
            "3-4 page reports with tables",
            "Core sections + 5 data tables",
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
**Analysis Depth**: Surface-level overview with key highlights and essential data tables
**Use Cases**: Outreach, Teasers, Initial stakeholder presentations

**Content Requirements**:
- Write 50-150 words per section with clear, accessible language
- Include specific market data, growth rates, and competitive metrics
- Focus on high-level value proposition and commercial opportunity
- Provide realistic financial estimates and development timelines
- Include quantitative data to support all claims

**Professional Standards**:
- Include market size estimates with growth projections
- Reference technology readiness levels and development stages
- Provide competitive landscape overview with key players
- Include realistic cost estimates and revenue projections
- Use industry-standard terminology and frameworks

**Data Requirements**:
- Market size: Include TAM estimates with CAGR data
- Technology metrics: TRL levels, development timelines
- Financial data: Development costs, revenue projections
- Competitive data: Market share, pricing, key features
- Timeline data: Development phases, milestones, costs

**Tone**: Professional yet accessible, optimistic but realistic, suitable for business presentations
"""
    },
    {
        "name": "Intermediate",
        "description": "In-depth feasibility check for internal reviews",
        "price_inr": 2000,  # ₹20
        "duration_days": 30,
        "reports_limit": 10,
        "report_pages": "6-8 pages",
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
            "6-8 page reports with comprehensive tables",
            "15 sections + 5 data tables",
            "TRL Analysis (Initial)",
            "Market Signals analysis",
            "Competitor Analysis with SWOT",
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
**Analysis Depth**: Detailed feasibility assessment with comprehensive data analysis
**Use Cases**: Institutional Feasibility, Internal investment decisions, Partnership evaluation

**Content Requirements**:
- Write 100-250 words per section with detailed analytical content
- Include comprehensive market analysis with segmentation data
- Provide detailed technical feasibility assessment with TRL framework
- Include competitive intelligence with SWOT analysis
- Offer clear go/no-go recommendations with supporting data

**Enhanced Analysis Areas**:
- Market validation with customer research data
- Technical risk assessment with mitigation strategies
- IP landscape analysis with freedom-to-operate overview
- Regulatory pathway analysis with timeline estimates
- Financial modeling with sensitivity analysis
- Competitive positioning with market share data

**Data Requirements**:
- Market data: TAM/SAM/SOM with growth projections and market drivers
- Technology metrics: Detailed TRL assessment with development roadmap
- Competitive intelligence: Market share, revenue, product features, pricing
- Financial projections: Development costs, revenue models, ROI analysis
- Risk assessment: Technical, market, regulatory, and financial risks

**Professional Standards**:
- Use institutional-grade analysis suitable for board presentations
- Include specific regulatory requirements and approval timelines
- Provide detailed competitive landscape with strategic positioning
- Include comprehensive risk assessment with mitigation strategies
- Reference industry standards and best practices

**Tone**: Analytical and professional, suitable for institutional review and investment decisions
"""
    },
    {
        "name": "Advanced",
        "description": "Full pre-commercial diligence for investors and incubators",
        "price_inr": 5000,  # ₹50
        "duration_days": 30,
        "reports_limit": 20,
        "report_pages": "10-12 pages",
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
            "10-12 page reports with advanced tables",
            "24 sections + 7 comprehensive tables",
            "VC-ready Executive Summary",
            "Detailed TRL Analysis with data",
            "SWOT Analysis & Market Segmentation",
            "IP landscape with FTO analysis",
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
- Write 150-350 words per section with investment-grade analysis
- Include comprehensive market intelligence with competitive landscape
- Provide detailed technical and commercial risk assessment
- Present multiple commercialization pathways with detailed analysis
- Include preliminary financial modeling with scenario planning

**Professional Analysis Areas**:
- Investment thesis with clear value proposition and market opportunity
- Comprehensive technical analysis with detailed TRL framework
- Market segmentation with addressable market analysis (TAM/SAM/SOM)
- Competitive landscape with strategic positioning and SWOT analysis
- IP strategy with patent landscape and freedom-to-operate analysis
- Regulatory strategy with approval processes and timeline estimates
- Multiple commercialization pathways with pros/cons analysis
- Financial projections with revenue models and ROI analysis
- Strategic roadmap with implementation timeline and milestones

**Data Requirements**:
- Market intelligence: Detailed market sizing, growth drivers, adoption barriers
- Technology assessment: Comprehensive TRL analysis with development milestones
- Competitive analysis: Market share data, revenue figures, strategic positioning
- IP analysis: Patent landscape, citation analysis, freedom-to-operate assessment
- Financial modeling: Revenue projections, cost structures, ROI scenarios
- Risk analysis: Technical, market, regulatory, and financial risk quantification

**Professional Standards**:
- Investment-grade analysis suitable for funding decisions
- Comprehensive due diligence with supporting data and rationale
- Strategic recommendations with implementation roadmap
- Risk assessment with quantified impact and mitigation strategies
- Professional formatting suitable for investor presentations

**Tone**: Investment-grade professional suitable for funding decisions and board presentations
"""
    },
    {
        "name": "Comprehensive",
        "description": "Investment-grade commercialization plan for VC funding",
        "price_inr": 10200,  # ₹102
        "duration_days": 30,
        "reports_limit": None,  # Unlimited
        "report_pages": "15-25 pages",
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
            "15-25 page reports with premium tables",
            "33 sections + 9 comprehensive tables",
            "Investor-grade Executive Summary",
            "Detailed TRL roadmap with milestones",
            "Full IP claims analysis with FTO",
            "Global market trends & forecasts",
            "5-year financial projections with scenarios",
            "Funding strategy with grant mapping",
            "Legal & regulatory by jurisdiction",
            "Complete licensing and exit strategies",
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
- Write 200-500 words per section with institutional-grade analysis
- Include comprehensive global market analysis with regional breakdowns
- Provide detailed financial modeling with multiple scenarios and sensitivity analysis
- Present complete commercialization strategy with detailed implementation roadmap
- Include comprehensive risk assessment with quantified impact and mitigation strategies

**Comprehensive Analysis Areas**:
- Institutional-grade investment thesis with detailed market opportunity
- Complete technical due diligence with scalability and manufacturing analysis
- Global market analysis with regional opportunity assessment and competitive intelligence
- Comprehensive IP strategy with global patent portfolio optimization
- Detailed business model analysis with multiple revenue streams
- 5-year financial projections with scenario planning and sensitivity analysis
- Complete funding strategy with capital requirements and investor targeting
- Comprehensive regulatory compliance strategy for multiple jurisdictions
- Strategic partnership and licensing framework with valuation models
- Detailed implementation roadmap with milestone tracking and KPIs

**Data Requirements**:
- Global market intelligence: Regional market analysis, adoption patterns, regulatory landscapes
- Technology assessment: Complete TRL roadmap, scalability analysis, manufacturing requirements
- IP intelligence: Global patent landscape, citation analysis, licensing opportunities
- Financial modeling: Detailed 5-year projections, multiple scenarios, sensitivity analysis
- Competitive intelligence: Market share analysis, strategic positioning, partnership opportunities
- Regulatory analysis: Multi-jurisdiction compliance requirements, approval timelines, costs
- Funding analysis: Capital requirements, funding sources, investor profiles, grant opportunities

**Professional Standards**:
- Institutional-grade analysis suitable for board and investor presentations
- Comprehensive due diligence with supporting data, assumptions, and methodologies
- Strategic recommendations with detailed implementation plans and success metrics
- Risk management framework with quantified assessments and mitigation strategies
- Professional formatting and presentation suitable for institutional stakeholders

**Tone**: Institutional-grade professional suitable for board presentations, VC pitches, and government grant applications
"""
    }
]