import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-900 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          className="max-w-3xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            If You're Serious, You're in the Right Place
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Whether you're building a technology or looking to invest Assessme
            ensures you engage with the right counterpart.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/investors"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                I'm an Investor Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/technologies"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
              >
                I'm a Founder Submit Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>

          <p className="text-sm text-blue-200">
            No listings. No randomness. Only evaluated matches.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
