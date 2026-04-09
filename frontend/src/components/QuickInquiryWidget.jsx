import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Mail, X, ArrowRight } from "lucide-react";

export default function QuickInquiryWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 min-w-[220px]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quick Inquiry
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 mb-3">
              <a
                href="tel:+919667576014"
                className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                +91-9667576014
              </a>
              <a
                href="mailto:support@assesme.com"
                className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                support@assesme.com
              </a>
            </div>

            <Link
              to="/contact"
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              Send Message
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl transition-colors duration-200"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
