import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Hash,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

const TIME_FILTERS = [
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
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Users</h2>
            <p className="text-sm text-neutral-600">
              {users.length} users, {completedCount} completed profiles
            </p>
          </div>
          <button
            onClick={exportUsersToExcel}
            className="btn-primary flex items-center"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by Name or Email"
              className="input pl-10"
            />
          </div>

          <select
            className="input min-w-[140px]"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatusFilter(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  statusFilter === item.id
                    ? "bg-primary-50 text-primary-700 border-primary-200"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TIME_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTimeFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                timeFilter === item.id
                  ? "bg-primary-50 text-primary-700 border-primary-200"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleUserExpansion(user.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{user.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {user.reports_generated} reports
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded border ${
                        user.profile_status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {user.profile_status === "completed"
                        ? "Completed"
                        : "Incomplete"}
                    </span>
                  </div>
                </div>
              </div>
              {expandedUserId === user.id ? (
                <ChevronDown className="h-5 w-5 text-neutral-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              )}
            </div>

            {expandedUserId === user.id && (
              <div className="mt-6 pt-6 border-t border-neutral-200 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Transactions ({userTransactions.length})
                  </h4>
                  {userTransactions.length === 0 ? (
                    <p className="text-neutral-600">No transactions found</p>
                  ) : (
                    <div className="space-y-3">
                      {userTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="bg-neutral-50 rounded-lg p-4 text-sm"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="font-medium text-neutral-900">Package</p>
                              <p className="text-neutral-600">{transaction.package_name}</p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">Status</p>
                              <p className="text-neutral-600">{transaction.status}</p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">Amount</p>
                              <p className="text-neutral-600">
                                ₹{((transaction.amount_paid || 0) / 100).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">Payment Id</p>
                              <p className="text-neutral-600 break-all">
                                {transaction.razorpay_payment_id || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Reports ({userReports.length})
                  </h4>
                  {userReports.length === 0 ? (
                    <p className="text-neutral-600">No reports generated yet</p>
                  ) : (
                    <div className="space-y-4">
                      {userReports.map((report) => (
                        <div key={report.id} className="bg-neutral-50 rounded-lg p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="flex items-center text-neutral-600">
                                <Hash className="h-4 w-4 mr-1" />
                                {report.id.slice(-8)}
                              </span>
                              <span className="flex items-center text-neutral-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(report.created_at).toLocaleDateString()}
                              </span>
                              <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                                {report.plan_name || "Report"}
                              </span>
                            </div>
                            {report.file_url ? (
                              <button
                                onClick={() => handleDownloadReport(report.id)}
                                className="btn-outline btn-sm"
                              >
                                Download
                              </button>
                            ) : (
                              <span className="text-xs text-neutral-500">
                                Not completed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
