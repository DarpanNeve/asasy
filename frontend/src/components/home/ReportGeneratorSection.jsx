import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import toast from "react-hot-toast";

export default function ReportGeneratorSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedComplexity, setSelectedComplexity] = useState("advanced");

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleGenerateReport = async (data) => {
    if (!user) {
      toast.error("Please sign in to generate reports");
      navigate("/login");
      return;
    }

    const tokenRequirements = { advanced: 7500, comprehensive: 9000 };
    const requiredTokens = tokenRequirements[selectedComplexity];

    try {
      const balanceResponse = await api.get("/tokens/balance");
      if (balanceResponse.data.available_tokens < requiredTokens) {
        toast.error(`Insufficient tokens. Required: ${requiredTokens}, Available: ${balanceResponse.data.available_tokens}.`);
        navigate("/login-pricing");
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
      navigate("/reports");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response?.data?.detail || "Insufficient tokens. Please purchase more tokens.");
        navigate("/login-pricing");
      } else {
        toast.error(error.response?.data?.detail || "Failed to generate report");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const COMPLEXITY_OPTIONS = [
    { id: "advanced", name: "Advanced", tokens: "7,500", description: "Comprehensive analysis", color: "teal" },
    { id: "comprehensive", name: "Comprehensive", tokens: "9,000", description: "Premium analysis", color: "emerald" },
  ];

  return (
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
          <p className="text-slate-500 dark:text-slate-400">Describe your innovation and get an investor-grade report in minutes.</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-transparent dark:border-slate-700"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit(handleGenerateReport)} className="space-y-6">
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
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Describe Your Technology Innovation
              </label>
              <div className="relative">
                <textarea
                  {...register("idea", {
                    required: "Please describe your technology idea",
                    minLength: { value: 50, message: "Please provide at least 50 characters" },
                  })}
                  rows={6}
                  className="w-full p-6 pr-16 border-2 border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-none resize-none text-lg transition-all duration-300 hover:shadow-md bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Include the following elements for better analysis: technology name, core function, intended application, current development stage, key innovations, target market..."
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <Send className="h-6 w-6" />
                  )}
                </button>
              </div>
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
  );
}
