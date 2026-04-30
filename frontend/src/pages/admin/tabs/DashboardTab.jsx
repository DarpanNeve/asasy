import { useState, useEffect } from "react";
import { Users, FileText, Activity, DollarSign, CreditCard } from "lucide-react";
import { api } from "../../../services/api";

export default function DashboardTab({ onNavigateTab }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-600">Total Users</h3>
              <p className="text-2xl font-bold text-neutral-900">{stats.total_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-600">Total Reports</h3>
              <p className="text-2xl font-bold text-neutral-900">{stats.total_reports || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg mr-4">
              <Activity className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-600">Token Transactions</h3>
              <p className="text-2xl font-bold text-neutral-900">{stats.completed_transactions || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg mr-4">
              <DollarSign className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-neutral-900">₹{stats.total_revenue_inr?.toLocaleString() || "0"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab?.("users")}
          className="card hover:shadow-lg transition-shadow p-6 text-left"
        >
          <Users className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="font-semibold text-neutral-900">Manage Users</h3>
          <p className="text-sm text-neutral-600">View and manage user accounts</p>
        </button>

        <button
          onClick={() => onNavigateTab?.("blog")}
          className="card hover:shadow-lg transition-shadow p-6 text-left"
        >
          <FileText className="h-8 w-8 text-success-600 mb-2" />
          <h3 className="font-semibold text-neutral-900">Blog Posts</h3>
          <p className="text-sm text-neutral-600">Create and manage blog content</p>
        </button>

        <button
          onClick={() => onNavigateTab?.("press")}
          className="card hover:shadow-lg transition-shadow p-6 text-left"
        >
          <FileText className="h-8 w-8 text-warning-600 mb-2" />
          <h3 className="font-semibold text-neutral-900">Press Releases</h3>
          <p className="text-sm text-neutral-600">Manage press releases</p>
        </button>

        <button
          onClick={() => onNavigateTab?.("transactions")}
          className="card hover:shadow-lg transition-shadow p-6 text-left"
        >
          <CreditCard className="h-8 w-8 text-secondary-600 mb-2" />
          <h3 className="font-semibold text-neutral-900">Transactions</h3>
          <p className="text-sm text-neutral-600">View payment transactions</p>
        </button>
      </div>
    </>
  );
}
