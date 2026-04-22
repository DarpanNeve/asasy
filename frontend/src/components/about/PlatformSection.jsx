import { motion } from "framer-motion";
import { Cpu, BarChart3, LineChart, CheckCircle } from "lucide-react";

const PLATFORM_CAPABILITIES = [
  "AI-powered assessment engine",
  "TRL-based maturity scoring",
  "Market & IP intelligence integration",
  "Investor-tech matchmaking system",
  "Structured reporting framework",
];

const REPORTING_INCLUDES = [
  "Technical feasibility",
  "Market analysis",
  "IP & FTO insights",
  "Financial projections",
  "Go-to-market strategy",
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function PlatformSection() {
  return (
    <>
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
              Built for Speed. Designed for Accuracy.
            </h2>
            <p className="text-lg text-blue-700 dark:text-blue-400 font-semibold">
              Speed from AI. Confidence from expertise.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PLATFORM_CAPABILITIES.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5"
              >
                <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              From Insights to Investment Decisions
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {[
              { icon: BarChart3, color: "text-blue-600 dark:text-blue-400", title: "Advanced", desc: "Quick validation" },
              { icon: LineChart, color: "text-emerald-600 dark:text-emerald-400", title: "Comprehensive", desc: "Deep analysis, investor-ready intelligence" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-5 h-5 ${card.color}`} />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{card.title}</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5">Includes</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {REPORTING_INCLUDES.map((item) => (
                <div key={item} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
