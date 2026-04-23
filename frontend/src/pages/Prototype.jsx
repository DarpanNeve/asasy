import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Send,
  ArrowRight,
  Cpu,
  Activity,
  Zap,
  Smartphone,
  Building2,
  FlaskConical,
  TrendingUp,
  BookOpen,
  Users,
  Briefcase,
  Upload,
  Search,
  Code2,
  Package,
  Shield,
  Clock,
  Wrench,
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

const SERVICES = [
  {
    icon: Cpu,
    bg: "bg-blue-600",
    title: "IoT & Hardware Prototypes",
    desc: "Sensor integration, embedded systems, microcontroller programming, and full hardware builds.",
  },
  {
    icon: Activity,
    bg: "bg-teal-600",
    title: "Medical Device Prototyping",
    desc: "Healthcare device development, patient monitoring systems, and medical-grade hardware builds.",
  },
  {
    icon: Zap,
    bg: "bg-emerald-600",
    title: "AI/ML Systems",
    desc: "Model integration, inference pipelines, data processing, and AI-powered application MVPs.",
  },
  {
    icon: Smartphone,
    bg: "bg-violet-600",
    title: "Mobile & Web MVPs",
    desc: "Full-stack mobile apps, web applications, and SaaS MVPs from design to deployment.",
  },
  {
    icon: Building2,
    bg: "bg-amber-500",
    title: "Industrial Development",
    desc: "Industrial product prototyping, automation systems, and manufacturing process builds.",
  },
  {
    icon: FlaskConical,
    bg: "bg-rose-600",
    title: "Research-to-Product",
    desc: "Converting academic research, lab experiments, and patents into real, testable product prototypes.",
  },
];

const WHO_CARDS = [
  {
    icon: Users,
    bg: "bg-blue-600",
    title: "Startups",
    desc: "Needing an MVP for funding, customer validation, or demo purposes.",
  },
  {
    icon: BookOpen,
    bg: "bg-teal-600",
    title: "Students & Researchers",
    desc: "Building final-year projects, competition entries, or research prototypes.",
  },
  {
    icon: FlaskConical,
    bg: "bg-emerald-600",
    title: "Researchers",
    desc: "Converting innovation and lab work into working demonstrable products.",
  },
  {
    icon: Briefcase,
    bg: "bg-amber-500",
    title: "Companies",
    desc: "Testing new product ideas, internal tools, or market validation builds.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    icon: Upload,
    bg: "bg-blue-600",
    title: "Submit Your Requirement",
    desc: "Fill out the inquiry form with your idea, prototype type, stage, and timeline.",
  },
  {
    step: "02",
    icon: Search,
    bg: "bg-teal-600",
    title: "Feasibility Evaluation",
    desc: "We evaluate feasibility, scope, and complexity. Response within 48 hours.",
  },
  {
    step: "03",
    icon: Code2,
    bg: "bg-emerald-600",
    title: "Development Begins",
    desc: "Hands-on engineering and prototyping with milestone-based progress updates.",
  },
  {
    step: "04",
    icon: Package,
    bg: "bg-amber-500",
    title: "Testing & Delivery",
    desc: "Rigorous testing, iteration, and final delivery with documentation.",
  },
];

const SHOWCASE_PROJECTS = [
  {
    tag: "IoT + Medical",
    tagColor:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    title: "Continuous Glucose Monitoring System",
    desc: "Real-time glucose tracking IoT device with sensor integration, data logging, and mobile app dashboard.",
  },
  {
    tag: "IoT + Environment",
    tagColor:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
    title: "Smart Air Quality Improvement Device",
    desc: "Air quality monitoring and purification system with real-time PM2.5, CO2, and VOC sensing.",
  },
  {
    tag: "IoT + Security",
    tagColor:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    title: "Bicycle Security & Tracking System",
    desc: "GPS-based smart lock with mobile alerts, location tracking, and tamper detection.",
  },
  {
    tag: "AI + Healthcare",
    tagColor:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    title: "Cognitive Load Monitoring Wearable",
    desc: "AI-powered wearable measuring cognitive stress via EEG, HRV, and GSR signals.",
  },
  {
    tag: "IoT + Safety",
    tagColor:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    title: "Smart Safety Companion Device",
    desc: "Personal safety wearable with emergency SOS, location sharing, fall detection, and companion app.",
  },
];

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "IP Stays Yours",
    desc: "All work under NDA. Full intellectual property ownership retained by you throughout.",
  },
  {
    icon: Clock,
    title: "48-Hour Response",
    desc: "Our team responds to all inquiries within 48 business hours with an initial feasibility assessment.",
  },
  {
    icon: Wrench,
    title: "Specialist Engineers",
    desc: "Domain-specific engineers matched to your technology type IoT, AI, Medical, Software.",
  },
];

const protoTypeMap = {
  "IoT / Hardware": "Electronic / Hardware",
  "Medical Device": "Electronic / Hardware",
  "AI/ML System": "Software / Digital MVP",
  "Web Application": "Software / Digital MVP",
  "Mobile App": "Software / Digital MVP",
  "Industrial Product": "Mechanical / Structural",
  Other: "Other",
};

