import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

export default function RTTPSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-900 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          className="max-w-3xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <BookOpen className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Work with RTTP Experts
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Access Registered Technology Transfer Professionals (RTTPs) experts
            in IP licensing, tech transfer, and commercialisation.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/experts"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Work With Our Experts
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
