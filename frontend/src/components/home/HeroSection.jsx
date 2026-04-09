import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users } from "lucide-react";

const STATS = [
  { value: "9,840+", label: "Innovators Trust Us" },
  { value: "Multi-Layer", label: "Evaluation System" },
  { value: "WIPO/EPO", label: "Aligned Standards" },
  { value: "Zero", label: "Random Listings" },
];

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-white dark:bg-slate-950 pt-5 pb-20 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Trusted by 9,840 Innovators Worldwide
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Validate, Protect, and Scale
            <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Your Innovation with Confidence
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-l text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            India’s First AI-Powered Platform to Evaluate,Build,and Fund
            Innovation.
          </motion.p>
          <motion.p
            className="text-lg md:text-l text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Technology assessment, prototyping support, access to verified
            investors through one structured ecosystem.
          </motion.p>
          <motion.p
            className="text-sm text-slate-500 dark:text-slate-400 mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6 }}
          >
            No listings. No randomness.{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Only evaluated matches.
            </span>
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/reports"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-full btn-glow transition-all duration-300"
              >
                Generate Your Report
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.65,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-900 px-6 py-5 text-center"
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
