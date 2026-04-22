import { motion } from "framer-motion";
import { TrendingDown, Clock, AlertTriangle, XCircle } from "lucide-react";

const STATS = [
  {
    icon: TrendingDown,
    value: "9 in 10",
    label: "Innovations never reach commercialization",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/40",
  },
  {
    icon: Clock,
    value: "6–12 mo",
    label: "Wasted on unstructured investor screening",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40",
  },
  {
    icon: AlertTriangle,
    value: "$2T+",
    label: "Potential locked in unvalidated technology globally",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/40",
  },
];

const ROOT_CAUSES = [
  "No structured validation framework or TRL roadmap",
  "No clear commercialization or licensing pathway",
  "No access to aligned, sector-matched investors",
  "No working prototype or proof of concept to demonstrate",
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProblemSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            The Problem We Solved
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Innovation is abundant. Successful commercialization is rare.
            The gap between breakthrough and market isn't talent — it's infrastructure.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-3 gap-4 mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                variants={fadeUp}
                className={`rounded-2xl border p-6 text-center ${stat.bg}`}
              >
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                <div className={`text-3xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800"
          >
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  Startups build without direction. Researchers innovate without
                  market alignment. Investors receive a flood of unvalidated
                  pitches with no structured data to act on.
                </p>
                <p>
                  The innovation ecosystem is fragmented at every critical
                  junction — and the most promising technologies pay the highest
                  price.
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Most technologies fail not because they lack potential — but because
                  they lack the right system around them.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-4">
                  The Root Causes
                </p>
                <ul className="space-y-3">
                  {ROOT_CAUSES.map((cause) => (
                    <li key={cause} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-7 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl font-semibold text-white leading-relaxed">
              Assessme was built to fix this disconnect — transforming raw innovation
              into structured, validated, investment-ready opportunity.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
