import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/transactions");
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = async () => {
    try {
      const exportData = transactions.map((transaction) => ({
        "Transaction ID": transaction.id,
        "User Name": transaction.user_name,
        "User Email": transaction.user_email,
        "Plan Name": transaction.plan_name,
        "Amount (₹)": transaction.amount_paid
          ? (transaction.amount_paid / 100).toFixed(2)
          : "0.00",
        Status: transaction.status,
        "Razorpay Payment ID": transaction.razorpay_payment_id || "",
        "Razorpay Order ID": transaction.razorpay_order_id || "",
        "Active Until": new Date(transaction.active_until).toLocaleDateString(),
        "Created At": new Date(transaction.created_at).toLocaleDateString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      XLSX.writeFile(
        workbook,
        `Assesme-transactions-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export transactions");
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
      <div className="mb-8">
        <div className="flex justify-end">
          <button onClick={exportTransactions} className="btn-primary flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export Transactions
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Payment ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{transaction.user_name}</div>
                      <div className="text-sm text-neutral-500">{transaction.user_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{transaction.plan_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    ₹{transaction.amount_paid ? (transaction.amount_paid / 100).toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === "active" ? "bg-success-100 text-success-800"
                      : transaction.status === "cancelled" ? "bg-error-100 text-error-800"
                      : "bg-warning-100 text-warning-800"
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono">
                    {transaction.razorpay_payment_id?.slice(-8) || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
