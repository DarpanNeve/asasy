import { motion } from "framer-motion";
import { Lightbulb, Zap, FileText, Users } from "lucide-react";

const STEPS = [
  {
    icon: Lightbulb,
    title: "Describe Your Innovation",
    description: "Share details about your idea, prototype, or patent.",
  },
  {
    icon: Zap,
    title: "AI Review",
    description: "Assesme's engine analyses and validates across 30+ parameters.",
  },
  {
    icon: FileText,
    title: "Download Your Report",
    description: "Receive structured, investor-grade PDF instantly.",
  },
  {
    icon: Users,
    title: "Get Guidance",
    description: "Connect with experts for next steps, IP licensing, or funding.",
  },
];

export default function HowAssesmeWorksSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          How Assesme Works
        </motion.h2>

        <div className="space-y-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;

            const card = (
              <motion.div
                className="flex-1 bg-white dark:bg-slate-800 rounded-2xl px-7 py-6 shadow-sm border border-slate-100 dark:border-slate-700"
                initial={{ opacity: 0, x: isEven ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );

            const icon = (
              <motion.div
                className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.1 }}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>
            );

            return (
              <div
                key={i}
                className={`flex items-center gap-5 ${isEven ? "flex-row-reverse" : "flex-row"}`}
              >
                {card}
                {icon}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
