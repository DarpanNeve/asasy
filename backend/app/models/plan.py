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

# Enhanced plans data with comprehensive AI prompts
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
        "badge_text": "Free",
        "prompt_template": """
Aim to make every section as comprehensive and statistically rigorous as possible while maintaining a basic assessment level.

**Analysis Depth**: Basic level with foundational insights
**Target Audience**: Researchers, students, early-stage inventors
**Focus Areas**: 
- High-level technology overview with basic feasibility assessment
- Preliminary market opportunity identification
- Basic IP landscape overview
- Initial commercialization pathways

**Specific Requirements**:
- Provide foundational analysis suitable for initial technology evaluation
- Include basic market size estimates and growth projections
- Identify primary application areas and target markets
- Assess basic technical feasibility and development requirements
- Outline preliminary IP considerations and protection strategies
- Suggest initial next steps for further development

**Tone**: Educational and accessible, suitable for those new to technology commercialization
**Data Requirements**: Include basic market statistics, fundamental technical metrics, and preliminary financial estimates
"""
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
        "badge_text": "Best Value",
        "prompt_template": """
Aim to make every section as comprehensive and statistically rigorous as possible with intermediate-level depth and analysis.

**Analysis Depth**: Intermediate level with detailed market and technical analysis
**Target Audience**: Entrepreneurs, small businesses, university tech transfer offices
**Focus Areas**:
- Comprehensive technology analysis with detailed feasibility assessment
- Market opportunity quantification with competitive landscape analysis
- IP strategy development with freedom-to-operate considerations
- Multiple commercialization pathway evaluation
- Risk assessment and mitigation strategies

**Specific Requirements**:
- Conduct thorough market analysis with TAM/SAM/SOM calculations
- Provide detailed technical feasibility assessment including TRL evaluation
- Analyze competitive landscape with SWOT analysis
- Develop comprehensive IP strategy including patent landscape analysis
- Evaluate multiple business models and commercialization approaches
- Include regulatory compliance requirements and approval pathways
- Assess financial viability with preliminary ROI projections
- Identify key risks and provide mitigation strategies

**Tone**: Professional and analytical, suitable for business development and investment evaluation
**Data Requirements**: Include detailed market research, competitive intelligence, technical benchmarks, and financial projections with supporting rationale
"""
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
        "badge_text": "Advanced",
        "prompt_template": """
Aim to make every section as comprehensive and statistically rigorous as possible with professional-grade depth suitable for investment decisions.

**Analysis Depth**: Advanced professional level with investment-grade analysis
**Target Audience**: Corporations, investors, established tech transfer offices, consulting firms
**Focus Areas**:
- Investment-grade technology due diligence with comprehensive risk assessment
- Detailed market analysis with multi-scenario financial modeling
- Complete IP strategy with global patent landscape analysis
- Comprehensive commercialization strategy with partnership opportunities
- Regulatory compliance roadmap with approval timeline estimates
- Detailed financial projections with sensitivity analysis

**Specific Requirements**:
- Provide investment-grade due diligence suitable for board presentations
- Conduct comprehensive market research with detailed competitive intelligence
- Perform thorough technical assessment including scalability analysis
- Develop complete IP strategy with global patent landscape mapping
- Create detailed business case with multiple revenue model scenarios
- Include comprehensive regulatory analysis with approval timeline estimates
- Provide detailed financial projections with NPV, IRR, and payback analysis
- Assess strategic partnerships and licensing opportunities
- Include detailed risk analysis with quantified impact assessments
- Develop comprehensive go-to-market strategy with implementation timeline

**Tone**: Executive-level professional suitable for C-suite and investor presentations
**Data Requirements**: Include institutional-grade market research, detailed financial models, comprehensive competitive analysis, and strategic recommendations with quantified business impact
"""
    },
    {
        "name": "Enterprise",
        "description": "Full access with comprehensive IP commercialization",
        "price_inr": 5400,  # ₹54
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
        "badge_text": "Complete",
        "prompt_template": """
Aim to make every section as comprehensive and statistically rigorous as possible with enterprise-grade depth suitable for institutional decision-making.

**Analysis Depth**: Comprehensive enterprise level with institutional-grade analysis
**Target Audience**: Large corporations, institutional investors, government agencies, major research institutions
**Focus Areas**:
- Complete IP commercialization strategy with global market analysis
- Institutional-grade financial modeling with multi-year projections
- Comprehensive regulatory strategy with international compliance requirements
- Strategic partnership and licensing framework development
- Complete technology transfer and commercialization roadmap
- Enterprise-level risk management and mitigation strategies

**Specific Requirements**:
- Provide institutional-grade analysis suitable for board and investor presentations
- Conduct comprehensive global market analysis with regional opportunity assessment
- Perform complete technical due diligence including scalability and manufacturing analysis
- Develop comprehensive global IP strategy with patent portfolio optimization
- Create detailed 5-year financial projections with scenario planning and sensitivity analysis
- Include complete regulatory compliance strategy for multiple jurisdictions
- Provide comprehensive competitive intelligence with strategic positioning analysis
- Develop detailed licensing and partnership strategies with valuation frameworks
- Include complete funding strategy with capital requirements and investor targeting
- Create comprehensive implementation roadmap with milestone tracking and KPIs
- Assess strategic acquisition and exit opportunities with valuation analysis
- Provide detailed team and organizational requirements for successful execution

**Tone**: Institutional-grade professional suitable for executive committees, boards of directors, and institutional investors
**Data Requirements**: Include comprehensive market intelligence, detailed financial models with supporting assumptions, complete competitive landscape analysis, regulatory compliance frameworks, and strategic recommendations with quantified business impact and implementation timelines
"""
    }
]