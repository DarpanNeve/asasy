import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Sparkles,
  CreditCard,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, refreshUserData } = useAuth();
  const [stats, setStats] = useState({
    reportsGenerated: 0,
    totalReports: 0,
    reportsRemaining: 0,
    currentPlan: "Starter",
    activeSubscription: null,
    lastReportDate: null,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse] = await Promise.all([
        api.get("/users/me/stats"),
        api.get("/reports/recent?limit=5"),
      ]);

      console.log("Stats response:", statsResponse.data);
      setStats(statsResponse.data);
      setRecentReports(reportsResponse.data);
      
      // Refresh user data to get latest subscription info
      await refreshUserData();
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (data) => {
    setGenerating(true);
    try {
      const response = await api.post("/reports/generate", {
        idea: data.idea,
      });

      toast.success("Report generation started! You'll see it below when ready.");
      reset();
      fetchDashboardData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You've reached your report limit. Please upgrade to continue.");
      } else {
        toast.error(error.response?.data?.detail || "Failed to generate report");
      }
    } finally {
      setGenerating(false);
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

  const canGenerateReport = () => {
    if (stats.reportsRemaining === -1) return true; // Unlimited
    return stats.reportsRemaining > 0;
  };

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
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {user?.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="mt-2 text-neutral-600">
          Describe your technology idea below to generate an assessment report.
        </p>
      </div>

      {/* Plan Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              <CreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Current Plan</h3>
              <p className="text-primary-600 font-medium">{stats.currentPlan}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Reports Generated</h3>
              <p className="text-success-600 font-medium">{stats.reportsGenerated}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg mr-4">
              <Zap className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Reports Remaining</h3>
              <p className="text-warning-600 font-medium">
                {stats.reportsRemaining === -1 ? "Unlimited" : stats.reportsRemaining}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Warning */}
      {!canGenerateReport() && (
        <div className="card bg-error-50 border-error-200">
          <div className="flex items-center">
            <div className="p-3 bg-error-100 rounded-lg mr-4">
              <AlertTriangle className="h-6 w-6 text-error-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-error-900">
                Report Limit Reached
              </h3>
              <p className="text-error-700">
                You have used all your available reports for the {stats.currentPlan} plan.
                Upgrade to generate more reports.
              </p>
            </div>
            <a href="/subscription" className="btn-primary">
              Upgrade Now
            </a>
          </div>
        </div>
      )}

      {/* Report Generator */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Generate Technology Assessment Report
          </h2>
          <p className="text-neutral-600">
            Describe your technology idea, innovation, or concept to get a comprehensive analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleGenerateReport)} className="space-y-4">
          <div className="relative">
            <textarea
              {...register("idea", {
                required: "Please describe your technology idea",
                minLength: {
                  value: 50,
                  message: "Please provide at least 50 characters",
                },
              })}
              rows={6}
              className="w-full p-6 pr-16 border-2 border-neutral-200 rounded-xl shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-none"
              placeholder="Describe your technology idea here... For example: 'AI-powered smart home automation system with voice control and predictive analytics for energy optimization...'"
              disabled={generating || !canGenerateReport()}
            />
            <button
              type="submit"
              disabled={generating || !canGenerateReport()}
              className="absolute bottom-4 right-4 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {generating ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </div>
          {errors.idea && (
            <p className="text-error-600 text-sm ml-2">{errors.idea.message}</p>
          )}
        </form>

        {/* Status indicators */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-neutral-600">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-primary-500 mr-2" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-success-500 mr-2" />
              <span>Professional Report</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-warning-500 mr-2" />
              <span>Results in Minutes</span>
            </div>
          </div>
          <div className="text-sm text-neutral-600">
            Plan: <span className="font-medium text-primary-600">{stats.currentPlan}</span>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Your Reports</h3>
          <a
            href="/reports"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </a>
        </div>

        {recentReports.length > 0 ? (
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report._id}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 truncate">
                      {report.reportType || "Technology Assessment"}
                    </h4>
                    <p className="text-sm text-neutral-600 truncate">
                      {report.idea || "Technology analysis report"}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-neutral-500">
                        {new Date(report.generatedAt || report.created_at).toLocaleDateString()}
                      </span>
                      {report.plan_name && (
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                          {report.plan_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-900 mb-2">No reports yet</h4>
            <p className="text-neutral-600 mb-6">
              Generate your first technology assessment report using the form above.
            </p>
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {stats.currentPlan === "Starter" && (
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-900">
                  Upgrade for More Reports
                </h3>
                <p className="text-primary-700">
                  Get unlimited reports, advanced analysis, and priority support.
                </p>
              </div>
            </div>
            <a href="/subscription" className="btn-primary">
              View Plans
            </a>
          </div>
        </div>
      )}
    </div>
  );
}