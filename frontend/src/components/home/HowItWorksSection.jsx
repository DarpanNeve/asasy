import { motion } from "framer-motion";
import { Lightbulb, Zap, FileText, Users, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Lightbulb,
    color: "from-blue-500 to-blue-700",
    step: "01",
    title: "Describe Your Innovation",
    description: "Share details about your idea, prototype, or patent in the report generator.",
  },
  {
    icon: Zap,
    color: "from-teal-500 to-teal-700",
    step: "02",
    title: "AI Reviews 30+ Parameters",
    description: "Assesme's engine analyses and validates technical feasibility, IP, market fit, and risk.",
  },
  {
    icon: FileText,
    color: "from-emerald-500 to-emerald-700",
    step: "03",
    title: "Download Your Report",
    description: "Receive a structured, investor-grade PDF report instantly — ready to share.",
  },
  {
    icon: Users,
    color: "from-orange-500 to-orange-700",
    step: "04",
    title: "Get Expert Guidance",
    description: "Connect with RTTP professionals for IP licensing, funding strategy, or next steps.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
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
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Assesme
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From raw idea to investor-grade report in under 15 minutes
          </p>
        </motion.div>

        {/* Desktop: horizontal steps */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-teal-200 to-orange-200 dark:from-blue-800 dark:via-teal-800 dark:to-orange-800" />

            <div className="grid grid-cols-4 gap-8">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="relative text-center"
                  >
                    {/* Icon circle */}
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10`}
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

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
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
