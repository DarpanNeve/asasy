import { motion } from "framer-motion";
import {
  FileSearch,
  Globe,
  TrendingUp,
  Map,
  FlaskConical,
  DollarSign,
} from "lucide-react";

const WHY_ITEMS = [
  {
    icon: FileSearch,
    color: "bg-blue-600",
    title: "Instant Technology Assessment",
    description: "Aligned with WIPO, EPO, NIH, and OECD standards.",
  },
  {
    icon: Globe,
    color: "bg-teal-600",
    title: "IP & Patentability Insights",
    description: "For national and international filings.",
  },
  {
    icon: TrendingUp,
    color: "bg-emerald-600",
    title: "Market, Competition & Risk Analysis",
    description: "For better decision-making at every stage.",
  },
  {
    icon: Map,
    color: "bg-blue-700",
    title: "Commercialisation Roadmaps",
    description: "For licensing, spin-offs, or partnerships.",
  },
  {
    icon: FlaskConical,
    color: "bg-teal-700",
    title: "TRL & Feasibility Checks",
    description: "For early-stage research and prototypes.",
  },
  {
    icon: DollarSign,
    color: "bg-orange-500",
    title: "Investor-Ready Documentation",
    description: "To improve fundraising success.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WhyAssesmeSection() {
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
            Why Assesme
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Most innovations never{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              reach the market
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Not because they lack potential but because they lack structured
            validation. Assesme solves this.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {WHY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group bg-slate-50 dark:bg-slate-800 p-7 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
