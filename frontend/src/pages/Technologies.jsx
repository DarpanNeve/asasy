import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Send,
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  Lightbulb,
  Globe,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
import { api } from "../services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  "AgriTech", "BioTech", "CleanTech", "DeepTech", "EdTech",
  "HealthTech", "InfoTech", "MedTech", "Manufacturing", "Other",
];

const IP_STATUSES = [
  "Patent Filed", "Patent Granted", "Provisional Application",
  "Trade Secret", "Copyright", "No IP Protection",
];

const TRL_LEVELS = [
  "TRL 1 - Basic Research",
  "TRL 2 - Technology Concept",
  "TRL 3 - Proof of Concept",
  "TRL 4 - Lab Validation",
  "TRL 5 - Relevant Environment",
  "TRL 6 - Prototype Demo",
  "TRL 7 - System Prototype",
  "TRL 8 - System Complete",
  "TRL 9 - Proven System",
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Technologies() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    technology_title: "", inventor_name: "", organization: "",
    email: "", phone: "", country: "", category: "", ip_status: "",
    trl_level: "", description: "", problem_solved: "", unique_value: "",
    seeking: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.technology_title) e.technology_title = "Required";
    if (!form.inventor_name) e.inventor_name = "Required";
    if (!form.organization) e.organization = "Required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.country) e.country = "Required";
    if (!form.category) e.category = "Required";
    if (!form.ip_status) e.ip_status = "Required";
    if (!form.trl_level) e.trl_level = "Required";
    if (!form.description || form.description.length < 20) e.description = "Minimum 20 characters";
    if (!form.problem_solved || form.problem_solved.length < 10) e.problem_solved = "Minimum 10 characters";
    if (!form.unique_value || form.unique_value.length < 10) e.unique_value = "Minimum 10 characters";
    if (!form.seeking) e.seeking = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post("/onboarding/technologies", form);
      setSubmitted(true);
      toast.success("Technology submitted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlights = [
    { icon: ShieldCheck, title: "IP Protection Guidance", desc: "Our team reviews your IP status and advises on strengthening your protection before commercialisation.", color: "from-blue-500 to-blue-700" },
    { icon: FlaskConical, title: "TRL-Based Assessment", desc: "Technologies are assessed using the standard Technology Readiness Level framework for objective benchmarking.", color: "from-teal-500 to-cyan-600" },
    { icon: Globe, title: "Global Licensing Network", desc: "Gain access to industry partners, investors, and licensees across 5+ countries actively seeking innovations.", color: "from-emerald-500 to-teal-600" },
    { icon: Lightbulb, title: "Expert Commercialisation", desc: "RTTP-certified professionals guide you through licensing, spin-off formation, and market entry strategy.", color: "from-amber-500 to-orange-500" },
  ];

  const sectionHeader = (label) => (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-slate-300 uppercase tracking-wide">{label}</h3>
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      {/* Hero */}
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
              IP Holders & Innovators
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Submit Your Technology
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Are you an inventor, researcher, or IP holder with a technology ready for commercialisation? Register your innovation to connect with investors and licensees worldwide.
            </p>
            <motion.a
              href="#submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
            >
              Submit Technology <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Why Submit */}
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
              Why Register on{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Assesme
              </span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              A structured path from research lab to commercial market.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {highlights.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${p.color} rounded-xl flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">{p.title}</h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section id="submit" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Technology Registration
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400">
              Complete the form below to list your technology on our platform.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
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
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-100 mb-2">Submission Received</h3>
                <p className="text-neutral-600 dark:text-slate-400">
                  Thank you for submitting your technology. A confirmation has been sent to your email. Our RTTP team will review and contact you within 48 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm space-y-8"
              >
                {/* Technology Details */}
                <div>
                  {sectionHeader("Technology Details")}
                  <div className="space-y-5">
                    <Field label="Technology Title" name="technology_title" value={form.technology_title} onChange={handleChange} error={errors.technology_title} placeholder="Name or brief title of the technology" />
                    <TextareaField label="Description" name="description" value={form.description} onChange={handleChange} error={errors.description} placeholder="Describe the technology, how it works, and its current state of development..." rows={4} />
                    <TextareaField label="Problem Being Solved" name="problem_solved" value={form.problem_solved} onChange={handleChange} error={errors.problem_solved} placeholder="What problem does this technology address?" rows={3} />
                    <TextareaField label="Unique Value Proposition" name="unique_value" value={form.unique_value} onChange={handleChange} error={errors.unique_value} placeholder="What makes this technology distinct from existing solutions?" rows={3} />
                    <Field label="Seeking" name="seeking" value={form.seeking} onChange={handleChange} error={errors.seeking} placeholder="e.g. Licensing partner, Investment, Co-development" />
                  </div>
                </div>

                {/* Classification */}
                <div>
                  {sectionHeader("Classification")}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Technology Category" name="category" value={form.category} onChange={handleChange} error={errors.category} options={CATEGORIES} placeholder="Select category" />
                    <SelectField label="IP Status" name="ip_status" value={form.ip_status} onChange={handleChange} error={errors.ip_status} options={IP_STATUSES} placeholder="Select IP status" />
                    <SelectField label="TRL Level" name="trl_level" value={form.trl_level} onChange={handleChange} error={errors.trl_level} options={TRL_LEVELS} placeholder="Select TRL level" />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  {sectionHeader("Inventor / Contact Details")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Inventor / Submitter Name" name="inventor_name" value={form.inventor_name} onChange={handleChange} error={errors.inventor_name} placeholder="Full name" />
                    <Field label="Organization / Institution" name="organization" value={form.organization} onChange={handleChange} error={errors.organization} placeholder="University, company, or research lab" />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
                    <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
                    <Field label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} placeholder="Country" />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit Technology"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
