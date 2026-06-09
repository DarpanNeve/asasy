import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb, Landmark, FlaskConical, Briefcase, Building, Handshake,
  X, CheckCircle, FileText, Cpu, Users, Rocket,
} from "lucide-react";

const USERS = [
  {
    icon: Lightbulb,
    color: "bg-blue-600",
    title: "Startups & Founders",
    description: "Validate ideas before investing years of effort.",
    useCase: "Validate your idea, build a prototype or MVP, and prepare your startup for commercialization and funding.",
    howHelps: [
      "Conducts AI-powered technology assessment covering TRL, patentability, technical feasibility, and market potential",
      "Provides prototype and MVP development support across IoT, AI, software, medical, and hardware domains",
      "Identifies commercialization risks, milestones, and go-to-market pathways",
      "Onboards qualified technologies into a structured selection pipeline",
      "Matches validated startups with relevant investors based on sector, stage, and funding requirements",
    ],
    benefits: [
      "Avoid spending years building the wrong product",
      "Convert concepts into working prototypes",
      "Receive investor-ready reports and commercialization guidance",
      "Access curated funding opportunities after structured filtration",
    ],
    example: "A founder with a smart agriculture idea uses Assessme to evaluate patentability and market demand, develops an MVP, and gets introduced to investors focused on AgriTech.",
  },
  {
    icon: Landmark,
    color: "bg-teal-600",
    title: "Universities, Academia & Students",
    description: "Assess research outputs, patents, and student innovations.",
    useCase: "Evaluate research outputs and student innovations, develop prototypes, and identify commercialization and licensing opportunities.",
    howHelps: [
      "Assesses patents, theses, projects, and faculty inventions",
      "Converts promising research into prototype or pilot-stage solutions",
      "Supports technology transfer offices and incubation centers",
      "Onboards high-potential technologies into commercialization programs",
      "Connects validated technologies with investors and industry partners",
    ],
    benefits: [
      "Increase the real-world impact of research",
      "Help students move from project to startup",
      "Prioritize inventions with licensing and funding potential",
      "Strengthen innovation and entrepreneurship outcomes",
    ],
    example: "A university assesses a biomedical research project, builds a functional prototype, and advances it toward startup formation and investor outreach.",
  },
  {
    icon: FlaskConical,
    color: "bg-emerald-600",
    title: "R&D Labs & Corporates",
    description: "De-risk projects and identify commercialization paths.",
    useCase: "Evaluate internal technologies, build proof-of-concept prototypes, and identify commercialization, licensing, or spin-off opportunities.",
    howHelps: [
      "Standardizes technical, IP, and market assessments",
      "Supports prototype refinement and pilot development",
      "Identifies regulatory, competitive, and scaling considerations",
      "Facilitates investor and strategic partner matching when appropriate",
    ],
    benefits: [
      "Reduce uncertainty before large investments",
      "Accelerate product development decisions",
      "Unlock licensing and partnership opportunities",
      "Improve portfolio prioritization",
    ],
    example: "A corporate R&D team evaluates an industrial automation technology, develops a pilot-ready prototype, and explores strategic partnerships and investment options.",
  },
  {
    icon: Briefcase,
    color: "bg-orange-500",
    title: "Investors & Venture Capital Firms",
    description: "Get standardized, comparable due diligence reports.",
    useCase: "Access validated, investment-ready technologies and startups with standardized due diligence and prototype visibility.",
    howHelps: [
      "Filters technologies through AI assessment and expert review",
      "Evaluates TRL, IP strength, market potential, and commercialization readiness",
      "Supports prototype/MVP development where gaps exist",
      "Matches investors with opportunities aligned to thesis, ticket size, and sector focus",
    ],
    benefits: [
      "Receive curated deal flow instead of unfiltered submissions",
      "Compare opportunities using consistent criteria",
      "Reduce early-stage diligence time",
      "Invest in more mature, better-prepared technologies",
    ],
    example: "An angel network uses Assessme to review validated clean-tech startups, including prototype status and commercialization reports, before making investment decisions.",
  },
  {
    icon: Building,
    color: "bg-blue-700",
    title: "Government & Policy Bodies",
    description: "Evaluate funding proposals with data-driven reports.",
    useCase: "Evaluate funded innovations, support prototype development, and identify technologies with strong commercialization potential.",
    howHelps: [
      "Provides structured scoring and standardized reports",
      "Assesses technical feasibility, IP, TRL, and market impact",
      "Supports prototype and pilot development for selected projects",
      "Connects high-potential innovations with investors and industry partners",
    ],
    benefits: [
      "Improve consistency and transparency in funding decisions",
      "Increase commercialization outcomes from public investment",
      "Prioritize projects with measurable impact",
      "Reduce subjectivity in proposal evaluation",
    ],
    example: "A government innovation program assesses renewable energy proposals, funds prototype development, and facilitates commercialization pathways for selected projects.",
  },
  {
    icon: Handshake,
    color: "bg-teal-700",
    title: "Incubators & Accelerators",
    description: "Screen applications and guide startups with structured assessments.",
    useCase: "Screen applicants, guide prototype development, and connect validated startups with investors.",
    howHelps: [
      "Evaluates startup applications using structured technical and commercial criteria",
      "Identifies prototype and MVP development needs",
      "Supports commercialization planning and milestone setting",
      "Matches investment-ready startups with relevant investors",
    ],
    benefits: [
      "Standardize selection and mentoring processes",
      "Improve startup readiness and funding outcomes",
      "Focus resources on the most promising ventures",
      "Offer a stronger value proposition to founders",
    ],
    example: "An accelerator uses Assessme to assess incoming startups, help selected teams build MVPs, and introduce top-performing ventures to investors.",
  },
];

const CTA_ACTIONS = [
  { label: "Let's Generate Report", icon: FileText, route: "/rttp", color: "bg-gradient-to-r from-blue-600 to-blue-800 hover:to-blue-900 text-white" },
  { label: "Make Prototype", icon: Cpu, route: "/prototype", color: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:to-emerald-800 text-white" },
  { label: "Register Investor", icon: Users, route: "/investors", color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:to-orange-700 text-white" },
  { label: "Submit Technology", icon: Rocket, route: "/technologies", color: "bg-gradient-to-r from-teal-600 to-teal-700 hover:to-teal-800 text-white" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function UserModal({ user, onClose }) {
  const navigate = useNavigate();
  const Icon = user.icon;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${user.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Use Case</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            {user.useCase}
          </p>

          <div className="mb-5">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide">How Assessme Helps</h4>
            <ul className="space-y-2">
              {user.howHelps.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-5">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide">Key Benefits</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {user.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5">
                  <span className="text-blue-600 font-bold text-xs mt-0.5">✦</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">Example</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed border-l-2 border-blue-500 pl-3">
              {user.example}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 p-4 rounded-b-2xl">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-3 font-medium uppercase tracking-wide">Get Started</p>
          <div className="grid grid-cols-2 gap-2">
            {CTA_ACTIONS.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.route}
                  onClick={() => { onClose(); navigate(action.route); }}
                  className={`${action.color} flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5`}
                >
                  <ActionIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WhoCanUseSection() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="who-can-use" className="scroll-mt-20 py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
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
            Built For Everyone
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Who Can Use{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Assesme?
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Built for the entire innovation ecosystem
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {USERS.map((user, index) => {
            const Icon = user.icon;
            return (
              <motion.button
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(user)}
                className="group bg-white dark:bg-slate-800/70 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 text-left w-full cursor-pointer"
              >
                <div className={`w-14 h-14 ${user.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {user.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {user.description}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more →
                </p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <UserModal user={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
