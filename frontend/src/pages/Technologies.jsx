import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Send,
  ArrowRight,
  ClipboardCheck,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
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

const WHY_CARDS = [
  {
    icon: ClipboardCheck,
    bg: "bg-blue-600",
    title: "Structured Evaluation",
    desc: "TRL-based assessment covering technology readiness, prototype status, business viability, and founder commitment.",
  },
  {
    icon: Shield,
    bg: "bg-teal-600",
    title: "Validation Before Exposure",
    desc: "You don't get listed until you're ready. Investors trust the platform, which increases your credibility.",
  },
  {
    icon: Users,
    bg: "bg-emerald-600",
    title: "Relevant Investor Access",
    desc: "Stage matching, sector alignment, and investment compatibility ensure you meet investors who actually care about your domain.",
  },
  {
    icon: TrendingUp,
    bg: "bg-amber-500",
    title: "Better Funding Probability",
    desc: "Quality attention over quantity views. Evaluated technologies have significantly higher chances of meaningful funding.",
  },
];

const DOMAINS = [
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

const ELIGIBILITY_ITEMS = [
  "I have completed at least POC or Prototype",
  "My solution solves a clearly defined problem",
  "I have a working model or validation",
  "I am actively building this (not just idea stage)",
  "I am open to evaluation before investor access",
  "I understand that only evaluated technologies are presented to investors",
];

const trlMap = {
  "TRL 1–3 – Basic Research": "TRL 3 - Proof of Concept",
  "TRL 4–5 – Lab Validation": "TRL 4 - Lab Validation",
  "TRL 6–7 – Prototype/Pilot": "TRL 6 - Prototype Demo",
  "TRL 8–9 – Market Ready": "TRL 8 - System Complete",
};

const fundingMap = {
  "< ₹10 Lakhs": "< ₹25L",
  "₹10–50 Lakhs": "₹25L – ₹1Cr",
  "₹50 Lakhs–2 Cr": "₹1Cr – ₹5Cr",
  "₹2–10 Cr": "₹5Cr – ₹25Cr",
  "₹10 Cr+": "₹25Cr+",
};


const TECH_STEPS = [
  { label: "About You", short: "1" },
  { label: "Your Technology", short: "2" },
  { label: "Development", short: "3" },
  { label: "IP & Funding", short: "4" },
  { label: "Eligibility", short: "5" },
];

const TECH_STEP_DATA = (step, form, selectedDomains) => {
  if (step === 0) return { inventor_name: form.inventor_name, co_founder: form.co_founder, email: form.email, phone: form.phone, linkedin: form.linkedin, organization: form.organization, website: form.website };
  if (step === 1) return { technology_title: form.technology_title, tech_type: form.tech_type, domains: selectedDomains, description: form.description, problem_solved: form.problem_solved, unique_value: form.unique_value };
  if (step === 2) return { current_stage: form.current_stage, trl_level: form.trl_level, working_prototype: form.working_prototype, tested_with_users: form.tested_with_users, pilot_done: form.pilot_done, pilot_details: form.pilot_details, revenue_status: form.revenue_status, business_model_defined: form.business_model_defined, target_market_size: form.target_market_size };
  if (step === 3) return { patent_filed: form.patent_filed, ip_status: form.ip_status, proprietary_tech: form.proprietary_tech, competitive_advantage: form.competitive_advantage, funding_required: form.funding_required, equity_offered: form.equity_offered, use_of_funds_desc: form.use_of_funds_desc, seeking: form.seeking, full_time_founder: form.full_time_founder, experience_level: form.experience_level };
  return {};
};

const TECH_DRAFT_KEY = "assesme_tech_draft_id";

export default function Technologies() {
  const [step, setStep] = useState(0);
  const [draftId, setDraftId] = useState(() => localStorage.getItem(TECH_DRAFT_KEY) || null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    technology_title: "",
    inventor_name: "",
    co_founder: "",
    organization: "",
    email: "",
    phone: "",
    linkedin: "",
    website: "",
    description: "",
    problem_solved: "",
    unique_value: "",
    seeking: "",
    tech_type: "",
    trl_level: "",
    ip_status: "",
    current_stage: "",
    working_prototype: "",
    tested_with_users: "",
    pilot_done: "",
    pilot_details: "",
    revenue_status: "",
    business_model_defined: "",
    target_market_size: "",
    patent_filed: "",
    proprietary_tech: "",
    competitive_advantage: "",
    funding_required: "",
    equity_offered: "",
    use_of_funds_desc: "",
    full_time_founder: "",
    experience_level: "",
  });
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [eligibility, setEligibility] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const toggleDomain = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
    if (errors.domains) setErrors((p) => ({ ...p, domains: "" }));
  };

  const toggleEligibility = (i) => {
    setEligibility((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.inventor_name.trim()) e.inventor_name = "Required";
      if (!form.organization.trim()) e.organization = "Required";
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Required";
      if (!form.linkedin.trim()) e.linkedin = "Required";
    }
    if (s === 1) {
      if (!form.technology_title.trim()) e.technology_title = "Required";
      if (!form.tech_type) e.tech_type = "Required";
      if (selectedDomains.length === 0) e.domains = "Select at least one domain";
      if (!form.description.trim()) e.description = "Required";
      if (!form.problem_solved.trim()) e.problem_solved = "Required";
      if (!form.unique_value.trim()) e.unique_value = "Required";
    }
    if (s === 2) {
      if (!form.current_stage) e.current_stage = "Required";
      if (!form.trl_level) e.trl_level = "Required";
      if (!form.working_prototype) e.working_prototype = "Required";
      if (!form.tested_with_users) e.tested_with_users = "Required";
      if (!form.pilot_done) e.pilot_done = "Required";
      if (!form.revenue_status) e.revenue_status = "Required";
      if (!form.business_model_defined) e.business_model_defined = "Required";
    }
    if (s === 3) {
      if (!form.patent_filed) e.patent_filed = "Required";
      if (!form.ip_status) e.ip_status = "Required";
      if (!form.proprietary_tech) e.proprietary_tech = "Required";
      if (!form.competitive_advantage.trim()) e.competitive_advantage = "Required";
      if (!form.funding_required) e.funding_required = "Required";
      if (!form.seeking.trim()) e.seeking = "Required";
      if (!form.full_time_founder) e.full_time_founder = "Required";
      if (!form.experience_level) e.experience_level = "Required";
    }
    if (s === 4) {
      if (!eligibility.every(Boolean)) e.eligibility = "Please confirm all eligibility criteria";
      if (!declaration) e.declaration = "Please confirm the declaration";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveDraft = async (currentStep) => {
    const stepData = TECH_STEP_DATA(currentStep, form, selectedDomains);
    try {
      setIsSavingDraft(true);
      if (!draftId) {
        const res = await api.post("/onboarding/technologies/draft", {
          email: form.email || null,
          step_reached: currentStep + 1,
          data: stepData,
        });
        setDraftId(res.data.draft_id);
        localStorage.setItem(TECH_DRAFT_KEY, res.data.draft_id);
      } else {
        await api.patch(`/onboarding/technologies/draft/${draftId}`, {
          step_reached: currentStep + 1,
          data: stepData,
        });
      }
    } catch {
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;
    await saveDraft(step);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    try {
      const additionalInfo = [
        form.linkedin ? `LinkedIn: ${form.linkedin}` : "",
        form.website ? `Website: ${form.website}` : "",
        form.co_founder ? `Co-founder: ${form.co_founder}` : "",
        form.tech_type ? `Type: ${form.tech_type}` : "",
        selectedDomains.length > 0
          ? `Domains: ${selectedDomains.join(", ")}`
          : "",
        form.current_stage ? `Stage: ${form.current_stage}` : "",
        form.working_prototype
          ? `Working Prototype: ${form.working_prototype}`
          : "",
        form.tested_with_users
          ? `Tested with users: ${form.tested_with_users}`
          : "",
        form.pilot_done ? `Pilot done: ${form.pilot_done}` : "",
        form.pilot_details ? `Pilot details: ${form.pilot_details}` : "",
        form.revenue_status ? `Revenue: ${form.revenue_status}` : "",
        form.business_model_defined
          ? `Business model: ${form.business_model_defined}`
          : "",
        form.target_market_size
          ? `Market size: ${form.target_market_size}`
          : "",
        form.patent_filed ? `Patent filed: ${form.patent_filed}` : "",
        form.proprietary_tech
          ? `Proprietary tech: ${form.proprietary_tech}`
          : "",
        form.equity_offered ? `Equity offered: ${form.equity_offered}%` : "",
        form.use_of_funds_desc ? `Use of funds: ${form.use_of_funds_desc}` : "",
        form.full_time_founder ? `Full-time: ${form.full_time_founder}` : "",
        form.experience_level ? `Experience: ${form.experience_level}` : "",
        form.competitive_advantage
          ? `Competitive advantage: ${form.competitive_advantage}`
          : "",
        form.funding_required
          ? `Funding required: ${fundingMap[form.funding_required] || form.funding_required}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");

      await api.post("/onboarding/technologies", {
        technology_title: form.technology_title,
        inventor_name: form.inventor_name,
        organization: form.organization,
        email: form.email,
        phone: form.phone,
        country: "India",
        category: "Other",
        ip_status: form.ip_status || "No IP Protection",
        trl_level: trlMap[form.trl_level] || form.trl_level,
        description: form.description,
        problem_solved: form.problem_solved,
        unique_value: form.unique_value,
        seeking: form.seeking || "Investment",
        additional_info: additionalInfo.slice(0, 2000),
      });
      setSubmitted(true);
      localStorage.removeItem(TECH_DRAFT_KEY);
      toast.success("Technology submitted successfully!");
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
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Inventor and Innovator
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Get Funded But Only If You're Ready.
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              We connect serious Inventor and Innovator with real investors
              through validation, not visibility.
            </p>
            <motion.a
              href="#submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
            >
              Submit Your Technology <ArrowRight className="h-4 w-4" />
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
              What We Do For You
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              We act as your evaluation partner, validation layer, and investor
              bridge.
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

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Who Should{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Apply
              </span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              We work with serious innovators who are ready for evaluation — not just exploration.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div
              variants={fadeUp}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-slate-100">
                  You Are a Strong Fit If:
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "You have completed at least a POC, prototype, or MVP",
                  "Your solution addresses a clearly defined, validated problem",
                  "You are building this full-time with serious commitment",
                  "You have at least basic IP awareness or filed a patent",
                  "You are open to structured evaluation before investor access",
                  "You understand that quality exposure beats mass visibility",
                  "You seek investment, co-development, or licensing partners",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 dark:text-slate-300 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-red-200 dark:border-red-900/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <XCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-slate-100">
                  Not Yet Ready If:
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "You only have an idea without any validation or prototype",
                  "No working model, POC, or demonstrable output exists",
                  "Building part-time with no clear commitment to scale",
                  "You have not thought through your business model",
                  "Expecting investor access before completing evaluation",
                  "Solution is a pure concept with no technical development",
                  "No clarity on IP status, competitive differentiator, or market",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 dark:text-slate-300 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-8 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-neutral-700 dark:text-slate-300 text-sm leading-relaxed">
              <span className="font-semibold text-blue-700 dark:text-blue-400">Not quite there yet?</span>{" "}
              That's okay. Use our{" "}
              <a href="/pricing" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800">
                AI Report
              </a>{" "}
              to validate your technology first — then come back when you're ready.
            </p>
          </motion.div>
        </div>
      </section>


      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
              Before You Apply
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Submission{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Guidelines
              </span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              All applicants must meet these criteria before submitting. Read carefully before proceeding.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {ELIGIBILITY_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
              >
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-neutral-700 dark:text-slate-300 leading-relaxed font-medium">{item}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-neutral-700 dark:text-slate-300 text-sm leading-relaxed">
              <span className="font-semibold text-blue-700 dark:text-blue-400">All guidelines must be confirmed</span>{" "}
              in Step 5 of the application form. Incomplete or inaccurate applications will not proceed to investor access.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="submit" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Technology Submission
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400">
              Complete the form below to apply for evaluation and investor
              access.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-12 text-center"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 200 }}>
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-100 mb-2">Submission Received</h3>
              <p className="text-neutral-600 dark:text-slate-400">
                Thank you for submitting your technology. Our team will evaluate your application and reach out within 48 hours.
              </p>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
              {/* Step Progress Bar */}
              <div className="border-b border-slate-100 dark:border-slate-800 px-8 pt-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  {TECH_STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"}`}>
                          {i < step ? <CheckCircle className="h-4 w-4" /> : s.short}
                        </div>
                        <span className={`text-xs mt-1 font-medium hidden sm:block whitespace-nowrap transition-colors duration-300 ${i === step ? "text-blue-600 dark:text-blue-400" : i < step ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                          {s.label}
                        </span>
                      </div>
                      {i < TECH_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-300 ${i < step ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-600"}`} />
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
                  transition={{ duration: 0.3 }}
                  className="space-y-6 min-h-[340px]"
                >
                  {step === 0 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">About You</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Basic details about you and your organization.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Founder Name" name="inventor_name" value={form.inventor_name} onChange={handleChange} error={errors.inventor_name} placeholder="Your full name" required />
                        <Field label="Co-founder(s)" name="co_founder" value={form.co_founder} onChange={handleChange} placeholder="Co-founder names (optional)" />
                        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" required />
                        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" required />
                        <Field label="LinkedIn Profile" name="linkedin" value={form.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="https://linkedin.com/in/yourprofile" required />
                        <Field label="Organization / Institution" name="organization" value={form.organization} onChange={handleChange} error={errors.organization} placeholder="Company, university, or institution" required />
                        <Field label="Website / Product Link" name="website" value={form.website} onChange={handleChange} placeholder="https://yourproduct.com (optional)" />
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Your Technology</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Tell us what you've built and what problem it solves.</p>
                      </div>
                      <Field label="Startup / Technology Name" name="technology_title" value={form.technology_title} onChange={handleChange} error={errors.technology_title} placeholder="Name of your startup or technology" required />
                      <SelectField label="Technology Type" name="tech_type" value={form.tech_type} onChange={handleChange} error={errors.tech_type} options={["Startup", "Patent-based", "Research", "Prototype"]} placeholder="Select type" />
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-2">
                          Domain(s) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DOMAINS.map((domain) => (
                            <button key={domain} type="button" onClick={() => toggleDomain(domain)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 ${selectedDomains.includes(domain) ? "bg-blue-600 border-blue-600 text-white" : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-neutral-700 dark:text-slate-300 hover:border-blue-400"}`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>
                        {errors.domains && <p className="mt-1.5 text-xs text-red-500">{errors.domains}</p>}
                      </div>
                      <TextareaField label="One-line Description (max 150 chars)" name="description" value={form.description} onChange={handleChange} error={errors.description} placeholder="Briefly describe your technology in one line" rows={2} maxLength={150} />
                      <TextareaField label="Problem Statement" name="problem_solved" value={form.problem_solved} onChange={handleChange} error={errors.problem_solved} placeholder="What problem are you solving?" rows={3} />
                      <TextareaField label="Your Solution" name="unique_value" value={form.unique_value} onChange={handleChange} error={errors.unique_value} placeholder="How does your solution address the problem?" rows={3} />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Development & Traction</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Where are you in the build process? What's been validated?</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField label="Current Stage" name="current_stage" value={form.current_stage} onChange={handleChange} error={errors.current_stage} options={["Idea Stage", "Proof of Concept (POC)", "Prototype Ready", "MVP Developed", "Early Revenue", "Scaling Stage"]} placeholder="Select your current stage" />
                        <SelectField label="TRL Level" name="trl_level" value={form.trl_level} onChange={handleChange} error={errors.trl_level} options={["TRL 1–3 – Basic Research", "TRL 4–5 – Lab Validation", "TRL 6–7 – Prototype/Pilot", "TRL 8–9 – Market Ready"]} placeholder="Select TRL level" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">We strongly prefer applications from TRL 4+ (Lab Validation and above).</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <SelectField label="Working Prototype?" name="working_prototype" value={form.working_prototype} onChange={handleChange} error={errors.working_prototype} options={["Yes", "No"]} placeholder="Select" />
                        <SelectField label="Tested with Users?" name="tested_with_users" value={form.tested_with_users} onChange={handleChange} error={errors.tested_with_users} options={["Yes", "No"]} placeholder="Select" />
                        <SelectField label="Pilot Done?" name="pilot_done" value={form.pilot_done} onChange={handleChange} error={errors.pilot_done} options={["Yes", "No"]} placeholder="Select" />
                      </div>
                      <TextareaField label="Pilot Details (if yes)" name="pilot_details" value={form.pilot_details} onChange={handleChange} placeholder="Describe your pilot — where, when, outcomes" rows={2} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <SelectField label="Revenue Status" name="revenue_status" value={form.revenue_status} onChange={handleChange} error={errors.revenue_status} options={["No Revenue", "Pre-revenue", "Revenue Generating"]} placeholder="Select" />
                        <SelectField label="Business Model Defined?" name="business_model_defined" value={form.business_model_defined} onChange={handleChange} error={errors.business_model_defined} options={["Yes", "No"]} placeholder="Select" />
                        <SelectField label="Target Market Size" name="target_market_size" value={form.target_market_size} onChange={handleChange} options={["< ₹100 Cr", "₹100–1000 Cr", "₹1000 Cr+"]} placeholder="Select (optional)" />
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">IP & Funding</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Tell us about your intellectual property and funding needs.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <SelectField label="Patent Filed?" name="patent_filed" value={form.patent_filed} onChange={handleChange} error={errors.patent_filed} options={["Yes", "No"]} placeholder="Select" />
                        <SelectField label="IP Status" name="ip_status" value={form.ip_status} onChange={handleChange} error={errors.ip_status} options={["Patent Filed", "Patent Granted", "Provisional Application", "Trade Secret", "Copyright", "No IP Protection"]} placeholder="Select IP status" />
                        <SelectField label="Proprietary Tech?" name="proprietary_tech" value={form.proprietary_tech} onChange={handleChange} error={errors.proprietary_tech} options={["Yes", "No"]} placeholder="Select" />
                      </div>
                      <TextareaField label="Competitive Advantage / Unique Edge" name="competitive_advantage" value={form.competitive_advantage} onChange={handleChange} error={errors.competitive_advantage} placeholder="What makes you hard to replicate?" rows={2} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField label="Funding Required" name="funding_required" value={form.funding_required} onChange={handleChange} error={errors.funding_required} options={["< ₹10 Lakhs", "₹10–50 Lakhs", "₹50 Lakhs–2 Cr", "₹2–10 Cr", "₹10 Cr+"]} placeholder="Select funding range" />
                        <Field label="Equity Offered (%)" name="equity_offered" value={form.equity_offered} onChange={handleChange} placeholder="e.g. 10% (optional)" />
                      </div>
                      <TextareaField label="Use of Funds" name="use_of_funds_desc" value={form.use_of_funds_desc} onChange={handleChange} placeholder="How will you use the funds? Product / Marketing / Hiring / Scaling (optional)" rows={2} />
                      <Field label="What are you seeking?" name="seeking" value={form.seeking} onChange={handleChange} error={errors.seeking} placeholder="e.g. Investment, Co-development, Licensing" required />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField label="Are you a Full-Time Founder?" name="full_time_founder" value={form.full_time_founder} onChange={handleChange} error={errors.full_time_founder} options={["Yes - Full Time", "No - Part Time"]} placeholder="Select" />
                        <SelectField label="Experience Level" name="experience_level" value={form.experience_level} onChange={handleChange} error={errors.experience_level} options={["None – First Startup", "Some – 1-2 Prior Ventures", "Strong – Serial Entrepreneur"]} placeholder="Select experience" />
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-slate-200 mb-1">Eligibility & Declaration</h3>
                        <p className="text-sm text-neutral-500 dark:text-slate-400">Please confirm the following before submitting your application.</p>
                      </div>
                      <div className="space-y-3">
                        {ELIGIBILITY_ITEMS.map((item, i) => (
                          <label key={i} className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" checked={eligibility[i]} onChange={() => toggleEligibility(i)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-700 mt-0.5" />
                            <span className="text-sm text-neutral-700 dark:text-slate-300 group-hover:text-neutral-900 dark:group-hover:text-slate-100 transition-colors">{item}</span>
                          </label>
                        ))}
                        {errors.eligibility && <p className="text-xs text-red-500 mt-1">{errors.eligibility}</p>}
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={declaration} onChange={() => { setDeclaration((v) => !v); if (errors.declaration) setErrors((p) => ({ ...p, declaration: "" })); }} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-700 mt-0.5" />
                          <span className="text-sm text-neutral-700 dark:text-slate-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-slate-100 transition-colors">
                            I agree to be evaluated and approved before onboarding. I confirm the information provided is accurate.
                          </span>
                        </label>
                        {errors.declaration && <p className="text-xs text-red-500 mt-2">{errors.declaration}</p>}
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    ← Back
                  </button>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Step {step + 1} of {TECH_STEPS.length}</span>
                  {step < TECH_STEPS.length - 1 ? (
                    <button type="button" onClick={handleNext} disabled={isSavingDraft} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md btn-glow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSavingDraft ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> : null}
                      {isSavingDraft ? "Saving..." : "Continue →"}
                    </button>
                  ) : (
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-md btn-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                      {isSubmitting ? "Submitting..." : "Submit Technology"}
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
