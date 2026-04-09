# Assesme — LLM Context

## Application Overview
**Assesme** is an AI-powered Technology Assessment Reports platform for innovators, startups, universities, R&D labs, investors, and government bodies. It helps users validate, protect, and commercialize their innovations via structured, investor-grade assessment reports.

## Core Concept
Users submit a technology idea/concept; the AI engine analyzes it across 30+ parameters and produces a PDF report covering technical feasibility, IP strength, market readiness, commercialization potential, and risk analysis — aligned with WIPO, EPO, NIH, and OECD standards.

## Report Types (Active)
| Type | Tokens Required | Description |
|---|---|---|
| Advanced | 7,500 | Comprehensive analysis — VC-ready, SWOT, ROI model |
| Comprehensive | 9,000 | Full due-diligence — IP claims, 5-yr forecasts, funding strategy |

> **Basic Report (2,500 tokens) has been removed from the UI.** The backend still accepts it, but it is no longer offered to users.

## Pricing (Current — No Free Token Concept)
| Plan | INR | USD | Type | Notes |
|---|---|---|---|---|
| Starter Report | ₹290 | $2.99 | Advanced | Single report |
| Starter Comprehensive | ₹390 | $4.50 | Comprehensive | Single report |
| Advanced Pack | ₹799 | $9.99 | Advanced | Token pack — Most Popular |
| Comprehensive Pack | ₹999 | $11.99 | Comprehensive | Token pack — Best Depth |
| Enterprise | Custom | Custom | — | Contact only |

> **Free Token concept has been removed.** No more "free tokens on signup" messaging.
> Pricing page (`Pricing.jsx`) is now a standalone fully redesigned page — no longer uses `TokenPricingSection`.

## Token Packages (Backend — Internal)
| Package | Type | Notes |
|---|---|---|
| Pro | pro | Teal color theme — maps to Advanced Pack (₹799) |
| Max | max | Emerald color theme — maps to Comprehensive Pack (₹999) |
| Enterprise | enterprise | Contact-only, orange color theme, display only |

> **Starter Pack is removed from backend display.** Filtered client-side.

## Color System
- **Primary**: Blue (trust, professionalism — `blue-600`)
- **Pro/Advanced tier**: Teal (`teal-500/600`)
- **Comprehensive/Max tier**: Emerald (`emerald-500/600`)
- **Enterprise tier**: Orange (`orange-500/600`)
- **Accents/gradients**: Slate, deeper blue (`blue-800/900`) — no indigo, no pink, no purple anywhere in the app
- **Button gradients**: `from-blue-600 to-blue-800` (hover: `to-blue-900`)

## Page Design Standards
- **Hero sections (content pages)**: Dark `bg-slate-900` with `bg-dot-grid` dot pattern + gradient fade at bottom. White text, badge pill above heading.
- **Hero entrance**: Framer Motion `initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}` with `duration: 0.7, ease: [0.22, 1, 0.36, 1]`
- **Card hover**: `whileHover={{ y: -4 }}` + `card-interactive` class (border glow) — no abrupt scale transforms
- **Card grids**: Always use stagger animation via Framer Motion `variants` + `whileInView` with `viewport={{ once: true }}`
- **Section backgrounds alternate**: `bg-white dark:bg-slate-950` ↔ `bg-slate-50 dark:bg-slate-900`
- **No blue gradient body sections** — only the FinalCTA block uses `bg-gradient-to-br from-blue-700 to-blue-900`
- **No animated pulse orbs** — still prohibited
- **Buttons**: Use `btn-glow` CSS class for primary buttons (blue shadow on hover). `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}` on CTAs.
- **AI language**: "AI-Powered" is the product's identity — keep it in labels, headings, and feature names.
- **Dark mode**: Fully supported. Toggle in Header. ThemeContext sets `.dark` on `<html>`. All new components MUST include `dark:` variants.
- **Icon badges**: Use SOLID `bg-X-600 rounded-xl` with white icon inside — NO gradients (`bg-gradient-to-br`) on icon containers.

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, React Hook Form, Lucide icons
- **Backend**: Python (FastAPI), located in `/backend/`
- **Auth**: Custom context (`AuthContext`)
- **API**: Axios via `/services/api.js`

## Key Files
| File | Purpose |
|---|---|
| `frontend/src/components/TokenPricingSection.jsx` | Legacy pricing component — no longer used on main Pricing page |
| `frontend/src/pages/Pricing.jsx` | **Fully redesigned** standalone pricing page — all plans, comparison table, sample downloads |
| `frontend/src/pages/Home.jsx` | Landing page — thin orchestrator, imports all section components |
| `frontend/src/components/home/` | **Home page sections** — each section is a separate component |
| `frontend/src/components/home/HeroSection.jsx` | Hero — "Validate, Protect, Scale" headline, "Trusted by 9,840 Innovators" badge, dual CTAs |
| `frontend/src/components/home/WhyAssesmeSection.jsx` | Why Assesme — 6 feature cards |
| `frontend/src/components/home/WhoCanUseSection.jsx` | Who Can Use Assesme — 6 user type cards |
| `frontend/src/components/home/TheProblemSection.jsx` | Problem section — 3 problem cards + result block |
| `frontend/src/components/home/TheSolutionSection.jsx` | Solution section — 3 solution cards |
| `frontend/src/components/home/HowItWorksSection.jsx` | 3-step process: Submit → Evaluate → Match |
| `frontend/src/components/home/ForInvestorsSection.jsx` | Investor pitch — checklist + investor types card |
| `frontend/src/components/home/ForFoundersSection.jsx` | Founder pitch — checklist + who should apply card |
| `frontend/src/components/home/SampleReportsSection.jsx` | Sample reports download section |
| `frontend/src/components/home/PrototypingHighlightSection.jsx` | Prototyping services teaser |
| `frontend/src/components/home/FinalCTASection.jsx` | Final dual CTA |
| `frontend/src/components/home/ReportGeneratorSection.jsx` | Report generation form (self-contained with auth, API, navigation) |
| `frontend/src/components/QuickInquiryWidget.jsx` | Fixed floating widget — phone, email, **inline contact form** (reason, name, phone, email, message), posts to `/contact` API. Rendered globally via `RootLayout` in App.jsx. |
| `frontend/src/pages/Reports.jsx` | Dashboard — generate + manage reports |
| `frontend/src/pages/About.jsx` | **Fully revamped** — new hero, mission pillars, founder section, report types with pricing |
| `frontend/src/pages/Investors.jsx` | Investor registration + **SVG pie chart** of technology distribution by sector |
| `frontend/src/pages/Technologies.jsx` | Technology submission — improved "Who Should Apply" section |
| `frontend/src/pages/Prototype.jsx` | Improved process steps + improved showcase section |
| `frontend/src/pages/Experts.jsx` | **Join as Expert** button now scrolls to `#join-form` (bottom form) |
| `frontend/src/components/Header.jsx` | Navigation — token balance, dark mode toggle, active indicator |
| `frontend/src/components/FormFields.jsx` | Shared form fields with dark mode support |
| `frontend/src/contexts/ThemeContext.jsx` | Light/dark mode context with localStorage persistence |
| `frontend/src/components/CheckoutPage.jsx` | Payment flow |
| `backend/app/` | FastAPI routes, models, report generation |
| `backend/app/api/routes/onboarding.py` | Investor, Technology, Prototype form submission endpoints + stats |
| `backend/app/models/onboarding.py` | Beanie ODM models for all 3 onboarding types |
| `backend/app/services/email_service.py` | Confirmation emails for all 3 onboarding forms |

## Business Rules
- **No free tokens** — free token concept completely removed from UI
- Minimum purchase: Starter Report (₹290 / $2.99) for a single Advanced Report
- Token balance shown in header and reports page (for users who purchased token packs)
- Enterprise tier is contact-only (routes to `/contact`)
- Reports take 12–15 minutes to generate

## Key UX Changes (Latest Batch)
| Page | Change |
|---|---|
| Home | `ReportGeneratorSection` is now position #2 (right after Hero) — report generation is first priority |
| Home Hero | Primary CTA → "Generate Your Report" → `/reports`; Secondary → "View Pricing" → `/pricing` |
| Home Hero | **"Validate, Protect, and Scale Your Innovation with Confidence & Assurance"** headline; "Trusted by 9,840 Innovators" badge |
| Home | WhyAssesme + WhoCanUse sections present; SampleReports section; all icon containers use solid colors (no gradients) |
| Home | `HowItWorksSection` title renamed → **"How Investor Access & Matching Works"** (badge: "Investor Access") |
| Home | All sections standardized to `py-24` padding — SampleReports and FinalCTA were `py-20`, now `py-24` |
| Pricing | Complete redesign — 5-plan grid: first 4 plans in `sm:grid-cols-2 lg:grid-cols-4`, Enterprise card spans full width (`lg:col-span-4`) with horizontal layout (icon/name/price/CTA left, features grid right), full non-collapsible comparison table, sample report downloads |
| About | Fully revamped — mission pillars, improved founder section, report types with pricing and CTAs; all sections `py-24` |
| Investors | SVG pie chart (static sector data); **5-step wizard form** with progress bar; draft saved to DB after each step; all sections `py-24` |
| Technologies | "Who Should Apply" improved; **5-step wizard form** with progress bar; draft saved to DB after each step |
| Technologies | **New "Submission Guidelines" section** above the form — shows all 6 ELIGIBILITY_ITEMS as visible cards (never hidden) |
| Experts | "Join as Expert" scrolls to `#join-form` (page bottom form) |
| Prototype | "Simple. Structured. Execution-Driven." process section; "What We've Already Built" portfolio with Delivered chips |
| Layout (sidebar) | "Buy Tokens" link fixed: was `/login-pricing` (broken) → now `/pricing` |
| Reports (dashboard) | Full dark mode on all modals, report cards, search/filter, pagination |
| Reports (dashboard) | **Confirmation dialog** before generating — shows report type, tokens required, generation time, and refund warning |
| ReportGeneratorSection | **Confirmation dialog** before generating (same pattern as Reports.jsx) |
| Character Limit | **10,000 char max** enforced on both frontend (all textareas) and backend (`ReportCreate` schema `max_length=10000`) |
| Character Counter | Live character counter shown on report idea textarea (turns red at 90% of limit) |

## Character Limit Rules
- **Report idea/concept**: max 10,000 characters
- Frontend: `maxLength={10000}` on all textarea inputs + live counter display
- Backend: `max_length=10000` in `ReportCreate` Pydantic schema (`backend/app/schemas/report.py`)
- Counter shows `{current} / 10,000` and turns red at ≥ 9,000 chars

## Confirmation Dialog (Report Generation)
Both `ReportGeneratorSection` and `Reports.jsx` modal show a confirmation dialog before submitting:
- Displays: Report Type, Tokens Required, Generation Time (12–15 min)
- Displays current token balance (Reports.jsx only)
- Warning: tokens deducted immediately, no cancellation, auto-refund on failure
- "Back" reopens the form; "Confirm & Generate" proceeds

## Routing (current)
| Path | Page | Notes |
|---|---|---|
| `/` | Home | |
| `/about` | About | |
| `/pricing` | Pricing | Standalone redesigned page |
| `/experts` | Experts | Replaces `/rttp` in navbar. `/rttp` still works as legacy URL. |
| `/investors` | Investors | Form + pie chart of registered technologies by sector |
| `/technologies` | Technologies | IP holder technology submission form |
| `/prototype` | Prototype | Prototype development inquiry form |
| `/contact` | Contact | "Prototyping" added to Reason dropdown |
| `/admin` | Admin | + 3 new tabs: Investors, Technologies, Prototype Inquiries |
| `/rttp` | RTTP | Legacy — kept intact, not linked from nav |

## Navigation Structure
**Top Navbar**: Home | About | Experts | Investors | Technologies | Prototype | Pricing | Contact | Sign In / Get Started / Dashboard
**Footer (Company column)**: Home | About | Pricing | Contact | Careers | Blog | Press Releases
**Footer (Services column)**: AI Reports | Experts | Investors | Submit Technology | Prototype

> Career, Blog, and Press links were removed from the top navbar and placed in the footer Company column.

## Onboarding System
All 3 forms POST to `/onboarding/*`, send confirmation email to the submitter via the existing msg91 email service, and are fully viewable in the Admin panel.

| Form | Endpoint | Admin Tab |
|---|---|---|
| Investor Registration | POST `/onboarding/investors` | "Investors" tab |
| Technology Submission | POST `/onboarding/technologies` | "Technologies" tab |
| Prototype Inquiry | POST `/onboarding/prototype` | "Prototype Inquiries" tab |
| Technology stats | GET `/onboarding/technologies/stats` | Used for pie chart on `/investors` page |

## Draft System (Progressive Save)
Investor and Technology forms save data after **each step** — not just on final submit.

| Action | Endpoint | Storage |
|---|---|---|
| Step 1 Next | `POST /onboarding/investors/draft` | Creates `InvestorDraft` doc, returns `draft_id` |
| Steps 2–4 Next | `PATCH /onboarding/investors/draft/{id}` | Merges step data into existing draft |
| Step 1 Next | `POST /onboarding/technologies/draft` | Creates `TechnologyDraft` doc |
| Steps 2–4 Next | `PATCH /onboarding/technologies/draft/{id}` | Merges step data into existing draft |

- `draft_id` is persisted in **localStorage** (`assesme_investor_draft_id`, `assesme_tech_draft_id`) — survives page refresh
- On successful final submission: localStorage key is cleared
- Draft models: `InvestorDraft`, `TechnologyDraft` in `investor_drafts` / `technology_drafts` MongoDB collections
- Admin view only shows complete submissions (drafts are in separate collections)

## Target Users
Startups & Founders, Universities & Academia, R&D Labs & Corporates, Investors & VCs, Government & Policy Bodies, Incubators & Accelerators, RTTP Professionals
