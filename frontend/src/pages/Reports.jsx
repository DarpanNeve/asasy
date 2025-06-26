import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FileText,
  Plus,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
  }, [pagination.page, statusFilter]);

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

    // Check if user can generate reports
    if (!user.current_subscription_id && user.reports_generated >= 1) {
      toast.error(
        "You have reached your free report limit. Please upgrade to continue."
      );
      return;
    }

    setGenerating(true);
    try {
      const response = await api.post("/reports/generate", {
        idea: data.idea,
      });

      toast.success(
        "Report generation started! You will be notified when complete."
      );
      setShowGenerateForm(false);
      reset();
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId, title) => {
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
    }
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
        </div>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="btn-primary mt-4 sm:mt-0"
          disabled={
            !user?.current_subscription_id && user?.reports_generated >= 1
          }
        >
          <Plus className="h-5 w-5 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Usage Status */}
      {!user?.current_subscription_id && (
        <div className="card bg-warning-50 border-warning-200">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg mr-4">
              <Zap className="h-6 w-6 text-warning-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-warning-900">
                Free Plan Usage
              </h3>
              <p className="text-warning-700">
                You have used {user?.reports_generated || 0} out of 1 free
                report.
                {user?.reports_generated >= 1 && (
                  <span className="ml-1">
                    <a href="/subscription" className="underline font-medium">
                      Upgrade to generate unlimited reports.
                    </a>
                  </span>
                )}
              </p>
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
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleGenerateReport)}
                className="space-y-6"
              >
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
              disabled={
                !user?.current_subscription_id && user?.reports_generated >= 1
              }
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">
                      {report.title || "Technology Assessment Report"}
                    </h3>
                    <p className="text-sm text-neutral-600 truncate">
                      {report.idea}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {report.status === "completed" && (
                    <button
                      onClick={() => handleDownload(report.id, report.title)}
                      className="btn-outline btn-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  )}
                </div>
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
