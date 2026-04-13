import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Sparkles,
  CheckCircle,
  Gauge,
  Timer,
  Users,
  Briefcase,
  FlaskConical,
  Cpu,
  ShieldCheck,
  Network,
  Handshake,
  LineChart,
  ArrowRight,
  Target,
  Rocket,
  BarChart3,
  FileSearch,
  Banknote,
  UserCircle2,
  GraduationCap,
  Building2,
  Microscope,
  Landmark,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const QUICK_STATS = [
  { icon: Gauge, value: "92%", label: "Analysis Accuracy" },
  { icon: Timer, value: "<60 Seconds", label: "Assessment Time" },
  { icon: Users, value: "1000+", label: "Innovators & Technologies Evaluated" },
  { icon: Briefcase, value: "Multi-Domain", label: "Expertise Across Industries" },
];

const PROBLEM_POINTS = [
  "No structured validation",
  "No clear commercialization path",
  "No access to the right investors",
  "No working prototype",
];

const ECOSYSTEM_STEPS = [
  {
    icon: FileSearch,
    color: "bg-blue-600",
    title: "Technology Assessment",
    subtitle: "Evaluate before you invest time or money.",
    points: [
      "Patentability & IP potential",
      "TRL (Technology Readiness Level)",
      "Market viability",
      "Commercialization pathways",
    ],
    outcome: "Clear feasibility + direction",
  },
  {
    icon: FlaskConical,
    color: "bg-teal-600",
    title: "Prototyping & Development",
    subtitle: "Turn concepts into working systems.",
    points: [
      "POC / Prototype / MVP",
      "IoT, AI, Software, Medical solutions",
      "Industrial-ready development",
    ],
    outcome: "Tangible, testable product",
  },
  {
    icon: ShieldCheck,
    color: "bg-emerald-600",
    title: "Technology Onboarding",
    subtitle: "Only qualified innovations move forward.",
    points: [
      "Minimum POC / MVP validation",
      "Problem-solution clarity",
      "Market readiness check",
    ],
    outcome: "High-quality innovation pipeline",
  },
  {
    icon: Handshake,
    color: "bg-blue-700",
    title: "Investor Connect",
    subtitle: "Access to verified, serious investors.",
    points: [
      "Investor profiling & filtration",
      "Sector & stage alignment",
      "Strategic + financial matching",
    ],
    outcome: "Relevant, high-quality deal flow",
  },
  {
    icon: Network,
    color: "bg-teal-700",
    title: "Intelligent Matching",
    subtitle: "Precision-based connection engine.",
    points: [
      "Stage compatibility",
      "Ticket size alignment",
      "Risk appetite matching",
    ],
    outcome: "Faster decisions, better outcomes",
  },
  {
    icon: Banknote,
    color: "bg-emerald-700",
    title: "Funding & Commercialization",
    subtitle: "Move from validation to growth.",
    points: [
      "Investor interaction",
      "Funding discussions",
      "Market execution",
    ],
    outcome: "Scalable, fundable innovation",
  },
];

const DIFFERENTIATORS = [
  "AI + Expert Hybrid Assessment",
  "TRL-Based Structured Evaluation",
  "Built-in Prototyping Support",
  "Dual Filtration (Investor + Technology)",
  "Intelligent Matching System",
  "End-to-End Commercialization Approach",
];

const PLATFORM_CAPABILITIES = [
  "AI-powered assessment engine",
  "TRL-based maturity scoring",
  "Market & IP intelligence integration",
  "Investor-tech matchmaking system",
  "Structured reporting framework",
];

const REPORTING_INCLUDES = [
  "Technical feasibility",
  "Market analysis",
  "IP & FTO insights",
  "Financial projections",
  "Go-to-market strategy",
];

const STAKEHOLDERS = [
  { icon: Rocket, label: "Startups & Founders" },
  { icon: Microscope, label: "Researchers & Scientists" },
  { icon: GraduationCap, label: "Universities & Incubation Centers" },
  { icon: Building2, label: "Corporates & R&D Teams" },
  { icon: Landmark, label: "Investors & Venture Networks" },
];

