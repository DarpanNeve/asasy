import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  UserCheck,
  TrendingUp,
  Building2,
  Briefcase,
  Users,
} from "lucide-react";

const CHECK_ITEMS = [
  "Curated deal flow",
  "Reduced due diligence effort",
  "Data-backed opportunities",
  "No random pitches",
];

const INVESTOR_TYPES = [
  { icon: UserCheck, label: "Angel Investors" },
  { icon: TrendingUp, label: "Venture Capitalists" },
  { icon: Building2, label: "Family Offices" },
  { icon: Briefcase, label: "Corporate Investors" },
  { icon: Users, label: "HNI" },
];

export default function ForInvestorsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
              For Investors
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              Stop Screening.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Start Investing.
              </span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Access only those technologies that have passed structured evaluation, show real validation, and match your investment thesis.
            </p>

            <ul className="space-y-3 mb-10">
              {CHECK_ITEMS.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/investors"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-full btn-glow transition-all duration-300"
              >
                Join as a Verified Investor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">
                Investor Types We Onboard
              </h3>
              <div className="space-y-3">
                {INVESTOR_TYPES.map((type, i) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.45 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                    >
                      <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                        {type.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
