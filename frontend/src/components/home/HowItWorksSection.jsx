import { motion } from "framer-motion";
import { Upload, ClipboardCheck, Zap } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    color: "bg-blue-600",
    step: "01",
    title: "Submit & Register",
    description:
      "Founders submit their technologies. Investors register with their investment preferences and criteria.",
  },
  {
    icon: ClipboardCheck,
    color: "bg-teal-600",
    step: "02",
    title: "Evaluation & Filtration",
    description:
      "TRL-based assessment. Business and market validation. Investor credibility checks. Only serious participants proceed.",
  },
  {
    icon: Zap,
    color: "bg-emerald-600",
    step: "03",
    title: "Intelligent Matching",
    description:
      "Stage alignment, sector fit, and ticket size compatibility. Only relevant matches are created no random connections.",
  },
];

export default function HowItWorksSection() {
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
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Assessme
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three structured steps from submission to meaningful connection
          </p>
        </motion.div>

        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-blue-200 via-teal-200 to-emerald-200 dark:from-blue-800 dark:via-teal-800 dark:to-emerald-800" />

            <div className="grid grid-cols-3 gap-8">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.12,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative text-center"
                  >
                    <motion.div
                      className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10`}
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Icon className="h-9 w-9 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                        {index + 1}
                      </span>
                    </motion.div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex gap-5 bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div
                  className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
