import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  Zap,
  X,
  Download,
  Eye,
  ExternalLink,
  Maximize2,
  Minimize2,
  CreditCard,
} from "lucide-react";
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

  const handleGenerateReport = async (data) => {
    if (!user) {
      toast.error("Please log in to generate reports");
      return;
    }

    // Check token requirements
    const tokenRequirements = {
      basic: 2500,
      advanced: 7500,
      comprehensive: 9000,
    };

    const requiredTokens = tokenRequirements[data.complexity];

    if (userBalance && userBalance.available_tokens < requiredTokens) {
      toast.error(
        `Insufficient tokens. Required: ${requiredTokens}, Available: ${userBalance.available_tokens}. Please purchase more tokens.`
      );
      setShowTokenPurchase(true);
      return;
    }
    setGenerating(true);
    try {
      const response = await api.post("/reports/generate", {
        idea: data.idea,
        complexity: data.complexity,
      });

      toast.success(
        "Report generation started! You will be notified when complete."
      );
      setShowGenerateForm(false);
      reset();
      fetchReports();
      fetchUserBalance(); // Refresh balance after report generation
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
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
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
          <h1 className="text-3xl font-bold text-neutral-900">Reports</h1>
          <p className="mt-2 text-neutral-600">
            Generate and manage your technology assessment reports.
          </p>
          {userBalance && (
            <div className="mt-2 flex items-center text-sm text-neutral-600">
              <Zap className="w-4 h-4 mr-1 text-blue-600" />
              <span>Available Tokens: </span>
              <span className="font-semibold text-blue-600 ml-1">
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
        {userBalance && userBalance.available_tokens < 2500 && (
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
      {showTokenPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Purchase Tokens
                </h2>
                <button
                  onClick={() => setShowTokenPurchase(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-6 w-6" />
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
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Generate New Report
                </h2>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                  disabled={generating}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleGenerateReport)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Report Complexity
                  </label>
                  <select
                    {...register("complexity", {
                      required: "Please select report complexity",
                    })}
                    className={`input ${
                      errors.complexity ? "input-error" : ""
                    }`}
                  >
                    <option value="">Select complexity level</option>
                    <option value="basic">
                      Basic (2,500 tokens) - Essential analysis
                    </option>
                    <option value="advanced">
                      Advanced (7,500 tokens) - Comprehensive analysis
                    </option>
                    <option value="comprehensive">
                      Comprehensive (9,000 tokens) - Premium analysis
                    </option>
                  </select>
                  {errors.complexity && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.complexity.message}
                    </p>
                  )}
                  {userBalance && (
                    <p className="mt-1 text-sm text-neutral-500">
                      Available tokens:{" "}
                      {userBalance.available_tokens.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Technology Idea or Concept
                  </label>
                  <textarea
                    {...register("idea", {
                      required: "Please describe your technology idea",
                      minLength: {
                        value: 50,
                        message: "Please provide at least 50 characters",
                      },
                    })}
                    rows={6}
                    className={`input ${errors.idea ? "input-error" : ""}`}
                    placeholder="Describe your technology idea, concept, or innovation. Be as detailed as possible to get a comprehensive assessment report. For example: 'AI-powered smart home automation system with voice control and predictive analytics for energy optimization...'"
                  />
                  {errors.idea && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.idea.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-neutral-500">
                    Provide a detailed description of your technology concept
                    for the best results.
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateForm(false)}
                    className="btn-outline"
                    disabled={generating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={generating}
                  >
                    {generating ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2" />
                        Generating...
                      </div>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPdfPreview && pdfUrl && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 ${
            isFullscreen ? "p-0" : ""
          }`}
        >
          <div
            className={`bg-white rounded-xl w-full h-full max-w-6xl max-h-[95vh] flex flex-col ${
              isFullscreen ? "max-w-none max-h-none rounded-none" : ""
            }`}
          >
            {/* PDF Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">
                PDF Preview
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
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
                  className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
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
                    <p className="text-neutral-600">Loading PDF preview...</p>
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
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedReport.title}
                </h2>
                <div className="flex items-center space-x-2">
                  {selectedReport.status === "completed" &&
                    selectedReport.pdf_url && (
                      <>
                        <button
                          onClick={() =>
                            handlePreviewPdf(
                              selectedReport.id,
                              selectedReport.title
                            )
                          }
                          className="btn-outline btn-sm"
                          disabled={pdfLoading}
                        >
                          {pdfLoading ? (
                            <div className="flex items-center">
                              <div className="spinner mr-1" />
                              Loading...
                            </div>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Preview PDF
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadReport(
                              selectedReport.id,
                              selectedReport.title
                            )
                          }
                          className="btn-primary btn-sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </button>
                      </>
                    )}
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Report Metadata */}
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-neutral-900">
                        Status:
                      </span>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedReport.status)}
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedReport.status
                          )}`}
                        >
                          {selectedReport.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-900">
                        Complexity:
                      </span>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(
                            selectedReport.complexity
                          )}`}
                        >
                          {selectedReport.complexity}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-900">
                        Created:
                      </span>
                      <p className="text-neutral-600 mt-1">
                        {new Date(
                          selectedReport.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-900">
                        Tokens Used:
                      </span>
                      <p className="text-neutral-600 mt-1">
                        {selectedReport.tokens_used || 0}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-900">
                        Type:
                      </span>
                      <p className="text-neutral-600 mt-1">
                        Technology Assessment
                      </p>
                    </div>
                  </div>
                </div>

                {/* Original Idea */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                    Original Idea
                  </h3>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-neutral-700">{selectedReport.idea}</p>
                  </div>
                </div>

                {/* Report Content Preview */}
                {selectedReport.content_preview && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      Executive Summary
                    </h3>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-700">
                        {selectedReport.content_preview}
                      </p>
                    </div>
                  </div>
                )}

                {/* Download Section */}
                {selectedReport.status === "completed" &&
                  selectedReport.pdf_url && (
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-primary-900">
                            Full Report Available
                          </h3>
                          <p className="text-primary-700 text-sm">
                            Preview or download the complete PDF report with
                            detailed analysis and insights.
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handlePreviewPdf(
                                selectedReport.id,
                                selectedReport.title
                              )
                            }
                            className="btn-outline"
                            disabled={pdfLoading}
                          >
                            {pdfLoading ? (
                              <div className="flex items-center">
                                <div className="spinner mr-2" />
                                Loading...
                              </div>
                            ) : (
                              <>
                                <Eye className="h-5 w-5 mr-2" />
                                Preview
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadReport(
                                selectedReport.id,
                                selectedReport.title
                              )
                            }
                            className="btn-primary"
                          >
                            <Download className="h-5 w-5 mr-2" />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Processing Status */}
                {selectedReport.status === "processing" && (
                  <div className="bg-warning-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-warning-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-warning-900">
                          Report in Progress
                        </h3>
                        <p className="text-warning-700 text-sm">
                          Your report is being generated. This usually takes
                          12-15 minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Failed Status */}
                {selectedReport.status === "failed" && (
                  <div className="bg-error-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="h-6 w-6 text-error-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-error-900">
                          Report Generation Failed
                        </h3>
                        <p className="text-error-700 text-sm">
                          {selectedReport.error_message ||
                            "An error occurred during report generation. Please try again."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
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
          <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {reports.length === 0 ? "No reports yet" : "No reports found"}
          </h3>
          <p className="text-neutral-600 mb-6">
            {reports.length === 0
              ? "Generate your first technology assessment report to get started."
              : "Try adjusting your search or filter criteria."}
          </p>
          {reports.length === 0 && (
            <button
              onClick={() => setShowGenerateForm(true)}
              className="btn-primary"
            >
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
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                  <div className="p-3 bg-primary-50 rounded-lg flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                      {report.title || "Technology Assessment Report"}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 break-words mt-1">
                      {report.idea}
                    </p>

                    {/* Mobile-first metadata layout */}
                    <div className="mt-3 space-y-2">
                      {/* Date and Status row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-neutral-500">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(report.status)}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </div>
                      </div>

                      {/* Processing message */}
                      {report.status === "processing" && (
                        <div className="text-xs text-neutral-500 bg-neutral-50 p-2 rounded">
                          Report will be available in 12-15 minutes
                        </div>
                      )}

                      {/* Complexity and tokens row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <div className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded inline-block w-fit">
                          {report.complexity}
                        </div>
                        {report.tokens_used && (
                          <div className="flex items-center text-xs text-neutral-500">
                            <Zap className="w-3 h-3 mr-1" />
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
          <p className="text-sm text-neutral-600">
            Showing {(pagination.page - 1) * 10 + 1} to{" "}
            {Math.min(pagination.page * 10, pagination.total)} of{" "}
            {pagination.total} reports
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="btn-outline btn-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.pages}
              className="btn-outline btn-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
