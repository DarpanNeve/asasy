import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

import openai
from weasyprint import HTML

from app.core.config import settings
from app.models.report import ReportComplexity

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('report_generator.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class PDFReportGenerator:
    temperature: float = 0.2
    max_tokens: int = 32768
    min_word_count: int = 23000
    model: str = "gpt-4.1"

    @staticmethod
    def initialize_openai_client() -> openai.OpenAI:
        """Initialize OpenAI client with proper error handling"""
        api_key =settings.OPENAI_API_KEY
        if not api_key:
            raise EnvironmentError("OPENAI_API_KEY not found in environment variables.")

        client = openai.OpenAI(api_key=api_key)
        logger.info("OpenAI client initialized successfully")
        return client

    @staticmethod
    def build_enhanced_prompt(topic, requirement) -> tuple[str, str]:
        """Build enhanced prompt for world-class PDF generation"""

        system_message = (
            "You are a senior RTTP expert specialized in structured and professional reports generation for technology commercialization and PDF generation (In Html format which can be converted to pdf using weasyprint in python) at scale."
            "Your job is to generate a complete, production-ready HTML5 document that will be converted into a beautiful, industry-grade PDF. Every heading should not start from new page and match the content  to fill in pdf width Strictly"
            "Your output must start with <!DOCTYPE html> and include a complete <html> document with a valid <head> section containing <title> and <meta> tags, along with embedded <style> for PDF-optimized CSS (fonts, page breaks, margins, etc.). "
            "The <body> must be organized with <header>, <section>, <article>, <h1> to <h4>, <p>, and <table> elements. "
            "Pdf should be well aligned,well margined (narrow) and well formatted"
            "Your report should be structured and professional"
            "It should be finalized and presentable to the end user."
            "Font should be times new roman"
            "Do not use ASCII format"
            "Remove Extra spacing in the pdf content"
            "Take context from Global data present on www"
            "Give content for every section and subsection as descriptive as possible and as explained as possible"
            "Content created words should not be less than 25000 words"
            "Please Consider that any thing you are creating should be properly visible and presentable in pdf format"
            "DO NOT use <pre> or <img> tags. Charts or diagrams must be represented using styled <div> blocks (CSS layout compatable to be converted to pdf using weasyprint)—no images. "
            "Each table must include real, credible data sourced from publicly available global reports or industry databases, and should not be limited to region-specific or placeholder information."
            "Adopt a formal, precise, and comprehensive technical writing style that reflects the rigor and sophistication expected in high-value commercialization strategies and critical investor decision-making contexts."
            "The HTML must be self-contained, styled, and return only the full raw HTML text—no Markdown, no explanations, no placeholders."
            "Use maximum token as possible"
        )

        user_message = (
            f"Generate a complete HTML5 report on the topic: '{topic.strip()}'.\n"
            "Charts must be rendered in a visually appealing and structured format within the HTML, incorporating clear titles and well-defined headings to ensure clarity and professional presentation."
            "Add References with links in the End in the Structured format (bullet points)."
            f"The report should address the following requirements in detail:\n"
            "Please Beautify pdf as much as possible."
            "Add index and (Font size 12,No Background Color,Make in proper format,line spacing should be 1.5 and make it in very proper tabular format)."
            "Give all section and sub section as descriptive and explained as possible."
            "Do not use <pre> tag."
            "For charts or diagrams, describe them using styled <div> blocks or tables—do NOT include any <img> or image paths."
            f"{requirement.strip()}\n"
            "Tables must contain real-world and verifiable data from global resources."
            "Minimum 5000 words for every title tag Content.Content should not feel like 4-5 lines it should be descriptive"
            "Charts must be built using styled <div> tables—NO <img> or <pre> tags. "
            "Ensure HTML5 is styled with embedded CSS for PDF export: use modern fonts, page-break control, margin spacing, and table aesthetics. "
            "Return only full HTML code starting with <!DOCTYPE html>."
        )
        return system_message, user_message

    def generate_html_report(self, client: openai.OpenAI,topic,requirement) -> str:
        """Generate HTML report using OpenAI API"""
        system_message, user_message = self.build_enhanced_prompt(topic, requirement)

        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )

            # Log usage statistics
            usage = response.usage
            logger.info(f"Token usage - Total: {usage.total_tokens}, "
                        f"Prompt: {usage.prompt_tokens}, "
                        f"Completion: {usage.completion_tokens}")

            html_content = response.choices[0].message.content.strip()

            # Validate HTML content
            if not self._validate_html(html_content):
                raise ValueError("Generated content is not valid HTML")

            return html_content

        except Exception as e:
            logger.error(f"Failed to generate report: {e}")
            raise RuntimeError(f"Failed to generate report from OpenAI API: {e}")

    @staticmethod
    def _validate_html(html_content: str) -> bool:
        """Validate that content is proper HTML"""
        return (
                html_content.strip().startswith('<!DOCTYPE html>') or
                '<html' in html_content.lower()
        )

    @staticmethod
    def save_html_to_file(html_content: str, output_dir:str, filename: str = None) -> Path:
        """Save HTML content to file with proper naming"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_{timestamp}.html"

        html_path = Path(output_dir) / filename

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        logger.info(f"HTML report saved to: {html_path}")
        return html_path

    @staticmethod
    def convert_html_to_pdf(html_content: str, output_dir:str, filename: str = None) -> Path:
        """Convert HTML to PDF with enhanced settings"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_{timestamp}.pdf"

        pdf_path = Path(output_dir) / filename

        try:
            # Create HTML object with enhanced configuration
            html_doc = HTML(
                string=html_content,
                base_url=str(output_dir)
            )

            # Enhanced PDF generation with optimized settings
            html_doc.write_pdf(
                str(pdf_path),
                optimize_images=True,
                pdf_version='1.7',
                pdf_forms=True,
                presentational_hints=True,
                font_size=12
            )

            logger.info(f"PDF successfully generated: {pdf_path}")
            return pdf_path

        except Exception as e:
            logger.error(f"PDF generation failed: {e}")
            raise RuntimeError(f"PDF generation error: {e}")

    def generate_report_metadata(self, html_path: Path, pdf_path: Path,topic,requirements,output_dir) -> Dict[str, Any]:
        """Generate metadata for the report"""
        metadata = {
            "topic": topic,
            "requirements": requirements,
            "generation_time": datetime.now().isoformat(),
            "files": {
                "html": str(html_path),
                "pdf": str(pdf_path)
            },
            "config": {
                "model": self.model,
                "temperature": self.temperature,
                "min_word_count": self.min_word_count
            }
        }

        metadata_path = output_dir / "report_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)

        logger.info(f"Metadata saved to: {metadata_path}")
        return metadata

    def generate_complete_report(self,topic,output_path,complexity:ReportComplexity) -> Dict[str, Path]:
        """Main method to generate complete report"""
        try:
            # Initialize OpenAI client
            client = self.initialize_openai_client()
            if complexity==ReportComplexity.COMPREHENSIVE:
                requirement =settings.COMPREHENSIVE_REQUIREMENT
            elif complexity==ReportComplexity.ADVANCED:
                requirement =settings.ADVANCED_REQUIREMENT
            else:
                requirement =settings.BASIC_REQUIREMENT
            # Generate HTML content
            logger.info("Generating HTML report...")
            html_content = self.generate_html_report(client,topic,requirement)

            # Save HTML file
            html_path = self.save_html_to_file(html_content,output_path)

            # Convert to PDF
            logger.info("Converting to PDF...")
            pdf_path = self.convert_html_to_pdf(html_content,output_path)

            # Generate metadata
            metadata = self.generate_report_metadata(html_path, pdf_path,topic,requirement,output_path)

            logger.info("🎉 Report generation completed successfully!")
            logger.info(f"📄 HTML Report: {html_path}")
            logger.info(f"📋 PDF Report: {pdf_path}")

            return {
                "html": html_path,
                "pdf": pdf_path,
                "metadata": metadata
            }

        except Exception as e:
            logger.error(f"Report generation failed: {e}")
            raise
