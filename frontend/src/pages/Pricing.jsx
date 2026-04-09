import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  Diamond,
  ArrowRight,
  FileText,
  ShoppingCart,
  Mail,
  Star,
  Download,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import CheckoutPage from "../components/CheckoutPage";
import { api } from "../services/api";
import toast from "react-hot-toast";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const PLANS = [
  {
    id: "starter",
    name: "Starter Report",
    badge: null,
    icon: Zap,
    color: "bg-blue-600",
    border: "border-blue-200 dark:border-blue-800",
    priceINR: 290,
    priceUSD: 2.99,
    reportType: "Advanced Report",
    tokens: "7,500",
    cta: "Buy Single Report",
    description: "Perfect to try your first AI assessment.",
    features: [
      "1 × Advanced Report",
      "Executive Summary",
      "TRL Analysis",
      "IP Snapshot",
      "Market Signals",
      "Competitor Overview",
      "PDF Download",
      "AI Auto-Generated",
    ],
    notIncluded: [
      "5-Year ROI Model",
      "Global FTO Report",
      "Funding Strategy",
      "Licensing & Exit Plan",
    ],
  },
  {
    id: "starter-comprehensive",
    name: "Starter Comprehensive",
    badge: null,
    icon: FileText,
    color: "bg-teal-600",
    border: "border-teal-200 dark:border-teal-800",
    priceINR: 390,
    priceUSD: 4.5,
    reportType: "Comprehensive Report",
    tokens: "9,000",
    cta: "Buy Single Report",
    description: "Full depth report for serious validation.",
    features: [
      "1 × Comprehensive Report",
      "Everything in Starter+",
      "5-Year ROI Projections",
      "Global FTO Analysis",
      "Funding Strategy",
      "Licensing & Exit Plan",
      "Implementation Roadmap",
      "Appendices & Data",
    ],
    notIncluded: [],
  },
  {
    id: "advanced",
    name: "Advanced Pack",
    badge: "Most Popular",
    icon: Crown,
    color: "bg-orange-500",
    border: "border-orange-300 dark:border-orange-700",
    priceINR: 799,
    priceUSD: 9.99,
    reportType: "Advanced Report",
    tokens: "7,500",
    cta: "Get Advanced Pack",
    description: "Best value for recurring innovators.",
    features: [
      "Advanced Report Access",
      "Full 24-Feature Analysis",
      "VC-Ready Narrative",
      "SWOT Analysis",
      "Commercialization Paths",
      "Preliminary ROI Model",
      "Regulatory Pathways",
      "Priority Support",
    ],
    notIncluded: [
      "5-Year Global Forecast",
      "Licensing & Exit Plan",
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive Pack",
    badge: "Best Depth",
    icon: Rocket,
    color: "bg-emerald-600",
    border: "border-emerald-200 dark:border-emerald-800",
    priceINR: 999,
    priceUSD: 11.99,
    reportType: "Comprehensive Report",
    tokens: "9,000",
    cta: "Get Comprehensive Pack",
    description: "Full due-diligence for investors & VC decks.",
    features: [
      "Comprehensive Report Access",
      "All 30+ Parameter Analysis",
      "5-Year ROI Projections",
      "Global FTO (US, EU, India, China)",
      "Funding Strategy (VC, Grants, PE)",
      "Licensing & Exit Plan",
      "Implementation Roadmap",
      "Appendices & Market Data",
    ],
    notIncluded: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: null,
    icon: Diamond,
    color: "bg-slate-700",
    border: "border-slate-300 dark:border-slate-600",
    priceINR: null,
    priceUSD: null,
    reportType: "Custom",
    tokens: "Unlimited",
    cta: "Contact Us",
    isContactOnly: true,
    description: "Custom solutions for large organizations.",
    features: [
      "Unlimited Reports",
      "Dedicated Account Manager",
      "Custom Report Templates",
      "Bulk Pricing",
      "API Access",
      "Team Collaboration",
      "White-Label Options",
      "SLA Guarantee",
    ],
    notIncluded: [],
  },
];

const comparisonFeatures = [
  {
    feature: "Executive Summary",
    advanced: { included: true, note: "(Detailed VC-ready)" },
    comprehensive: { included: true, note: "(Investor-grade)" },
  },
  {
    feature: "Problem Statement",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "" },
  },
  {
    feature: "Technical Overview",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "" },
  },
  {
    feature: "TRL Analysis",
    advanced: { included: true, note: "(With data)" },
    comprehensive: { included: true, note: "(Detailed roadmap)" },
  },
  {
    feature: "IP Snapshot",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "(Full claim analysis)" },
  },
  {
    feature: "Market Signals",
    advanced: { included: true, note: "(Segmentation)" },
    comprehensive: { included: true, note: "(Global trends + forecasts)" },
  },
  {
    feature: "Competitor Analysis",
    advanced: { included: true, note: "(SWOT, landscape)" },
    comprehensive: { included: true, note: "(With market share data)" },
  },
  {
    feature: "Commercialization Paths",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "(With financial modeling)" },
  },
  {
    feature: "ROI Forecast",
    advanced: { included: true, note: "(Preliminary)" },
    comprehensive: { included: true, note: "(5-year plan + funding)" },
  },
  {
    feature: "Legal & Regulatory",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "(By jurisdiction)" },
  },
  {
    feature: "PDF Output",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "" },
  },
  {
    feature: "AI Auto-Generated",
    advanced: { included: true, note: "" },
    comprehensive: { included: true, note: "" },
  },
  {
    feature: "Use Cases",
    advanced: { included: true, note: "Incubators, Angel/Seed" },
    comprehensive: { included: true, note: "VC Decks, Govt Grants" },
  },
];

