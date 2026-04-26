import { useState, useEffect, useRef } from "react";
import { useSEO } from "../hooks/useSEO";
import HowItWorksSection from "../components/home/HowItWorksSection";
import PieChart from "../components/PieChart";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Send,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
import { api } from "../services/api";
import toast from "react-hot-toast";
import {
  INVESTOR_TYPE_COLORS,
  INVESTOR_TYPE_DUMMY,
} from "../data/chartData";

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

const WHY_CARDS = [
  {
    icon: Target,
    bg: "bg-blue-600",
    title: "Multi-Layer Technology Filtration",
    desc: "Every startup goes through structured checkpoints: TRL validation, MVP verification, market assessment, and founder credibility analysis.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-teal-600",
    title: "Investor Qualification System",
    desc: "We evaluate financial capacity, investment experience, strategic contribution ability, and engagement intent.",
  },
  {
    icon: Zap,
    bg: "bg-emerald-600",
    title: "Intelligent Matching Engine",
    desc: "Matched based on investment stage, sector alignment, ticket size compatibility, risk appetite, and strategic synergy.",
  },
  {
    icon: BarChart3,
    bg: "bg-amber-500",
    title: "Structured Deal Flow",
    desc: "Scored opportunities with evaluation insights and clear investment readiness indicators. No cold pitches.",
  },
];

const INVESTOR_TYPES = [
  "Angel Investor",
  "Venture Capitalist",
  "Corporate Investor",
  "Family Office",
  "HNI / Individual",
];

const STAGES = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Growth Stage",
  "Any Stage",
];

const TICKET_DISPLAY = [
  "< ₹10 Lakhs",
  "₹10–50 Lakhs",
  "₹50 Lakhs–2 Cr",
  "₹2–10 Cr",
  "₹10 Cr+",
];

const TICKET_MAP = {
  "< ₹10 Lakhs": "< ₹25L",
  "₹10–50 Lakhs": "₹25L – ₹1Cr",
  "₹50 Lakhs–2 Cr": "₹1Cr – ₹5Cr",
  "₹2–10 Cr": "₹5Cr – ₹25Cr",
  "₹10 Cr+": "₹25Cr+",
};

const SECTORS_LIST = [
  "AI/ML",
  "IoT",
  "Healthcare",
  "Deep Tech",
  "EdTech",
  "FinTech",
  "Sustainability",
  "Defence",
  "AgriTech",
  "Women-Based",
  "Social Startups",
  "Others",
];

const GEOGRAPHY_OPTIONS = ["India", "Global", "Specific Region"];

const NUM_INVESTMENTS = ["0–5", "5–20", "20+"];

const YEARS_EXPERIENCE = ["< 2 years", "2–5 years", "5–10 years", "10+ years"];

const BEYOND_FUNDING_OPTIONS = [
  "Mentorship",
  "Strategic Support",
  "Industry Connections",
  "No involvement",
];

const ROI_HORIZON = ["1–3 years", "3–5 years", "5–10 years"];

const ELIGIBILITY_ITEMS = [
  "Minimum annual investment capacity ≥ ₹25 Lakhs",
  "At least 1 prior investment OR strong financial backing proof",
  "Willingness to review evaluated technologies (not raw ideas)",
  "Agrees to platform evaluation framework",
  "Accepts confidentiality & IP protection terms",
];

const WHO_LEFT = [
  "Angel Investors",
  "Venture Capitalists",
  "Family Offices",
  "Corporate Investors",
  "HNI / High-Net-Worth Individuals",
];

const WHO_RIGHT = [
  "Access to filtered technologies",
  "Reduced screening time",
  "Early access to investment-ready innovations",
  "Insights beyond pitch decks",
];

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-slate-300 uppercase tracking-wide">
        {label}
      </h3>
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

const STEPS = [
  { label: "Basic Info", short: "1" },
  { label: "Investment Profile", short: "2" },
  { label: "Experience", short: "3" },
  { label: "Intent", short: "4" },
  { label: "Eligibility", short: "5" },
];

const hasDraftableValues = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.some(hasDraftableValues);
  if (typeof value === "object") return Object.values(value).some(hasDraftableValues);
  return true;
};