export default function Prototype() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    prototype_type: "",
    tech_description: "",
    current_stage: "",
    budget_range: "",
    timeline: "",
    message: "",
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
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.prototype_type) e.prototype_type = "Required";
    if (!form.tech_description || form.tech_description.length < 20)
      e.tech_description = "Minimum 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const messageValue = [
        form.message,
        form.current_stage ? `Current Stage: ${form.current_stage}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      await api.post("/onboarding/prototype", {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        tech_description: form.tech_description,
        prototype_type: protoTypeMap[form.prototype_type] || "Other",
        budget_range: form.budget_range || "< ₹1L",
        timeline: form.timeline || "< 1 month",
        message: messageValue.slice(0, 1000),
      });
      setSubmitted(true);
      toast.success("Inquiry submitted successfully!");
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
              From Concept to Reality
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build What You Imagine. We Engineer It.
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Turn your idea, research, or concept into a working prototype,
              MVP, or industrial-ready product. From IoT devices to AI systems
              to full-scale applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#inquiry"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
              >
                Request a Prototype <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#showcase"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                View Our Work
              </motion.a>
            </div>
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
              End-to-End Prototyping Support
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              We don't just guide you get actual execution.
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
                  <div
                    className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">
                    {s.desc}
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
              Built for Serious Builders
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {WHO_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive"
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

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Simple.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Structured.
              </span>{" "}
              Execution-Driven.
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              From inquiry to delivery, every step is transparent, milestone-based, and engineer-led.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 relative"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {PROCESS_STEPS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} variants={fadeUp} className="relative">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm h-full hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className={`w-12 h-12 ${p.bg} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-4xl font-black text-slate-100 dark:text-slate-800 select-none">
                        {p.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-900 dark:text-slate-200 mb-2 text-base group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:flex absolute top-1/3 -right-4 z-10 items-center">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="showcase" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full mr-2" />
              Our Portfolio
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              What We've{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Already Built
              </span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              Real projects. Real engineering. Real delivery — from concept to working product.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {SHOWCASE_PROJECTS.map((project, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${project.tagColor}`}
                  >
                    {project.tag}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    Delivered
                  </span>
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-slate-200 mb-3 text-base group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">
                  {project.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-neutral-500 dark:text-slate-400 text-sm mb-4">
              Ready to add your project to this list?
            </p>
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md btn-glow"
            >
              Start Your Prototype <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Not Just Development. Real Engineering.
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TRUST_POINTS.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 group cursor-default"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors duration-300">
                    <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">
                    {t.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">
                    {t.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="inquiry" className="py-24 bg-slate-50 dark:bg-slate-900">
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
              Describe your technology and requirements. Our team responds
              within 48 hours.
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
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-100 mb-2">
                  Inquiry Received
                </h3>
                <p className="text-neutral-600 dark:text-slate-400">
                  Thank you for reaching out. A confirmation has been sent to
                  your email. Our prototyping team will contact you within 48
                  hours.
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
                  <Field
                    label="Full Name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    error={errors.full_name}
                    placeholder="Your full name"
                    required
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+91 98765 43210"
                    required
                  />
                  <SelectField
                    label="Prototype Type"
                    name="prototype_type"
                    value={form.prototype_type}
                    onChange={handleChange}
                    error={errors.prototype_type}
                    options={[
                      "IoT / Hardware",
                      "Medical Device",
                      "AI/ML System",
                      "Web Application",
                      "Mobile App",
                      "Industrial Product",
                      "Other",
                    ]}
                    placeholder="Select type"
                  />
                </div>
                <TextareaField
                  label="Brief Idea Description"
                  name="tech_description"
                  value={form.tech_description}
                  onChange={handleChange}
                  error={errors.tech_description}
                  placeholder="Describe your prototype idea core function, target users, and any existing documentation..."
                  rows={4}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectField
                    label="Current Stage"
                    name="current_stage"
                    value={form.current_stage}
                    onChange={handleChange}
                    options={[
                      "Just an Idea",
                      "Have a Concept Document",
                      "POC Exists",
                      "Prototype Exists",
                      "Need MVP",
                    ]}
                    placeholder="Select stage (optional)"
                  />
                  <SelectField
                    label="Budget Range"
                    name="budget_range"
                    value={form.budget_range}
                    onChange={handleChange}
                    options={[
                      "< ₹1L",
                      "₹1L – ₹5L",
                      "₹5L – ₹20L",
                      "₹20L – ₹50L",
                      "₹50L+",
                    ]}
                    placeholder="Select budget (optional)"
                  />
                  <SelectField
                    label="Timeline"
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    options={[
                      "< 1 month",
                      "1 – 3 months",
                      "3 – 6 months",
                      "6 – 12 months",
                      "> 12 months",
                    ]}
                    placeholder="Select timeline (optional)"
                  />
                </div>
                <TextareaField
                  label="Additional Notes or Requirements"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any specific requirements, constraints, or questions..."
                  rows={3}
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
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