const leadershipProfiles = [
  {
    name: "Mr. Venkatesh Bharti",
    role: "Scientist & Director",
    body: "Mr. Venkatesh Bharti is a nationally recognised innovator and IP strategist, known for bridging the gap between technology development and commercialisation. He is a recipient of the Young & Innovative Scientist Award (DRDO, 2022) and holds over 80+ granted intellectual properties across domains such as IoT, Legal-Tech, Ed-Tech, and Health-Tech. With experience collaborating with Fortune 50+ companies and delivering 50+ sessions on innovation and intellectual property, he brings deep expertise in both technical and strategic domains. He specialises in transforming early-stage ideas into structured, scalable, and investment-ready innovations.",
  },
  {
    name: "Ms. Deepa Kohli",
    role: "Academic & Innovation Ecosystem Leader",
    body: "With over 18+ years of experience, Ms. Deepa Kohli brings strong expertise in academics, corporate training, and institutional development, with a growing focus on innovation and startup ecosystems. She has served as faculty at leading universities including DU, IGNOU, Manipal, IP University, and PTU, where she has actively mentored students in research, technology, and entrepreneurial thinking. As a trainer, she has worked with government bodies and PSUs, delivering programs across a wide range of programming and technology domains. Her experience extends into supporting startup initiatives, skill development, and innovation-driven programs, where she contributes to building structured, education-led ecosystems. She plays a key role in enabling large-scale engagement programs that connect academia, technology, and entrepreneurship.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden py-40 md:py-52">
        <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              About Assessme
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              From Idea to Investment - We Make Innovation Work
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Assessme is an AI-powered technology assessment and commercialization platform that helps innovators evaluate, build, onboard, and connect with investors - through a structured, data-driven ecosystem.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm md:text-base text-slate-200 mb-10">
              {["Assess", "Build", "Onboard", "Match", "Fund", "Scale"].map((step, idx) => (
                <React.Fragment key={step}>
                  <span className="font-medium">{step}</span>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-blue-400" />}
                </React.Fragment>
              ))}
            </div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {QUICK_STATS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    className="bg-white/5 border border-white/15 rounded-2xl p-5 text-left"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div className="text-sm text-slate-300 mt-1">{item.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
              The Problem We Solved
            </h2>
            <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>Innovation is everywhere.</p>
              <p>Successful commercialization is not.</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Most technologies fail because:</p>
              <ul className="space-y-2">
                {PROBLEM_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p>Startups build without direction.</p>
              <p>Researchers innovate without market alignment.</p>
              <p>Investors struggle to find validated opportunities.</p>
              <p>Assessme was built to fix this disconnect.</p>
            </div>
            <div className="mt-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-6">
              <p className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-300 text-center">
                We don't just assess technology - we move it toward real-world success.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

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
                    <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">{index + 1}. {step.title}</div>
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
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">
              Assess  -  Build  -  Qualify  -  Match  -  Fund  -  Scale
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Not a Tool. Not a Marketplace. A Complete System.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Most platforms offer either assessment, or investor listing, or development services. Assessme integrates everything into one structured pipeline.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {DIFFERENTIATORS.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Vision</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              To become the global infrastructure for technology validation, investment, and commercialization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Mission</h3>
            <ul className="space-y-3">
              {[
                "Make innovation measurable and investable",
                "Simplify technology transfer for all stakeholders",
                "Enable startups and researchers to scale faster",
                "Create a trusted bridge between innovation and capital",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Built for Speed. Designed for Accuracy.
            </h2>
            <p className="text-lg text-blue-700 dark:text-blue-400 font-semibold">Speed from AI. Confidence from expertise.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PLATFORM_CAPABILITIES.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5"
              >
                <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              From Insights to Investment Decisions
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Advanced</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">Quick validation</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <LineChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Comprehensive</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">Deep analysis, investor-ready intelligence</p>
            </motion.div>
          </div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5">Includes</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {REPORTING_INCLUDES.map((item) => (
                <div key={item} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Driven by Innovation. Backed by Experience.
            </h2>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {leadershipProfiles.map((leader) => (
              <motion.article
                key={leader.name}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <UserCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{leader.name}</h3>
                    <p className="text-blue-700 dark:text-blue-400 font-medium">{leader.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{leader.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Built for Every Stakeholder in Innovation
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STAKEHOLDERS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Making Innovation Investable</h2>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
              Ideas alone don't create impact. Validated, structured, and funded innovations do.
            </p>
            <p className="text-base md:text-lg text-blue-100 mb-4">Assessme ensures every technology moves forward with:</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {["Clarity", "Strategy", "Execution"].map((item) => (
                <span key={item} className="px-4 py-2 rounded-full border border-blue-200/30 text-blue-50 bg-white/10 font-medium">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-xl md:text-2xl font-semibold text-white">From idea to investment - we make innovation real.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
