import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BENEFITS = [
  {
    audience: "Startups",
    audienceColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
    benefit: "De-risk your business model before scaling.",
  },
  {
    audience: "Researchers",
    audienceColor: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400",
    benefit: "Ensure your work has real-world commercialisation potential.",
  },
  {
    audience: "Corporates",
    audienceColor: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    benefit: "Benchmark internal R&D against global industry trends.",
  },
  {
    audience: "Investors",
    audienceColor: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400",
    benefit: "Standardised, objective evaluation of your deal flow.",
  },
  {
    audience: "Policy Makers",
    audienceColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
    benefit: "Transparent, data-driven innovation assessment.",
  },
  {
    audience: "Accelerators",
    audienceColor: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400",
    benefit: "Identify high-potential ventures faster with objective insights.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
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
            Real-World Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Benefits of Using{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Assesme
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            One platform, value for every stakeholder in the innovation ecosystem
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {BENEFITS.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${item.audienceColor}`}>
                {item.audience}
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.benefit}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-full shadow-lg btn-glow transition-all duration-300"
            >
              See Pricing & Token Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
