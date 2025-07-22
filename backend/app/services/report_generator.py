import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum

# Required Libraries (install via pip: openai weasyprint serpapi)
import openai
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
from serpapi import GoogleSearch

from app.core.config import settings


# --- 1. Enumeration for Report Complexity ---
class ReportComplexity(str, Enum):
    """Defines the complexity levels for the report."""
    BASIC = "basic"
    ADVANCED = "advanced"
    COMPREHENSIVE = "comprehensive"


# --- 2. Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('report_generator.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


# --- 3. Report Configuration Dataclass ---
@dataclass
class ReportConfig:
    """Configuration class for report generation"""
    topic: str
    output_dir: str
    model: str = "gpt-4-turbo"
    temperature: float = 0.15
    primary_color: str = "#2563eb"
    secondary_color: str = "#1e40af"
    font_family: str = "Times New Roman"


# --- 4. The Main Merged Report Generator Class ---
class PDFReportGenerator:
    """
    Generates professional PDF reports by combining dynamic complexity levels
    with section-by-section content generation and real-time data retrieval.
    """

    def __init__(self):
        # API keys should be set as environment variables for security
        self.openai_api_key = settings.OPENAI_API_KEY  # Replace with your key if not using env vars
        self.serpapi_api_key = settings.SERPAPI_API_KEY  # Replace with your key if not using env vars
        self.font_config = FontConfiguration()
        self._total_usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}

    def initialize_openai_client(self) -> openai.OpenAI:
        """Initializes the OpenAI client with proper error handling."""
        if not self.openai_api_key:
            raise EnvironmentError(
                "OPENAI_API_KEY is not set. Please set it as an environment variable or directly in the script.")
        try:
            client = openai.OpenAI(api_key=self.openai_api_key)
            logger.info("OpenAI client initialized successfully.")
            return client
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
            raise

    def _get_search_query_from_topic(self, client: openai.OpenAI, topic: str) -> str:
        """Uses an LLM to extract concise search keywords from the report topic."""
        logger.info("Extracting search keywords for patent search...")
        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system",
                     "content":"You are a patent search expert. Extract a concise, effective search query (3-5 keywords) from the user's topic for the Google Patents database. Return only the keywords, separated by spaces."},
                    {"role": "user", "content": f"Topic: {topic}"}
                ],
                temperature=0.0,
                max_tokens=50
            )
            keywords = response.choices[0].message.content.strip().replace('"', '')
            logger.info(f"Generated search query: '{keywords}'")

            return keywords
        except Exception as e:
            logger.error(f"Could not extract keywords: {e}")
            return topic  # Fallback to using the original topic

    def search_for_patents(self, client: openai.OpenAI, topic: str) -> list:
        """Searches for real patents using the SerpApi Google Patents API."""
        if not self.serpapi_api_key:
            logger.warning("SERPAPI_API_KEY not found. Skipping patent search.")
            return []

        search_query = self._get_search_query_from_topic(client, topic)
        logger.info(f"Searching for patents with SerpApi using query: '{search_query}'")

        params = {
            "engine": "google_patents",
            "q": search_query,
            "api_key": self.serpapi_api_key,
            "num": 10
        }
        try:
            search_client = GoogleSearch(params)
            results = search_client.get_dict()
            patent_results = results.get("organic_results", [])
            if not patent_results:
                logger.warning("No patent results found via SerpApi.")
                return []

            verified_patents = [
                {
                    "patent_number": item.get("publication_number"),
                    "title": item.get("title"),
                    "assignee": item.get("assignee"),
                    "inventor": item.get("inventor"),
                    "grant_status": item.get("grant_status", "N/A"),
                    "filing_date": item.get("filing_date", "N/A"),
                    "link": item.get("link")
                }
                for item in patent_results
            ]
            logger.info(f"Successfully retrieved {len(verified_patents)} patents via SerpApi.")
            print(f"patent_results: {json.dumps(verified_patents, indent=2)}")
            return verified_patents
        except Exception as e:
            logger.error(f"SerpApi search failed: {e}", exc_info=True)
            return []

    @staticmethod
    def build_prompt_for_section(self, topic: str, section_title: str, data: Optional[Any] = None) -> str:
        """Builds a targeted prompt for a specific report section."""
        # This dictionary holds the specific, detailed instructions for every section.
        # Note: The extensive prompt dictionary from your Version 2 is used here.
        # It has been omitted for brevity in this display but is included in the logic.
        section_instructions = {
            "1. Executive Summary": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    1.1 One-Line Value Proposition
                    Deliver a single, compelling sentence that summarizes the unique commercial or societal value of this invention. It must encapsulate the core benefit, highlight a major unmet need, a significant efficiency gain, or a scalable impact. Phrase it as a compelling proposition to investors, governments, or industry leaders. Avoid buzzwords unless they are industry-standard. The sentence must include a tangible output or outcome. The output should be a single, grammatically perfect sentence in raw text, ready for PDF publishing. Do not use bullet points or line breaks.

                    1.2 Overview of the Invention
                    Describe the invention’s core mechanism or concept clearly for business and policy stakeholders. Explain the core concept, design, or working principle in a simple yet authoritative tone. Emphasize its novelty, technical uniqueness, and operational simplicity. Avoid excessive jargon, and ensure the text is written for a non-technical reader while still reflecting the depth of innovation. Mention what makes the invention superior or differentiated from existing solutions. If relevant, include a brief description of the technology’s architecture, process, or structure. The output must be grammatically perfect, in full narrative sentences, and immediately usable in a report. Avoid lists, bullet points, and markdown. Do not use placeholders or dummy terms.

                    1.3 Summary of Market Potential
                    Provide a sharp, expanded summary of the macro-level market opportunity, focusing on sectors, use cases, and timing relevance without including raw data or numerical stats. Describe the industry domains or verticals primed for adoption. Highlight emerging trends, adoption urgency, or market timing that make this the right moment for the technology. Focus on real-world applicability, pain points solved, and alignment with global priorities. The tone must be professional, forward-looking, and visionary, suitable for stakeholders like investors, policymakers, and innovation leaders. Use fluid, high-quality narrative sentences. Avoid lists, bullet points, markdown, and dummy text. Do not include visuals or tables.

                    1.4 Commercial Opportunity Highlights
                    Generate 10-15 sharp, detailed, bullet-style insights that outline key commercialization pathways for the invention, highlighting a strategic avenue for translating it into a scalable business or deployment model. Each bullet must offer a realistic, professionally analyzed route for monetization, scaling, or societal deployment. The structure should begin with early-stage or grassroots-level use, progress toward large-scale licensing, platform integration, or government programs, and conclude with long-horizon or international potential. Each insight must include the specific pathway, justification for viability, and mention sectors or stakeholder types most aligned with the pathway. The tone must be one of authority, clarity, and investor-readiness. Avoid generalizations, financial figures, vague benefits, placeholders, assumptions, extrapolations, or unverifiable claims. The output must be in bullet points, and suitable for direct inclusion in a global IP commercialization or investment report. Do not include visuals or markdown.
                    """,
            "2. Problem / Opportunity Statement": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    2.1 Industry Gap or Unmet Need
                    Clearly define the critical industry gap this invention addresses. Ground the gap in real-world inefficiencies, regulatory limitations, high-cost structures, inaccessibility, or technological fragmentation. Articulate the consequences of inaction and what is at stake for stakeholders if the gap remains unaddressed. Reference globally traceable data, recurring pain points, and recognized industry limitations. Avoid generic or vague claims, and frame the problem using sector-specific terminology aligned with commercialization contexts. Mention why current solutions fail or are suboptimal and the structural reasons behind their inefficacy. The output must build a compelling case for urgency, relevance, and investment-worthiness. Do not use assumptions, placeholders, or speculative commentary. Use clean HTML5 tags only, and maintain a professional tone and narrative flow. The purpose is to form a credible, compelling foundation for commercialization strategy and IP positioning.

                    2.2 Urgency and Relevance
                    Explain in detail why solving this problem is urgent today using a clear, cause-effect narrative. Highlight timing triggers such as regulatory reforms, international policy shifts, market saturation, or digital acceleration pressure. Explain how delayed intervention increases risk or lost competitive advantage. Ground every urgency signal in verifiable current events or widely recognized industrial transformations. The message must be aligned to commercialization stakeholders, emphasizing why this matters now. The output must be clean HTML5, using only specified semantic tags, and contain no placeholder text, unverified trends, or stylistic elements. The goal is to justify why now is the precise and strategic time to act, backed by visible global signals. It can optionally suggest 4-5 visual metaphor ideas (e.g., ticking clock).

                    2.3 Societal/Commercial Impact Potential
                    Analyze in depth the dual-benefit model: how the invention addresses systemic social, health, or environmental inequities (societal impact) and how it strengthens economic activity, competitiveness, or product pipelines for businesses (commercial impact). Describe the ecosystem transformation by detailing who benefits and how, such as through cost reduction or expanded markets. Reference authenticated parallels or documented examples from similar industries. Emphasize alignment with global frameworks like UN SDGs or ESG mandates. Every impact narrative should map to a traceable, verifiable driver or precedent. The output must be clean HTML5, logically cohesive, and grounded in ecosystem understanding, suitable for direct PDF conversion. The section must persuade readers that the invention is a catalyst for systemic commercial and social change. Do not include vague impact claims or abstract phrases. All data must be verifiable and aligned with RTTP, WIPO, AUTM, or equivalent commercialization standards. Do not include markdown, explanations, or placeholders.
                    """,
            "3. Technology Overview": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    3.1 Core Concept / Invention Idea
                    Deliver a concise yet technically robust explanation of the core inventive idea. Frame the invention in technology transfer-ready language suitable for IP licensing, investment due diligence, and grant assessments. Avoid marketing buzzwords and focus on engineering/scientific precision. Include what the invention is, what it does, how it functions at a fundamental level, and what makes it novel from an IP or technical standpoint. Anchor the explanation in applied science or proven engineering logic, and emphasize how this invention translates into an enabling technology or a platform innovation. Mention its intended application context without exaggeration. The output should be pure HTML5, using specified semantic tags, and be print-ready and compliant with professional report formats. Do not include speculative content.

                    3.2 Underlying Scientific/Engineering Principle
                    Explain in detail the foundational principles that enable the invention to function. Clearly describe the core physical, chemical, biological, or computational principles, ensuring the explanation is technically valid, non-speculative, and aligned with domain-verified frameworks. Maintain accessibility for business, legal, and government stakeholders. Emphasize the integrity and feasibility of the invention based on first principles or repeatable empirical logic. Reference the known fields of study that this invention leverages or advances. Use internationally recognized scientific terminology. Avoid unverified hypotheses, and maintain a focus on technical clarity and credibility. The output must be clean HTML5, ready for use in government filings, IP valuation reports, and technology dossiers. Do not include speculative figures.

                    3.3 Key Technical Features and Functionalities
                    Articulate in detail the most significant technical features and operational functionalities in a clear, structured manner for commercial, IP, and tech transfer stakeholders. Outline each unique feature, focusing on how it enhances performance, usability, scalability, or reliability. Highlight what sets the invention apart from conventional solutions at a component and system level. Use precise, engineering-grade terminology grounded in globally accepted frameworks. Avoid speculative descriptions and unquantified superlatives; all listed features must be technically feasible. Prioritize clarity and technical integrity suitable for integration into patent specifications or licensing decks. The output must be pure HTML5, print-aligned, and investment-grade, with no placeholders or hypothetical features.

                    3.4 Differentiation from Traditional Approaches
                    Demonstrate how this invention fundamentally improves upon or diverges from conventional solutions. Identify the benchmark or prevailing methods/products in the target market. Explain in depth how the invention surpasses or disrupts these solutions using a structured, point-by-point format. Focus on quantifiable or logically verifiable differences in performance, efficiency, integration, cost-effectiveness, and other key dimensions. All differentiators must be grounded in reality. Use a comparison table with semantic HTML to highlight side-by-side differences between the "Traditional Method" and "This Invention" across at least 10-15 key dimensions. The narrative tone must align with global standards for IP licensing and due diligence. The output must be clean, semantic HTML5, and compatible with WeasyPrint PDF rendering, suitable for licensing dossiers and grant submissions. Avoid promotional or speculative language. Include a comparative HTML table with at least 10-15 rows contrasting the invention with traditional methods. Use consistent heading structures. All claims must be backed by a verifiable scientific or engineering basis.
                    """,
            "4. Unique Selling Proposition (USP) & Key Benefits": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    4.1 Efficiency or Cost Advantages
                    Detail how the invention reduces input cost, resource consumption, or operational complexity compared to existing solutions. Use clean comparative phrasing and, if relevant, include one table summarizing measurable cost or efficiency gains across key parameters. The language must be professional, technical, and factual with no promotional tone. All advantages must be based on technical, economic, or social validation, not assumptions.

                    4.2 Performance Enhancements
                    Describe in detail how the technology improves core performance metrics such as accuracy, speed, yield, or energy use. Avoid vague terms like "better" and quantify improvements using technical units or real-world standards wherever possible. The output must use professional, technical, and factual language, avoiding promotional tone or unverified claims.

                    4.3 Scalability / Flexibility
                    Explain in depth whether and how the technology can be scaled, such as through mass production, multi-sector adoption, or modularization potential. Describe the modular architecture and its potential for seamless integration into existing systems, platforms, or workflows. Specify compatibility with industry-standard protocols, interfaces, or infrastructure. Clarify how the deployment architecture is adaptable across diverse use cases, operational environments, or industry sectors, emphasizing configurability and interoperability.

                    4.4 Sustainability / Social Relevance
                    Articulate in detail how the invention aligns with ESG goals, regulatory shifts, UN SDGs, and climate resilience targets. Include facts on waste reduction, energy neutrality, safety enhancement, or inclusion. Optionally, include a table comparing the traditional vs. new method on sustainability parameters. The content must be precise, IP-evaluation grade, and suitable for licensing, startup valuation, and government grant submission contexts. Do not generate markdown, bullet summaries, speculative projections, or informal commentary. The output must use only semantic HTML5 tags and be fully compatible with WeasyPrint for PDF rendering.
                    """,
            "5. Applications & Use-Cases": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    5.1 Primary Application Sectors
                    Define in detail the primary industry sectors where the invention has validated, high-impact commercial application potential. Use formal, sector-specific terminology recognized in global markets. Avoid generalizations. Anchor all sector references in existing unmet needs, market inefficiencies, and alignment with known frameworks such as UNSDGs, national innovation missions, or regulatory roadmaps. Use only verifiable, real-world justification from sources like industry association reports, government R&D budget allocations, or market intelligence reports. Avoid speculation, placeholders, or promotional tone.

                    5.2 Secondary and Emerging Markets
                    Identify and describe in detail non-primary sectors and emerging industry domains where the invention has credible potential for future adoption. Clearly distinguish these from primary markets based on technological adjacency, regulatory shifts, or sustainability-driven pivots. Cite drivers such as smart city integration or emerging economy digitalization. Use real, documented examples, market evolution patterns, or sector forecasts from reputable sources. Avoid unvalidated claims, assumptions, or speculative tone. For nascent sectors, explain relevance based on factual convergence of technology or policy. The output must use only semantic HTML5 tags and be 100% clean for WeasyPrint PDF rendering. Do not include markdown, images, or placeholders.

                    5.3 Ideal Customer/End User Profiles
                    Define target customers and end users by industry vertical, organizational role, institution type, and geography in a detailed manner. Differentiate between buyers vs. users and government vs. private sector. Support profiles with industry-specific challenges or workflows that the technology directly solves. Use a table with at least the following columns: Customer Segment, Pain Point, Adoption Context, Strategic Benefit, Solution Fit, Value Proposition, TRL, IP/Regulatory Status, Revenue Opportunity, Implementation Barrier, Key Decision Maker, Go-to-Market Approach, Pilot Possibility, Funding Mechanism, Competition Landscape, and Scalability Potential. Avoid hypothetical personas and use authentic, anonymized industry archetypes based on documented use cases. The output must use only clean, semantic HTML5 tags and be fully compatible with WeasyPrint PDF rendering. Do not use speculative language.
                    """,
            "6. IP Snapshot": "Present the provided patent data in a clear, analytical table. For each patent, include its number, title, assignee, inventor, grant status and filling date. Provide expert analysis on the implications of this patent landscape based on the given data.",
            "7. Next Steps & Development Suggestions": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    7.1 Suggested Pilot / PoC
                    Clearly describe in detail the most viable PoC scenario based on the current TRL of the invention. Define a real-world context where the pilot would be conducted. Identify what technical performance, feasibility, or user feedback the PoC will validate, using specific, real-world metrics. Name potential PoC collaborators only if verifiable. Ensure the design is scalable, low-risk, and budget-justifiable for early-stage stakeholders. Do not include assumptions or hypothetical outcomes. Optionally, describe the minimal viable configuration required for testing. The output must use only clean semantic HTML5 and be compatible with WeasyPrint PDF rendering, using globally accepted commercialization terminology.

                    7.2 R&D Expansion Recommendations
                    Clearly articulate priority research areas that would enhance the technical maturity, scalability, or market readiness of the invention in a comprehensive manner. Use established R&D categorization where applicable (e.g., prototype validation, regulatory compliance, field testing). Base recommendations on existing limitations or data gaps, feedback from pilot testing, and industry standards. Each recommendation should directly support commercialization, IP defensibility, or end-user adoption. Include recommendations for potential academic/industry partnerships, testing environments, or engineering redesigns. The output must use only semantic HTML5 tags and be compatible with WeasyPrint for PDF generation, with a professional, technically grounded, and globally credible tone.

                    7.3 Prototype or Manufacturing Suggestions
                    Clearly outline practical, detailed next steps for physical prototyping or pilot-scale manufacturing based on the invention’s current development status. Mention applicable methods, materials, or fabrication tools. If software-based, suggest the tech stack or simulation environments. Align recommendations with the current Technology Readiness Level (TRL). Use terminology compliant with RTTP and industry manufacturing standards. Address cost, scalability, or supply chain feasibility only where verifiable. The output must use only clean, semantic HTML5 tags, without speculative methods, placeholders, or promotional language. It must be print-aligned and WeasyPrint-compatible.
                    """,
            "8. Expanded Executive Summary": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report.

                    8.1 Go / No-Go Commercialization Recommendation
                    Provide a formal commercialization readiness recommendation (Go, Conditional Go, or No-Go) based on all preceding evidence from technical, market, regulatory, and IP analysis. Ensure the recommendation is objective, grounded in verifiable factors such as market timing, IP position strength, regulatory readiness, and technology maturity. Use formal, decision-making language suitable for innovation boards and investors. If "Conditional Go," outline specific, detailed milestones that must be achieved. Avoid promotional tone or speculative commentary. The output must use only semantic HTML5 tags and be print-aligned for audit-ready PDF output. Use globally accepted terminology from WIPO, AUTM, or RTTP.

                    8.2 Justification: Market, Tech, IP, and Cost Factors
                    Present a professional, evidence-based, and highly detailed justification for the technology's commercial and strategic viability based on real-world, documented inputs. Provide integrated justification across four pillars: Market (demand, pain points), Technology (feasibility, maturity), IP (protection, FTO), and Cost (cost-efficiency, manufacturing insights). Use verifiable language only and cross-reference established frameworks like the TRL framework. Do not include generic or promotional claims. Every point must connect to actual filed IP, tested prototypes, market indicators, or cost assessments. Highlight interdependencies where relevant. The output must use clean, semantic HTML5, without speculative phrases, placeholders, or markdown. It must be fully compliant with WeasyPrint PDF rendering.
                    """,
            "9. Problem & Solution Fit (Validated Background)": """
                    Provide a significantly more detailed and expanded explanation for this section. Use only verified, publicly available data to describe the problem. Demonstrate that the problem is significant, persistent, and not adequately addressed by current alternatives. Show that the proposed solution directly addresses root-cause-level pain points or systemic gaps. Cite documented proof of solution alignment such as use-cases, pilot data, or regulatory validation. Avoid any promotional tone, unvalidated assumptions, or speculative projections. The language must reflect the standards of global TTO offices, WIPO, AUTM, and RTTP protocols. The output must use only semantic HTML5 tags and be fully compatible with WeasyPrint for high-fidelity PDF export. All claims must be evidence-based and audit-ready.

                    9.1 Pain Points Faced by Industry
                    Describe in detail specific, well-documented industry challenges based on regulatory non-compliance, inefficiencies, safety risks, high costs, or market fragmentation. Ground each pain point in factual and verifiable data from academic, industrial, or public domain reports. Use terminology consistent with global tech transfer bodies. Avoid assumptions, anecdotes, or non-validated opinions. Do not include user feedback unless backed by cited sources or structured studies. The output must be clean semantic HTML5, readable, print-aligned, and globally presentable.

                    9.2 How This Solution Addresses the Need
                    Use cause-effect logic to show in a comprehensive manner how specific features of the invention solve the defined unmet need. Align the solution’s capabilities with documented market failures or operational constraints. Cross-reference verifiable data from previously discussed problem statements. Emphasize precise fit-for-purpose characteristics like cost-effectiveness, real-time response, or regulatory compliance. Use language aligned with global tech transfer standards and avoid promotional tone or exaggeration. The output must be in HTML5 using semantic tags, print-ready, and compliant with international reporting frameworks.

                    9.3 Initial Validation, Research Data
                    Describe any laboratory, field, prototype, or simulation-based validation conducted to date in extensive detail. Include references to documented research studies, internal findings, or third-party testing. Indicate the type of validation, validating institutions, protocols used, outcomes, and data integrity. Mention if any validation gaps still exist. All data must be real and verifiable, without assumptions, hypotheticals, or projections. The output must use only semantic HTML5 tags and be fully compatible with WeasyPrint PDF rendering, suitable for IP/commercial due diligence. The language must be professional, objective, and technically sound.
                    """,
            "10. Technical Feasibility & TRL": """
                    Provide a significantly more detailed and expanded explanation for this section. Elaborate on each point, offering deeper context, more thorough analysis, and comprehensive descriptions to create a more in-depth version of the report. Clearly explain the present development stage of the technology using the 9-level TRL framework recognized globally. Provide direct evidence of feasibility such as lab validation, functional prototypes, or pilot tests. Mention if standards compliance is underway or achieved. Clarify the methodology used to assign the TRL score. The output must use only semantic HTML5 tags, with no speculative statements, placeholder data, or markdown. It must be clean, print-aligned, and fully compatible with WeasyPrint for PDF rendering.

                    10.1 Technology Readiness Level (TRL)
                    Clearly identify the current TRL using a scale from TRL 1 to TRL 9, with reference to a recognized global framework. Explain in detail what this TRL means in practice. Present the justification factors in a detailed HTML table. The table should include columns for 'Evidence Type', 'Description of Milestone Achieved', and 'Implication for TRL Score'. Mention if the technology has crossed critical thresholds like Proof-of-Concept Validation or Integration Readiness. The output must use clean semantic HTML5, with no speculative statements, placeholders, or promotional tone. It must be fully compliant with international IP audit and valuation standards.

                    10.2 Prototype / Demonstrator Availability
                    Provide a factual, detailed technical summary of any working prototype, lab demonstrator, or pilot system built. Include the type of prototype, year of development, institution involved, materials, methods, and scale. Exclude photographic or visual references; describe them instead. Reference any TRL or ISO/NIST-standard classification if available. Mention funding sources if applicable and highlight reproducibility and replicability potential. The output must use only clean, professional HTML5 tags and be visually aligned for PDF rendering. Do not include speculative or promotional content.

                    10.3 Development Challenges
                    List and explain in detail verifiable development challenges the innovation has faced or may face across categories such as technical limitations, regulatory compliance hurdles, infrastructure/ecosystem gaps, talent constraints, and go-to-market risks. Use only validated observations from the development process, published reports, or pilot data. Avoid hypothetical issues unless directly supported by known precedents in the field. Use globally accepted language consistent with RTTP, AUTM, and WIPO standards. The output must be in clean HTML5, professionally structured for WeasyPrint rendering, and suitable for use in IP audit reports, technology valuation dossiers, or investor technical briefings.

                    10.4 Engineering Stack & Core Architecture
                    Clearly describe the full engineering or technology stack in a comprehensive manner. Use a tiered or modular explanation (e.g., Front-end, Middleware, Back-end). Emphasize system interoperability, integration methods, and cross-platform scalability. Describe deployment context and mention standards compliance where relevant. Clarify compatibility with open-source or proprietary components and outline system architecture principles. Include a comparative table outlining each layer/component with its function, tech choices, and rationale. The output must use only semantic HTML5 tags and be compatible with WeasyPrint for clean PDF conversion. Avoid speculative or promotional content.

                    10.5 Technology Readiness Level (TRL) in Comparison with AICTE
                    Clearly define the current TRL of the technology using the standard 9-level TRL scale. Explicitly map the technology’s maturity level to the AICTE’s Innovation Readiness Levels (IRL). Explain the basis for the TRL classification using factual, verifiable data. Crucially, you MUST include a detailed comparative HTML table showing TRL vs. AICTE IRL definitions side-by-side, and then indicate where the current project aligns on both scales. Explain any discrepancies or nuances in the mapping. Mention any activities pending to move to the next level on both scales. The output must use only clean, semantic HTML5, and be compliant with global tech transfer documentation norms and WeasyPrint rendering. Avoid promotional, exaggerated, or placeholder statements.
                    """,
            "11. IP Summary & Landscape": """
                    Use internationally accepted terminology and factually verifiable IP data only. Do not expand content or speculate beyond the provided data. Use the provided patent data as the primary source for your analysis.

                    11.1 Patent Landscape Overview
                    Describe the geographic and sectoral distribution of relevant patents based on the provided data. Use summary tables to compare jurisdictions, assignees, and filing volumes from the data. Mention any observable trends in the domain based on the provided patents.

                    11.2 Freedom-to-Operate (FTO) Status
                    State whether an FTO analysis was conducted. If not, state that this is a recommended next step. Based on the provided patents, give a preliminary assessment of potential FTO risks.

                    11.3 Competing Patents / Prior Art
                    Identify and list the provided competing patents or prior art documents using their legal identifiers from the data. For each reference, briefly summarize the technological overlap or distinction with the current invention. Use WIPO, AUTM, or RTTP-compliant terminology. Present this in a comparison table listing key prior art from the data, with Assignee, Publication Number, Filing Date, and a brief note on relevance.

                    11.4 Patent Strength & Claims Breadth
                    Analyze the scope and strength of the claims for the patents in the provided data. This is a high-level analysis.

                    11.5 PCT Application Status
                    If any of the patents in the data mention a PCT application, summarize that information.
                    """,
            "12. Market Signals & Traction": """
                    Provide a significantly more detailed and expanded explanation for this section. Highlight any real-world signs of market interest or ecosystem validation, such as Letters of Intent (LOIs), pilot deployments, or participation in recognized accelerators. Use clean, globally professional language, without hype, promotional tone, or unverifiable statements. Do not include speculative projections or future plans. List multiple types of signals using bullet points. The output must use only clean HTML5 semantic tags and be compatible with WeasyPrint PDF rendering, acceptable for use in valuation frameworks. Exclude placeholders or hypothetical examples.

                    12.1 Pilot Study Results / Beta Feedback
                    Summarize in detail any pilot studies, usability tests, or controlled field validations. Include only real, evidence-based results from structured trials. Cover testing environments, participant details (anonymized), quantifiable outcomes, performance gaps, and stakeholder feedback. Use bullet points for clarity where multiple findings are listed. If applicable, include a table comparing key pre- and post-pilot performance indicators. The output must use only HTML5 semantic tags, without markdown or non-verifiable language. It must be globally professional and export-ready for investor due diligence or government filings.

                    12.2 Letters of Intent (LOIs)
                    Summarize in detail actual, legally verifiable LOIs or documented expressions of commercial interest. Include the name of the organization, date of issuance, nature of intent, scope, and whether it includes financial commitments. Do not include confidential terms or speculative interest. The output must use only clean, semantic HTML5 tags, with no promotional tone, and be compatible with WeasyPrint PDF generation. Avoid duplicate reporting.

                    12.3 Customer Interviews or Case Studies
                    Summarize in depth real-world customer or end-user interactions using only facts. Include the context of the interaction, customer segment, key feedback highlights, stated pain points resolved, and evidence of repeated usage or willingness-to-pay. If multiple studies are presented, format each as a distinct article with structured sub-points. The output must use only clean, semantic HTML5 tags and be print-aligned and compatible with WeasyPrint for high-quality PDF rendering. Avoid promotional tone or unverified assumptions; content must meet audit-grade documentation quality.
                    """,
            "13. Competitive Intelligence": """
                    Provide a significantly more detailed and expanded explanation for this section. Analyze the competitive landscape using only real, validated information from public patent databases, scientific literature, and commercial product benchmarks. Highlight known competing technologies, their technology approach, IP positions, market status, and known limitations. Present at least one comparative table showing how the innovation compares with 5-10 leading alternatives across 6-8 technical or market-relevant parameters. The output must use clean HTML5, avoid placeholders or assumptions, and be compatible with WeasyPrint for PDF rendering. It must be aligned with WIPO, AUTM, RTTP, or equivalent global reporting standards.

                    13.1 Existing Competitors (Products)
                    Provide detailed, verified data on commercially available competing products that solve a similar problem. Include only publicly accessible, non-confidential data. Focus on relevance and degree of market overlap, and clearly explain how each competitor’s offering differs from the invention. Highlight white space opportunities if clear differentiation is evident.

                    13.2 SWOT Analysis (Tech, Market, IP)
                    Use only real, defensible inputs based on previously described technology and IP. Analyze Strengths, Weaknesses, Opportunities, and Threats across three columns: Technology, Market, and Intellectual Property. The table must have four rows (S/W/O/T). Provide detailed, comprehensive points for each cell. Avoid filler, vague language, and placeholders. Use globally accepted terminology from WIPO, AUTM, OECD, or RTTP frameworks. All content must be concise, commercially relevant, and legally defensible.

                    13.3 Key Differentiators
                    Use internationally accepted terminology from WIPO, AUTM, RTTP, or ISO frameworks. Emphasize in detail the factual, independently verifiable aspects that set the invention apart in technical functionality, cost/efficiency, market readiness, scalability, or regulatory compliance. Avoid generic claims unless backed by objective, cited benchmarks or validated comparisons. Highlight the invention’s IP-protected uniqueness, scientific novelty, and system-level compatibility.
                    """,
            "14. Regulatory & Compliance Overview": """
                    Provide a significantly more detailed and expanded explanation for this section. Identify applicable regulatory frameworks relevant to the innovation’s sector. State clearly whether the innovation is pre-regulation, in the process of compliance, or already certified. Mention the regulatory authorities involved, key hurdles, and any certifications already obtained. If no compliance is yet required, state this explicitly based on real-world conditions. The output must be in clean HTML5 using only semantic tags. Avoid markdown, placeholders, or promotional, hypothetical, or speculative content. Use recognized, compliance-compatible terminology.

                    14.1 Required Certifications
                    Identify and list in detail only the applicable certifications relevant to the product or process. Include recognized national and international standards (e.g., FDA, CE Marking, BIS, ISO). Include a detailed justification for each certification and classify it by market geography and product category.

                    14.2 Anticipated Approval Timeline
                    Describe in detail the standard approval pathway(s) based on the type of innovation. Specify the applicable regulatory body(ies), key approval stages, and duration estimates based on historical data. Mention any fast-track or provisional approval pathways and dependencies on documentation or infrastructure readiness. Use only real regulatory precedents and timelines from published guidance documents. Avoid speculation.
                    """,
            "15. Risk Summary & Open Questions": """
                    Provide a significantly more detailed and expanded explanation for this section. Provide a fact-based evaluation of compliance risks relevant to commercialization, deployment, or cross-border licensing. Analyze jurisdiction-specific regulatory compliance issues, including medical device approvals, data protection regulations, and export controls. Identify any compliance bottlenecks that may affect time-to-market or international market entry. Reference documented standards or legal precedents and flag mandatory certifications.

                    15.1 Technical Risks
                    Identify and clearly explain 5-10 specific, factual technical risks relevant to the innovation in great detail. Ground all risk analysis in real-world dynamics, including scientific/engineering limitations. Use factual and objective language suitable for technical boards and legal counsels.

                    15.2 Market Risks
                    Identify and clearly explain 5-10 specific, factual market risks relevant to the innovation in great detail. Ground all risk analysis in real-world dynamics, including shifting consumer behavior, regulatory timing, or competitive threats. Use factual and objective language suitable for venture committees.

                    15.3 Legal & IP Risks
                    Identify and clearly explain 5-10 specific, factual legal and IP risks relevant to the innovation, potentially referencing the provided patent data in great detail. Ground all risk analysis in real-world dynamics, including prior art challenges, jurisdictional gaps, or IP validity disputes.

                    15.4 Mitigation Suggestions
                    Provide clear, realistic, detailed, and evidence-backed suggestions to address and minimize the top critical risks identified. Focus on strategies aligned with IP protection, regulatory compliance, product-market fit, and scalability.
                    """,
            "16. Business Case & Commercial Viability": """
                    Provide a significantly more detailed and expanded explanation for this section. Clearly articulate the commercial opportunity derived from the innovation. Include the core value proposition in monetizable terms, targeted value chains, and go-to-market pathways. Mention IP-backed competitive advantages and market traction evidence. Provide an overview of the cost-to-scale and potential revenue models. Include risk considerations and potential exit or scale-up opportunities.

                    16.1 Business Opportunity Narrative
                    Describe in comprehensive detail the real-world commercial opportunity, grounded in validated data or documented parallels. Use language and tone consistent with IP valuation experts and investment analysts. Explain why the timing is right for this technology and the key drivers that make it investable or licensable.

                    16.2 Cost-to-Value Alignment
                    Provide a factual, objective, and detailed analysis of cost-to-value justification using globally accepted IP valuation frameworks. Include real-world cost factors such as development, IP filing, and regulatory approval expenses. Evaluate these costs against expected value drivers such as market entry acceleration, competitive differentiation, and licensing potential. Where possible, provide estimated figures in both INR and USD.

                    16.3 Barriers to Entry & Positioning
                    Identify and explain in detail the real, verifiable barriers to entry across dimensions like Intellectual Property Protection, Technological Complexity, Regulatory Compliance, and Capital Intensity. Clearly distinguish between hard and soft barriers. Provide context about how these barriers contribute to strategic market positioning.
                    """,
            "17. Market Analysis & Forecasts": """
                    Generate a detailed market analysis. Use tables where appropriate. All financial figures must be presented in both Indian Rupees (INR) and US Dollars (USD). Clearly state the conversion rate used for calculations. Provide a significantly more detailed and expanded explanation for this section.

                    17.1 Global Market Size (TAM/SAM/SOM) (Present in a table format)
                    Provide a detailed breakdown of the Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM). The table must include columns for Market Segment (TAM/SAM/SOM), Value (USD), Value (INR), and a detailed justification/methodology for each calculation.

                    17.2 Growth Trends & CAGR
                    Elaborate on the key market growth trends and provide a projected Compound Annual Growth Rate (CAGR). Cite the sources for these trends and projections.

                    17.3 Adoption Barriers
                    Analyze the primary barriers to market adoption in detail, including economic, technological, and behavioral factors.

                    17.4 Geographic Expansion Opportunity
                    Discuss potential for geographic expansion, highlighting key target regions and the rationale for their selection.
                    """,
            "18. Business Models": """
                    Outline potential business models for this technology in great detail. Use tables for comparison if helpful. Provide a significantly more detailed and expanded explanation for this section.

                    18.1 Licensing (Exclusive, Non-Exclusive)
                    Describe the pros and cons of exclusive and non-exclusive licensing models for this specific technology.

                    18.2 Product/Platform Offering
                    Detail a direct-to-market product or platform strategy.

                    18.3 Subscription (SaaS / IPaaS)
                    Explain how a subscription-based model could be implemented.

                    18.4 Hybrid / Custom Engagements
                    Discuss the potential for hybrid models or custom enterprise solutions.
                    """,
            "19. Financial Overview & ROI Projection": """
                    Provide a high-level but detailed financial overview. Use tables to present data clearly. All financial figures must be presented in both Indian Rupees (INR) and US Dollars (USD). Clearly state the conversion rate used. Provide a significantly more detailed and expanded explanation for this section.

                    19.1 Development & Operational Costs
                    Provide a detailed estimate of costs, broken down by phase (e.g., R&D, prototyping, market entry). Present in a table with columns for Cost Item, Amount (USD), and Amount (INR).

                    19.2 Projected Revenue Streams
                    Outline potential revenue streams with detailed projections for the first 5 years.

                    19.3 Break-even Timeline
                    Project a realistic break-even timeline based on the cost and revenue projections.

                    19.4 5-Year ROI Model (Present in a table)
                    Create a table showing a simplified 5-year Return on Investment (ROI) model, with rows for Year, Investment, Revenue, Profit, and Cumulative ROI. All financial figures must be in both USD and INR.
                    """,
            "20. Funding Strategy": """
                    Suggest a detailed funding strategy for this technology. Provide a significantly more detailed and expanded explanation for this section.

                    20.1 Ideal Funding Sources (Govt Grants, VC, Angel)
                    Analyze the suitability of different funding sources like government grants, venture capital, and angel investors for each stage of development.

                    20.2 Suggested Rounds (Pre-Seed, Seed, Series A)
                    Outline the key milestones and funding amounts (in both INR and USD) for Pre-Seed, Seed, and Series A rounds.

                    20.3 Accelerator / Incubator Suggestions
                    Recommend specific, relevant accelerators or incubators and explain the rationale for each suggestion.
                    """,
            "21. Licensing & Exit Strategy": """
                    Detail potential licensing and exit strategies in a comprehensive manner. Provide a significantly more detailed and expanded explanation for this section.

                    21.1 IP Deal Structures
                    Discuss various IP deal structures like upfront payments, royalties, and equity.

                    21.2 Buyout / Acquisition Models
                    Analyze potential acquirers and the rationale for a buyout strategy.

                    21.3 Spin-Off Potential
                    Evaluate the feasibility of creating a spin-off company based on this technology.

                    21.4 Strategic Partnering Frameworks
                    Describe frameworks for establishing strategic partnerships for development and distribution.
                    """,
            "22. Team & Strategic Resource Planning": """
                    Outline the necessary team and resources in detail. Provide a significantly more detailed and expanded explanation for this section.

                    22.1 Required Talent Roles
                    List the key technical, business, and administrative roles required for success.

                    22.2 Advisory/Board Composition
                    Suggest the ideal composition for a board of advisors, including key areas of expertise.

                    22.3 Strategic Partners for Scale
                    Identify the types of strategic partners needed for manufacturing, distribution, and market access.
                    """,
            "23. Implementation Roadmap": """
                    Provide a clear, detailed implementation roadmap. Use tables for timelines and budgets. All financial figures must be presented in both Indian Rupees (INR) and US Dollars (USD). Clearly state the conversion rate used. Provide a significantly more detailed and expanded explanation for this section.

                    23.1 Timeline from Now to MVP
                    Create a detailed timeline with phases (e.g., Month 1-3, Month 4-6) leading to a Minimum Viable Product (MVP).

                    23.2 Key Milestones
                    List the critical milestones for each phase of the roadmap.

                    23.3 Budget Allocation by Phase
                    Present a table showing budget allocation by phase, with columns for Phase, Activities, Budget (USD), and Budget (INR).

                    23.4 Risk Buffers and Contingencies
                    Discuss the need for time and budget buffers to mitigate potential risks.
                    """,
            "24. Appendices": "Create an appendix section. Include a detailed table of all the patent data provided. The table should list Patent Number, Title, Assignee, Inventor, Filing Date, and grant status. Do not expand content or speculate beyond the provided data.",
            "25. Conclusion": "Provide a detailed conclusion for the entire report. **Bold** the keywords and highlight the key points of the report within the conclusion. The conclusion should summarize the findings from all sections, reinforcing the value proposition, market opportunity, and strategic viability based on the presented evidence. The tone should be authoritative and forward-looking, suitable for a professional audience of investors, policymakers, and industry leaders.",
            "26. References": "Generate a list of credible, authoritative references that would typically support the claims and analysis made in a technology assessment report of this nature. Include realistic examples of references from academic journals, industry reports (e.g., from Gartner, Forrester), patent databases (e.g., WIPO, USPTO), government publications, and recognized news outlets. Format this as a standard bibliography or reference list. Do not invent full URLs, but provide examples of the types of sources that should be consulted for a report of this caliber."
        }
        # Default instruction if a specific one isn't found
        instructions = section_instructions.get(section_title,
                                                f"Please now write the complete content for the '{section_title}' section. Provide a significantly more detailed and expanded explanation.")

        base_prompt = f"""
                You are a senior RTTP expert writing a section of a formal technology assessment report.
                The overarching topic is: '{topic}'
                Your tone must be formal, deeply analytical, and suitable for investors and policymakers.
                Generate only the HTML content for the '{section_title}' section, starting with the <h2> tag. Do NOT include an opening or closing <section> tag.
                Use semantic HTML tags like <h3>, <p>, <table>, <ul>, etc., as requested in the instructions.
                Ensure all content is highly detailed, well-structured, and provides actionable insights.
                If provided with data, use it as the absolute source of truth. Do not invent details not present in the data.

                Instructions for this section:
                {instructions}
                """

        if data:
            patent_data_json = json.dumps(data, indent=2)
            specific_prompt = f"""
                    {base_prompt}

                    Use ONLY the following VERIFIED patent data for this task. Do not invent any patents or details.

                    Verified Data:
                    ```json
                    {patent_data_json}
                    ```
                    """
            return specific_prompt
        else:
            return base_prompt

    def generate_html_for_section(self, client: openai.OpenAI, config: ReportConfig, prompt: str) -> str:
        """Generates HTML for a single section and tracks token usage."""
        try:
            response = client.chat.completions.create(
                model=config.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=config.temperature,
                max_tokens=4096
            )
            usage = response.usage
            self._total_usage["prompt_tokens"] += usage.prompt_tokens
            self._total_usage["completion_tokens"] += usage.completion_tokens
            self._total_usage["total_tokens"] += usage.total_tokens
            logger.info(f"Section Token Usage - Prompt: {usage.prompt_tokens}, Completion: {usage.completion_tokens}")
            print("complete response is ", response.choices[0].message.content.strip())
            return response.choices[0].message.content.strip() + "\n"
        except Exception as e:
            logger.error(f"Failed to generate section content: {e}")
            return f"<h2>Error: Content Generation Failed</h2><p>Could not generate content for this section due to an API error: {e.__class__.__name__}</p>\n"

    def convert_html_to_pdf(self, html_content: str, output_path: Path) -> Path:
        """Converts the final HTML to a PDF using WeasyPrint."""
        pdf_path = output_path.with_suffix(".pdf")
        try:
            HTML(string=html_content, base_url=str(output_path.parent)).write_pdf(pdf_path,
                                                                                  font_config=self.font_config)
            logger.info(f"PDF successfully generated: {pdf_path}")
            return pdf_path
        except Exception as e:
            logger.error(f"PDF generation failed: {e}")
            raise RuntimeError(f"PDF conversion error: {e}")

    def generate_report_metadata(self, config: ReportConfig, html_path: Path, pdf_path: Path,
                                 complexity: ReportComplexity) -> Dict[str, Any]:
        """Generates metadata for the completed report."""
        return {
            "topic": config.topic,
            "complexity": complexity.value,
            "generation_time": datetime.now().isoformat(),
            "files": {
                "html": str(html_path),
                "pdf": str(pdf_path)
            },
            "config": {
                "model": config.model,
                "temperature": config.temperature,
            },
            "usage": self._total_usage
        }

    def generate_complete_report(self, topic: str, output_path_str: str, complexity: ReportComplexity) -> Dict[
        str, Any]:
        """
        Main method to generate a complete report based on topic, path, and complexity.
        """
        # 1. --- SETUP AND CONFIGURATION ---
        logger.info(f"Starting report generation for topic: '{topic[:100]}...' with complexity: {complexity.value}")
        self._total_usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}

        output_path = Path(output_path_str)
        output_dir = output_path.parent
        output_dir.mkdir(parents=True, exist_ok=True)
        config = ReportConfig(topic=topic, output_dir=str(output_dir))

        # 2. --- DEFINE REPORT STRUCTURE BASED ON COMPLEXITY ---
        ALL_SECTIONS = [
            "1. Executive Summary", "2. Problem / Opportunity Statement", "3. Technology Overview",
            "4. Unique Selling Proposition (USP) & Key Benefits", "5. Applications & Use-Cases",
            "6. IP Snapshot", "7. Next Steps & Development Suggestions", "8. Expanded Executive Summary",
            "9. Problem & Solution Fit (Validated Background)", "10. Technical Feasibility & TRL",
            "11. IP Summary & Landscape", "12. Market Signals & Traction", "13. Competitive Intelligence",
            "14. Regulatory & Compliance Overview", "15. Risk Summary & Open Questions",
            "16. Business Case & Commercial Viability", "17. Market Analysis & Forecasts", "18. Business Models",
            "19. Financial Overview & ROI Projection", "20. Funding Strategy", "21. Licensing & Exit Strategy",
            "22. Team & Strategic Resource Planning", "23. Implementation Roadmap", "24. Appendices",
            "25. Conclusion", "26. References"
        ]

        SECTION_MAPPING = {
            ReportComplexity.BASIC: [ALL_SECTIONS[i] for i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,24,25]],
            # Exec Summary, Tech Overview, Apps, IP Snapshot, Conclusion
            ReportComplexity.ADVANCED:  [ALL_SECTIONS[i] for i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,24,25]],
            # First 7 sections, Comp. Intel to Business Case, and final sections
            ReportComplexity.COMPREHENSIVE: ALL_SECTIONS
        }
        report_structure = SECTION_MAPPING[complexity]
        logger.info(f"Generating {len(report_structure)} sections for '{complexity.value}' report.")

        # 3. --- INITIALIZE CLIENT AND RETRIEVE DATA ---
        client = self.initialize_openai_client()
        logger.info("--- Phase 1: Retrieving patent data ---")
        verified_patents = self.search_for_patents(client, topic)

        # 4. --- BUILD HTML DOCUMENT SKELETON (CSS, COVER, TOC) ---
        logger.info("--- Phase 2: Generating report HTML structure ---")
        css_styles = f"""
                    /* --- Page Layout and Numbering --- */
                    @page {{
                        size: A4;
                        margin: 2cm;
                        @bottom-center {{
                            color: #888;
                            content: 'Page ' counter(page);
                            font-size: 9pt;
                        }}
                    }}
                    @page :first {{
                        /* Suppress footer on the first page (cover) */
                        @bottom-center {{ content: normal; }}
                    }}
                    .page-break {{ page-break-after: always; }}

                    /* --- Watermark --- */
                    body::after {{
                        content: "ASSESME";
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 150pt;
                        color: #000;
                        opacity: 0.08;
                        z-index: -1000;
                        pointer-events: none;
                        font-weight: bold;
                    }}

                    /* --- Cover Page --- */
                    .cover-page {{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        height: 25.7cm; /* A4 height minus margins */
                    }}
                    .cover-title {{
                        font-size: 28pt;
                        color: {config.primary_color};
                        border-bottom: 3px solid {config.secondary_color};
                        padding-bottom: 10px;
                        margin-bottom: 1cm;
                    }}
                    .cover-subtitle {{
                        font-size: 16pt;
                        color: {config.secondary_color};
                        margin-top: 2cm;
                        font-style: italic;
                    }}
                    .cover-topic {{
                        font-size: 12pt;
                        margin: 0.5cm 2cm;
                        line-height: 1.5;
                    }}
                    .cover-footer {{
                        position: absolute;
                        bottom: 2cm;
                        font-size: 10pt;
                        color: #555;
                    }}

                    /* --- Table of Contents --- */
                    #toc h1 {{
                        font-size: 20pt;
                        color: {config.primary_color};
                        border-bottom: 2px solid {config.primary_color};
                        padding-bottom: 5px;
                        margin-bottom: 1cm;
                    }}
                    .toc-entry {{
                        margin-bottom: 0.7em;
                        font-size: 12pt;
                    }}
                    .toc-entry a {{
                        color: #333;
                        text-decoration: none;
                    }}
                    .toc-entry a:hover {{
                        text-decoration: underline;
                        color: {config.primary_color};
                    }}

                    /* --- General Body and Text Styles --- */
                    body {{
                        font-family: '{config.font_family}', serif;
                        font-size: 11pt;
                        line-height: 1.5;
                        color: #333;
                        counter-reset: page 1; /* Start page numbering for main content at 1 */
                    }}
                    h1, h2, h3, h4 {{
                        color: {config.secondary_color};
                        font-weight: bold;
                        page-break-after: avoid;
                    }}
                    h2 {{
                        font-size: 18pt;
                        border-bottom: 2px solid {config.primary_color};
                        padding-bottom: 2px;
                        margin-top: 1.5cm;
                        page-break-before: always;
                    }}
                    h2:first-of-type {{
                        page-break-before: auto; /* Don't break before the very first section */
                    }}
                    h3 {{
                        font-size: 14pt;
                        color: {config.secondary_color};
                        margin-top: 1cm;
                    }}
                    table {{
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 1em;
                        page-break-inside: avoid;
                    }}
                    th, td {{
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                        font-size: 9pt;
                    }}
                    th {{
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }}
                    ul {{ padding-left: 20px; }}
                    a {{ color: {config.primary_color}; text-decoration: none; }}
                    a:hover {{ text-decoration: underline; }}
                    """
        html_parts = [
             f'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
                f'<title>Technology Assessment Report: {config.topic[:50]}...</title>',
                f'<style>{css_styles}</style></head><body>']

        # Cover Page
        html_parts.append(f"""
            <div class="cover-page page-break">
                <div class="cover-title">Technology Assessment Report</div>
                <div class="cover-subtitle">Regarding the Technology:</div>
                <div class="cover-topic">{config.topic}</div>
                <div class="cover-footer">
                    Generated on: {datetime.now().strftime('%B %d, %Y')}
                </div>
            </div>
            """)

        # Table of Contents
        html_parts.append('<section id="toc" class="page-break"><h1>Table of Contents</h1>')
        for i, title in enumerate(report_structure):
            section_id = f"section-{i + 1}"
            html_parts.append(f"""
            <div class="toc-entry">
                <a href="#{section_id}">{title}</a>
            </div>
            """)
        html_parts.append('</section>')

        # 5. --- GENERATE CONTENT FOR EACH SECTION ---
        logger.info("--- Phase 3: Generating content section by section ---")
        for i, title in enumerate(report_structure):
            logger.info(f"Generating section: {title}...")
            data_to_pass = verified_patents if any(k in title for k in ["IP", "Patent", "Appendices"]) else None
            prompt = self.build_prompt_for_section(self,topic, title, data=data_to_pass)
            section_content = self.generate_html_for_section(client, config, prompt)
            html_parts.append(f'<section id="section-{i + 1}">{section_content}</section>')

        html_parts.append("</body></html>")
        final_html = "".join(html_parts)

        # 6. --- SAVE FILES AND GENERATE METADATA ---
        logger.info("--- Phase 4: Finalizing files ---")
        html_path = output_path.with_suffix(".html")
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(final_html)
        logger.info(f"HTML report saved to: {html_path}")

        pdf_path = self.convert_html_to_pdf(final_html, html_path)
        metadata = self.generate_report_metadata(config, html_path, pdf_path, complexity)

        logger.info("🎉 Report generation completed successfully!")
        return {
            "html": html_path,
            "pdf": pdf_path,
            "metadata": metadata
        }