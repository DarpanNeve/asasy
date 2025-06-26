import os
import json
import openai
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from app.core.config import settings

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

def generate_report_json(idea: str) -> dict:
    """Generate report content using OpenAI API"""
    system_prompt = """
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

Aim to make every section as comprehensive and statistically rigorous as possible.
"""
    
    user_prompt = f"""
Idea: ```{idea}```

Generate the report JSON as specified above. Ensure every section is richly detailed, with at least five numerical data points per section and a minimum of 300 words each. Include realistic tabular data for all 5 table sections.
"""
    
    try:
        resp = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )
        
        if (data := resp.choices[0].message.content) is None:
            raise ValueError("Received empty response from OpenAI API")
        return json.loads(data)

    except Exception as e:
        print(f"Error generating report: {e}")
        # Return a default structure in case of API issues
        return {
            "patent_info": {
                "title": "Technology Assessment Report",
                "application_no": "N/A",
                "grant_no": "N/A",
                "filing_date": "N/A",
                "jurisdiction": "N/A",
                "assignee": "N/A",
                "status": "N/A",
            },
            "executive_summary": "Report generation failed.",
            "technology_overview": "N/A",
            "development_plan": "N/A",
            "market_assessment": "N/A",
            "commercialization_strategies": "N/A",
            "financial_viability": "N/A",
            "final_thoughts": "N/A",
            "market_data_table": [],
            "competitor_analysis_table": [],
            "development_timeline_table": [],
            "financial_projections_table": [],
            "technology_comparison_table": [],
        }

class ReportPDF(FPDF):
    def __init__(self):
        super().__init__(format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)

    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(128, 128, 128)
        self.cell(
            0,
            10,
            "Technology Assessment Report",
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
            f"Page {self.page_no()}",
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
        if self.get_y() > 50:
            self.ln(8)

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
            text = "Information not available."

        text = self.clean_text(text)
        self.multi_cell(0, 6, text, align="L")
        self.ln(2)

    def clean_text(self, text):
        """Clean text to remove problematic Unicode characters"""
        if not text:
            return ""

        replacements = {
            """: "'",
            """: "'",
            '"': '"',
            '"': '"',
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

def create_pdf(report: dict, output_path: str):
    """Create PDF from report data"""
    try:
        pdf = ReportPDF()
        pdf.add_page()

        # Title
        pdf.add_title("TECHNOLOGY ASSESSMENT REPORT")

        # Subtitle with patent title
        if report.get("patent_info", {}).get("title"):
            pdf.set_font("Helvetica", "B", 14)
            pdf.set_text_color(0, 0, 0)
            title_text = report["patent_info"]["title"]
            title_text = pdf.clean_text(title_text)
            pdf.multi_cell(0, 8, title_text, align="C")
            pdf.ln(10)

        # Sections
        sections = [
            ("Executive Summary", report.get("executive_summary", "")),
            ("Technology Overview", report.get("technology_overview", "")),
            ("Development Plan", report.get("development_plan", "")),
            ("Market Assessment", report.get("market_assessment", "")),
            ("Commercialization Strategies", report.get("commercialization_strategies", "")),
            ("Financial Viability", report.get("financial_viability", "")),
            ("Final Thoughts", report.get("final_thoughts", "")),
        ]

        for i, (title, content) in enumerate(sections, 1):
            pdf.add_section_header(i, title)
            pdf.add_paragraph(content)

        # Save PDF
        pdf.output(output_path)
        print(f"✅ PDF generated successfully at: {output_path}")

    except Exception as e:
        print(f"❌ Error creating PDF: {e}")
        raise

async def generate_technology_report(idea: str, output_path: str) -> dict:
    """Main function to generate a complete technology assessment report"""
    try:
        print("🔄 Generating report content...")
        report_json = generate_report_json(idea)

        print("🔄 Creating PDF...")
        create_pdf(report_json, output_path)

        print("✅ Process completed successfully!")
        return report_json

    except Exception as e:
        print(f"❌ Error in main process: {e}")
        raise