import React from "react";
import { motion } from "framer-motion";
import {
  FileSearch,
  FlaskConical,
  ShieldCheck,
  Handshake,
  Network,
  Banknote,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const ECOSYSTEM_STEPS = [
  {
    icon: FileSearch,
    color: "bg-blue-600",
    title: "Technology Assessment",
    subtitle: "Evaluate before you invest time or money.",
    points: ["Patentability & IP potential", "TRL (Technology Readiness Level)", "Market viability", "Commercialization pathways"],
    outcome: "Clear feasibility + direction",
  },
  {
    icon: FlaskConical,
    color: "bg-teal-600",
    title: "Prototyping & Development",
    subtitle: "Turn concepts into working systems.",
    points: ["POC / Prototype / MVP", "IoT, AI, Software, Medical solutions", "Industrial-ready development"],
    outcome: "Tangible, testable product",
  },
  {
    icon: ShieldCheck,
    color: "bg-emerald-600",
    title: "Technology Qualification",
    subtitle: "Only validated innovations move forward.",
    points: ["Minimum POC / MVP validation", "Problem-solution clarity", "Market readiness check"],
    outcome: "High-quality innovation pipeline",
  },
  {
    icon: Handshake,
    color: "bg-violet-600",
    title: "Investor Connect",
    subtitle: "Access to verified, serious investors.",
    points: ["Investor profiling & filtration", "Sector & stage alignment", "Strategic + financial matching"],
    outcome: "Relevant, high-quality deal flow",
  },
  {
    icon: Network,
    color: "bg-amber-500",
    title: "Intelligent Matching",
    subtitle: "Precision-based connection engine.",
    points: ["Stage compatibility", "Ticket size alignment", "Risk appetite matching"],
    outcome: "Faster decisions, better outcomes",
  },
  {
    icon: Banknote,
    color: "bg-rose-500",
    title: "Funding & Scale",
    subtitle: "Move from validation to growth.",
    points: ["Direct investor interaction", "Funding discussions", "Market execution & scale"],
    outcome: "Scalable, fundable innovation",
  },
];

const PIPELINE_STEPS = [
  { number: "01", label: "Assess", sub: "Validate potential", color: "#3b82f6" },
  { number: "02", label: "Build", sub: "Create your MVP", color: "#14b8a6" },
  { number: "03", label: "Qualify", sub: "Earn your place", color: "#10b981" },
  { number: "04", label: "Match", sub: "Find the right fit", color: "#f59e0b" },
  { number: "05", label: "Fund", sub: "Secure capital", color: "#8b5cf6" },
  { number: "06", label: "Scale", sub: "Grow with confidence", color: "#f43f5e" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function PipelineSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            A Complete Innovation-to-Investment Pipeline
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Six structured stages that take a raw idea all the way to funded, scalable reality.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {ECOSYSTEM_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 ${step.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    {index + 1}. {step.title}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{step.subtitle}</p>
                <ul className="space-y-2 mb-4">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Outcome: {step.outcome}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
            The Innovation Pipeline
          </p>
          <div className="flex flex-wrap items-start justify-center gap-y-8 gap-x-1">
            {PIPELINE_STEPS.map((step, i) => (
              <React.Fragment key={step.label}>
                <motion.div
                  className="flex flex-col items-center gap-2 min-w-[80px]"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ background: `linear-gradient(135deg, ${step.color}cc, ${step.color})` }}
                  >
                    <span className="text-white font-black text-sm">{step.number}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{step.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">{step.sub}</span>
                </motion.div>
                {i < 5 && (
                  <div className="hidden md:flex items-center pb-8 px-1">
                    <div
                      className="w-8 h-0.5 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${step.color}, ${PIPELINE_STEPS[i + 1].color})` }}
                    />
                    <ChevronRight className="w-4 h-4 -ml-1" style={{ color: PIPELINE_STEPS[i + 1].color }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
