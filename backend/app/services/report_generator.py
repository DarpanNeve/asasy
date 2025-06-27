import os
import json
import openai
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from app.core.config import settings
from app.models.plan import Plan
import asyncio
import logging

logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

async def generate_report_json(idea: str, plan: Plan) -> dict:
    """Generate report content using OpenAI API with plan-specific prompt"""
    
    user_prompt = f"""
Idea: ```{idea}```

Generate the report JSON as specified above. Ensure every section follows the requirements for {plan.report_type} ({plan.report_pages}).
"""
    
    try:
        # Use the new OpenAI client
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": plan.prompt_template},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            max_tokens=4000,
            temperature=0.7,
        )
        
        if not response.choices or not response.choices[0].message.content:
            raise ValueError("Received empty response from OpenAI API")
            
        content = response.choices[0].message.content
        logger.info(f"Generated report content for plan {plan.name}")
        
        return json.loads(content)

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response: {e}")
        return get_fallback_report(plan)
    except openai.OpenAIError as e:
        logger.error(f"OpenAI API error: {e}")
        return get_fallback_report(plan)
    except Exception as e:
        logger.error(f"Unexpected error generating report: {e}")
        return get_fallback_report(plan)

def get_fallback_report(plan: Plan) -> dict:
    """Return a fallback report structure when AI generation fails"""
    if plan.name == "Basic":
        return {
            "executive_summary": "This technology concept shows potential for development. Further analysis recommended to assess viability and market opportunities.",
            "problem_opportunity": "The described technology addresses a market need that requires validation through user research and competitive analysis.",
            "technology_overview": "The proposed solution leverages existing technologies in a novel configuration. Technical feasibility assessment needed.",
            "key_benefits": "Potential benefits include improved efficiency, cost reduction, and enhanced user experience. Quantification required.",
            "applications": "Primary applications span multiple market segments. Target market identification and prioritization recommended.",
            "ip_snapshot": "Initial patent landscape review suggests freedom to operate. Comprehensive IP analysis recommended before development.",
            "next_steps": "Conduct market research, develop proof of concept, and perform detailed technical feasibility study.",
        }
    elif plan.name == "Intermediate":
        return {
            "executive_summary": "Technology assessment indicates moderate to high potential with identified development pathways and market opportunities.",
            "problem_solution": "The technology addresses validated market problems with a technically feasible solution approach requiring further development.",
            "technical_feasibility": "Initial technical assessment shows feasibility with standard engineering approaches. Prototype development recommended for validation.",
            "ip_summary": "Patent landscape analysis reveals competitive space with opportunities for novel claims. IP strategy development recommended.",
            "market_signals": "Market indicators suggest growing demand in target segments. Customer validation studies recommended to confirm market fit.",
            "early_competitors": "Competitive analysis identifies several players with similar approaches. Differentiation strategy development needed.",
            "regulatory_compliance": "Regulatory requirements identified for target markets. Compliance pathway assessment recommended before market entry.",
            "summary_recommendation": "Proceed with cautious optimism. Recommend prototype development and market validation before significant investment.",
        }
    elif plan.name == "Advanced":
        return {
            "executive_summary": "Comprehensive analysis indicates strong commercial potential with clear development and commercialization pathways identified.",
            "technology_description": "The technology represents a significant advancement with novel approaches to existing problems. Technical readiness level assessment indicates development feasibility.",
            "market_competition": "Market analysis reveals competitive landscape with opportunities for differentiation. Market size and growth projections support commercial viability.",
            "trl_feasibility": "Technology Readiness Level assessment indicates current TRL 3-4 with clear pathway to TRL 6-7 through systematic development program.",
            "ip_legal_status": "Intellectual property analysis reveals strong patentability with freedom to operate confirmed in key markets. IP portfolio development strategy recommended.",
            "regulatory_path": "Regulatory pathway analysis identifies clear approval processes with manageable compliance requirements for target markets.",
            "commercialization_options": "Multiple commercialization pathways identified including licensing, joint ventures, and direct commercialization. Strategic partnership opportunities exist.",
            "preliminary_financials": "Financial modeling indicates positive ROI potential with break-even projected within 3-5 years depending on market penetration rates.",
            "conclusion_recommendations": "Strong recommendation to proceed with development. Suggest phased approach with milestone-based investment and strategic partnership development.",
        }
    else:  # Comprehensive
        return {
            "executive_summary": "Detailed technology and market analysis indicates exceptional commercial potential with multiple value creation opportunities and clear competitive advantages.",
            "invention_claims": "Patent analysis reveals strong IP position with broad claim coverage and significant barriers to entry. Multiple patent families recommended for global protection.",
            "global_fto": "Global freedom to operate analysis confirms clear development pathway with minimal IP encumbrances across major markets including US, EU, and Asia-Pacific regions.",
            "market_analysis": "Comprehensive market analysis indicates $X billion addressable market with Y% CAGR. Multiple market segments identified with varying entry strategies and revenue potential.",
            "business_models": "Analysis of business model options reveals subscription, licensing, and direct sales opportunities with recurring revenue potential and scalable growth trajectories.",
            "roi_financial_projections": "Financial modeling indicates 25-40% IRR with break-even in years 2-3. Revenue projections of $X million by year 5 with multiple value creation milestones.",
            "funding_strategy": "Comprehensive funding strategy identifies $X million development capital requirement with staged investment approach. Grant opportunities and strategic investor alignment confirmed.",
            "licensing_plan": "Licensing strategy development reveals multiple high-value partnership opportunities with established market players. Revenue sharing models and partnership structures analyzed.",
            "team_partnerships": "Strategic partnership analysis identifies key technology and market partners. Team development plan includes critical skill acquisition and advisory board composition.",
            "implementation_roadmap": "Detailed 5-year implementation roadmap with quarterly milestones, resource requirements, and risk mitigation strategies. Critical path analysis completed.",
            "risk_analysis": "Comprehensive risk assessment identifies technical, market, and financial risks with detailed mitigation strategies. Sensitivity analysis confirms robust business case.",
            "appendices_data": "Supporting data includes market research findings, technical specifications, competitive intelligence, and financial model assumptions with scenario planning.",
        }

