import { motion } from "framer-motion";
import {
  Globe2,
  CheckCircle,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Banknote,
} from "lucide-react";

const MISSION_ITEMS = [
  {
    icon: Lightbulb,
    title: "Make innovation measurable",
    body: "Bring structure, scoring, and clarity to every stage of technology development — from idea to investment-ready asset.",
  },
  {
    icon: ShieldCheck,
    title: "Eliminate barriers to capital",
    body: "Break down the walls between breakthrough technology and the patient capital waiting to fund it.",
  },
  {
    icon: Users,
    title: "Empower every innovator",
    body: "Give startups, researchers, and R&D teams the tools, validation, and connections they need to scale with confidence.",
  },
  {
    icon: Banknote,
    title: "Bridge innovation and investment",
    body: "Create a trusted, data-driven channel where validated technologies meet strategic investors — efficiently and transparently.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function VisionMissionSection() {
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
            What Drives Us
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A clear north star and a concrete commitment to the innovators and investors we serve.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 text-white"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-10 -translate-x-8 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  Our Vision
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                To build the world's most trusted infrastructure for technology
                validation, investment, and commercialization.
              </h3>
              <p className="text-blue-100 leading-relaxed mb-5">
                A future where every breakthrough technology — regardless of geography,
                domain, or stage — finds a structured, data-driven path from concept
                to capital. Where innovation and investment converge without friction.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200">
                <ArrowUpRight className="w-4 h-4" />
                Global reach. Local impact.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Our Mission
              </span>
            </div>
            <motion.ul
              className="space-y-5"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {MISSION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.li key={item.title} variants={fadeUp} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-0.5">{item.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.body}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>

        <motion.div
          className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 p-7 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-sm font-bold uppercase tracking-widest text-teal-100 mb-2">
            Our Core Belief
          </p>
          <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            Every great innovation deserves a fair shot at the market.
            We provide the infrastructure to make that happen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
