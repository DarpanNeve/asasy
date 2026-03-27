import { useState, useEffect } from "react";
import { Search, Download, FileSpreadsheet, User, Mail, Phone, CreditCard, FileText, ChevronDown, ChevronRight, Hash, Calendar } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReports = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}/reports`);
      setUserReports(data);
    } catch {
      toast.error("Failed to fetch user reports");
    }
  };

  const fetchUserSubscriptions = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}/transactions`);
      setUserSubscriptions(data);
    } catch {
      toast.error("Failed to fetch user subscriptions");
    }
  };

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
      if (selectedUser === userId) {
        setSelectedUser(null);
        setUserReports([]);
        setUserSubscriptions([]);
      }
    } else {
      newExpanded.add(userId);
      setSelectedUser(userId);
      fetchUserReports(userId);
      fetchUserSubscriptions(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const { data } = await api.get(`/reports/${reportId}/download`, { responseType: "blob" });
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

  const exportUsersToExcel = async () => {
    try {
      const exportData = users.map((user) => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone || "Not provided",
        "Plan Name": user.plan_name || "Free",
        "Subscription Status": user.subscription_status || "none",
        "Reports Generated": user.reports_generated || 0,
        "Registration Date": new Date(user.created_at || Date.now()).toLocaleDateString(),
        "Last Login": user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      XLSX.writeFile(workbook, `asasy-users-${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("User list exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export user list");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <button onClick={exportUsersToExcel} className="btn-primary flex items-center">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export to Excel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleUserExpansion(user.id)}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{user.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <div className="flex items-center"><Mail className="h-4 w-4 mr-1" />{user.email}</div>
                    <div className="flex items-center"><Phone className="h-4 w-4 mr-1" />{user.phone}</div>
                    <div className="flex items-center"><CreditCard className="h-4 w-4 mr-1" />{user.plan_name} ({user.subscription_status})</div>
                    <div className="flex items-center"><FileText className="h-4 w-4 mr-1" />{user.reports_generated} reports</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-500">{expandedUsers.has(user.id) ? "Hide" : "View"} Details</span>
                {expandedUsers.has(user.id) ? <ChevronDown className="h-5 w-5 text-neutral-400" /> : <ChevronRight className="h-5 w-5 text-neutral-400" />}
              </div>
            </div>

            {expandedUsers.has(user.id) && selectedUser === user.id && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" /> Subscriptions ({userSubscriptions.length})
                  </h4>
                  {userSubscriptions.length === 0 ? <p className="text-neutral-600">No subscriptions found</p> : (
                    <div className="space-y-3">
                      {userSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="bg-neutral-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><span className="font-medium text-neutral-900">Plan:</span>
                              {subscription.razorpay_payment_id && <div className="mt-2 text-xs text-neutral-500">Payment ID: {subscription.razorpay_payment_id}</div>}
                            </div>
                            <div><span className="font-medium text-neutral-900">Status:</span>
                              <p className={`text-sm font-medium ${subscription.status === "active" ? "text-success-600" : subscription.status === "cancelled" ? "text-error-600" : "text-warning-600"}`}>{subscription.status}</p>
                            </div>
                            <div><span className="font-medium text-neutral-900">Amount:</span><p className="text-neutral-600">₹{subscription.amount_paid ? (subscription.amount_paid / 100).toFixed(2) : "0.00"}</p></div>
                            <div><span className="font-medium text-neutral-900">Package Name</span><p className="text-neutral-600">{subscription.package_name}</p></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" /> Reports ({userReports.length})
                  </h4>
                  {userReports.length === 0 ? <p className="text-neutral-600">No reports generated yet</p> : (
                    <div className="space-y-4">
                      {userReports.map((report) => (
                        <div key={report.id} className="bg-neutral-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 text-sm">
                              <div className="flex items-center space-x-4 mb-2">
                                <div className="flex items-center"><Hash className="h-4 w-4 text-neutral-400 mr-1" /><span className="font-mono text-neutral-600">{report.id.slice(-8)}</span></div>
                                <div className="flex items-center"><Calendar className="h-4 w-4 text-neutral-400 mr-1" /><span className="text-neutral-600">{new Date(report.created_at).toLocaleDateString()}</span></div>
                                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">{report.plan_name}</span>
                                <div className="ml-4">
                                  {report.file_url ? (
                                    <button onClick={() => handleDownloadReport(report.id)} className="btn-outline btn-sm"><Download className="h-4 w-4 mr-1" /> Download PDF</button>
                                  ) : (
                                    <span className="text-sm text-neutral-500 px-3 py-2 bg-neutral-200 rounded">{report.status}</span>
                                  )}
                                </div>
                              </div>
                            </div>
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
    </>
  );
}
