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
    """Generate report content using OpenAI API with plan-specific structure"""
    
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
            content_depth = "concise overview"
        elif plan.name == "Intermediate":
            min_words = 100
            max_words = 250
            content_depth = "detailed analysis"
        elif plan.name == "Advanced":
            min_words = 150
            max_words = 350
            content_depth = "comprehensive analysis"
        else:  # Comprehensive
            min_words = 200
            max_words = 500
            content_depth = "in-depth professional analysis"
        
        # Add standard tables for all plans
        table_sections = {
            "market_data_table": "[{\"metric\": \"string\", \"value\": \"string\", \"growth_rate\": \"string\", \"source\": \"string\"}]",
            "competitor_analysis_table": "[{\"company\": \"string\", \"market_share\": \"string\", \"revenue\": \"string\", \"key_features\": \"string\", \"rating\": \"string\"}]",
            "development_timeline_table": "[{\"phase\": \"string\", \"duration\": \"string\", \"cost\": \"string\", \"milestones\": \"string\", \"risk_level\": \"string\"}]",
            "financial_projections_table": "[{\"year\": \"string\", \"revenue\": \"string\", \"costs\": \"string\", \"profit\": \"string\", \"roi\": \"string\"}]",
            "technology_comparison_table": "[{\"feature\": \"string\", \"current_solution\": \"string\", \"proposed_solution\": \"string\", \"improvement\": \"string\", \"priority\": \"string\"}]"
        }
        
        # Add advanced tables for higher tier plans
        if plan.name in ["Advanced", "Comprehensive"]:
            table_sections.update({
                "ip_landscape_table": "[{\"patent_id\": \"string\", \"assignee\": \"string\", \"jurisdiction\": \"string\", \"status\": \"string\", \"relevance\": \"string\"}]",
                "regulatory_timeline_table": "[{\"jurisdiction\": \"string\", \"requirement\": \"string\", \"timeline\": \"string\", \"cost\": \"string\", \"complexity\": \"string\"}]"
            })
        
        if plan.name == "Comprehensive":
            table_sections.update({
                "funding_sources_table": "[{\"source_type\": \"string\", \"amount_range\": \"string\", \"timeline\": \"string\", \"requirements\": \"string\", \"success_rate\": \"string\"}]",
                "licensing_terms_table": "[{\"license_type\": \"string\", \"royalty_rate\": \"string\", \"upfront_fee\": \"string\", \"territory\": \"string\", \"exclusivity\": \"string\"}]"
            })
        
        # Create comprehensive system prompt
        system_prompt = f"""
You are a world-class technology commercialization expert and RTTP (Registered Technology Transfer Professional) generating a {plan.report_type}.

{plan.prompt_template}

**CRITICAL OUTPUT REQUIREMENTS:**
You must output STRICTLY ONE JSON DOCUMENT with these exact keys:

**Required Text Sections:**
{json.dumps(required_sections, indent=2)}

**Required Table Sections:**
{json.dumps(table_sections, indent=2)}

**CONTENT LENGTH REQUIREMENTS:**
- Each text section: {min_words}-{max_words} words ({content_depth})
- Include specific quantitative data, metrics, and statistics
- Use professional, analytical tone appropriate for {plan.name} plan level
- Provide actionable insights and concrete recommendations
- Each table: 5-8 realistic entries with specific, credible data
- All values must be strings for JSON compatibility

**DATA QUALITY STANDARDS:**
- Include realistic market sizes (e.g., "$2.5B market growing at 12% CAGR")
- Provide specific technology metrics (e.g., "TRL 6-7, prototype tested")
- Use industry-standard terminology and frameworks
- Include credible competitor names and market data
- Provide realistic financial projections and timelines
- Reference appropriate regulatory bodies and standards

**PROFESSIONAL FORMATTING:**
- Write in third person, analytical style
- Use bullet points sparingly, prefer flowing paragraphs
- Include specific dates, percentages, and dollar amounts
- Cite hypothetical but realistic data sources
- Maintain consistency across all sections

OUTPUT ONLY THE JSON - NO ADDITIONAL TEXT, MARKDOWN, OR FORMATTING.
"""

        user_prompt = f"""
Technology Idea: {idea}

Generate a comprehensive {plan.report_type} following the exact JSON structure specified. 
Ensure all sections meet the {min_words}-{max_words} word requirement and include specific, quantitative data appropriate for {plan.name} plan level analysis.

Focus on creating realistic, professional content that would be suitable for actual business use in {plan.name.lower()} scenarios.
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
            
            # Add proper paragraph spacing and formatting
            paragraphs = text.split('\n\n')
            for i, paragraph in enumerate(paragraphs):
                if paragraph.strip():
                    self.multi_cell(0, 6, paragraph.strip(), align="L")
                    if i < len(paragraphs) - 1:  # Add space between paragraphs
                        self.ln(2)
            
            self.ln(4)
            logger.info(f"Added paragraph with {len(text)} characters")
        except Exception as e:
            logger.error(f"Error adding paragraph: {e}")

    def add_data_table(self, title, data, column_widths=None):
        try:
            if not data or not isinstance(data, list) or len(data) == 0:
                logger.info(f"No valid data for table: {title}")
                return

            if self.get_y() > 220:
                self.add_page()

            self.set_font("Helvetica", "B", 12)
            self.set_text_color(0, 0, 0)
            title = self.clean_text(title)
            self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
            self.ln(3)

            # Ensure we have valid data structure
            if not isinstance(data[0], dict):
                logger.warning(f"Invalid table data structure for {title}")
                return

            headers = list(data[0].keys())
            num_cols = len(headers)

            if column_widths is None:
                available_width = 170
                column_widths = [available_width // num_cols] * num_cols

            total_width = sum(column_widths)
            if total_width > 170:
                factor = 170 / total_width
                column_widths = [int(w * factor) for w in column_widths]

            # Add headers
            self.set_font("Helvetica", "B", 9)
            self.set_fill_color(200, 200, 200)

            for i, header in enumerate(headers):
                header_text = self.clean_text(header.replace("_", " ").title())
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

            # Add data rows
            self.set_font("Helvetica", "", 8)
            self.set_fill_color(255, 255, 255)

            for row_idx, row in enumerate(data):
                if self.get_y() > 250:
                    self.add_page()

                fill = row_idx % 2 == 0
                if fill:
                    self.set_fill_color(245, 245, 245)
                else:
                    self.set_fill_color(255, 255, 255)

                for i, header in enumerate(headers):
                    value = str(row.get(header, "")).strip()
                    if not value:
                        value = "N/A"

                    if len(value) > 25:
                        value = value[:22] + "..."

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

            self.ln(5)
            logger.info(f"Added data table: {title} with {len(data)} rows")
        except Exception as e:
            logger.error(f"Error adding data table {title}: {e}")

    def clean_text(self, text):
        """Clean text to remove problematic Unicode characters"""
        try:
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

            text = "".join(char if ord(char) < 128 else "?" for char in text)
            return text
        except Exception as e:
            logger.error(f"Error cleaning text: {e}")
            return str(text)

def create_pdf(report: dict, output_path: str, plan: Plan):
    """Create PDF from report data with plan-specific structure"""
    logger.info(f"Starting PDF creation for plan: {plan.name}")
    logger.info(f"Plan sections: {plan.sections}")
    logger.info(f"Report keys: {list(report.keys())}")
    
    try:
        pdf = ReportPDF(plan)
        pdf.add_page()

        # Title
        pdf.add_title(f"{plan.report_type.upper()}")
        
        # Subtitle
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 0, 0)
        subtitle = f"{plan.name} Plan ({plan.report_pages})"
        subtitle = pdf.clean_text(subtitle)
        pdf.multi_cell(0, 8, subtitle, align="C")
        pdf.ln(10)

        # Add timestamp
        from datetime import datetime
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(128, 128, 128)
        timestamp = f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        pdf.multi_cell(0, 6, timestamp, align="C")
        pdf.ln(10)

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

        # Add tables based on plan level
        table_mapping = {
            "Technology Comparison": "technology_comparison_table",
            "Development Timeline": "development_timeline_table", 
            "Market Data": "market_data_table",
            "Competitor Analysis": "competitor_analysis_table",
            "Financial Projections": "financial_projections_table"
        }
        
        # Add advanced tables for higher tier plans
        if plan.name in ["Advanced", "Comprehensive"]:
            table_mapping.update({
                "IP Landscape": "ip_landscape_table",
                "Regulatory Timeline": "regulatory_timeline_table"
            })
        
        if plan.name == "Comprehensive":
            table_mapping.update({
                "Funding Sources": "funding_sources_table",
                "Licensing Terms": "licensing_terms_table"
            })

        for table_title, table_key in table_mapping.items():
            table_data = report.get(table_key, [])
            if table_data and isinstance(table_data, list) and len(table_data) > 0:
                logger.info(f"Adding table: {table_title}")
                pdf.add_data_table(table_title, table_data)

        # Save PDF
        pdf.output(output_path)
        logger.info(f"PDF generated successfully at: {output_path}")
        
        # Verify file was created and has content
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            logger.info(f"PDF file size: {file_size} bytes")
            if file_size == 0:
                logger.error("PDF file is empty!")
                raise ValueError("Generated PDF file is empty")
        else:
            logger.error("PDF file was not created!")
            raise ValueError("PDF file was not created")

    except Exception as e:
        logger.error(f"Error creating PDF: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

async def generate_technology_report(idea: str, output_path: str, plan: Plan) -> dict:
    """Main function to generate a complete technology assessment report"""
    logger.info("="*50)
    logger.info("STARTING TECHNOLOGY REPORT GENERATION")
    logger.info("="*50)
    logger.info(f"Plan: {plan.name}")
    logger.info(f"Report Type: {plan.report_type}")
    logger.info(f"Sections: {len(plan.sections)}")
    logger.info(f"Idea: {idea[:100]}...")
    logger.info(f"Output path: {output_path}")
    
    try:
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        logger.info(f"Output directory ensured: {os.path.dirname(output_path)}")

        logger.info("Step 1: Generating report content...")
        report_json, usage_info = await generate_report_json(idea, plan)
        
        logger.info("Step 2: Creating PDF...")
        create_pdf(report_json, output_path, plan)

        logger.info("Step 3: Report generation completed successfully!")
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