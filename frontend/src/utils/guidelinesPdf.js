export const SECTIONS = [
  {
    title: "1. General & Background",
    items: [
      "Company/Startup Name:",
      "Sector/Industry:",
      "Country (India / Global):",
      "Stage: (Idea, Prototype, Pilot, Revenue-Stage, Growth-Stage):",
      "Are you a startup, MSME, corporate, or university lab?",
      "Are you competing with other startups, corporates, or global players?",
    ],
  },
  {
    title: "2. Problem / Opportunity",
    items: [
      "What is the core problem you are solving?",
      "Why is it important (for your industry/market)?",
      "Who faces this problem (your target audience)?",
      "What is currently missing in the market (gap/opportunity)?",
    ],
  },
  {
    title: "3. Technology / Solution",
    items: [
      "Core Technology/Innovation:",
      "Key Features (bullet points):",
      "How does it work (short technical explanation)?",
      "Technology Readiness Level (TRL 1–9, if known):",
      "Current Status (Idea, Prototype, Pilot, Tested, Marketed):",
      "Unique Advantages (speed, cost, sustainability, compliance, accuracy, scalability):",
    ],
  },
  {
    title: "4. IP & Legal",
    items: [
      "Any patents filed/granted? (Application No., Countries):",
      "Copyrights/Trademarks/Design registrations (if any):",
      "Any IP conflicts or legal risks?",
      "Do you have freedom to operate in India/global markets?",
    ],
  },
  {
    title: "5. Market & Competitors",
    items: [
      "Target Market (India, Asia, EU, US, Global):",
      "Primary Use Cases:",
      "Target Customers (B2B, B2C, B2G, segments):",
      "Market Size Estimate (if known):",
      "Who are your top competitors? (Startups, corporates, substitutes):",
      "What makes you different? (USP vs competitors):",
      "Do you have early signals? (LOIs, pilot projects, customer interest, test users):",
    ],
  },
  {
    title: "6. Risk & Compliance",
    items: [
      "Applicable Regulatory Bodies (FDA, CE, BIS, ISO, AIS, SEBI, GDPR, etc.):",
      "Certifications obtained (if any):",
      "Risks you see today: (Technical, Compliance, Financial, Operational, IP, Market, Environmental):",
    ],
  },
  {
    title: "7. Business & Financials",
    items: [
      "Business Model (Licensing, SaaS, Product Sales, Hybrid, Other):",
      "Pricing Strategy (if known):",
      "Current or Projected Revenue:",
      "5-Year Vision (Market expansion, Global presence, IPO, Licensing):",
      "Funding Raised (if any):",
      "Funding Needed (stage, amount, purpose):",
    ],
  },
  {
    title: "8. Team & Execution",
    items: [
      "Current Team Size:",
      "Key Expertise of Team Members:",
      "Gaps in Team / Skills Needed:",
      "Strategic Partners or Advisors:",
      "Planned Execution Timeline (MVP, Pilot, Launch, Scale-up):",
    ],
  },
  {
    title: "9. Supporting Information",
    items: [
      "Technical drawings, flowcharts, prototypes",
      "Pilot/test data",
      "Market research reports",
      "IP documents",
      "Compliance certificates",
      "Financial projections",
    ],
  },
];

export const BEST_PRACTICES = [
  {
    label: "Be specific",
    detail:
      'Avoid "general answers" (e.g., instead of "healthcare," write "AI-based non-invasive glucose monitoring device for diabetes patients").',
  },
  {
    label: "Be complete",
    detail:
      'Answer every section, even if with "Not applicable" (so Assesme AI knows what\'s missing).',
  },
  {
    label: "Be factual",
    detail:
      "Numbers, TRL, IP filings, pilot data, ROI estimates — all improve accuracy.",
  },
  {
    label: "Be forward-looking",
    detail: "Share your vision, even if projections are estimates.",
  },
];

export function downloadGuidelinesPDF() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Assesme AI – Input Guideline</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:40px;max-width:780px;margin:0 auto;font-size:13px;line-height:1.7}
  h1{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:4px}
  .subtitle{color:#64748b;font-size:13px;margin-bottom:28px}
  h2{font-size:14px;font-weight:700;color:#1e40af;margin:20px 0 8px;padding-bottom:4px;border-bottom:1.5px solid #bfdbfe}
  ul{padding-left:18px;margin:0}
  li{margin-bottom:4px;color:#334155}
  .tip-box{background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin-top:28px}
  .tip-box h3{font-size:13px;font-weight:700;color:#1e40af;margin-bottom:10px}
  .tip{margin-bottom:6px}
  .tip strong{color:#1e3a8a}
  @media print{body{padding:24px}}
</style>
</head>
<body>
  <h1>Assesme AI – Input Guideline Prompt for Users</h1>
  <p class="subtitle">To get the world's best assessment report, please provide as much detail as possible in your input.<br/>Use the following structure (copy &amp; fill each point).</p>
  ${SECTIONS.map(
    (s) => `
  <h2>${s.title}</h2>
  <ul>${s.items.map((item) => `<li>${item}</li>`).join("")}</ul>`
  ).join("")}
  <div class="tip-box">
    <h3>Guideline for Best Results</h3>
    ${BEST_PRACTICES.map(
      (b) => `<p class="tip"><strong>• ${b.label} →</strong> ${b.detail}</p>`
    ).join("")}
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 400);
}
