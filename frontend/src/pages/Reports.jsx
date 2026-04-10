import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  Zap,
  X,
  Download,
  Eye,
  Maximize2,
  Minimize2,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const MAX_IDEA_CHARS = 10000;
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import TokenPricingSection from "../components/TokenPricingSection";

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingReportData, setPendingReportData] = useState(null);
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    fetchReports();
    if (user) {
      fetchUserBalance();
    }
  }, [pagination.page, statusFilter, user]);

  const fetchUserBalance = async () => {
    try {
      const response = await api.get("/tokens/balance");
      setUserBalance(response.data);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await api.get("/reports", { params });
      setReports(response.data.reports);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = (data) => {
    if (!user) {
      toast.error("Please log in to generate reports");
      return;
    }
    const tokenRequirements = { advanced: 7500, comprehensive: 9000 };
    const requiredTokens = tokenRequirements[data.complexity];
    if (userBalance && userBalance.available_tokens < requiredTokens) {
      toast.error(
        `Insufficient tokens. Required: ${requiredTokens}, Available: ${userBalance.available_tokens}. Please purchase more tokens.`
      );
      setShowTokenPurchase(true);
      return;
    }
    setPendingReportData(data);
    setShowGenerateForm(false);
    setShowConfirm(true);
  };

  const handleConfirmedGenerate = async () => {
    setShowConfirm(false);
    const data = pendingReportData;
    setGenerating(true);
    try {
      await api.post("/reports/generate", {
        idea: data.idea,
        complexity: data.complexity,
      });
      toast.success("Report generation started! You will be notified when complete.");
      reset();
      fetchReports();
      fetchUserBalance();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      setSelectedReport(response.data);
      setShowReportModal(true);
    } catch (error) {
      console.error("Failed to fetch report details:", error);
      toast.error("Failed to load report details");
    }
  };

  const handlePreviewPdf = async (reportId, reportTitle) => {
    if (!reportId) {
      toast.error("Report ID not available");
      return;
    }

    setPdfLoading(true);
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPdfPreview(true);

      toast.success("PDF preview loaded");
    } catch (error) {
      console.error("Failed to load PDF preview:", error);
      toast.error("Failed to load PDF preview");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadReport = async (reportId, reportTitle) => {
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportTitle || "report"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Failed to download report:", error);
      toast.error("Failed to download report");
    }
  };

  const closePdfPreview = () => {
    setShowPdfPreview(false);
    setIsFullscreen(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-warning-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return <Clock className="h-5 w-5 text-neutral-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-success-100 text-success-800";
      case "processing":
        return "bg-warning-100 text-warning-800";
      case "failed":
        return "bg-error-100 text-error-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "basic":
        return "bg-slate-100 text-slate-700";
      case "advanced":
        return "bg-teal-100 text-teal-800";
      case "comprehensive":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };
  const filteredReports = reports.filter(
    (report) =>
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.idea?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-slate-100">Reports</h1>
          <p className="mt-2 text-neutral-600 dark:text-slate-400">
            Generate and manage your technology assessment reports.
          </p>
          {userBalance && (
            <div className="mt-2 flex items-center text-sm text-neutral-600 dark:text-slate-400">
              <Zap className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span>Available Tokens: </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">
                {userBalance.available_tokens.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Generate Report
        </button>
        {userBalance && userBalance.available_tokens < 7500 && (
          <button
            onClick={() => setShowTokenPurchase(true)}
            className="btn-outline mt-4 sm:mt-0 sm:ml-2"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Buy Tokens
          </button>
        )}
      </div>

      {/* Token Purchase Modal */}
      <AnimatePresence>
        {showTokenPurchase && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Purchase Tokens</h2>
                  <button
                    onClick={() => setShowTokenPurchase(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <TokenPricingSection
                  compact={true}
                  showReportTypes={false}
                  showHeader={false}
                  onTokenPurchase={() => {
                    setShowTokenPurchase(false);
                    fetchUserBalance();
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Generate Modal */}
      <AnimatePresence>
        {showConfirm && pendingReportData && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full p-8"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Confirm Report Generation</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Please review before proceeding</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-5 space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Report Type</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{pendingReportData.complexity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Tokens Required</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {pendingReportData.complexity === "advanced" ? "7,500" : "9,000"} tokens
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Generation Time</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">12–15 minutes</span>
                </div>
                {userBalance && (
                  <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Your Balance</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{userBalance.available_tokens.toLocaleString()} tokens</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 mb-6">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  Tokens will be deducted immediately. Reports cannot be cancelled once generation begins. Tokens are refunded automatically if generation fails.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfirm(false); setShowGenerateForm(true); }}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmedGenerate}
                  disabled={generating}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Generating...
                    </span>
                  ) : "Confirm & Generate"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showGenerateForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Generate New Report
                  </h2>
                  <button
                    onClick={() => setShowGenerateForm(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    disabled={generating}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(handleGenerateReport)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Report Complexity
                    </label>
                    <select
                      {...register("complexity", { required: "Please select report complexity" })}
                      className={`input dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 ${errors.complexity ? "input-error" : ""}`}
                    >
                      <option value="">Select complexity level</option>
                      <option value="advanced">Advanced (7,500 tokens) — Comprehensive analysis</option>
                      <option value="comprehensive">Comprehensive (9,000 tokens) — Premium analysis</option>
                    </select>
                    {errors.complexity && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.complexity.message}</p>
                    )}
                    {userBalance && (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Available tokens: <span className="font-semibold text-blue-600 dark:text-blue-400">{userBalance.available_tokens.toLocaleString()}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Technology Idea or Concept
                      </label>
                      <span className={`text-xs font-medium tabular-nums ${(watch("idea")?.length ?? 0) > MAX_IDEA_CHARS * 0.9 ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-slate-500"}`}>
                        {(watch("idea")?.length ?? 0).toLocaleString()} / {MAX_IDEA_CHARS.toLocaleString()}
                      </span>
                    </div>
                    <textarea
                      {...register("idea", {
                        required: "Please describe your technology idea",
                        minLength: { value: 50, message: "Please provide at least 50 characters" },
                        maxLength: { value: MAX_IDEA_CHARS, message: `Description cannot exceed ${MAX_IDEA_CHARS.toLocaleString()} characters` },
                      })}
                      rows={6}
                      maxLength={MAX_IDEA_CHARS}
                      className={`input dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.idea ? "input-error" : ""}`}
                      placeholder="Describe your technology idea, concept, or innovation. Include: technology name, core function, development stage, key innovations, target market..."
                    />
                    {errors.idea && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.idea.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowGenerateForm(false)}
                      className="btn-outline dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      disabled={generating}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={generating}>
                      <Zap className="h-5 w-5 mr-2" />
                      Generate Report
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      {showPdfPreview && pdfUrl && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 ${
            isFullscreen ? "p-0" : ""
          }`}
        >
          <div
            className={`bg-white dark:bg-slate-900 rounded-xl w-full h-full max-w-6xl max-h-[95vh] flex flex-col ${
              isFullscreen ? "max-w-none max-h-none rounded-none" : ""
            }`}
          >
            {/* PDF Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-slate-100">
                PDF Preview
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={closePdfPreview}
                  className="p-2 text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 transition-colors"
                  title="Close Preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              {pdfLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-slate-400">Loading PDF preview...</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                  style={{ minHeight: "500px" }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      <AnimatePresence>
        {showReportModal && selectedReport && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedReport.title}
                </h2>
                <div className="flex items-center space-x-2">
                  {selectedReport.status === "completed" && selectedReport.pdf_url && (
                    <>
                      <button
                        onClick={() => handlePreviewPdf(selectedReport.id, selectedReport.title)}
                        className="btn-outline btn-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        disabled={pdfLoading}
                      >
                        {pdfLoading ? <><div className="spinner mr-1" />Loading...</> : <><Eye className="h-4 w-4 mr-1" />Preview PDF</>}
                      </button>
                      <button
                        onClick={() => handleDownloadReport(selectedReport.id, selectedReport.title)}
                        className="btn-primary btn-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />Download PDF
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedReport.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Complexity:</span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(selectedReport.complexity)}`}>
                          {selectedReport.complexity}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Created:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{new Date(selectedReport.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Tokens Used:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{selectedReport.tokens_used || 0}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Type:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Technology Assessment</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Original Idea</h3>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300">{selectedReport.idea}</p>
                  </div>
                </div>

                {selectedReport.content_preview && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Executive Summary</h3>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-700 dark:text-slate-300">{selectedReport.content_preview}</p>
                    </div>
                  </div>
                )}

                {selectedReport.status === "completed" && selectedReport.pdf_url && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200">Full Report Available</h3>
                        <p className="text-blue-700 dark:text-blue-400 text-sm">Preview or download the complete PDF report.</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handlePreviewPdf(selectedReport.id, selectedReport.title)} className="btn-outline btn-sm dark:border-blue-700 dark:text-blue-300" disabled={pdfLoading}>
                          {pdfLoading ? <><div className="spinner mr-2" />Loading...</> : <><Eye className="h-5 w-5 mr-2" />Preview</>}
                        </button>
                        <button onClick={() => handleDownloadReport(selectedReport.id, selectedReport.title)} className="btn-primary btn-sm">
                          <Download className="h-5 w-5 mr-2" />Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.status === "processing" && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-900 dark:text-amber-200">Report in Progress</h3>
                        <p className="text-amber-700 dark:text-amber-400 text-sm">Your report is being generated. This usually takes 12–15 minutes.</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.status === "failed" && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
                    <div className="flex items-center">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-200">Report Generation Failed</h3>
                        <p className="text-red-700 dark:text-red-400 text-sm">{selectedReport.error_message || "An error occurred during report generation. Please try again."}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {reports.length === 0 ? "No reports yet" : "No reports found"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {reports.length === 0
              ? "Generate your first technology assessment report to get started."
              : "Try adjusting your search or filter criteria."}
          </p>
          {reports.length === 0 && (
            <button onClick={() => setShowGenerateForm(true)} className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Generate Your First Report
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="card dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                      {report.title || "Technology Assessment Report"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 break-words mt-1">
                      {report.idea}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(report.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                      </div>

                      {report.status === "processing" && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                          Report will be available in 12–15 minutes
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-lg inline-block w-fit font-medium capitalize">
                          {report.complexity}
                        </div>
                        {report.tokens_used && (
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <Zap className="w-3 h-3 mr-1 text-blue-500 dark:text-blue-400" />
                            {report.tokens_used} tokens
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons - mobile responsive */}
                {report.status === "completed" && report.pdf_url && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4">
                    <button
                      onClick={() => handlePreviewPdf(report.id, report.title)}
                      className="btn-outline btn-sm flex items-center justify-center"
                      disabled={pdfLoading}
                    >
                      {pdfLoading ? (
                        <div className="spinner" />
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadReport(report.id, report.title)
                      }
                      className="btn-primary btn-sm flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {(pagination.page - 1) * 10 + 1} to{" "}
            {Math.min(pagination.page * 10, pagination.total)} of{" "}
            {pagination.total} reports
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="btn-outline btn-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="btn-outline btn-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
