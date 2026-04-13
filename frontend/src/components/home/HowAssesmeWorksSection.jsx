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
    description:
      "Assesme's engine analyses and validates across 30+ parameters.",
  },
  {
    icon: FileText,
    title: "Download Your Report",
    description: "Receive structured, investor-grade PDF instantly.",
  },
  {
    icon: Users,
    title: "Get Guidance",
    description:
      "Connect with experts for next steps, IP licensing, or funding.",
  },
];

export default function HowAssesmeWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-100 to-white dark:from-slate-950 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-950 dark:text-slate-100 leading-tight">
            How Assessment Works in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Assesme
            </span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;

            const card = (
              <motion.div
                className="flex-1 bg-white dark:bg-slate-900 rounded-2xl px-7 py-6 shadow-md border border-slate-300 dark:border-slate-700"
                initial={{ opacity: 0, x: isEven ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {step.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
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
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>
            );

            return (
              <div
                key={i}
                className={`flex items-center gap-5 ${isEven ? "md:flex-row-reverse" : "md:flex-row"} flex-row`}
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
