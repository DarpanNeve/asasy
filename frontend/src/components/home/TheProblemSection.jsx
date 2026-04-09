import { motion } from "framer-motion";
import { Search, UserX, BarChart2 } from "lucide-react";

const PROBLEMS = [
  {
    icon: Search,
    title: "Investors waste time filtering weak, unvalidated pitches",
  },
  {
    icon: UserX,
    title: "Founders struggle to reach the right investors",
  },
  {
    icon: BarChart2,
    title: "Platforms prioritize visibility over quality",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function TheProblemSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
            The Problem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            The Current System is{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Broken
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PROBLEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive"
              >
                <div className="w-12 h-12 bg-slate-700 dark:bg-slate-600 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-snug">
                  {item.title}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="max-w-2xl mx-auto border-l-4 border-red-400 dark:border-red-500 bg-white dark:bg-slate-900 rounded-xl px-6 py-5 shadow-sm"
        >
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-center text-lg">
            Result? Time lost. Capital misallocated. Innovation ignored.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
