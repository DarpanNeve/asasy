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
    
    # Prompt template for AI generation
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

# Updated plans data with AI prompts
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
        "prompt_template": """You are an expert technology analyst. Generate a basic technology assessment report in JSON format.

Required sections: Executive Summary, Problem/Opportunity Statement, Technology Overview, Key Benefits, Applications, IP Snapshot, Next Steps.

Return ONLY valid JSON with these exact keys:
{
  "executive_summary": "Brief overview of the technology and its potential",
  "problem_opportunity": "Problem this technology solves and market opportunity",
  "technology_overview": "Technical description and how it works",
  "key_benefits": "Main advantages and value propositions",
  "applications": "Potential use cases and target markets",
  "ip_snapshot": "Basic IP landscape overview",
  "next_steps": "Recommended actions for development"
}

Keep each section concise (2-3 paragraphs max). Focus on high-level insights."""
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
        "prompt_template": """You are an expert technology analyst. Generate an intermediate technology assessment report in JSON format.

Required sections: Executive Summary, Problem/Opportunity Statement, Technology Overview, Key Benefits, Applications, IP Snapshot, Next Steps, Problem & Solution Fit, Technical Feasibility, IP Summary, Market Signals, Early Competitors, Regulatory/Compliance Overview, Risk Summary.

Return ONLY valid JSON with these exact keys:
{
  "executive_summary": "Comprehensive overview with market context",
  "problem_opportunity": "Detailed problem analysis and market sizing",
  "technology_overview": "Technical architecture and implementation details",
  "key_benefits": "Quantified benefits and competitive advantages",
  "applications": "Detailed use cases with market segments",
  "ip_snapshot": "Patent landscape and freedom to operate",
  "next_steps": "Detailed development roadmap",
  "problem_solution": "Problem-solution fit analysis",
  "technical_feasibility": "Technical challenges and development timeline",
  "ip_summary": "IP strategy and protection recommendations",
  "market_signals": "Market trends and adoption indicators",
  "early_competitors": "Competitive landscape analysis",
  "regulatory_compliance": "Regulatory requirements and compliance pathway",
  "summary_recommendation": "Risk assessment and go/no-go recommendation"
}

Provide detailed analysis with specific insights and actionable recommendations."""
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
        "prompt_template": """You are a senior technology commercialization expert. Generate a comprehensive professional technology assessment report in JSON format.

Required sections: All previous sections plus Detailed Business Case, Technology Description, Market & Competition, TRL & Technical Challenges, Detailed IP & Legal Status, Regulatory Pathways, Commercialization Options, Preliminary Financial Estimates, Summary & Go-to-Market Plan.

Return ONLY valid JSON with these exact keys:
{
  "executive_summary": "Executive-level strategic overview",
  "problem_opportunity": "Market problem with TAM/SAM analysis",
  "technology_overview": "Detailed technical specifications",
  "key_benefits": "Quantified value proposition with ROI",
  "applications": "Market segmentation and prioritization",
  "ip_snapshot": "Comprehensive IP landscape",
  "next_steps": "Strategic development roadmap",
  "detailed_business_case": "Business model and revenue projections",
  "technology_description": "Technical architecture and scalability",
  "market_competition": "Competitive positioning and SWOT analysis",
  "trl_technical_challenges": "Technology readiness level assessment",
  "detailed_ip_legal": "IP strategy and legal considerations",
  "regulatory_pathways": "Regulatory approval strategy",
  "commercialization_options": "Go-to-market strategies and partnerships",
  "financial_estimates": "Financial projections and funding requirements",
  "conclusion_recommendations": "Strategic recommendations and next steps"
}

Provide investment-grade analysis with detailed financial and strategic insights."""
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
        "prompt_template": """You are a senior IP commercialization expert and RTTP professional. Generate a comprehensive enterprise-grade IP commercialization report in JSON format.

Required sections: All previous sections plus In-depth IP Claims Analysis, Global Freedom-to-Operate Report, Market Analysis, Business Models, 5-Year ROI & Revenue Projections, Funding Strategy, Licensing & Exit Strategy, Team & Strategic Partners Required, Implementation Roadmap, Appendices.

Return ONLY valid JSON with these exact keys:
{
  "executive_summary": "C-suite executive summary with investment thesis",
  "problem_opportunity": "Market analysis with global opportunity sizing",
  "technology_overview": "Comprehensive technical due diligence",
  "key_benefits": "Quantified competitive advantages and moats",
  "applications": "Global market segmentation and entry strategy",
  "ip_snapshot": "Patent portfolio analysis and IP valuation",
  "next_steps": "Strategic implementation roadmap",
  "ip_claims_analysis": "Detailed patent claims and prior art analysis",
  "global_fto_report": "Freedom-to-operate analysis across key markets",
  "market_analysis": "Comprehensive market research and sizing",
  "business_models": "Revenue model optimization and pricing strategy",
  "roi_projections": "5-year financial projections and sensitivity analysis",
  "funding_strategy": "Capital requirements and funding pathway",
  "licensing_strategy": "IP licensing and exit strategy options",
  "team_partners": "Required team composition and strategic partnerships",
  "implementation_roadmap": "Detailed execution timeline and milestones",
  "conclusion_recommendations": "Investment recommendation with risk mitigation"
}

Provide institutional-grade analysis suitable for board presentations and investor due diligence."""
    }
]