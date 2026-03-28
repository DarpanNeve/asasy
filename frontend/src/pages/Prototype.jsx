import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Send,
  ArrowRight,
  Cpu,
  Wrench,
  Code2,
  Box,
  FlaskConical,
  Clock,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
import { api } from "../services/api";
import toast from "react-hot-toast";

const PROTOTYPE_TYPES = [
  "Electronic / Hardware",
  "Mechanical / Structural",
  "Software / Digital MVP",
  "3D Model / CAD",
  "Chemical / Material",
  "Other",
];

const BUDGETS = ["< ₹1L", "₹1L – ₹5L", "₹5L – ₹20L", "₹20L – ₹50L", "₹50L+"];
const TIMELINES = ["< 1 month", "1 – 3 months", "3 – 6 months", "6 – 12 months", "> 12 months"];

const SERVICES = [
  {
    icon: Cpu,
    title: "Electronic & Hardware",
    desc: "PCB design, embedded systems, sensor integration, and functional hardware builds for IoT, robotics, and instrumentation projects.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Wrench,
    title: "Mechanical & Structural",
    desc: "Precision fabrication, CNC machining, and structural prototyping for mechanical devices, medical equipment, and industrial applications.",
    color: "from-slate-500 to-slate-700",
  },
  {
    icon: Code2,
    title: "Software & Digital MVPs",
    desc: "Rapid development of web apps, mobile apps, and SaaS MVPs to validate your digital product concept with real users.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Box,
    title: "3D Modelling & CAD",
    desc: "Detailed 3D models, technical drawings, and CAD files for patent applications, investor presentations, or manufacturing handoffs.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: FlaskConical,
    title: "Chemical & Material",
    desc: "Lab-scale formulation, material testing, and proof-of-concept builds for chemical, pharmaceutical, and advanced materials innovations.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "IP Documentation",
    desc: "Technical drawings, functional specifications, and prototype documentation to strengthen patent applications and licensing packages.",
    color: "from-rose-500 to-red-600",
  },
];

const PROCESS = [
  { step: "01", title: "Submit Inquiry", desc: "Fill out the inquiry form with your technology description, prototype type, budget, and timeline." },
  { step: "02", title: "Initial Assessment", desc: "Our prototyping team reviews your submission and contacts you within 48 hours to discuss feasibility." },
  { step: "03", title: "Scope & Proposal", desc: "We prepare a detailed scope of work with cost and timeline estimates for your review and approval." },
  { step: "04", title: "Development", desc: "Development begins with regular milestone updates. You retain full IP ownership throughout the process." },
  { step: "05", title: "Delivery", desc: "Receive the completed prototype with technical documentation, CAD files, and IP-ready deliverables." },
];

const TRUST = [
  { icon: Shield, title: "IP Stays Yours", desc: "All prototypes are developed under NDA. You retain full intellectual property ownership." },
  { icon: Clock, title: "48-Hour Response", desc: "Our prototyping team responds to all inquiries within 48 business hours with an initial feasibility assessment." },
  { icon: Users, title: "Specialist Engineers", desc: "Work with domain-specific engineers handpicked for your technology type and sector." },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Prototype() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "", organization: "", email: "", phone: "",
    tech_description: "", prototype_type: "", budget_range: "",
    timeline: "", message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name) e.full_name = "Required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.tech_description || form.tech_description.length < 20) e.tech_description = "Minimum 20 characters";
    if (!form.prototype_type) e.prototype_type = "Required";
    if (!form.budget_range) e.budget_range = "Required";
    if (!form.timeline) e.timeline = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post("/onboarding/prototype", form);
      setSubmitted(true);
      toast.success("Inquiry submitted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              From Concept to Reality
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Prototype Development
              <span className="block text-slate-300 text-3xl md:text-4xl font-normal mt-2">Services</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Assesme connects innovators with specialist engineers to build, validate, and document their technology for commercialisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#inquiry"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
              >
                Submit Inquiry <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#services"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                View Services
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Prototyping{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              Specialist support across hardware, software, mechanical, and materials domains.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">{s.title}</h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">How It Works</h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              A clear, milestone-driven process from initial inquiry to final delivery.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {PROCESS.map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="relative">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm h-full hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <span className="text-white font-bold text-xs">{p.step}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2 text-sm">{p.title}</h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/3 -right-2.5 z-10 items-center">
                    <ArrowRight className="h-4 w-4 text-blue-300 dark:text-blue-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TRUST.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 group cursor-default"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                    <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">{t.title}</h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section id="inquiry" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Submit a Prototype Inquiry
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400">
              Describe your technology and requirements. Our team responds within 48 hours.
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
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-100 mb-2">Inquiry Received</h3>
                <p className="text-neutral-600 dark:text-slate-400">
                  Thank you for reaching out. A confirmation has been sent to your email. Our prototyping team will contact you within 48 hours.
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
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} placeholder="Your full name" />
                  <Field label="Organization" name="organization" value={form.organization} onChange={handleChange} placeholder="Company, university, or individual" optional />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
                </div>
                <TextareaField
                  label="Technology Description"
                  name="tech_description"
                  value={form.tech_description}
                  onChange={handleChange}
                  error={errors.tech_description}
                  placeholder="Describe the technology you want prototyped. Include the core function, target application, and any existing technical documentation..."
                  rows={5}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectField label="Prototype Type" name="prototype_type" value={form.prototype_type} onChange={handleChange} error={errors.prototype_type} options={PROTOTYPE_TYPES} placeholder="Select type" />
                  <SelectField label="Budget Range" name="budget_range" value={form.budget_range} onChange={handleChange} error={errors.budget_range} options={BUDGETS} placeholder="Select budget" />
                  <SelectField label="Timeline" name="timeline" value={form.timeline} onChange={handleChange} error={errors.timeline} options={TIMELINES} placeholder="Select timeline" />
                </div>
                <TextareaField label="Additional Notes" name="message" value={form.message} onChange={handleChange} placeholder="Any specific requirements, constraints, or questions..." rows={3} optional />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
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
