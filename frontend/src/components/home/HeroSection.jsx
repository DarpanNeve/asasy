import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const STATS = [
  { value: "Multi-Layer", label: "Evaluation System" },
  { value: "Strict", label: "Investor Filtering" },
  { value: "Intelligent", label: "Matching Engine" },
  { value: "Zero", label: "Random Listings" },
];

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Star className="h-4 w-4 text-amber-500 fill-current" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Structured. Validated. Matched.
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Where Serious Innovation
            <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Meets Serious Capital
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            A structured platform that evaluates technologies and connects them
            with the right investors based on data, not noise.
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
                to="/investors"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-full btn-glow transition-all duration-300"
              >
                Explore Verified Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/technologies"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300"
              >
                Submit Your Technology
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
