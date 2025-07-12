import os
import json
import openai
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from app.core.config import settings
from app.models.report import ReportComplexity
import asyncio
import logging
import time
import traceback

logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

async def generate_report_json(idea: str, complexity: ReportComplexity) -> tuple[dict, dict]:
    """Generate report content using OpenAI API with complexity-specific structure and comprehensive tables"""
    
    logger.info(f"Starting report generation for complexity: {complexity}")
    
    try:
        # Define sections based on complexity
        if complexity == ReportComplexity.BASIC:
            sections = [
                "Executive Summary",
                "Problem/Opportunity Statement",
                "Technology Overview",
                "Key Benefits",
                "Applications",
                "IP Snapshot",
                "Next Steps"
            ]
            min_words = 50
            max_words = 150
            num_tables = 5
            report_type = "Basic Technology Assessment"
        elif complexity == ReportComplexity.ADVANCED:
            sections = [
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
            ]
            min_words = 100
            max_words = 250
            num_tables = 7
            report_type = "Advanced Technology Assessment"
        else:  # COMPREHENSIVE
            sections = [
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
            ]
            min_words = 200
            max_words = 500
            num_tables = 9
            report_type = "Comprehensive Technology Assessment"
        
        # Create JSON structure based on sections
        required_sections = {}
        
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
        for section in sections:
            if section in section_mapping:
                required_sections[section_mapping[section]] = "string"
        
        # Define content depth based on complexity
        if complexity == ReportComplexity.BASIC:
            content_depth = "concise overview with essential data"
        elif complexity == ReportComplexity.ADVANCED:
            content_depth = "detailed analysis with comprehensive data"
        else:
            content_depth = "in-depth professional analysis with institutional-grade data"
        
        # FIXED: Define table structure with SHORT, CONCISE text
        table_sections = {
            "market_data_table": [
                {"metric": "TAM", "value": "$12.5B", "growth": "15.2%", "source": "Industry 2024", "region": "Global"},
                {"metric": "SAM", "value": "$3.8B", "growth": "18.5%", "source": "Market Research", "region": "US/EU"},
                {"metric": "Penetration", "value": "2.3%", "growth": "12.1%", "source": "Analytics", "region": "Current"},
                {"metric": "Deal Size", "value": "$125K", "growth": "8.7%", "source": "Sales Data", "region": "Average"},
                {"metric": "CAC", "value": "$15K", "growth": "-5.2%", "source": "Marketing", "region": "Blended"},
                {"metric": "LTV", "value": "$450K", "growth": "22.3%", "source": "Revenue", "region": "Projected"}
            ],
            "competitor_analysis_table": [
                {"company": "TechCorp", "share": "23.5%", "revenue": "$2.8B", "strength": "Market Leader", "weakness": "High Cost"},
                {"company": "InnovateTech", "share": "18.2%", "revenue": "$2.1B", "strength": "Scalable", "weakness": "Limited Features"},
                {"company": "NextGen", "share": "15.7%", "revenue": "$1.9B", "strength": "Fast Deploy", "weakness": "Support Issues"},
                {"company": "SmartTech", "share": "12.3%", "revenue": "$1.4B", "strength": "User UX", "weakness": "Integration"},
                {"company": "FutureTech", "share": "8.9%", "revenue": "$1.1B", "strength": "Innovation", "weakness": "Stability"},
                {"company": "DataFlow", "share": "6.4%", "revenue": "$780M", "strength": "Security", "weakness": "Complexity"}
            ],
            "development_timeline_table": [
                {"phase": "R&D", "duration": "6 months", "cost": "$500K", "milestone": "MVP Ready", "risk": "Medium"},
                {"phase": "Prototype", "duration": "4 months", "cost": "$300K", "milestone": "Beta Testing", "risk": "Low"},
                {"phase": "Testing", "duration": "3 months", "cost": "$200K", "milestone": "User Feedback", "risk": "Medium"},
                {"phase": "Regulatory", "duration": "8 months", "cost": "$400K", "milestone": "Compliance", "risk": "High"},
                {"phase": "Production", "duration": "5 months", "cost": "$600K", "milestone": "Manufacturing", "risk": "Medium"},
                {"phase": "Launch", "duration": "2 months", "cost": "$350K", "milestone": "Go-to-Market", "risk": "Low"}
            ],
            "financial_projections_table": [
                {"year": "Y1", "revenue": "$2.5M", "costs": "$1.8M", "profit": "$0.7M", "roi": "38.9%"},
                {"year": "Y2", "revenue": "$6.2M", "costs": "$3.9M", "profit": "$2.3M", "roi": "59.0%"},
                {"year": "Y3", "revenue": "$12.8M", "costs": "$7.1M", "profit": "$5.7M", "roi": "80.3%"},
                {"year": "Y4", "revenue": "$24.5M", "costs": "$12.8M", "profit": "$11.7M", "roi": "91.4%"},
                {"year": "Y5", "revenue": "$42.3M", "costs": "$21.2M", "profit": "$21.1M", "roi": "99.5%"},
                {"year": "Y6", "revenue": "$68.9M", "costs": "$32.1M", "profit": "$36.8M", "roi": "114.6%"}
            ],
            "technology_comparison_table": [
                {"feature": "Speed", "current": "2.3s", "proposed": "0.8s", "improvement": "65% faster", "priority": "High"},
                {"feature": "Accuracy", "current": "87.5%", "proposed": "96.2%", "improvement": "8.7% increase", "priority": "High"},
                {"feature": "Energy", "current": "450W", "proposed": "180W", "improvement": "60% reduction", "priority": "Medium"},
                {"feature": "Scale", "current": "1K users", "proposed": "50K users", "improvement": "50x increase", "priority": "High"},
                {"feature": "Cost", "current": "$0.45", "proposed": "$0.12", "improvement": "73% reduction", "priority": "Medium"},
                {"feature": "Deploy", "current": "6 weeks", "proposed": "2 days", "improvement": "95% reduction", "priority": "Low"}
            ]
        }
        
        # Add advanced tables for higher tier plans
        if complexity in [ReportComplexity.ADVANCED, ReportComplexity.COMPREHENSIVE]:
            table_sections.update({
                "ip_landscape_table": [
                    {"patent": "US10123456", "owner": "TechCorp", "status": "Active", "relevance": "High", "expires": "2041"},
                    {"patent": "EP3456789", "owner": "EuroTech", "status": "Active", "relevance": "Medium", "expires": "2039"},
                    {"patent": "CN201980012", "owner": "Asia Innov", "status": "Pending", "relevance": "Medium", "expires": "2042"},
                    {"patent": "JP2020123", "owner": "Nippon Tech", "status": "Active", "relevance": "Low", "expires": "2040"},
                    {"patent": "KR102019012", "owner": "Korea Tech", "status": "Active", "relevance": "Medium", "expires": "2041"},
                    {"patent": "AU2019123", "owner": "Aussie Innov", "status": "Active", "relevance": "Low", "expires": "2040"}
                ],
                "regulatory_timeline_table": [
                    {"region": "US", "requirement": "FDA", "timeline": "12-18 mo", "cost": "$250K", "success": "78%"},
                    {"region": "EU", "requirement": "CE Mark", "timeline": "8-12 mo", "cost": "$180K", "success": "85%"},
                    {"region": "Canada", "requirement": "Health CA", "timeline": "6-10 mo", "cost": "$120K", "success": "82%"},
                    {"region": "Japan", "requirement": "PMDA", "timeline": "10-14 mo", "cost": "$200K", "success": "75%"},
                    {"region": "China", "requirement": "NMPA", "timeline": "14-20 mo", "cost": "$300K", "success": "68%"},
                    {"region": "Australia", "requirement": "TGA", "timeline": "6-9 mo", "cost": "$100K", "success": "88%"}
                ]
            })
        
        # Add premium tables for Comprehensive plan
        if complexity == ReportComplexity.COMPREHENSIVE:
            table_sections.update({
                "funding_sources_table": [
                    {"source": "VC", "range": "$5M-50M", "timeline": "6-12 mo", "success": "15%", "requirements": "Traction"},
                    {"source": "Angel", "range": "$100K-2M", "timeline": "3-6 mo", "success": "25%", "requirements": "Team"},
                    {"source": "Grants", "range": "$50K-5M", "timeline": "6-18 mo", "success": "35%", "requirements": "Innovation"},
                    {"source": "Corporate", "range": "$500K-10M", "timeline": "9-18 mo", "success": "20%", "requirements": "Alignment"},
                    {"source": "Crowdfund", "range": "$10K-1M", "timeline": "2-4 mo", "success": "40%", "requirements": "Appeal"},
                    {"source": "Bank", "range": "$100K-5M", "timeline": "1-3 mo", "success": "60%", "requirements": "Collateral"}
                ],
                "licensing_terms_table": [
                    {"type": "Exclusive", "royalty": "8-15%", "upfront": "$500K-2M", "territory": "Global", "duration": "Patent Life"},
                    {"type": "Non-Exclusive", "royalty": "3-8%", "upfront": "$100K-500K", "territory": "Regional", "duration": "5-10 years"},
                    {"type": "Field-of-Use", "royalty": "5-12%", "upfront": "$200K-1M", "territory": "Specific", "duration": "Patent Life"},
                    {"type": "Cross-License", "royalty": "2-6%", "upfront": "$50K-300K", "territory": "Mutual", "duration": "Negotiable"},
                    {"type": "Sublicense", "royalty": "10-20%", "upfront": "$1M-5M", "territory": "Global", "duration": "Patent Life"},
                    {"type": "Research", "royalty": "1-3%", "upfront": "$10K-100K", "territory": "Academic", "duration": "3-5 years"}
                ]
            })

        # Create comprehensive system prompt with enhanced table requirements
        system_prompt = f"""
You are a world-class technology commercialization expert and RTTP (Registered Technology Transfer Professional) generating a {report_type}.

**CRITICAL OUTPUT REQUIREMENTS:**
You must output STRICTLY ONE JSON DOCUMENT with these exact keys:

**Required Text Sections:**
{json.dumps(required_sections, indent=2)}

**Required Table Sections (MUST include {num_tables} tables with EXACTLY the structure shown):**
{json.dumps(table_sections, indent=2)}

**MANDATORY TABLE REQUIREMENTS:**
- Each table MUST have exactly 6 entries (arrays of 6 objects)
- Each object must have ALL the fields shown in the example
- Use SHORT, CONCISE text (max 15 characters per field)
- Tables must be named exactly as shown above
- NO long sentences in table cells

**CONTENT REQUIREMENTS:**
- Each text section: {min_words}-{max_words} words
- Professional, analytical tone
- Include specific quantitative data and metrics
- All table data must be realistic and relevant to the technology

OUTPUT ONLY THE JSON - NO ADDITIONAL TEXT, MARKDOWN, OR FORMATTING.
"""

        user_prompt = f"""
Technology Idea: {idea}

Generate a comprehensive {report_type} following the exact JSON structure specified. 

**CRITICAL REQUIREMENTS:**
1. Ensure ALL sections meet the {min_words}-{max_words} word requirement
2. Include ALL {num_tables} required tables with EXACTLY 6 realistic entries each
3. Use the EXACT table structure provided in the system prompt
4. All table data must be relevant to the technology idea: {idea}
5. Keep table text SHORT and CONCISE (max 15 characters per cell)
6. Include specific, quantitative data appropriate for {complexity} complexity level analysis

Focus on creating realistic, professional content that would be suitable for actual business use.
"""
        
        logger.info("Preparing OpenAI API call...")
        logger.info(f"System prompt length: {len(system_prompt)} characters")
        logger.info(f"User prompt length: {len(user_prompt)} characters")
        
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        start_time = time.time()
        
        logger.info("Making OpenAI API call...")
        response = client.chat.completions.create(
            model="gpt-4o-search-preview-2025-03-11",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            # response_format={"type": "json_object"},
            max_tokens=16000,
            # temperature=0.3,
        )
        print(response)
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
            "model": "gpt-4.1",
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
            for section in sections:
                if section in section_mapping:
                    json_key = section_mapping[section]
                    if json_key not in parsed_content:
                        missing_sections.append(section)
            
            if missing_sections:
                logger.warning(f"Missing sections for {complexity} complexity: {missing_sections}")
            
            # Log content lengths and validate tables
            for key, value in parsed_content.items():
                if isinstance(value, str):
                    word_count = len(value.split())
                    logger.info(f"Section '{key}' length: {len(value)} characters, {word_count} words")
                    if word_count < min_words:
                        logger.warning(f"Section '{key}' has only {word_count} words, minimum is {min_words}")
                elif isinstance(value, list):
                    logger.info(f"Table '{key}' entries: {len(value)}")
                    if len(value) < 6:
                        logger.warning(f"Table '{key}' has only {len(value)} entries, minimum is 6")
                    # Validate table structure
                    if len(value) > 0 and isinstance(value[0], dict):
                        logger.info(f"Table '{key}' first entry keys: {list(value[0].keys())}")
            
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
    def __init__(self, complexity: ReportComplexity):
        super().__init__(format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)
        self.complexity = complexity

    def header(self):
        try:
            self.set_font("Helvetica", "B", 10)
            self.set_text_color(128, 128, 128)
            report_type = f"{self.complexity.title()} Technology Assessment"
            self.cell(
                0,
                10,
                f"{report_type}",
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
            
            # Enhanced paragraph formatting with proper line breaks
            paragraphs = text.split('\n\n')
            for i, paragraph in enumerate(paragraphs):
                if paragraph.strip():
                    # Handle bullet points and formatting
                    lines = paragraph.split('\n')
                    for line in lines:
                        if line.strip():
                            # Use multi_cell with proper width to prevent overflow
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
            logger.info(f"=== ADDING TABLE: {title} ===")
            logger.info(f"Table data type: {type(data)}")
            logger.info(f"Table data length: {len(data) if isinstance(data, list) else 'N/A'}")
            
            if data:
                logger.info(f"First entry: {data[0] if isinstance(data, list) and len(data) > 0 else 'No data'}")
            
            # Validate data
            if not data or not isinstance(data, list) or len(data) == 0:
                logger.warning(f"No valid data for table: {title}")
                # Add a placeholder message
                self.set_font("Helvetica", "B", 12)
                self.set_text_color(200, 0, 0)  # Red color for error
                self.cell(0, 10, f"{title} - No data available", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
                self.ln(5)
                return

            # Check if we need a new page
            if self.get_y() > 200:
                self.add_page()

            # Table title
            self.set_font("Helvetica", "B", 12)
            self.set_text_color(0, 0, 0)
            title = self.clean_text(title)
            self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
            self.ln(5)

            # Validate data structure
            if not isinstance(data[0], dict):
                logger.warning(f"Invalid table data structure for {title}")
                self.set_font("Helvetica", "", 10)
                self.set_text_color(200, 0, 0)
                self.cell(0, 8, "Invalid table data format", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
                self.ln(5)
                return

            headers = list(data[0].keys())
            num_cols = len(headers)
            logger.info(f"Table headers: {headers}")
            logger.info(f"Number of columns: {num_cols}")

            # FIXED: Better column width calculation
            available_width = 170  # A4 width minus margins
            if column_widths is None:
                # Distribute width more evenly
                base_width = available_width / num_cols
                column_widths = [max(25, base_width) for _ in range(num_cols)]
                
                # Adjust if total exceeds available width
                total_width = sum(column_widths)
                if total_width > available_width:
                    factor = available_width / total_width
                    column_widths = [int(w * factor) for w in column_widths]

            logger.info(f"Column widths: {column_widths}")

            # Draw table headers with smaller font
            self.set_font("Helvetica", "B", 8)  # Smaller font for headers
            self.set_fill_color(220, 220, 220)
            self.set_text_color(0, 0, 0)

            for i, header in enumerate(headers):
                header_text = self.clean_text(header.replace("_", " ").title())
                # FIXED: Truncate header text properly
                if len(header_text) > 12:
                    header_text = header_text[:9] + "..."
                
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

            # Draw data rows with smaller font
            self.set_font("Helvetica", "", 7)  # Even smaller font for data
            
            for row_idx, row in enumerate(data):
                # Check for page break
                if self.get_y() > 260:
                    self.add_page()
                    # Re-add headers on new page
                    self.set_font("Helvetica", "B", 12)
                    self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
                    self.ln(5)
                    
                    self.set_font("Helvetica", "B", 8)
                    self.set_fill_color(220, 220, 220)
                    for i, header in enumerate(headers):
                        header_text = self.clean_text(header.replace("_", " ").title())
                        if len(header_text) > 12:
                            header_text = header_text[:9] + "..."
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
                    self.set_font("Helvetica", "", 7)

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

                    # FIXED: Better text truncation based on actual column width
                    # Calculate max characters based on font size and column width
                    max_chars = max(6, int(column_widths[i] / 4))  # Rough estimate
                    if len(value) > max_chars:
                        value = value[:max_chars-2] + ".."

                    value = self.clean_text(value)
                    is_last = i == len(headers) - 1

                    # FIXED: Use multi_cell for better text wrapping
                    current_x = self.get_x()
                    current_y = self.get_y()
                    
                    # Set position and draw cell
                    self.set_xy(current_x, current_y)
                    
                    # Draw border manually and add text
                    self.cell(
                        column_widths[i],
                        8,  # Fixed row height
                        value,
                        border=1,
                        new_x=XPos.RIGHT if not is_last else XPos.LMARGIN,
                        new_y=YPos.TOP if not is_last else YPos.NEXT,
                        align="L",
                        fill=fill,
                    )

            self.ln(8)  # Extra space after table
            logger.info(f"Successfully added table: {title} with {len(data)} rows")
            
        except Exception as e:
            logger.error(f"Error adding data table {title}: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            # Add error message to PDF
            self.set_font("Helvetica", "", 10)
            self.set_text_color(200, 0, 0)
            self.cell(0, 8, f"Error rendering table: {title}", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
            self.ln(5)

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
                "°": " deg", "±": "+/-", "×": "x"
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

def create_pdf(report: dict, output_path: str, complexity: ReportComplexity):
    """Create enhanced PDF from report data with comprehensive tables"""
    logger.info(f"Starting PDF creation for complexity: {complexity}")
    logger.info(f"Report keys: {list(report.keys())}")
    
    try:
        pdf = ReportPDF(complexity)
        pdf.add_page()

        # Get report type based on complexity
        if complexity == ReportComplexity.BASIC:
            report_type = "Basic Technology Assessment"
            report_pages = "3-4 pages"
            sections = [
                "Executive Summary",
                "Problem/Opportunity Statement",
                "Technology Overview",
                "Key Benefits",
                "Applications",
                "IP Snapshot",
                "Next Steps"
            ]
        elif complexity == ReportComplexity.ADVANCED:
            report_type = "Advanced Technology Assessment"
            report_pages = "6-8 pages"
            sections = [
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
            ]
        else:  # COMPREHENSIVE
            report_type = "Comprehensive Technology Assessment"
            report_pages = "10-15 pages"
            sections = [
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
            ]

        # Enhanced title page
        pdf.add_title(f"{report_type.upper()}")
        
        # Enhanced subtitle with plan details
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 0, 0)
        subtitle = f"{complexity.title()} Complexity - {report_pages}"
        subtitle = pdf.clean_text(subtitle)
        pdf.multi_cell(0, 8, subtitle, align="C")
        pdf.ln(5)

        # Plan features summary
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(100, 100, 100)
        table_count = len([k for k in report.keys() if 'table' in k])
        features_text = f"Features: {len(sections)} sections, {table_count} data tables"
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
        for section_title in sections:
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
        if complexity in [ReportComplexity.ADVANCED, ReportComplexity.COMPREHENSIVE]:
            table_mapping.update({
                "IP Landscape Analysis": "ip_landscape_table",
                "Regulatory Timeline": "regulatory_timeline_table"
            })
        
        # Add premium tables for Comprehensive plan
        if complexity == ReportComplexity.COMPREHENSIVE:
            table_mapping.update({
                "Funding Sources & Opportunities": "funding_sources_table",
                "Licensing Terms & Strategies": "licensing_terms_table"
            })

        # Add all tables with enhanced formatting
        logger.info("=== ADDING TABLES TO PDF ===")
        for table_title, table_key in table_mapping.items():
            table_data = report.get(table_key, [])
            logger.info(f"Processing table {table_title}: {table_key}")
            logger.info(f"Table data exists: {table_key in report}")
            logger.info(f"Table data type: {type(table_data)}")
            logger.info(f"Table data length: {len(table_data) if isinstance(table_data, list) else 'N/A'}")
            
            if table_data and isinstance(table_data, list) and len(table_data) > 0:
                logger.info(f"Adding table: {table_title}")
                pdf.add_data_table(table_title, table_data)
            else:
                logger.warning(f"Skipping table {table_title} - no valid data")

        # Save PDF
        pdf.output(output_path)
        logger.info(f"PDF generated successfully at: {output_path}")
        
        # Verify file was created and has substantial content
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            logger.info(f"PDF file size: {file_size} bytes")
            if file_size == 0:
                logger.error("PDF file is empty!")
                raise ValueError("Generated PDF file is empty")
            elif file_size < 10000:
                logger.warning(f"PDF file size ({file_size} bytes) seems small for {complexity} complexity")
        else:
            logger.error("PDF file was not created!")
            raise ValueError("PDF file was not created")

    except Exception as e:
        logger.error(f"Error creating PDF: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

async def generate_technology_report(idea: str, output_path: str, complexity: ReportComplexity) -> dict:
    """Main function to generate a technology assessment report"""
    logger.info("="*50)
    logger.info("STARTING TECHNOLOGY REPORT GENERATION")
    logger.info("="*50)
    logger.info(f"Complexity: {complexity}")
    logger.info(f"Idea: {idea[:100]}...")
    logger.info(f"Output path: {output_path}")
    
    try:
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        logger.info(f"Output directory ensured: {os.path.dirname(output_path)}")

        logger.info("Step 1: Generating report content...")
        report_json, usage_info = await generate_report_json(idea, complexity)
        
        logger.info("Step 2: Creating PDF...")
        create_pdf(report_json, output_path, complexity)

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