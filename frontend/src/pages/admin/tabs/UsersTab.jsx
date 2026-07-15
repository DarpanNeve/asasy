import { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet, Search } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { api } from "../../../services/api";
import UserCard from "./UserCard";

const TIME_FILTERS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "incomplete", label: "Incomplete" },
];

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("month");
  const [sortOrder, setSortOrder] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, timeFilter, sortOrder, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        time_filter: timeFilter,
        sort: sortOrder,
        status_filter: statusFilter,
      };
      const { data } = await api.get("/admin/users", { params });
      setUsers(Array.isArray(data) ? data : []);
      if (expandedUserId && !data.some((item) => item.id === expandedUserId)) {
        setExpandedUserId(null);
        setUserReports([]);
        setUserTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const [reportsResponse, transactionsResponse] = await Promise.all([
        api.get(`/admin/users/${userId}/reports`),
        api.get(`/admin/users/${userId}/transactions`),
      ]);
      setUserReports(reportsResponse.data || []);
      setUserTransactions(transactionsResponse.data || []);
    } catch {
      toast.error("Failed to fetch user details");
    }
  };

  const toggleUserExpansion = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setUserReports([]);
      setUserTransactions([]);
      return;
    }
    setExpandedUserId(userId);
    await fetchUserDetails(userId);
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const { data } = await api.get(`/reports/${reportId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const exportUsersToExcel = () => {
    try {
      const exportData = users.map((user) => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone || "Not provided",
        "Profile Status": user.profile_status || "incomplete",
        "Reports Generated": user.reports_generated || 0,
        "Registration Date": user.created_at
          ? new Date(user.created_at).toLocaleString()
          : "",
        "Last Login": user.last_login
          ? new Date(user.last_login).toLocaleString()
          : "Never",
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(
        workbook,
        `assesme-users-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("User list exported");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export user list");
    }
  };

  const completedCount = useMemo(
    () => users.filter((user) => user.profile_status === "completed").length,
    [users],
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 dark:border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Users
            </h2>
            <p className="text-sm text-neutral-600 dark:text-slate-400">
              {users.length} users, {completedCount} completed profiles
            </p>
          </div>
          <button
            onClick={exportUsersToExcel}
            className="btn-primary flex items-center shrink-0"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or email"
              className="input pl-10"
            />
          </div>

          <select
            className="input lg:w-40 shrink-0"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 pt-1">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-slate-500">
              Status
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatusFilter(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    statusFilter === item.id
                      ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/30"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-slate-500">
              Time range
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {TIME_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimeFilter(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    timeFilter === item.id
                      ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/30"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isExpanded={expandedUserId === user.id}
            onToggle={toggleUserExpansion}
            userReports={expandedUserId === user.id ? userReports : []}
            userTransactions={expandedUserId === user.id ? userTransactions : []}
            onDownloadReport={handleDownloadReport}
          />
        ))}
      </div>
    </div>
  );
}
