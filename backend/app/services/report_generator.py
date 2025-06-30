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
    """Generate report content using OpenAI API with comprehensive logging"""
    
    logger.info(f"Starting report generation for plan: {plan.name}")
    logger.info(f"Idea length: {len(idea)} characters")
    logger.info(f"OpenAI API Key configured: {'Yes' if settings.OPENAI_API_KEY else 'No'}")
    
    try:
        # Check if plan has a prompt template
        if not hasattr(plan, 'prompt_template') or not plan.prompt_template:
            logger.error(f"No prompt template found for plan: {plan.name}")
            raise ValueError(f"No prompt template configured for plan: {plan.name}")
        
        # Create enhanced system prompt by combining base structure with plan-specific template
        base_structure = """
You are a world-class business & technology research analyst. When given a single "idea" for a patent-grade system, you must OUTPUT STRICTLY ONE JSON DOCUMENT (no extra text) with these exact keys:

1. patent_info: {title, application_no, grant_no, filing_date, jurisdiction, assignee, status}  
2. executive_summary: string  
3. technology_overview: string  
4. development_plan: string  
5. market_assessment: string  
6. commercialization_strategies: string  
7. financial_viability: string  
8. final_thoughts: string
9. market_data_table: [{"metric": "string", "value": "string", "growth_rate": "string", "source": "string"}]
10. competitor_analysis_table: [{"company": "string", "market_share": "string", "revenue": "string", "key_features": "string", "rating": "string"}]
11. development_timeline_table: [{"phase": "string", "duration": "string", "cost": "string", "milestones": "string", "risk_level": "string"}]
12. financial_projections_table: [{"year": "string", "revenue": "string", "costs": "string", "profit": "string", "roi": "string"}]
13. technology_comparison_table: [{"feature": "string", "current_solution": "string", "proposed_solution": "string", "improvement": "string", "priority": "string"}]

**Requirements for ALL textual fields**  
• **Length**: Minimum **300** words per section.  
• **Data density**: Embed at least **5** distinct quantitative metrics or statistics in each section (e.g., market size in USD, CAGR percentages, user-adoption rates, cost breakdowns, projected ROI timelines, comparative benchmarks).  
• **Formatting**: Keep prose in **concise paragraphs**—avoid bullet lists or tables.  
• **Date style**: Use "DD Month YYYY" for all dates.  
• **Character set**: Only ASCII characters—no special quotes, en-dashes, or non-ASCII.  
• **Sophistication**: Write with authoritative, analytical tone, citing hypothetical data points ("According to Gartner, global market will grow by 12.5% CAGR…").  

**Requirements for TABLE fields**
• Each table should have 5-8 realistic entries
• Use specific, realistic data points and figures
• Ensure all values are strings for JSON compatibility
• Make data relevant to the technology idea provided

**Plan-Specific Requirements:**
"""
        
        # Combine base structure with plan-specific template
        system_prompt = base_structure + plan.prompt_template
        
        logger.info(f"Using enhanced prompt template for {plan.name}")

        user_prompt = f"""
Idea: ```{idea}```

Generate the report JSON as specified above. Ensure every section is richly detailed, with at least five numerical data points per section and a minimum of 300 words each. Include realistic tabular data for all 5 table sections.
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
        logger.info(f"OpenAI response preview: {content[:200]}...")
        
        # Extract usage information with proper token structure
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
            
            # Validate required keys
            required_keys = [
                'patent_info', 'executive_summary', 'technology_overview',
                'development_plan', 'market_assessment', 'commercialization_strategies',
                'financial_viability', 'final_thoughts'
            ]
            
            missing_keys = [key for key in required_keys if key not in parsed_content]
            if missing_keys:
                logger.error(f"Missing required keys: {missing_keys}")
                raise ValueError(f"OpenAI response missing required keys: {missing_keys}")
            
            # Log content lengths
            for key, value in parsed_content.items():
                if isinstance(value, str):
                    logger.info(f"Section '{key}' length: {len(value)} characters")
                elif isinstance(value, list):
                    logger.info(f"Table '{key}' entries: {len(value)}")
                elif isinstance(value, dict):
                    logger.info(f"Dict '{key}' keys: {list(value.keys())}")
            
            return parsed_content, usage_info
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw content: {content}")
            raise ValueError(f"Invalid JSON response from OpenAI: {e}")

    except Exception as e:
        logger.error(f"Error in generate_report_json: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Re-raise the exception instead of returning fallback
        raise

class ReportPDF(FPDF):
    def __init__(self, plan_name: str):
        super().__init__(format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)
        self.plan_name = plan_name

    def header(self):
        try:
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
            self.multi_cell(0, 6, text, align="L")
            self.ln(4)
            logger.info(f"Added paragraph with {len(text)} characters")
        except Exception as e:
            logger.error(f"Error adding paragraph: {e}")

    def add_info_table(self, patent_info):
        try:
            self.set_font("Helvetica", "B", 12)
            self.cell(
                0, 10, "Patent Information", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L"
            )
            self.ln(3)

            self.set_font("Helvetica", "", 10)
            label_width = 50
            value_width = 120

            for key, value in patent_info.items():
                label = key.replace("_", " ").title() + ":"
                label = self.clean_text(label)

                value_str = str(value).strip() if value else "N/A"
                value_str = self.clean_text(value_str)

                self.set_font("Helvetica", "B", 10)
                self.cell(
                    label_width,
                    8,
                    label,
                    border=1,
                    new_x=XPos.RIGHT,
                    new_y=YPos.TOP,
                    align="L",
                )
                self.set_font("Helvetica", "", 10)

                if len(value_str) > 50:
                    self.cell(
                        value_width,
                        8,
                        value_str[:47] + "...",
                        border=1,
                        new_x=XPos.LMARGIN,
                        new_y=YPos.NEXT,
                        align="L",
                    )
                else:
                    self.cell(
                        value_width,
                        8,
                        value_str,
                        border=1,
                        new_x=XPos.LMARGIN,
                        new_y=YPos.NEXT,
                        align="L",
                    )

            self.ln(5)
            logger.info("Added patent information table")
        except Exception as e:
            logger.error(f"Error adding info table: {e}")

    def add_data_table(self, title, data, column_widths=None):
        try:
            if not data:
                logger.info(f"No data for table: {title}")
                return

            if self.get_y() > 220:
                self.add_page()

            self.set_font("Helvetica", "B", 12)
            self.set_text_color(0, 0, 0)
            title = self.clean_text(title)
            self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
            self.ln(3)

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
    """Create PDF from report data with comprehensive logging"""
    logger.info(f"Starting PDF creation for plan: {plan.name}")
    logger.info(f"Output path: {output_path}")
    logger.info(f"Report keys: {list(report.keys())}")
    
    try:
        pdf = ReportPDF(plan.name)
        pdf.add_page()

        # Title
        pdf.add_title(f"TECHNOLOGY ASSESSMENT REPORT")
        
        # Subtitle
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 0, 0)
        subtitle = f"{plan.report_type} ({plan.report_pages})"
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

        # Section mapping for consistent ordering
        section_mapping = {
            "Patent Information": ("patent_info", "add_info_table"),
            "Executive Summary": ("executive_summary", "add_paragraph"),
            "Technology Overview": ("technology_overview", "add_paragraph"),
            "Development Plan": ("development_plan", "add_paragraph"),
            "Market Assessment": ("market_assessment", "add_paragraph"),
            "Commercialization Strategies": ("commercialization_strategies", "add_paragraph"),
            "Financial Viability": ("financial_viability", "add_paragraph"),
            "Final Thoughts": ("final_thoughts", "add_paragraph"),
        }

        section_num = 1
        for section_title, (content_key, method_name) in section_mapping.items():
            content = report.get(content_key, "")
            if content:
                logger.info(f"Adding section {section_num}: {section_title}")
                pdf.add_section_header(section_num, section_title)
                
                if method_name == "add_info_table":
                    pdf.add_info_table(content)
                else:
                    pdf.add_paragraph(content)
                
                section_num += 1

        # Add tables if they exist
        table_mapping = {
            "Technology Comparison": "technology_comparison_table",
            "Development Timeline": "development_timeline_table", 
            "Market Data": "market_data_table",
            "Competitor Analysis": "competitor_analysis_table",
            "Financial Projections": "financial_projections_table"
        }

        for table_title, table_key in table_mapping.items():
            table_data = report.get(table_key, [])
            if table_data:
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
    """Main function to generate a complete technology assessment report with comprehensive logging"""
    logger.info("="*50)
    logger.info("STARTING TECHNOLOGY REPORT GENERATION")
    logger.info("="*50)
    logger.info(f"Plan: {plan.name}")
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