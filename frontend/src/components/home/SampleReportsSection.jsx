import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";

const SAMPLES = [
  {
    href: "/assets/pdf/advance-sample.pdf",
    title: "Advanced",
    subtitle: "Includes licensing and market insights",
    color: "from-teal-500 to-teal-700",
    badge: "7,500 tokens",
  },
  {
    href: "/assets/pdf/comprehensive-sample.pdf",
    title: "Comprehensive",
    subtitle: "Complete due diligence + commercialization plan",
    color: "from-emerald-500 to-emerald-700",
    badge: "9,000 tokens",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function SampleReportsSection() {
  return (
    <section className="pb-12 bg-slate-100 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Not sure yet? Download a sample report
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {SAMPLES.map((sample, i) => (
            <motion.a
              key={i}
              href={sample.href}
              download
              variants={fadeUp}
              whileHover={{ y: -2, scale: 1.01 }}
              className="group bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300 flex items-center gap-4 text-left"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${sample.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sample.title}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full flex-shrink-0">{sample.badge}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sample.subtitle}</p>
              </div>
              <Download className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
