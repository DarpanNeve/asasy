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
import traceback

logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

async def generate_report_json(idea: str, plan: Plan) -> tuple[dict, dict]:
    """Generate report content using OpenAI API with plan-specific structure and comprehensive tables"""
    
    logger.info(f"Starting report generation for plan: {plan.name}")
    logger.info(f"Plan sections: {plan.sections}")
    logger.info(f"Plan report type: {plan.report_type}")
    
    try:
        # Check if plan has a prompt template
        if not hasattr(plan, 'prompt_template') or not plan.prompt_template:
            logger.error(f"No prompt template found for plan: {plan.name}")
            raise ValueError(f"No prompt template configured for plan: {plan.name}")
        
        # Create plan-specific JSON structure based on plan sections
        required_sections = {}
        table_sections = {}
        
        # Map plan sections to JSON keys
        section_mapping = {
            "Executive Summary": "executive_summary",
            "Problem/Opportunity Statement": "problem_opportunity_statement",
            "Technology Overview": "technology_overview",
            "Key Benefits": "key_benefits",
            "Applications": "applications",
            "IP Snapshot": "ip_snapshot",
            "Next Steps": "next_steps",
            "Expanded Executive Summary": "expanded_executive_summary",
            "Problem & Solution Fit": "problem_solution_fit",
            "Technical Feasibility": "technical_feasibility",
            "IP Summary": "ip_summary",
            "Market Signals": "market_signals",
            "Early Competitors": "early_competitors",
            "Regulatory/Compliance Overview": "regulatory_compliance_overview",
            "Risk Summary and Key Questions": "risk_summary_key_questions",
            "Detailed Business Case": "detailed_business_case",
            "Technology Description": "technology_description",
            "Market & Competition": "market_competition",
            "TRL & Technical Challenges": "trl_technical_challenges",
            "Detailed IP & Legal Status": "detailed_ip_legal_status",
            "Regulatory Pathways": "regulatory_pathways",
            "Commercialization Options": "commercialization_options",
            "Preliminary Financial Estimates": "preliminary_financial_estimates",
            "Summary & Go-to-Market Plan": "summary_go_to_market_plan",
            "In-depth IP Claims Analysis": "indepth_ip_claims_analysis",
            "Global Freedom-to-Operate Report": "global_freedom_to_operate_report",
            "Market Analysis": "market_analysis",
            "Business Models": "business_models",
            "5-Year ROI & Revenue Projections": "five_year_roi_revenue_projections",
            "Funding Strategy": "funding_strategy",
            "Licensing & Exit Strategy": "licensing_exit_strategy",
            "Team & Strategic Partners Required": "team_strategic_partners_required",
            "Implementation Roadmap": "implementation_roadmap",
            "Appendices": "appendices"
        }
        
        # Build required sections based on plan
        for section in plan.sections:
            if section in section_mapping:
                required_sections[section_mapping[section]] = "string"
        
        # Define content length requirements based on plan
        if plan.name == "Basic":
            min_words = 50
            max_words = 150
            content_depth = "concise overview with essential data"
        elif plan.name == "Intermediate":
            min_words = 100
            max_words = 250
            content_depth = "detailed analysis with comprehensive data"
        elif plan.name == "Advanced":
            min_words = 150
            max_words = 350
            content_depth = "comprehensive analysis with investment-grade data"
        else:  # Comprehensive
            min_words = 200
            max_words = 500
            content_depth = "in-depth professional analysis with institutional-grade data"
        
        # Add comprehensive tables for all plans (5 standard tables)
        table_sections = {
            "market_data_table": "[{\"metric\": \"string\", \"value\": \"string\", \"growth_rate\": \"string\", \"source\": \"string\", \"year\": \"string\"}]",
            "competitor_analysis_table": "[{\"company\": \"string\", \"market_share\": \"string\", \"revenue\": \"string\", \"key_features\": \"string\", \"rating\": \"string\", \"strengths\": \"string\"}]",
            "development_timeline_table": "[{\"phase\": \"string\", \"duration\": \"string\", \"cost\": \"string\", \"milestones\": \"string\", \"risk_level\": \"string\", \"dependencies\": \"string\"}]",
            "financial_projections_table": "[{\"year\": \"string\", \"revenue\": \"string\", \"costs\": \"string\", \"profit\": \"string\", \"roi\": \"string\", \"market_share\": \"string\"}]",
            "technology_comparison_table": "[{\"feature\": \"string\", \"current_solution\": \"string\", \"proposed_solution\": \"string\", \"improvement\": \"string\", \"priority\": \"string\", \"impact\": \"string\"}]"
        }
        
        # Add advanced tables for higher tier plans (7 total for Advanced)
        if plan.name in ["Advanced", "Comprehensive"]:
            table_sections.update({
                "ip_landscape_table": "[{\"patent_id\": \"string\", \"assignee\": \"string\", \"jurisdiction\": \"string\", \"status\": \"string\", \"relevance\": \"string\", \"expiry_date\": \"string\"}]",
                "regulatory_timeline_table": "[{\"jurisdiction\": \"string\", \"requirement\": \"string\", \"timeline\": \"string\", \"cost\": \"string\", \"complexity\": \"string\", \"approval_rate\": \"string\"}]"
            })
        
        # Add premium tables for Comprehensive plan (9 total)
        if plan.name == "Comprehensive":
            table_sections.update({
                "funding_sources_table": "[{\"source_type\": \"string\", \"amount_range\": \"string\", \"timeline\": \"string\", \"requirements\": \"string\", \"success_rate\": \"string\", \"contact_info\": \"string\"}]",
                "licensing_terms_table": "[{\"license_type\": \"string\", \"royalty_rate\": \"string\", \"upfront_fee\": \"string\", \"territory\": \"string\", \"exclusivity\": \"string\", \"duration\": \"string\"}]"
            })
        
        # Create comprehensive system prompt with enhanced table requirements
        system_prompt = f"""
You are a world-class technology commercialization expert and RTTP (Registered Technology Transfer Professional) generating a {plan.report_type}.

{plan.prompt_template}

**CRITICAL OUTPUT REQUIREMENTS:**
You must output STRICTLY ONE JSON DOCUMENT with these exact keys:

**Required Text Sections:**
{json.dumps(required_sections, indent=2)}

**Required Table Sections (MUST include {len(table_sections)} tables):**
{json.dumps(table_sections, indent=2)}

**ENHANCED CONTENT LENGTH REQUIREMENTS:**
- Each text section: {min_words}-{max_words} words ({content_depth})
- Include specific quantitative data, metrics, statistics, and financial figures
- Use professional, analytical tone appropriate for {plan.name} plan level
- Provide actionable insights and concrete recommendations with supporting data
- Each table: 6-8 realistic entries with specific, credible, industry-standard data
- All values must be strings for JSON compatibility

**COMPREHENSIVE DATA QUALITY STANDARDS:**
- Market data: Include realistic market sizes (e.g., "$2.5B market growing at 12% CAGR"), TAM/SAM/SOM figures
- Technology metrics: Specific TRL levels (e.g., "TRL 6-7"), development timelines, technical specifications
- Financial data: Realistic development costs, revenue projections, ROI calculations, funding requirements
- Competitive data: Actual company names where possible, market share percentages, revenue figures
- IP data: Patent numbers, filing dates, jurisdictions, legal status, expiry dates
- Regulatory data: Specific approval timelines, cost estimates, success rates by jurisdiction
- Timeline data: Specific phases, duration estimates, cost breakdowns, risk assessments

**PROFESSIONAL TABLE REQUIREMENTS:**
- Market Data Table: Include metrics like market size, growth rates, adoption rates, pricing trends
- Competitor Analysis: Real or realistic company names, market positions, revenue data, key differentiators
- Development Timeline: Specific phases (R&D, Prototype, Testing, Regulatory, Launch), realistic timelines and costs
- Financial Projections: 5-year projections with revenue, costs, profit margins, ROI calculations
- Technology Comparison: Feature-by-feature comparison with quantified improvements and impact assessments

**ENHANCED PROFESSIONAL FORMATTING:**
- Write in third person, analytical style suitable for business presentations
- Use industry-standard terminology and frameworks (TRL, TAM/SAM/SOM, SWOT, etc.)
- Include specific dates, percentages, dollar amounts, and quantified metrics
- Reference credible but hypothetical data sources and industry reports
- Maintain consistency across all sections and tables
- Ensure all financial figures are realistic and properly scaled

**PLAN-SPECIFIC REQUIREMENTS:**
- {plan.name} Plan: Target {plan.name.lower()} use cases with appropriate depth and sophistication
- Content suitable for: {plan.description}
- Analysis depth: {content_depth}
- Professional standards appropriate for {plan.name} plan stakeholders

OUTPUT ONLY THE JSON - NO ADDITIONAL TEXT, MARKDOWN, OR FORMATTING.
"""

        user_prompt = f"""
Technology Idea: {idea}

Generate a comprehensive {plan.report_type} following the exact JSON structure specified. 

**CRITICAL REQUIREMENTS:**
1. Ensure ALL sections meet the {min_words}-{max_words} word requirement
2. Include ALL {len(table_sections)} required tables with 6-8 realistic entries each
3. Include specific, quantitative data appropriate for {plan.name} plan level analysis
4. Use realistic market data, financial projections, and competitive intelligence
5. Maintain professional tone suitable for {plan.name} plan stakeholders

Focus on creating realistic, professional content that would be suitable for actual business use in {plan.name.lower()} scenarios. Include comprehensive tables with industry-standard data that supports the analysis.
"""
        
        logger.info("Preparing OpenAI API call...")
        logger.info(f"System prompt length: {len(system_prompt)} characters")
        logger.info(f"User prompt length: {len(user_prompt)} characters")
        
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        start_time = time.time()
        
        logger.info("Making OpenAI API call...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            max_tokens=4000,
            temperature=0.7,
        )
        
        generation_time = time.time() - start_time
        logger.info(f"OpenAI API call completed in {generation_time:.2f} seconds")
        
        # Log response details
        if not response.choices:
            logger.error("OpenAI API returned no choices")
            raise ValueError("OpenAI API returned no choices")
            
        if not response.choices[0].message.content:
            logger.error("OpenAI API returned empty content")
            raise ValueError("Received empty response from OpenAI API")
            
        content = response.choices[0].message.content
        logger.info(f"OpenAI response content length: {len(content)} characters")
        
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
        
        logger.info(f"Token usage - Prompt: {response.usage.prompt_tokens}, "
                   f"Completion: {response.usage.completion_tokens}, "
                   f"Total: {response.usage.total_tokens}")
        
        # Parse JSON response
        try:
            parsed_content = json.loads(content)
            logger.info("Successfully parsed JSON response")
            logger.info(f"JSON keys: {list(parsed_content.keys())}")
            
            # Validate that we have the required sections for this plan
            missing_sections = []
            for section in plan.sections:
                if section in section_mapping:
                    json_key = section_mapping[section]
                    if json_key not in parsed_content:
                        missing_sections.append(section)
            
            if missing_sections:
                logger.warning(f"Missing sections for {plan.name} plan: {missing_sections}")
            
            # Log content lengths and validate word counts
            for key, value in parsed_content.items():
                if isinstance(value, str):
                    word_count = len(value.split())
                    logger.info(f"Section '{key}' length: {len(value)} characters, {word_count} words")
                    if word_count < min_words:
                        logger.warning(f"Section '{key}' has only {word_count} words, minimum is {min_words}")
                elif isinstance(value, list):
                    logger.info(f"Table '{key}' entries: {len(value)}")
                    if len(value) < 5:
                        logger.warning(f"Table '{key}' has only {len(value)} entries, recommended minimum is 6")
            
            return parsed_content, usage_info
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw content: {content}")
            raise ValueError(f"Invalid JSON response from OpenAI: {e}")

    except Exception as e:
        logger.error(f"Error in generate_report_json: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

class ReportPDF(FPDF):
    def __init__(self, plan: Plan):
        super().__init__(format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)
        self.plan = plan

    def header(self):
        try:
            self.set_font("Helvetica", "B", 10)
            self.set_text_color(128, 128, 128)
            self.cell(
                0,
                10,
                f"{self.plan.report_type} - {self.plan.name} Plan",
                new_x=XPos.LMARGIN,
                new_y=YPos.NEXT,
                align="C",
            )
            self.ln(5)
        except Exception as e:
            logger.error(f"Error in PDF header: {e}")

    def footer(self):
        try:
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
        except Exception as e:
            logger.error(f"Error in PDF footer: {e}")

    def add_title(self, title):
        try:
            self.set_font("Helvetica", "B", 18)
            self.set_text_color(0, 0, 0)
            title = self.clean_text(title)
            self.cell(0, 15, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
            self.ln(10)
            logger.info(f"Added title: {title}")
        except Exception as e:
            logger.error(f"Error adding title: {e}")

    def add_section_header(self, section_num, title):
        try:
            if self.get_y() > 250:
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
            logger.info(f"Added section header: {section_num}. {title}")
        except Exception as e:
            logger.error(f"Error adding section header: {e}")

    def add_paragraph(self, text):
        try:
            self.set_font("Helvetica", "", 11)
            self.set_text_color(0, 0, 0)

            text = str(text).strip()
            if not text or text == "N/A":
                text = "Information not available at this time. Further analysis recommended."

            text = self.clean_text(text)
            
            # Enhanced paragraph formatting with better spacing
            paragraphs = text.split('\n\n')
            for i, paragraph in enumerate(paragraphs):
                if paragraph.strip():
                    # Handle bullet points and formatting
                    lines = paragraph.split('\n')
                    for line in lines:
                        if line.strip():
                            self.multi_cell(0, 6, line.strip(), align="L")
                            self.ln(1)
                    if i < len(paragraphs) - 1:  # Add space between paragraphs
                        self.ln(3)
            
            self.ln(5)
            logger.info(f"Added paragraph with {len(text)} characters")
        except Exception as e:
            logger.error(f"Error adding paragraph: {e}")

    def add_data_table(self, title, data, column_widths=None):
        try:
            if not data or not isinstance(data, list) or len(data) == 0:
                logger.info(f"No valid data for table: {title}")
                return

            if self.get_y() > 200:  # More conservative page break for tables
                self.add_page()

            # Table title with enhanced formatting
            self.set_font("Helvetica", "B", 12)
            self.set_text_color(0, 0, 0)
            title = self.clean_text(title)
            self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
            self.ln(5)

            # Ensure we have valid data structure
            if not isinstance(data[0], dict):
                logger.warning(f"Invalid table data structure for {title}")
                return

            headers = list(data[0].keys())
            num_cols = len(headers)

            # Enhanced column width calculation
            if column_widths is None:
                available_width = 170
                # Adjust column widths based on content
                if num_cols <= 3:
                    column_widths = [available_width // num_cols] * num_cols
                elif num_cols <= 5:
                    column_widths = [max(25, available_width // num_cols)] * num_cols
                else:
                    column_widths = [max(20, available_width // num_cols)] * num_cols

            total_width = sum(column_widths)
            if total_width > 170:
                factor = 170 / total_width
                column_widths = [int(w * factor) for w in column_widths]

            # Enhanced table headers
            self.set_font("Helvetica", "B", 9)
            self.set_fill_color(220, 220, 220)
            self.set_text_color(0, 0, 0)

            for i, header in enumerate(headers):
                header_text = self.clean_text(header.replace("_", " ").title())
                if len(header_text) > 15:
                    header_text = header_text[:12] + "..."
                
                is_last = i == len(headers) - 1
                self.cell(
                    column_widths[i],
                    8,
                    header_text,
                    border=1,
                    new_x=XPos.RIGHT if not is_last else XPos.LMARGIN,
                    new_y=YPos.TOP if not is_last else YPos.NEXT,
                    align="C",
                    fill=True,
                )

            # Enhanced data rows with alternating colors
            self.set_font("Helvetica", "", 8)
            
            for row_idx, row in enumerate(data):
                if self.get_y() > 260:  # Check for page break
                    self.add_page()
                    # Re-add headers on new page
                    self.set_font("Helvetica", "B", 9)
                    self.set_fill_color(220, 220, 220)
                    for i, header in enumerate(headers):
                        header_text = self.clean_text(header.replace("_", " ").title())
                        if len(header_text) > 15:
                            header_text = header_text[:12] + "..."
                        is_last = i == len(headers) - 1
                        self.cell(
                            column_widths[i],
                            8,
                            header_text,
                            border=1,
                            new_x=XPos.RIGHT if not is_last else XPos.LMARGIN,
                            new_y=YPos.TOP if not is_last else YPos.NEXT,
                            align="C",
                            fill=True,
                        )
                    self.set_font("Helvetica", "", 8)

                # Alternating row colors
                fill = row_idx % 2 == 0
                if fill:
                    self.set_fill_color(248, 248, 248)
                else:
                    self.set_fill_color(255, 255, 255)

                for i, header in enumerate(headers):
                    value = str(row.get(header, "")).strip()
                    if not value:
                        value = "N/A"

                    # Smart text truncation based on column width
                    max_chars = max(10, column_widths[i] // 3)
                    if len(value) > max_chars:
                        value = value[:max_chars-3] + "..."

                    value = self.clean_text(value)
                    is_last = i == len(headers) - 1

                    self.cell(
                        column_widths[i],
                        7,
                        value,
                        border=1,
                        new_x=XPos.RIGHT if not is_last else XPos.LMARGIN,
                        new_y=YPos.TOP if not is_last else YPos.NEXT,
                        align="L",
                        fill=fill,
                    )

            self.ln(8)  # Extra space after table
            logger.info(f"Added enhanced data table: {title} with {len(data)} rows")
        except Exception as e:
            logger.error(f"Error adding data table {title}: {e}")

    def clean_text(self, text):
        """Enhanced text cleaning for better PDF compatibility"""
        try:
            if not text:
                return ""

            # Enhanced character replacements
            replacements = {
                """: '"', """: '"', "'": "'", "'": "'",
                "–": "-", "—": "-", "…": "...",
                "®": "(R)", "™": "(TM)", "©": "(C)",
                "€": "EUR", "£": "GBP", "¥": "JPY",
                "°": " degrees", "±": "+/-", "×": "x"
            }

            for old, new in replacements.items():
                text = text.replace(old, new)

            # Remove or replace non-ASCII characters
            text = "".join(char if ord(char) < 128 else "?" for char in text)
            
            # Clean up extra whitespace
            text = " ".join(text.split())
            
            return text
        except Exception as e:
            logger.error(f"Error cleaning text: {e}")
            return str(text)

def create_pdf(report: dict, output_path: str, plan: Plan):
    """Create enhanced PDF from report data with comprehensive tables"""
    logger.info(f"Starting PDF creation for plan: {plan.name}")
    logger.info(f"Plan sections: {plan.sections}")
    logger.info(f"Report keys: {list(report.keys())}")
    
    try:
        pdf = ReportPDF(plan)
        pdf.add_page()

        # Enhanced title page
        pdf.add_title(f"{plan.report_type.upper()}")
        
        # Enhanced subtitle with plan details
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 0, 0)
        subtitle = f"{plan.name} Plan - {plan.report_pages}"
        subtitle = pdf.clean_text(subtitle)
        pdf.multi_cell(0, 8, subtitle, align="C")
        pdf.ln(5)

        # Plan features summary
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(100, 100, 100)
        features_text = f"Features: {len(plan.sections)} sections, {len([k for k in report.keys() if 'table' in k])} data tables"
        pdf.multi_cell(0, 6, features_text, align="C")
        pdf.ln(10)

        # Add timestamp
        from datetime import datetime
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(128, 128, 128)
        timestamp = f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        pdf.multi_cell(0, 6, timestamp, align="C")
        pdf.ln(15)

        # Section mapping for consistent ordering based on plan sections
        section_mapping = {
            "Executive Summary": "executive_summary",
            "Problem/Opportunity Statement": "problem_opportunity_statement",
            "Technology Overview": "technology_overview",
            "Key Benefits": "key_benefits",
            "Applications": "applications",
            "IP Snapshot": "ip_snapshot",
            "Next Steps": "next_steps",
            "Expanded Executive Summary": "expanded_executive_summary",
            "Problem & Solution Fit": "problem_solution_fit",
            "Technical Feasibility": "technical_feasibility",
            "IP Summary": "ip_summary",
            "Market Signals": "market_signals",
            "Early Competitors": "early_competitors",
            "Regulatory/Compliance Overview": "regulatory_compliance_overview",
            "Risk Summary and Key Questions": "risk_summary_key_questions",
            "Detailed Business Case": "detailed_business_case",
            "Technology Description": "technology_description",
            "Market & Competition": "market_competition",
            "TRL & Technical Challenges": "trl_technical_challenges",
            "Detailed IP & Legal Status": "detailed_ip_legal_status",
            "Regulatory Pathways": "regulatory_pathways",
            "Commercialization Options": "commercialization_options",
            "Preliminary Financial Estimates": "preliminary_financial_estimates",
            "Summary & Go-to-Market Plan": "summary_go_to_market_plan",
            "In-depth IP Claims Analysis": "indepth_ip_claims_analysis",
            "Global Freedom-to-Operate Report": "global_freedom_to_operate_report",
            "Market Analysis": "market_analysis",
            "Business Models": "business_models",
            "5-Year ROI & Revenue Projections": "five_year_roi_revenue_projections",
            "Funding Strategy": "funding_strategy",
            "Licensing & Exit Strategy": "licensing_exit_strategy",
            "Team & Strategic Partners Required": "team_strategic_partners_required",
            "Implementation Roadmap": "implementation_roadmap",
            "Appendices": "appendices"
        }

        # Add sections based on plan configuration
        section_num = 1
        for section_title in plan.sections:
            if section_title in section_mapping:
                content_key = section_mapping[section_title]
                content = report.get(content_key, "")
                if content:
                    logger.info(f"Adding section {section_num}: {section_title}")
                    pdf.add_section_header(section_num, section_title)
                    pdf.add_paragraph(content)
                    section_num += 1

        # Add comprehensive tables based on plan level
        table_mapping = {
            "Market Data Analysis": "market_data_table",
            "Competitive Landscape": "competitor_analysis_table",
            "Development Timeline & Milestones": "development_timeline_table",
            "Financial Projections": "financial_projections_table",
            "Technology Comparison Matrix": "technology_comparison_table"
        }
        
        # Add advanced tables for higher tier plans
        if plan.name in ["Advanced", "Comprehensive"]:
            table_mapping.update({
                "IP Landscape Analysis": "ip_landscape_table",
                "Regulatory Timeline": "regulatory_timeline_table"
            })
        
        # Add premium tables for Comprehensive plan
        if plan.name == "Comprehensive":
            table_mapping.update({
                "Funding Sources & Opportunities": "funding_sources_table",
                "Licensing Terms & Strategies": "licensing_terms_table"
            })

        # Add all tables with enhanced formatting
        for table_title, table_key in table_mapping.items():
            table_data = report.get(table_key, [])
            if table_data and isinstance(table_data, list) and len(table_data) > 0:
                logger.info(f"Adding enhanced table: {table_title}")
                pdf.add_data_table(table_title, table_data)

        # Save PDF
        pdf.output(output_path)
        logger.info(f"Enhanced PDF generated successfully at: {output_path}")
        
        # Verify file was created and has substantial content
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            logger.info(f"PDF file size: {file_size} bytes")
            if file_size == 0:
                logger.error("PDF file is empty!")
                raise ValueError("Generated PDF file is empty")
            elif file_size < 10000:  # Less than 10KB might indicate insufficient content
                logger.warning(f"PDF file size ({file_size} bytes) seems small for {plan.name} plan")
        else:
            logger.error("PDF file was not created!")
            raise ValueError("PDF file was not created")

    except Exception as e:
        logger.error(f"Error creating enhanced PDF: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

async def generate_technology_report(idea: str, output_path: str, plan: Plan) -> dict:
    """Main function to generate a comprehensive technology assessment report with enhanced tables"""
    logger.info("="*50)
    logger.info("STARTING ENHANCED TECHNOLOGY REPORT GENERATION")
    logger.info("="*50)
    logger.info(f"Plan: {plan.name}")
    logger.info(f"Report Type: {plan.report_type}")
    logger.info(f"Sections: {len(plan.sections)}")
    logger.info(f"Expected Tables: 5+ comprehensive data tables")
    logger.info(f"Idea: {idea[:100]}...")
    logger.info(f"Output path: {output_path}")
    
    try:
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        logger.info(f"Output directory ensured: {os.path.dirname(output_path)}")

        logger.info("Step 1: Generating comprehensive report content with tables...")
        report_json, usage_info = await generate_report_json(idea, plan)
        
        logger.info("Step 2: Creating enhanced PDF with comprehensive tables...")
        create_pdf(report_json, output_path, plan)

        logger.info("Step 3: Enhanced report generation completed successfully!")
        logger.info("="*50)
        
        # Return the report data with usage info
        return {
            **report_json,
            "_usage_info": usage_info
        }

    except Exception as e:
        logger.error(f"Error in generate_technology_report: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise