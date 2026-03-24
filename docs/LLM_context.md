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

## Token Packages (Active)
| Package | Type | Notes |
|---|---|---|
| Pro | pro | Indigo color theme |
| Max | max | Emerald color theme |
| Enterprise | enterprise | Contact-only, orange color theme, display only |

> **Starter Pack has been removed from the UI.** Filtered client-side via `pkg.package_type !== "starter"` in `TokenPricingSection.jsx`.

## Color System
- **Primary**: Blue (trust, professionalism — `blue-600`)
- **Pro/Advanced tier**: Teal (`teal-500/600`) — deliberately chosen for this IP/tech-transfer platform; reads analytical and credible, not AI-generic
- **Comprehensive/Max tier**: Emerald (`emerald-500/600`)
- **Enterprise tier**: Orange (`orange-500/600`)
- **Accents/gradients**: Slate, deeper blue (`blue-800/900`) — no indigo, no pink, no purple anywhere in the app
- **Button gradients**: `from-blue-600 to-blue-800` (hover: `to-blue-900`)

## Page Design Standards
- **Page hero height**: `py-28 md:py-36` for content pages (About, Careers, RTTP, Blog, Press Releases), `py-24 md:py-32` for listing pages, `py-16 md:py-24` for policy pages (Privacy, Terms, Pricing Policy, Refund Policy)
- **Hero background**: `bg-slate-50 border-b border-slate-200` — clean, no gradient, no animated elements
- **No animated pulse orbs** anywhere in the app — unprofessional
- **No `hover:scale-105 transform`** on buttons — use `hover:bg-blue-700` or `hover:opacity-90` only
- **AI language**: "AI-Powered" is the product's identity — keep it in labels, headings, and feature names. What to avoid is AI-*generated-sounding* copy: generic buzzwords, overly enthusiastic filler phrases, and fluffy marketing language that lacks specificity
- **Card hover**: `hover:shadow-md` or `hover:shadow-lg` only — no `transform hover:-translate-y-2`
- **Section backgrounds alternate**: `bg-white` ↔ `bg-slate-50` — no blue gradient sections

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, React Hook Form, Lucide icons
- **Backend**: Python (FastAPI), located in `/backend/`
- **Auth**: Custom context (`AuthContext`)
- **API**: Axios via `/services/api.js`

## Key Files
| File | Purpose |
|---|---|
| `frontend/src/components/TokenPricingSection.jsx` | Pricing page — token packages + report requirements table |
| `frontend/src/pages/Home.jsx` | Landing page — hero, features, report generator, sample downloads |
| `frontend/src/pages/Reports.jsx` | Dashboard — generate + manage reports |
| `frontend/src/pages/Pricing.jsx` | Standalone pricing page |
| `frontend/src/components/Header.jsx` | Navigation — token balance display |
| `frontend/src/components/CheckoutPage.jsx` | Payment flow |
| `backend/app/` | FastAPI routes, models, report generation |

## Business Rules
- Minimum token purchase must cover Advanced (7,500) as the entry-level report
- Token balance shown in header and reports page
- Enterprise tier is contact-only (routes to `/contact`)
- Reports take 12–15 minutes to generate
- Users receive free tokens on signup

## Target Users
Startups & Founders, Universities & Academia, R&D Labs & Corporates, Investors & VCs, Government & Policy Bodies, Incubators & Accelerators, RTTP Professionals