const reportTypes = [
  {
    id: "advanced",
    name: "Advanced Report",
    tokens: "7,500",
    description: "Comprehensive analysis with detailed insights",
    features: [
      "Executive Summary (1–2 line value proposition)",
      "Problem/Opportunity Statement",
      "Technology Overview (core idea, brief features)",
      "Key Benefits (USP)",
      "Applications (primary markets/use cases)",
      "IP Snapshot (status & country)",
      "Next Steps (e.g., pilot studies, further R&D)",
      "Expanded Executive Summary (go/no-go recommendation)",
      "Problem & Solution Fit (with background justification)",
      "Technical Feasibility (prototype status, TRL stage)",
      "IP Summary (landscape & freedom-to-operate overview)",
      "Market Signals (interest letters, pilot test data)",
      "Early Competitors (known tech or patent citations)",
      "Regulatory/Compliance Overview",
      "Risk Summary and Key Questions",
      "Detailed Business Case (narrative for VCs)",
      "Technology Description (core claims, development stage, TRL framework)",
      "Market & Competition (segmentation, SWOT analysis, barriers to entry)",
      "TRL & Technical Challenges (scale-up readiness)",
      "Detailed IP & Legal Status (global patent families, claims, FTO risks)",
      "Regulatory Pathways (e.g., CE, FDA, BIS, AIS)",
      "Commercialization Options (spin-off, licensing, JVs)",
      "Preliminary Financial Estimates (cost vs ROI model)",
      "Summary & Go-to-Market Plan",
    ],
    color: "bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800",
  },
  {
    id: "comprehensive",
    name: "Comprehensive Report",
    tokens: "9,000",
    description: "Premium analysis with AI-driven insights",
    features: [
      "Executive Summary (1–2 line value proposition)",
      "Problem/Opportunity Statement",
      "Technology Overview (core idea, brief features)",
      "Key Benefits (USP)",
      "Applications (primary markets/use cases)",
      "IP Snapshot (status & country)",
      "Next Steps (e.g., pilot studies, further R&D)",
      "Expanded Executive Summary (go/no-go recommendation)",
      "Problem & Solution Fit (with background justification)",
      "Technical Feasibility (prototype status, TRL stage)",
      "IP Summary (landscape & freedom-to-operate overview)",
      "Market Signals (interest letters, pilot test data)",
      "Early Competitors (known tech or patent citations)",
      "Regulatory/Compliance Overview",
      "Risk Summary and Key Questions",
      "Detailed Business Case (narrative for VCs)",
      "Technology Description (core claims, development stage, TRL framework)",
      "Market & Competition (segmentation, SWOT analysis, barriers to entry)",
      "TRL & Technical Challenges (scale-up readiness)",
      "Detailed IP & Legal Status (global patent families, claims, FTO risks)",
      "Regulatory Pathways (e.g., CE, FDA, BIS, AIS)",
      "Commercialization Options (spin-off, licensing, JVs)",
      "Preliminary Financial Estimates (cost vs ROI model)",
      "Summary & Go-to-Market Plan",
      "In-depth IP Claims Analysis (protection scope, robustness)",
      "Global Freedom-to-Operate Report (US, EU, India, China)",
      "Market Analysis (size, trends, addressable market, adoption barriers)",
      "Business Models (licensing, SaaS, product, hybrid)",
      "5-Year ROI & Revenue Projections (unit cost, pricing, TAM/SAM/SOM)",
      "Funding Strategy (grants, accelerators, VC, PE, SBIR)",
      "Licensing & Exit Strategy (terms, IP deal structures)",
      "Team & Strategic Partners Required (talent, advisors)",
      "Implementation Roadmap (milestones, MVP, pilot scaling)",
      "Appendices (patent tables, market research data, technical drawings)",
    ],
    color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800",
  },
];

