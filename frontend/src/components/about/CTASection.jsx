import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-700 to-blue-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Making Innovation Investable
          </h2>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
            Ideas alone don't create impact. Validated, structured, and funded innovations do.
          </p>
          <p className="text-base md:text-lg text-blue-100 mb-4">
            Assessme ensures every technology moves forward with:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {["Clarity", "Strategy", "Execution"].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full border border-blue-200/30 text-blue-50 bg-white/10 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-xl md:text-2xl font-semibold text-white">
            From idea to investment — we make innovation real.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
