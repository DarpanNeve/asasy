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
            num_tables = 5
        elif plan.name == "Intermediate":
            min_words = 100
            max_words = 250
            content_depth = "detailed analysis with comprehensive data"
            num_tables = 5
        elif plan.name == "Advanced":
            min_words = 150
            max_words = 350
            content_depth = "comprehensive analysis with investment-grade data"
            num_tables = 7
        else:  # Comprehensive
            min_words = 200
            max_words = 500
            content_depth = "in-depth professional analysis with institutional-grade data"
            num_tables = 9
        
        # FIXED: Define table structure with explicit examples
        table_sections = {
            "market_data_table": [
                {"metric": "Total Addressable Market", "value": "$12.5B", "growth_rate": "15.2% CAGR", "source": "Industry Report 2024", "year": "2024"},
                {"metric": "Serviceable Available Market", "value": "$3.8B", "growth_rate": "18.5% CAGR", "source": "Market Research Inc", "year": "2024"},
                {"metric": "Market Penetration Rate", "value": "2.3%", "growth_rate": "12.1% annually", "source": "Tech Analytics", "year": "2024"},
                {"metric": "Average Deal Size", "value": "$125K", "growth_rate": "8.7% annually", "source": "Sales Data", "year": "2024"},
                {"metric": "Customer Acquisition Cost", "value": "$15K", "growth_rate": "-5.2% annually", "source": "Marketing Analytics", "year": "2024"},
                {"metric": "Customer Lifetime Value", "value": "$450K", "growth_rate": "22.3% annually", "source": "Revenue Analytics", "year": "2024"}
            ],
            "competitor_analysis_table": [
                {"company": "TechCorp Solutions", "market_share": "23.5%", "revenue": "$2.8B", "key_features": "AI-powered automation", "rating": "Strong", "strengths": "Market leader, strong R&D"},
                {"company": "InnovateTech Ltd", "market_share": "18.2%", "revenue": "$2.1B", "key_features": "Cloud-native platform", "rating": "Strong", "strengths": "Scalable architecture"},
                {"company": "NextGen Systems", "market_share": "15.7%", "revenue": "$1.9B", "key_features": "Real-time analytics", "rating": "Moderate", "strengths": "Fast deployment"},
                {"company": "SmartTech Inc", "market_share": "12.3%", "revenue": "$1.4B", "key_features": "Mobile-first design", "rating": "Moderate", "strengths": "User experience"},
                {"company": "FutureTech Corp", "market_share": "8.9%", "revenue": "$1.1B", "key_features": "Blockchain integration", "rating": "Emerging", "strengths": "Innovation focus"},
                {"company": "DataFlow Systems", "market_share": "6.4%", "revenue": "$780M", "key_features": "Advanced security", "rating": "Emerging", "strengths": "Security expertise"}
            ],
            "development_timeline_table": [
                {"phase": "Research & Development", "duration": "6 months", "cost": "$500K", "milestones": "Proof of concept, MVP", "risk_level": "Medium", "dependencies": "Technical team hiring"},
                {"phase": "Prototype Development", "duration": "4 months", "cost": "$300K", "milestones": "Working prototype, testing", "risk_level": "Low", "dependencies": "R&D completion"},
                {"phase": "Beta Testing", "duration": "3 months", "cost": "$200K", "milestones": "User feedback, iterations", "risk_level": "Medium", "dependencies": "Prototype completion"},
                {"phase": "Regulatory Approval", "duration": "8 months", "cost": "$400K", "milestones": "Compliance certification", "risk_level": "High", "dependencies": "Beta testing results"},
                {"phase": "Production Setup", "duration": "5 months", "cost": "$600K", "milestones": "Manufacturing ready", "risk_level": "Medium", "dependencies": "Regulatory approval"},
                {"phase": "Market Launch", "duration": "2 months", "cost": "$350K", "milestones": "Product launch, marketing", "risk_level": "Low", "dependencies": "Production setup"}
            ],
            "financial_projections_table": [
                {"year": "Year 1", "revenue": "$2.5M", "costs": "$1.8M", "profit": "$0.7M", "roi": "38.9%", "market_share": "0.8%"},
                {"year": "Year 2", "revenue": "$6.2M", "costs": "$3.9M", "profit": "$2.3M", "roi": "59.0%", "market_share": "1.9%"},
                {"year": "Year 3", "revenue": "$12.8M", "costs": "$7.1M", "profit": "$5.7M", "roi": "80.3%", "market_share": "3.2%"},
                {"year": "Year 4", "revenue": "$24.5M", "costs": "$12.8M", "profit": "$11.7M", "roi": "91.4%", "market_share": "5.1%"},
                {"year": "Year 5", "revenue": "$42.3M", "costs": "$21.2M", "profit": "$21.1M", "roi": "99.5%", "market_share": "7.8%"},
                {"year": "Year 6", "revenue": "$68.9M", "costs": "$32.1M", "profit": "$36.8M", "roi": "114.6%", "market_share": "11.2%"}
            ],
            "technology_comparison_table": [
                {"feature": "Processing Speed", "current_solution": "2.3 seconds", "proposed_solution": "0.8 seconds", "improvement": "65% faster", "priority": "High", "impact": "Critical"},
                {"feature": "Accuracy Rate", "current_solution": "87.5%", "proposed_solution": "96.2%", "improvement": "8.7% increase", "priority": "High", "impact": "Critical"},
                {"feature": "Energy Efficiency", "current_solution": "450W", "proposed_solution": "180W", "improvement": "60% reduction", "priority": "Medium", "impact": "Significant"},
                {"feature": "Scalability", "current_solution": "1K users", "proposed_solution": "50K users", "improvement": "5000% increase", "priority": "High", "impact": "Critical"},
                {"feature": "Cost per Transaction", "current_solution": "$0.45", "proposed_solution": "$0.12", "improvement": "73% reduction", "priority": "Medium", "impact": "Significant"},
                {"feature": "Deployment Time", "current_solution": "6 weeks", "proposed_solution": "2 days", "improvement": "95% reduction", "priority": "Low", "impact": "Moderate"}
            ]
        }
        
        # Add advanced tables for higher tier plans
        if plan.name in ["Advanced", "Comprehensive"]:
            table_sections.update({
                "ip_landscape_table": [
                    {"patent_id": "US10,123,456", "assignee": "TechCorp Inc", "jurisdiction": "United States", "status": "Active", "relevance": "High", "expiry_date": "2041-03-15"},
                    {"patent_id": "EP3456789", "assignee": "EuroTech Ltd", "jurisdiction": "European Union", "status": "Active", "relevance": "Medium", "expiry_date": "2039-08-22"},
                    {"patent_id": "CN201980012345", "assignee": "Asia Innovations", "jurisdiction": "China", "status": "Pending", "relevance": "Medium", "expiry_date": "2042-01-10"},
                    {"patent_id": "JP2020-123456", "assignee": "Nippon Tech", "jurisdiction": "Japan", "status": "Active", "relevance": "Low", "expiry_date": "2040-06-30"},
                    {"patent_id": "KR10-2019-0123456", "assignee": "Korea Advanced Tech", "jurisdiction": "South Korea", "status": "Active", "relevance": "Medium", "expiry_date": "2041-11-18"},
                    {"patent_id": "AU2019123456", "assignee": "Aussie Innovations", "jurisdiction": "Australia", "status": "Active", "relevance": "Low", "expiry_date": "2040-09-05"}
                ],
                "regulatory_timeline_table": [
                    {"jurisdiction": "United States", "requirement": "FDA Approval", "timeline": "12-18 months", "cost": "$250K", "complexity": "High", "approval_rate": "78%"},
                    {"jurisdiction": "European Union", "requirement": "CE Marking", "timeline": "8-12 months", "cost": "$180K", "complexity": "Medium", "approval_rate": "85%"},
                    {"jurisdiction": "Canada", "requirement": "Health Canada", "timeline": "6-10 months", "cost": "$120K", "complexity": "Medium", "approval_rate": "82%"},
                    {"jurisdiction": "Japan", "requirement": "PMDA Approval", "timeline": "10-14 months", "cost": "$200K", "complexity": "High", "approval_rate": "75%"},
                    {"jurisdiction": "China", "requirement": "NMPA Approval", "timeline": "14-20 months", "cost": "$300K", "complexity": "High", "approval_rate": "68%"},
                    {"jurisdiction": "Australia", "requirement": "TGA Approval", "timeline": "6-9 months", "cost": "$100K", "complexity": "Low", "approval_rate": "88%"}
                ]
            })
        
        # Add premium tables for Comprehensive plan
        if plan.name == "Comprehensive":
            table_sections.update({
                "funding_sources_table": [
                    {"source_type": "Venture Capital", "amount_range": "$5M-$50M", "timeline": "6-12 months", "requirements": "Proven traction, scalable model", "success_rate": "15%", "contact_info": "VC firms, accelerators"},
                    {"source_type": "Angel Investors", "amount_range": "$100K-$2M", "timeline": "3-6 months", "requirements": "Strong team, clear vision", "success_rate": "25%", "contact_info": "Angel networks, platforms"},
                    {"source_type": "Government Grants", "amount_range": "$50K-$5M", "timeline": "6-18 months", "requirements": "Innovation focus, compliance", "success_rate": "35%", "contact_info": "SBIR, STTR programs"},
                    {"source_type": "Corporate Partnerships", "amount_range": "$500K-$10M", "timeline": "9-18 months", "requirements": "Strategic alignment", "success_rate": "20%", "contact_info": "Corporate venture arms"},
                    {"source_type": "Crowdfunding", "amount_range": "$10K-$1M", "timeline": "2-4 months", "requirements": "Consumer appeal, marketing", "success_rate": "40%", "contact_info": "Kickstarter, Indiegogo"},
                    {"source_type": "Bank Loans", "amount_range": "$100K-$5M", "timeline": "1-3 months", "requirements": "Collateral, credit history", "success_rate": "60%", "contact_info": "Commercial banks, SBA"}
                ],
                "licensing_terms_table": [
                    {"license_type": "Exclusive License", "royalty_rate": "8-15%", "upfront_fee": "$500K-$2M", "territory": "Global", "exclusivity": "Full", "duration": "Patent life"},
                    {"license_type": "Non-Exclusive License", "royalty_rate": "3-8%", "upfront_fee": "$100K-$500K", "territory": "Regional", "exclusivity": "None", "duration": "5-10 years"},
                    {"license_type": "Field-of-Use License", "royalty_rate": "5-12%", "upfront_fee": "$200K-$1M", "territory": "Specific market", "exclusivity": "Field-limited", "duration": "Patent life"},
                    {"license_type": "Cross-License", "royalty_rate": "2-6%", "upfront_fee": "$50K-$300K", "territory": "Mutual", "exclusivity": "Shared", "duration": "Negotiable"},
                    {"license_type": "Sublicense Rights", "royalty_rate": "10-20%", "upfront_fee": "$1M-$5M", "territory": "Global", "exclusivity": "Sublicense", "duration": "Patent life"},
                    {"license_type": "Research License", "royalty_rate": "1-3%", "upfront_fee": "$10K-$100K", "territory": "Academic only", "exclusivity": "Non-commercial", "duration": "3-5 years"}
                ]
            })

        # Create comprehensive system prompt with enhanced table requirements
        system_prompt = f"""
You are a world-class technology commercialization expert and RTTP (Registered Technology Transfer Professional) generating a {plan.report_type}.

{plan.prompt_template}

**CRITICAL OUTPUT REQUIREMENTS:**
You must output STRICTLY ONE JSON DOCUMENT with these exact keys:

**Required Text Sections:**
{json.dumps(required_sections, indent=2)}

**Required Table Sections (MUST include {num_tables} tables with EXACTLY the structure shown):**
{json.dumps(table_sections, indent=2)}

**MANDATORY TABLE REQUIREMENTS:**
- Each table MUST have exactly 6 entries (arrays of 6 objects)
- Each object must have ALL the fields shown in the example
- Use realistic data relevant to the technology idea
- All values must be strings
- Tables must be named exactly as shown above

**CONTENT REQUIREMENTS:**
- Each text section: {min_words}-{max_words} words
- Professional, analytical tone
- Include specific quantitative data and metrics
- All table data must be realistic and relevant to the technology

OUTPUT ONLY THE JSON - NO ADDITIONAL TEXT, MARKDOWN, OR FORMATTING.
"""

        user_prompt = f"""
Technology Idea: {idea}

Generate a comprehensive {plan.report_type} following the exact JSON structure specified. 

**CRITICAL REQUIREMENTS:**
1. Ensure ALL sections meet the {min_words}-{max_words} word requirement
2. Include ALL {num_tables} required tables with EXACTLY 6 realistic entries each
3. Use the EXACT table structure provided in the system prompt
4. All table data must be relevant to the technology idea: {idea}
5. Include specific, quantitative data appropriate for {plan.name} plan level analysis

Focus on creating realistic, professional content that would be suitable for actual business use.
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

            # Calculate column widths
            available_width = 170  # A4 width minus margins
            if column_widths is None:
                if num_cols <= 3:
                    column_widths = [available_width // num_cols] * num_cols
                elif num_cols <= 5:
                    column_widths = [max(25, available_width // num_cols)] * num_cols
                else:
                    column_widths = [max(20, available_width // num_cols)] * num_cols

            # Ensure total width doesn't exceed available space
            total_width = sum(column_widths)
            if total_width > available_width:
                factor = available_width / total_width
                column_widths = [int(w * factor) for w in column_widths]

            logger.info(f"Column widths: {column_widths}")

            # Draw table headers
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

            # Draw data rows
            self.set_font("Helvetica", "", 8)
            
            for row_idx, row in enumerate(data):
                # Check for page break
                if self.get_y() > 260:
                    self.add_page()
                    # Re-add headers on new page
                    self.set_font("Helvetica", "B", 12)
                    self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
                    self.ln(5)
                    
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
                    max_chars = max(8, column_widths[i] // 3)
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
        table_count = len([k for k in report.keys() if 'table' in k])
        features_text = f"Features: {len(plan.sections)} sections, {table_count} data tables"
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