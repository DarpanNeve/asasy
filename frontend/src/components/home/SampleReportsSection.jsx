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
    <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-slate-100 mb-3">
            Download Sample Reports
          </h2>
          <p className="text-neutral-500 dark:text-slate-400 mb-10">See the quality and depth of our AI-generated reports before purchasing.</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
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
              whileHover={{ y: -4, scale: 1.01 }}
              className="group bg-white dark:bg-slate-900 p-7 rounded-2xl border border-neutral-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 flex items-start gap-5 text-left"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${sample.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sample.title}
                  </h3>
                  <span className="text-xs text-neutral-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{sample.badge}</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-slate-400">{sample.subtitle}</p>
              </div>
              <Download className="h-5 w-5 text-neutral-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
