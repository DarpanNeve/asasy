import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { downloadGuidelinesPDF, SECTIONS, BEST_PRACTICES } from "../../utils/guidelinesPdf";

export default function GuidelinesSection() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <section className="py-10 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-2xl px-7 py-5 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Not sure what to write?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Follow our structured input guide to get the best assessment report.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.button
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm btn-glow"
              >
                View Guidelines
              </motion.button>
              <motion.button
                onClick={downloadGuidelinesPDF}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all duration-200 bg-white dark:bg-slate-700"
              >
                <Download className="h-4 w-4" />
                PDF
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[88vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Assesme AI – Input Guideline
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fill each section for the best assessment report
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={downloadGuidelinesPDF}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </motion.button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-2">
                {SECTIONS.map((section, i) => (
                  <div
                    key={i}
                    className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      onClick={() => setExpanded(expanded === i ? null : i)}
                    >
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {section.title}
                      </span>
                      {expanded === i ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <ul className="px-5 py-3 space-y-1.5">
                            {section.items.map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                              >
                                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl px-5 py-4">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    Guideline for Best Results
                  </p>
                  <div className="space-y-2">
                    {BEST_PRACTICES.map((b, i) => (
                      <p key={i} className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">{b.label} →</span>{" "}
                        <span className="text-blue-600 dark:text-blue-400">{b.detail}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
