import { motion } from "framer-motion";
import { Target } from "lucide-react";

const DIFFERENTIATORS = [
  "AI + Expert Hybrid Assessment",
  "TRL-Based Structured Evaluation",
  "Built-in Prototyping Support",
  "Dual Filtration (Investor + Technology)",
  "Intelligent Matching System",
  "End-to-End Commercialization Approach",
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function DifferentiatorsSection() {
  return (
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
            Most platforms offer either assessment, or investor listing, or development
            services. Assessme integrates everything into one structured pipeline.
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
  );
}