const INVESTOR_STEP_DATA = (step, form, selectedSectors, beyondFunding, eligibility, declaration) => {
  if (step === 0) return { full_name: form.full_name, organization: form.organization, investor_type: form.investor_type, email: form.email, phone: form.phone, linkedin: form.linkedin };
  if (step === 1) return { investment_stage: form.investment_stage, ticket_size: form.ticket_size, sectors: selectedSectors, geography_preference: form.geography_preference };
  if (step === 2) return { num_investments: form.num_investments, years_experience: form.years_experience, past_investments_desc: form.past_investments_desc };
  if (step === 3) return { beyond_funding: beyondFunding, roi_horizon: form.roi_horizon, areas_of_interest: form.areas_of_interest };
  if (step === 4) return { eligibility, declaration };
  return { ...form, sectors: selectedSectors, beyond_funding: beyondFunding, eligibility, declaration };
};

const INVESTOR_DRAFT_KEY = "assesme_investor_draft_id";
const CHART_REAL_DATA_MIN = 100;

export default function Investors() {
  useSEO({
    title: "Investor Network for Verified Startups & Technologies | Assessme",
    description: "Join Assessme's investor network to access AI-validated, high-potential technologies and startups. Get curated deal flow with structured insights.",
    keywords: "startup investor platform, angel investor network India, deal flow platform, technology investment opportunities",
  });
  const [investorChartData, setInvestorChartData] = useState(INVESTOR_TYPE_DUMMY);

  useEffect(() => {
    api.get("/onboarding/investors/stats")
      .then(({ data }) => {
        if (data.total >= CHART_REAL_DATA_MIN && data.by_type?.length) {
          const mapped = data.by_type.map((d) => ({
            label: d.type,
            value: d.count,
            color: INVESTOR_TYPE_COLORS[d.type] || "#94a3b8",
          }));
          setInvestorChartData(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const [step, setStep] = useState(0);
  const [draftId, setDraftId] = useState(() => localStorage.getItem(INVESTOR_DRAFT_KEY) || null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    organization: "",
    investor_type: "",
    email: "",
    phone: "",
    linkedin: "",
    investment_stage: "",
    ticket_size: "",
    geography_preference: "",
    num_investments: "",
    years_experience: "",
    past_investments_desc: "",
    roi_horizon: "",
    areas_of_interest: "",
  });

  const [selectedSectors, setSelectedSectors] = useState([]);
  const [beyondFunding, setBeyondFunding] = useState([]);
  const [eligibility, setEligibility] = useState([false, false, false, false, false]);
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState({});
  const lastDraftPayloadRef = useRef("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const toggleSector = (sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector],
    );
    if (errors.sectors) setErrors((p) => ({ ...p, sectors: "" }));
  };

  const toggleBeyondFunding = (item) => {
    setBeyondFunding((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const toggleEligibility = (i) => {
    setEligibility((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
    if (errors.eligibility) setErrors((p) => ({ ...p, eligibility: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.full_name.trim()) e.full_name = "Required";
      if (!form.organization.trim()) e.organization = "Required";
      if (!form.investor_type) e.investor_type = "Required";
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Required";
    }
    if (s === 1) {
      if (!form.investment_stage) e.investment_stage = "Required";
      if (!form.ticket_size) e.ticket_size = "Required";
      if (selectedSectors.length === 0) e.sectors = "Select at least one sector";
    }
    if (s === 4) {
      if (!eligibility.every(Boolean)) e.eligibility = "Please accept all eligibility criteria";
      if (!declaration) e.declaration = "Please accept the declaration to proceed";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveDraft = async (currentStep) => {
    const stepData = INVESTOR_STEP_DATA(
      currentStep,
      form,
      selectedSectors,
      beyondFunding,
      eligibility,
      declaration,
    );
    if (!hasDraftableValues(stepData)) return;

    const payloadSignature = JSON.stringify({
      step_reached: currentStep + 1,
      data: stepData,
    });
    if (payloadSignature === lastDraftPayloadRef.current) return;

    try {
      setIsSavingDraft(true);
      if (!draftId) {
        const res = await api.post("/onboarding/investors/draft", {
          email: form.email || null,
          step_reached: currentStep + 1,
          data: stepData,
        });
        setDraftId(res.data.draft_id);
        localStorage.setItem(INVESTOR_DRAFT_KEY, res.data.draft_id);
        lastDraftPayloadRef.current = payloadSignature;
      } else {
        await api.patch(`/onboarding/investors/draft/${draftId}`, {
          step_reached: currentStep + 1,
          data: stepData,
        });
        lastDraftPayloadRef.current = payloadSignature;
      }
    } catch {
    } finally {
      setIsSavingDraft(false);
    }
  };

  useEffect(() => {
    if (submitted) return;
    const timer = setTimeout(() => {
      saveDraft(step);
    }, 1200);
    return () => clearTimeout(timer);
  }, [form, selectedSectors, beyondFunding, eligibility, declaration, step, draftId, submitted]);

  const handleNext = async () => {
    if (!validateStep(step)) return;
    await saveDraft(step);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    try {
      await api.post("/onboarding/investors", {
        full_name: form.full_name.trim(),
        organization: form.organization.trim(),
        designation: form.investor_type,
        email: form.email.trim(),
        phone: form.phone.trim(),
        linkedin: form.linkedin.trim() || null,
        country: "India",
        investor_type: form.investor_type,
        investment_focus: "Other",
        investment_stage: form.investment_stage,
        ticket_size: TICKET_MAP[form.ticket_size],
        sectors: selectedSectors,
        geography_preference: form.geography_preference || null,
        num_investments: form.num_investments || null,
        years_experience: form.years_experience || null,
        past_investments_desc: form.past_investments_desc.trim() || null,
        beyond_funding: beyondFunding,
        roi_horizon: form.roi_horizon || null,
        areas_of_interest: form.areas_of_interest.trim() || null,
        eligibility_confirmations: eligibility,
        declaration_confirmed: declaration,
        message: null,
      });

      setSubmitted(true);
      localStorage.removeItem(INVESTOR_DRAFT_KEY);
      toast.success("Registration submitted successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
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
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 ">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Investor Network
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Invest in Verified Innovation.{" "}
              <span className="text-blue-400">Not Noise.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Access a curated pipeline of high-potential technologies and
              startups filtered, evaluated, and matched to your investment
              strategy.
            </p>
            <motion.a
              href="#register"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
            >
              Join as a Verified Investor <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Why Invest Through Assessme
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              A structured, transparent process for discovering and investing in
              validated innovations.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {WHY_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive"
                >
                  <div
                    className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <HowItWorksSection />

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Who Should Join as an Investor
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-xl mx-auto">
              This platform is built for serious investors looking for curated,
              evaluated deal flow.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <h3 className="text-base font-semibold text-neutral-900 dark:text-slate-100 mb-5">
                Investor Types
              </h3>
              <ul className="space-y-3">
                {WHO_LEFT.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-slate-300 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <h3 className="text-base font-semibold text-neutral-900 dark:text-slate-100 mb-5">
                What You Get
              </h3>
              <ul className="space-y-3">
                {WHO_RIGHT.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-slate-300 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-slate-100 mb-3">
              Investor Type Distribution
            </h2>
            <p className="text-neutral-500 dark:text-slate-400 text-sm">
              Breakdown of verified investors registered on the platform
            </p>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PieChart data={investorChartData} centerLabel="Investors" centerSub="by type" />
          </motion.div>
        </div>
      </section>

      <section id="register" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Investor Registration
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400">
              Complete the form below to join our verified investor network.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-100 mb-2">
                Registration Received
              </h3>
              <p className="text-neutral-600 dark:text-slate-400">
                Thank you for registering. A confirmation has been sent to your email. Our team will review your profile and be in touch shortly.
              </p>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
              {/* Step Progress Bar */}
              <div className="border-b border-slate-100 dark:border-slate-800 px-8 pt-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}>
                          {i < step ? <CheckCircle className="h-4 w-4" /> : s.short}
                        </div>
                        <span className={`text-xs mt-1 font-medium hidden sm:block whitespace-nowrap transition-colors duration-300 ${i === step ? "text-blue-600 dark:text-blue-400" : i < step ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-300 ${i < step ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 min-h-[320px]"
                >
                  {step === 0 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Basic Information</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Tell us who you are.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} placeholder="Your full name" />
                        <Field label="Organization / Fund" name="organization" value={form.organization} onChange={handleChange} error={errors.organization} placeholder="Organization or fund name" />
                        <SelectField label="Investor Type" name="investor_type" value={form.investor_type} onChange={handleChange} error={errors.investor_type} options={INVESTOR_TYPES} placeholder="Select type" />
                        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
                        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
                        <Field label="LinkedIn or Website" name="linkedin" value={form.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="https://linkedin.com/in/yourprofile" optional />
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Investment Profile</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Tell us about your investment focus and capacity.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField label="Investment Stage" name="investment_stage" value={form.investment_stage} onChange={handleChange} error={errors.investment_stage} options={STAGES} placeholder="Select stage" />
                        <SelectField label="Ticket Size" name="ticket_size" value={form.ticket_size} onChange={handleChange} error={errors.ticket_size} options={TICKET_DISPLAY} placeholder="Select range" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-2">
                          Sectors of Interest <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SECTORS_LIST.map((sector) => {
                            const selected = selectedSectors.includes(sector);
                            return (
                              <button key={sector} type="button" onClick={() => toggleSector(sector)}
                                className={selected ? "border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg px-3 py-1.5 text-sm transition-all duration-150" : "border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg px-3 py-1.5 text-sm transition-all duration-150"}
                              >
                                {sector}
                              </button>
                            );
                          })}
                        </div>
                        {errors.sectors && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.sectors}</p>}
                      </div>
                      <SelectField label="Geography Preference" name="geography_preference" value={form.geography_preference} onChange={handleChange} options={GEOGRAPHY_OPTIONS} placeholder="Select preference (optional)" />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Experience & Credibility</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Help us understand your investment background.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField label="Number of Prior Investments" name="num_investments" value={form.num_investments} onChange={handleChange} options={NUM_INVESTMENTS} placeholder="Select range (optional)" />
                        <SelectField label="Years of Investment Experience" name="years_experience" value={form.years_experience} onChange={handleChange} options={YEARS_EXPERIENCE} placeholder="Select range (optional)" />
                      </div>
                      <TextareaField label="Portfolio Description" name="past_investments_desc" value={form.past_investments_desc} onChange={handleChange} placeholder="Portfolio links or brief description of past investments" rows={3} optional />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Investment Intent</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">What are you looking for beyond capital deployment?</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-2">
                          Involvement Beyond Funding <span className="text-neutral-400 dark:text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {BEYOND_FUNDING_OPTIONS.map((item) => {
                            const selected = beyondFunding.includes(item);
                            return (
                              <button key={item} type="button" onClick={() => toggleBeyondFunding(item)}
                                className={selected ? "border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg px-3 py-1.5 text-sm transition-all duration-150" : "border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg px-3 py-1.5 text-sm transition-all duration-150"}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <SelectField label="Expected ROI Horizon" name="roi_horizon" value={form.roi_horizon} onChange={handleChange} options={ROI_HORIZON} placeholder="Select horizon (optional)" />
                      <TextareaField label="Areas of Interest" name="areas_of_interest" value={form.areas_of_interest} onChange={handleChange} placeholder="Specific technologies, sectors, or problem areas you want to invest in" rows={3} optional />
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Eligibility & Declaration</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Please confirm the following before submitting.</p>
                      </div>
                      <div className="space-y-3">
                        {ELIGIBILITY_ITEMS.map((item, i) => (
                          <label key={i} className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" checked={eligibility[i]} onChange={() => toggleEligibility(i)} className="w-4 h-4 rounded border-slate-300 text-blue-600 mt-0.5 cursor-pointer accent-blue-600" />
                            <span className="text-sm text-neutral-700 dark:text-slate-300 group-hover:text-neutral-900 dark:group-hover:text-slate-100 transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                      {errors.eligibility && <p className="text-xs text-red-600 dark:text-red-400">{errors.eligibility}</p>}
                      <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={declaration} onChange={() => { setDeclaration((p) => !p); if (errors.declaration) setErrors((p) => ({ ...p, declaration: "" })); }} className="w-4 h-4 rounded border-slate-300 text-blue-600 mt-0.5 cursor-pointer accent-blue-600" />
                          <span className="text-sm text-neutral-700 dark:text-slate-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-slate-100 transition-colors">
                            I agree to be evaluated and approved before onboarding. I confirm the information provided is accurate.
                          </span>
                        </label>
                        {errors.declaration && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.declaration}</p>}
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    ← Back
                  </button>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Step {step + 1} of {STEPS.length}
                  </span>
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSavingDraft}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md btn-glow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSavingDraft ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> : null}
                      {isSavingDraft ? "Saving..." : "Continue →"}
                    </button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-md btn-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
