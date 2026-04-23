import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  Wrench,
  ShieldCheck,
  BadgeDollarSign,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    tag: "Technology Assessment",
    title: "Evaluate Before You Build",
    description:
      "Understand the true potential of your idea through structured analysis:",
    bullets: [
      "Patentability & IP scope",
      "Technology Readiness (TRL)",
      "Market potential",
      "Commercialization pathways",
    ],
    outcome: "Clear direction. Reduced risk. Defined next step.",
    cta: { label: "Start with Assessment", to: "/reports" },
    icon: FlaskConical,
    color: "#3b82f6",
    gradient: "from-blue-500 to-blue-700",
    light:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40",
    dot: "bg-blue-600",
    text: "text-blue-700 dark:text-blue-400",
  },
  {
    number: "02",
    tag: "Prototyping & Development",
    title: "Build What Matters",
    description: "Transform validated concepts into real, working systems:",
    bullets: [
      "POC, Prototype, MVP",
      "IoT, AI, Medical, Software solutions",
      "Scalable and test-ready builds",
    ],
    outcome: "A functional product — not just an idea.",
    cta: { label: "Build Your Prototype", to: "/prototype" },
    icon: Wrench,
    color: "#14b8a6",
    gradient: "from-teal-500 to-teal-700",
    light:
      "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/40",
    dot: "bg-teal-600",
    text: "text-teal-700 dark:text-teal-400",
  },
  {
    number: "03",
    tag: "Technology Qualification",
    title: "Only Serious Innovations Move Forward",
    description: "We filter technologies before exposure:",
    bullets: [
      "Minimum POC / MVP required",
      "Real validation & use-case clarity",
      "Founder commitment check",
    ],
    outcome: "Entry into a high-quality ecosystem.",
    cta: { label: "Check Eligibility", to: "/technologies" },
    icon: ShieldCheck,
    color: "#10b981",
    gradient: "from-emerald-500 to-emerald-700",
    light:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40",
    dot: "bg-emerald-600",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  {
    number: "04",
    tag: "Investor Onboarding",
    title: "Capital, But Verified",
    description: "We onboard only serious investors:",
    bullets: [
      "Financial capacity validation",
      "Investment experience check",
      "Sector and strategy alignment",
    ],
    outcome: "Access to credible, active investors.",
    cta: { label: "Join as Investor", to: "/investors" },
    icon: BadgeDollarSign,
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-600",
    light:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  {
    number: "05",
    tag: "Intelligent Matching",
    title: "Right Fit. Not Random Connections.",
    description: "Our system matches based on:",
    bullets: [
      "Stage compatibility",
      "Sector alignment",
      "Ticket size",
      "Risk and strategic fit",
    ],
    outcome: "High-relevance investor–startup connections.",
    cta: { label: "Get Matched", to: "/investors" },
    icon: Zap,
    color: "#8b5cf6",
    gradient: "from-violet-500 to-violet-700",
    light:
      "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/40",
    dot: "bg-violet-600",
    text: "text-violet-700 dark:text-violet-400",
  },
  {
    number: "06",
    tag: "Funding & Scale",
    title: "From Validation to Growth",
    description: "Once matched:",
    bullets: [
      "Direct investor interaction",
      "Funding discussions",
      "Growth and commercialization",
    ],
    outcome: "Capital + scale + market entry.",
    cta: null,
    icon: TrendingUp,
    color: "#f43f5e",
    gradient: "from-rose-500 to-rose-600",
    light:
      "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40",
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
  },
];

const STRIP = [
  { label: "Assess", color: "#3b82f6" },
  { label: "Build", color: "#14b8a6" },
  { label: "Qualify", color: "#10b981" },
  { label: "Match", color: "#f59e0b" },
  { label: "Fund", color: "#8b5cf6" },
  { label: "Scale", color: "#f43f5e" },
];

function RoadmapCard({ step, index, isRight }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={`relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 ${isRight ? "lg:ml-8" : "lg:mr-8"}`}
    >
      {/* Colored top bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-80"
        style={{
          background: `linear-gradient(90deg, ${step.color}, transparent)`,
        }}
      />

      {/* Tag + icon */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${step.light} ${step.text}`}
        >
          {step.tag}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${step.color}cc, ${step.color})`,
          }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 leading-snug">
        {step.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {step.description}
      </p>

      {/* Bullets */}
      <ul className="space-y-1.5 mb-4">
        {step.bullets.map((b, j) => (
          <li
            key={j}
            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: step.color }}
            />
            {b}
          </li>
        ))}
      </ul>

      {/* Outcome */}
      <div className={`rounded-lg px-3 py-2 mb-4 border ${step.light}`}>
        <p className="text-xs leading-relaxed">
          <span className={`font-semibold ${step.text}`}>Outcome: </span>
          <span className="text-slate-600 dark:text-slate-300">
            {step.outcome}
          </span>
        </p>
      </div>

      {/* CTA */}
      {step.cta && (
        <Link
          to={step.cta.to}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${step.text} hover:opacity-80 transition-opacity group`}
        >
          {step.cta.label}
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}

export default function RoadmapSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-600 dark:text-white/70 text-sm font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
            Platform Roadmap
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              Assessme
            </span>{" "}
            Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            A structured path from idea to investment
          </p>
        </motion.div>

        {/* Desktop zigzag timeline */}
        <div className="hidden lg:block relative">
          {/* Center vertical line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px">
            <div className="w-full h-full bg-gradient-to-b from-blue-400 via-teal-400 to-emerald-400 dark:from-blue-500 dark:via-violet-500 dark:to-rose-500 opacity-40 dark:opacity-30" />
          </div>

          <div className="space-y-16">
            {STEPS.map((step, i) => {
              const isRight = i % 2 === 1;
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative grid grid-cols-2 gap-0 items-center"
                >
                  {/* Left side */}
                  <div
                    className={`${isRight ? "pr-16 flex justify-end" : "pr-16"}`}
                  >
                    {!isRight && (
                      <RoadmapCard step={step} index={i} isRight={false} />
                    )}
                  </div>

                  {/* Center node */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-slate-200 dark:border-slate-800"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}dd, ${step.color})`,
                      }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="mt-1.5 text-xs font-black text-slate-500 dark:text-slate-500 tracking-widest">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Right side */}
                  <div
                    className={`${!isRight ? "pl-16 flex justify-start" : "pl-16"}`}
                  >
                    {isRight && (
                      <RoadmapCard step={step} index={i} isRight={true} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: left-rail timeline */}
        <div className="lg:hidden relative pl-12">
          {/* Left vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400 via-teal-400 to-emerald-400 dark:from-blue-500 dark:via-violet-500 dark:to-rose-500 opacity-50 dark:opacity-40" />

          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative"
                >
                  {/* Node on the rail */}
                  <div
                    className="absolute -left-12 top-4 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-800"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}cc, ${step.color})`,
                    }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  {/* Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${step.light} ${step.text}`}
                      >
                        {step.number} — {step.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <ul className="space-y-1 mb-3">
                      {step.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: step.color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-600 dark:text-slate-500">
                      <span className={`font-semibold ${step.text}`}>
                        Outcome:{" "}
                      </span>
                      {step.outcome}
                    </p>
                    {step.cta && (
                      <Link
                        to={step.cta.to}
                        className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold ${step.text}`}
                      >
                        {step.cta.label} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Final strip */}
        <motion.div
          className="mt-20 flex flex-wrap items-center justify-center gap-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {STRIP.map((item, i) => (
            <div key={i} className="flex items-center">
              <motion.div
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
                  {item.label}
                </span>
              </motion.div>
              {i < STRIP.length - 1 && (
                <div className="w-10 sm:w-16 mx-1 mb-5 h-px bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
