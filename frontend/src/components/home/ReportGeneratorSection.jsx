import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertTriangle, X, Zap, BookOpen, Download } from "lucide-react";
import { downloadGuidelinesPDF } from "../../utils/guidelinesPdf";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import toast from "react-hot-toast";

const MAX_CHARS = 10000;

const COMPLEXITY_OPTIONS = [
  { id: "advanced", name: "Advanced", tokens: "7,500", description: "Comprehensive analysis", color: "teal" },
  { id: "comprehensive", name: "Comprehensive", tokens: "9,000", description: "Premium analysis", color: "emerald" },
];

export default function ReportGeneratorSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedComplexity, setSelectedComplexity] = useState("advanced");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [assured, setAssured] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const ideaValue = watch("idea", "");

  const closeConfirm = () => {
    setShowConfirm(false);
    setAssured(false);
  };

  const onFormSubmit = (data) => {
    if (!user) {
      toast.error("Please sign in to generate reports");
      navigate("/login");
      return;
    }
    setPendingData(data);
    setShowConfirm(true);
  };

  const handleConfirmedGenerate = async () => {
    setShowConfirm(false);
    const data = pendingData;
    const tokenRequirements = { advanced: 7500, comprehensive: 9000 };
    const requiredTokens = tokenRequirements[selectedComplexity];

    try {
      const balanceResponse = await api.get("/tokens/balance");
      if (balanceResponse.data.available_tokens < requiredTokens) {
        toast.error(`Insufficient tokens. Required: ${requiredTokens}, Available: ${balanceResponse.data.available_tokens}.`);
        navigate("/pricing");
        return;
      }
    } catch {
      // Let backend handle validation
    }

    setIsGenerating(true);
    try {
      await api.post("/reports/generate", { idea: data.idea, complexity: selectedComplexity });
      toast.success(`Report generation started using ${requiredTokens} tokens!`);
      reset();
      setCharCount(0);
      navigate("/reports");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response?.data?.detail || "Insufficient tokens. Please purchase more tokens.");
        navigate("/pricing");
      } else {
        toast.error(error.response?.data?.detail || "Failed to generate report");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedOption = COMPLEXITY_OPTIONS.find((o) => o.id === selectedComplexity);

  return (
    <>
      <section id="generate-report" className="py-24 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Generate Your Assessment
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Describe your innovation and get an investor-grade report in minutes.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-transparent dark:border-slate-700"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Choose Report Complexity
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COMPLEXITY_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedComplexity(option.id)}
                      disabled={isGenerating}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedComplexity === option.id
                          ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20 shadow-lg`
                          : "border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${selectedComplexity === option.id ? `text-${option.color}-700 dark:text-${option.color}-400` : "text-slate-700 dark:text-slate-300"}`}>
                          {option.name}
                        </h3>
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${selectedComplexity === option.id ? `border-${option.color}-500 bg-${option.color}-500` : "border-slate-300 dark:border-slate-500"}`}>
                          {selectedComplexity === option.id && <div className="w-full h-full rounded-full bg-white scale-50" />}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{option.tokens} tokens</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{option.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Describe Your Technology Innovation
                  </label>
                  <span className={`text-xs font-medium tabular-nums ${ideaValue?.length > MAX_CHARS * 0.9 ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-slate-500"}`}>
                    {ideaValue?.length ?? 0} / {MAX_CHARS.toLocaleString()}
                  </span>
                </div>
                <textarea
                  {...register("idea", {
                    required: "Please describe your technology idea",
                    minLength: { value: 50, message: "Please provide at least 50 characters" },
                    maxLength: { value: MAX_CHARS, message: `Description cannot exceed ${MAX_CHARS.toLocaleString()} characters` },
                  })}
                  rows={6}
                  maxLength={MAX_CHARS}
                  className="w-full p-6 border-2 border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-none resize-none text-lg transition-all duration-300 hover:shadow-md bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Include: technology name, core function, intended application, current development stage, key innovations, target market..."
                  disabled={isGenerating}
                />
                {errors.idea && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.idea.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isGenerating}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl btn-glow flex items-center justify-center gap-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Generating Your Report...
                  </>
                ) : (
                  <>
                    Generate Assessment Report
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-8"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={closeConfirm}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Confirm Report Generation</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Please review before proceeding</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6 space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Report Type</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{selectedOption?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Tokens Required</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedOption?.tokens} tokens</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Generation Time</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">12–15 minutes</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  Tokens will be deducted immediately. Reports cannot be cancelled once generation begins. Tokens are refunded automatically if generation fails.
                </p>
              </div>

              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-3 mb-4">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  For the best report quality, ensure your input follows our structured guidelines.{" "}
                  <button
                    type="button"
                    onClick={downloadGuidelinesPDF}
                    className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download Guidelines
                  </button>
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-6 select-none">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={assured}
                    onChange={(e) => setAssured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-150 flex items-center justify-center">
                    {assured && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  I confirm that my input is detailed and complete. I understand that report quality depends on the information provided.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={closeConfirm}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleConfirmedGenerate}
                  disabled={!assured}
                  whileHover={assured ? { scale: 1.02 } : {}}
                  whileTap={assured ? { scale: 0.98 } : {}}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold btn-glow transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Confirm & Generate
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
