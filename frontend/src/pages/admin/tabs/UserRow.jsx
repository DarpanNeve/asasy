import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  Hash,
} from "lucide-react";

export default function UserRow({
  user,
  isExpanded,
  onToggle,
  userReports,
  userTransactions,
  onDownloadReport,
}) {
  return (
    <>
      <tr
        className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-slate-700/40 transition-colors"
        onClick={() => onToggle(user.id)}
      >
        <td className="px-4 py-2.5">
          <div className="font-medium text-neutral-900 dark:text-white">
            {user.name}
          </div>
          <div className="text-xs text-neutral-500 dark:text-slate-400">
            {user.email}
          </div>
        </td>
        <td className="px-4 py-2.5 text-sm text-neutral-600 dark:text-slate-400 whitespace-nowrap">
          {user.phone}
        </td>
        <td className="px-4 py-2.5 text-sm text-neutral-600 dark:text-slate-400 text-center">
          {user.reports_generated}
        </td>
        <td className="px-4 py-2.5">
          <span
            className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${
              user.profile_status === "completed"
                ? "bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/30"
                : "bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/30"
            }`}
          >
            {user.profile_status === "completed" ? "Completed" : "Incomplete"}
          </span>
        </td>
        <td className="px-4 py-2.5 text-right">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-neutral-400 dark:text-slate-500 inline" />
          ) : (
            <ChevronRight className="h-4 w-4 text-neutral-400 dark:text-slate-500 inline" />
          )}
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-neutral-50/70 dark:bg-slate-900/40">
          <td colSpan={5} className="px-4 py-4">
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-slate-500 mb-2 flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  Transactions ({userTransactions.length})
                </h4>
                {userTransactions.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-slate-500">
                    No transactions found
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg p-3 text-sm"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              Package
                            </p>
                            <p className="text-neutral-600 dark:text-slate-400">
                              {transaction.package_name}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              Status
                            </p>
                            <p className="text-neutral-600 dark:text-slate-400">
                              {transaction.status}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              Amount
                            </p>
                            <p className="text-neutral-600 dark:text-slate-400">
                              ₹{((transaction.amount_paid || 0) / 100).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              Payment Id
                            </p>
                            <p className="text-neutral-600 dark:text-slate-400 break-all">
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
                <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-slate-500 mb-2 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Reports ({userReports.length})
                </h4>
                {userReports.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-slate-500">
                    No reports generated yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userReports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center text-neutral-600 dark:text-slate-400">
                              <Hash className="h-4 w-4 mr-1" />
                              {report.id.slice(-8)}
                            </span>
                            <span className="flex items-center text-neutral-600 dark:text-slate-400">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-500/15 dark:text-primary-400 px-2 py-1 rounded">
                              {report.plan_name || "Report"}
                            </span>
                          </div>
                          {report.file_url ? (
                            <button
                              onClick={() => onDownloadReport(report.id)}
                              className="btn-outline btn-sm"
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-xs text-neutral-500 dark:text-slate-500">
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
          </td>
        </tr>
      )}
    </>
  );
}