const SAMPLES = [
  { href: "/assets/pdf/advance-sample.pdf", title: "Advanced Sample", badge: "Advanced", color: "from-teal-500 to-teal-700" },
  { href: "/assets/pdf/comprehensive-sample.pdf", title: "Comprehensive Sample", badge: "Comprehensive", color: "from-emerald-500 to-emerald-700" },
];

export default function Pricing() {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [tokenPackages, setTokenPackages] = useState([]);

  const fetchTokenPackages = async () => {
    try {
      const response = await api.get("/tokens/packages");
      setTokenPackages(response.data);
    } catch {}
  };

  React.useEffect(() => {
    fetchTokenPackages();
  }, []);

  // IST = UTC+5:30 = -330 min offset. getTimezoneOffset() returns negative for ahead-of-UTC zones.
  // This is more reliable than timezone name strings (Asia/Kolkata vs Asia/Calcutta alias).
  const isIndia = new Date().getTimezoneOffset() === -330;

  const PLAN_TO_PKG_TYPE = {
    "starter": "starter",
    "starter-comprehensive": "starter_comp",
    "advanced": "pro",
    "comprehensive": "max",
  };

  const getLivePrice = (planId) => {
    const pkgType = PLAN_TO_PKG_TYPE[planId] ?? null;
    if (!pkgType) return null;
    return tokenPackages.find((p) => p.package_type === pkgType) || null;
  };

  // Returns the single correct price string based on user's region
  // pkg = live DB package (or null for static plans)
  // staticINR/staticUSD = fallback from PLANS array
  // staticTokens = token count for static plans
  const displayPrice = (pkg, staticINR, staticUSD, staticTokens) => {
    const tokens = pkg ? pkg.tokens.toLocaleString() : staticTokens;
    if (isIndia) {
      const inr = pkg ? pkg.price_inr : staticINR;
      return { main: `₹${inr}`, sub: `${tokens} tokens` };
    } else {
      const usd = pkg ? pkg.price_usd : staticUSD;
      return { main: `$${usd}`, sub: `${tokens} tokens` };
    }
  };

  const handleBuy = (plan) => {
    if (plan.isContactOnly) {
      window.location.href = "/contact";
      return;
    }
    if (!user) {
      toast.error("Please log in to purchase");
      window.location.href = "/login";
      return;
    }
    const pkgType = PLAN_TO_PKG_TYPE[plan.id] ?? null;
    const matchedPkg = pkgType ? tokenPackages.find((p) => p.package_type === pkgType) : null;
    if (matchedPkg) {
      setSelectedPackage(matchedPkg);
      setShowCheckout(true);
    } else {
      toast.error("Package not available. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
              Simple, Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Invest in Your{" "}
              <span className="text-blue-400">Innovation's Future</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get AI-powered technology assessment reports. No subscriptions. No free token gimmicks.
              Pay per report, upgrade when you're ready.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Report Plan
              </span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Single reports for first-timers. Packs for serious innovators. Enterprise for institutions.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.badge === "Most Popular";
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`relative bg-white dark:bg-slate-900 rounded-2xl border-2 ${plan.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${isPopular ? "ring-2 ring-orange-400 ring-offset-2 dark:ring-offset-slate-950" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${isPopular ? "bg-orange-500" : "bg-emerald-600"}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-snug">
                      {plan.description}
                    </p>

                    {plan.isContactOnly ? (
                      <div className="mb-4">
                        <div className="text-2xl font-black text-slate-900 dark:text-slate-100">Custom</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contact for pricing</div>
                      </div>
                    ) : (() => {
                        const livePkg = getLivePrice(plan.id);
                        const { main, sub } = displayPrice(
                          livePkg,
                          plan.priceINR,
                          plan.priceUSD,
                          plan.tokens
                        );
                        return (
                          <div className="mb-4">
                            <div className="flex items-end gap-1">
                              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{main}</span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>
                          </div>
                        );
                    })()}
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                      {plan.notIncluded.map((f, i) => (
                        <li key={`no-${i}`} className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-600">
                          <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-6 pb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBuy(plan)}
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        plan.isContactOnly
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          : isPopular
                          ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md btn-glow"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-glow"
                      }`}
                    >
                      {plan.isContactOnly ? (
                        <><Mail className="w-4 h-4" /> Contact Us</>
                      ) : (
                        <><ShoppingCart className="w-4 h-4" /> {plan.cta}</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Download Sample Reports
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              See the quality and depth before you buy.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SAMPLES.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                download
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 flex items-center gap-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                    {s.title}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.badge} — Free download</div>
                </div>
                <Download className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Full Feature{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Comparison
              </span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Compare the depth of our Advanced vs Comprehensive assessments.
            </p>
          </motion.div>

          {/* New Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-16 max-w-5xl mx-auto"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-6 px-6 text-slate-900 dark:text-slate-100 font-bold text-lg min-w-[200px]">
                      Feature
                    </th>
                    <th className="text-center py-6 px-6 min-w-[160px]">
                      <div className="text-orange-600 dark:text-orange-400 font-bold text-lg">Advanced</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1">7,500 tokens</div>
                    </th>
                    <th className="text-center py-6 px-6 min-w-[160px]">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">Comprehensive</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1">9,000 tokens</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 ${
                        idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-900/50"
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-200">
                        {item.feature}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                          {item.advanced.included ? (
                            <Check className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-1" />
                          ) : (
                            <X className="w-6 h-6 text-red-400 mb-1" />
                          )}
                          {item.advanced.note && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                              {item.advanced.note}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                          {item.comprehensive.included ? (
                            <Check className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-1" />
                          ) : (
                            <X className="w-6 h-6 text-red-400 mb-1" />
                          )}
                          {item.comprehensive.note && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                              {item.comprehensive.note}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Detailed View - Open Mode */}
          <div className="max-w-5xl mx-auto space-y-12">
            {reportTypes.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className={`rounded-2xl border ${report.color} overflow-hidden shadow-md`}
              >
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[inherit]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-${idx === 0 ? "orange" : "emerald"}-600 dark:text-${idx === 0 ? "orange" : "emerald"}-400 border-[inherit] bg-white dark:bg-slate-900`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {report.name} Features
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border border-[inherit] text-${idx === 0 ? "orange" : "emerald"}-700 dark:text-${idx === 0 ? "orange" : "emerald"}-300 bg-white dark:bg-slate-900 shadow-sm`}>
                      {report.tokens} Tokens Required
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                    {report.features.map((feat, f_idx) => (
                      <div key={f_idx} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 text-${idx === 0 ? "orange" : "emerald"}-500 dark:text-${idx === 0 ? "orange" : "emerald"}-400 mt-0.5 flex-shrink-0`} />
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-tight">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Not Sure Which Plan to Choose?
            </h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">
              Start with a Starter Report. Upgrade once you see the depth and value of our AI assessments.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-xl transition-all duration-200"
              >
                Talk to Us <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="/reports"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-full transition-colors duration-200"
              >
                Generate Report
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {showCheckout && selectedPackage && (
        <CheckoutPage
          isOpen={showCheckout}
          packageData={selectedPackage}
          onClose={() => { setShowCheckout(false); setSelectedPackage(null); }}
          onSuccess={() => { setShowCheckout(false); setSelectedPackage(null); }}
        />
      )}

      <Footer />
    </div>
  );
}
