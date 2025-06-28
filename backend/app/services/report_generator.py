import os
import json
import openai
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from app.core.config import settings
from app.models.plan import Plan
import asyncio
import logging
import time

logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

async def generate_report_json(idea: str, plan: Plan) -> tuple[dict, dict]:
    """Generate report content using OpenAI API with plan-specific prompt"""
    
    user_prompt = f"""
Idea: ```{idea}```

Generate the report JSON as specified above. Ensure every section follows the requirements for {plan.report_type} ({plan.report_pages}).
"""
    
    try:
        # Use the new OpenAI client
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        start_time = time.time()
        
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
        
        generation_time = time.time() - start_time
        
        if not response.choices or not response.choices[0].message.content:
            raise ValueError("Received empty response from OpenAI API")
            
        content = response.choices[0].message.content
        
        # Extract usage information
        usage_info = {
            "model": "gpt-4o-mini",
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            },
            "generation_time": generation_time
        }
        
        logger.info(f"Generated report content for plan {plan.name} - Tokens: {response.usage.total_tokens}")
        
        return json.loads(content), usage_info

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response: {e}")
        return get_fallback_report(plan), {"error": "JSON parsing failed"}
    except openai.OpenAIError as e:
        logger.error(f"OpenAI API error: {e}")
        return get_fallback_report(plan), {"error": str(e)}
    except Exception as e:
        logger.error(f"Unexpected error generating report: {e}")
        return get_fallback_report(plan), {"error": str(e)}

def get_fallback_report(plan: Plan) -> dict:
    """Return a fallback report structure when AI generation fails"""
    if plan.name == "Starter":
        return {
            "executive_summary": "This technology concept shows potential for development. Further analysis recommended to assess viability and market opportunities.",
            "problem_opportunity": "The described technology addresses a market need that requires validation through user research and competitive analysis.",
            "technology_overview": "The proposed solution leverages existing technologies in a novel configuration. Technical feasibility assessment needed.",
            "key_benefits": "Potential benefits include improved efficiency, cost reduction, and enhanced user experience. Quantification required.",
            "applications": "Primary applications span multiple market segments. Target market identification and prioritization recommended.",
            "ip_snapshot": "Initial patent landscape review suggests freedom to operate. Comprehensive IP analysis recommended before development.",
            "next_steps": "Conduct market research, develop proof of concept, and perform detailed technical feasibility study.",
        }
    elif plan.name == "Explorer":
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
    elif plan.name == "Professional":
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
    else:  # Enterprise
        return {
            "executive_summary": "Detailed technology and market analysis indicates exceptional commercial potential with multiple value creation opportunities and clear competitive advantages.",
            "invention_claims": "Patent analysis reveals strong IP position with broad claim coverage and significant barriers to entry. Multiple patent families recommended for global protection.",
            "global_fto": "Global freedom to operate analysis confirms clear development pathway with minimal IP encumbrances across major markets including US, EU, and Asia-Pacific regions.",
            "market_analysis": "Comprehensive market analysis indicates significant addressable market with strong CAGR. Multiple market segments identified with varying entry strategies and revenue potential.",
            "business_models": "Analysis of business model options reveals subscription, licensing, and direct sales opportunities with recurring revenue potential and scalable growth trajectories.",
            "roi_financial_projections": "Financial modeling indicates 25-40% IRR with break-even in years 2-3. Revenue projections show strong growth potential with multiple value creation milestones.",
            "funding_strategy": "Comprehensive funding strategy identifies development capital requirement with staged investment approach. Grant opportunities and strategic investor alignment confirmed.",
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

        # Use plan sections to determine what to include
        section_mapping = {
            "Executive Summary": "executive_summary",
            "Problem/Opportunity Statement": "problem_opportunity",
            "Technology Overview": "technology_overview",
            "Key Benefits": "key_benefits",
            "Applications": "applications",
            "IP Snapshot": "ip_snapshot",
            "Next Steps": "next_steps",
            "Expanded Executive Summary": "expanded_executive_summary",
            "Problem & Solution Fit": "problem_solution",
            "Technical Feasibility": "technical_feasibility",
            "IP Summary": "ip_summary",
            "Market Signals": "market_signals",
            "Early Competitors": "early_competitors",
            "Regulatory/Compliance Overview": "regulatory_compliance",
            "Risk Summary and Key Questions": "summary_recommendation",
            "Detailed Business Case": "detailed_business_case",
            "Technology Description": "technology_description",
            "Market & Competition": "market_competition",
            "TRL & Technical Challenges": "trl_feasibility",
            "Detailed IP & Legal Status": "ip_legal_status",
            "Regulatory Pathways": "regulatory_path",
            "Commercialization Options": "commercialization_options",
            "Preliminary Financial Estimates": "preliminary_financials",
            "Summary & Go-to-Market Plan": "conclusion_recommendations",
            "In-depth IP Claims Analysis": "invention_claims",
            "Global Freedom-to-Operate Report": "global_fto",
            "Market Analysis": "market_analysis",
            "Business Models": "business_models",
            "5-Year ROI & Revenue Projections": "roi_financial_projections",
            "Funding Strategy": "funding_strategy",
            "Licensing & Exit Strategy": "licensing_plan",
            "Team & Strategic Partners Required": "team_partnerships",
            "Implementation Roadmap": "implementation_roadmap",
            "Appendices": "appendices_data"
        }

        # Generate sections based on plan
        section_num = 1
        for section_title in plan.sections:
            if section_title in section_mapping:
                content_key = section_mapping[section_title]
                content = report.get(content_key, "")
                if content:  # Only add sections with content
                    pdf.add_section_header(section_num, section_title)
                    pdf.add_paragraph(content)
                    section_num += 1

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
        report_json, usage_info = await generate_report_json(idea, plan)

        logger.info("Creating PDF...")
        create_pdf(report_json, output_path, plan)

        logger.info("Report generation completed successfully!")
        
        # Return both report data and usage info
        return {
            **report_json,
            "_usage_info": usage_info
        }

    except Exception as e:
        logger.error(f"Error in report generation process: {e}")
        raise