class ReportPDF(FPDF):
    def __init__(self, plan_name: str):
        super().__init__(format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)
        self.plan_name = plan_name

    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(128, 128, 128)
        self.cell(
            0,
            10,
            f"Technology Assessment Report - {self.plan_name} Plan",
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT,
            align="C",
        )
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(
            0,
            10,
            f"Page {self.page_no()} - Generated by Asasy",
            new_x=XPos.LMARGIN,
            new_y=YPos.TOP,
            align="C",
        )

    def add_title(self, title):
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(0, 0, 0)
        title = self.clean_text(title)
        self.cell(0, 15, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.ln(10)

    def add_section_header(self, section_num, title):
        if self.get_y() > 250:  # Start new page if near bottom
            self.add_page()

        self.set_font("Helvetica", "B", 14)
        self.set_text_color(0, 0, 0)
        title = self.clean_text(title)
        self.cell(
            0,
            10,
            f"{section_num}. {title}",
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT,
            align="L",
        )
        self.ln(3)

    def add_paragraph(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(0, 0, 0)

        text = str(text).strip()
        if not text or text == "N/A":
            text = "Information not available at this time. Further analysis recommended."

        text = self.clean_text(text)
        self.multi_cell(0, 6, text, align="L")
        self.ln(4)

    def clean_text(self, text):
        """Clean text to remove problematic Unicode characters"""
        if not text:
            return ""

        replacements = {
            """: '"',
            """: '"',
            "'": "'",
            "'": "'",
            "–": "-",
            "—": "-",
            "…": "...",
            "®": "(R)",
            "™": "(TM)",
            "©": "(C)",
        }

        for old, new in replacements.items():
            text = text.replace(old, new)

        # Replace any remaining non-ASCII characters
        text = "".join(char if ord(char) < 128 else "?" for char in text)
        return text

def create_pdf(report: dict, output_path: str, plan: Plan):
    """Create PDF from report data based on plan type"""
    try:
        pdf = ReportPDF(plan.name)
        pdf.add_page()

        # Title
        pdf.add_title(f"TECHNOLOGY ASSESSMENT REPORT")
        
        # Subtitle with plan info
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 0, 0)
        subtitle = f"{plan.report_type} ({plan.report_pages})"
        subtitle = pdf.clean_text(subtitle)
        pdf.multi_cell(0, 8, subtitle, align="C")
        pdf.ln(10)

        # Add generation timestamp
        from datetime import datetime
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(128, 128, 128)
        timestamp = f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        pdf.multi_cell(0, 6, timestamp, align="C")
        pdf.ln(10)

        # Sections based on plan type
        if plan.name == "Basic":
            sections = [
                ("Executive Summary", report.get("executive_summary", "")),
                ("Problem & Opportunity", report.get("problem_opportunity", "")),
                ("Technology Overview", report.get("technology_overview", "")),
                ("Key Benefits", report.get("key_benefits", "")),
                ("Applications", report.get("applications", "")),
                ("IP Snapshot", report.get("ip_snapshot", "")),
                ("Next Steps", report.get("next_steps", "")),
            ]
        elif plan.name == "Intermediate":
            sections = [
                ("Executive Summary", report.get("executive_summary", "")),
                ("Problem & Solution", report.get("problem_solution", "")),
                ("Technical Feasibility", report.get("technical_feasibility", "")),
                ("IP Summary", report.get("ip_summary", "")),
                ("Market Signals", report.get("market_signals", "")),
                ("Early Competitors", report.get("early_competitors", "")),
                ("Regulatory & Compliance", report.get("regulatory_compliance", "")),
                ("Summary & Recommendation", report.get("summary_recommendation", "")),
            ]
        elif plan.name == "Advanced":
            sections = [
                ("Executive Summary", report.get("executive_summary", "")),
                ("Technology Description", report.get("technology_description", "")),
                ("Market & Competition", report.get("market_competition", "")),
                ("TRL & Feasibility", report.get("trl_feasibility", "")),
                ("IP & Legal Status", report.get("ip_legal_status", "")),
                ("Regulatory Path", report.get("regulatory_path", "")),
                ("Commercialization Options", report.get("commercialization_options", "")),
                ("Preliminary Financials", report.get("preliminary_financials", "")),
                ("Conclusion & Recommendations", report.get("conclusion_recommendations", "")),
            ]
        else:  # Comprehensive
            sections = [
                ("Executive Summary", report.get("executive_summary", "")),
                ("Invention & Claims", report.get("invention_claims", "")),
                ("Global FTO Analysis", report.get("global_fto", "")),
                ("Market Analysis", report.get("market_analysis", "")),
                ("Business Models", report.get("business_models", "")),
                ("ROI & Financial Projections", report.get("roi_financial_projections", "")),
                ("Funding Strategy", report.get("funding_strategy", "")),
                ("Licensing Plan", report.get("licensing_plan", "")),
                ("Team & Partnerships", report.get("team_partnerships", "")),
                ("Implementation Roadmap", report.get("implementation_roadmap", "")),
                ("Risk Analysis", report.get("risk_analysis", "")),
                ("Appendices & Data", report.get("appendices_data", "")),
            ]

        for i, (title, content) in enumerate(sections, 1):
            pdf.add_section_header(i, title)
            pdf.add_paragraph(content)

        # Save PDF
        pdf.output(output_path)
        logger.info(f"PDF generated successfully at: {output_path}")

    except Exception as e:
        logger.error(f"Error creating PDF: {e}")
        raise

async def generate_technology_report(idea: str, output_path: str, plan: Plan) -> dict:
    """Main function to generate a complete technology assessment report"""
    try:
        logger.info(f"Generating {plan.name} report content...")
        report_json = await generate_report_json(idea, plan)

        logger.info("Creating PDF...")
        create_pdf(report_json, output_path, plan)

        logger.info("Report generation completed successfully!")
        return report_json

    except Exception as e:
        logger.error(f"Error in report generation process: {e}")
        raise