import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, User } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

const formatValue = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const extractDraftPreview = (data) =>
  Object.entries(data || {})
    .filter(([, value]) => formatValue(value).trim().length > 0)
    .slice(0, 10);

const structuredInvestorRows = (inv) =>
  [
    ["Investor Type", inv.investor_type || inv.designation],
    ["LinkedIn", inv.linkedin],
    ["Sectors", formatValue(inv.sectors)],
    ["Geography Preference", inv.geography_preference],
    ["Number of Prior Investments", inv.num_investments],
    ["Years of Experience", inv.years_experience],
    ["Portfolio Description", inv.past_investments_desc],
    ["Beyond Funding", formatValue(inv.beyond_funding)],
    ["ROI Horizon", inv.roi_horizon],
    ["Areas of Interest", inv.areas_of_interest],
    ["Eligibility Confirmations", formatValue(inv.eligibility_confirmations)],
    ["Declaration Confirmed", formatValue(inv.declaration_confirmed)],
    ["Message", inv.message],
  ].filter(([, value]) => formatValue(value).trim().length > 0);

export default function InvestorsTab() {
  const [investors, setInvestors] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("complete");

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const [investorsResponse, draftsResponse] = await Promise.all([
        api.get("/onboarding/investors"),
        api.get("/onboarding/investors/drafts"),
      ]);
      setInvestors(investorsResponse.data);
      setDrafts(draftsResponse.data);
    } catch (error) {
      console.error("Failed to fetch investors:", error);
      toast.error("Failed to load investor records");
    } finally {
      setLoading(false);
    }
  };

  const exportInvestorsToExcel = () => {
    try {
      const completeRows = investors.map((inv) => ({
        Status: "Complete",
        Name: inv.full_name || "",
        Organization: inv.organization || "",
        Designation: inv.designation || "",
        "Investor Type": inv.investor_type || "",
        Email: inv.email || "",
        Phone: inv.phone || "",
        LinkedIn: inv.linkedin || "",
        Country: inv.country || "",
        "Investment Stage": inv.investment_stage || "",
        "Ticket Size": inv.ticket_size || "",
        Sectors: formatValue(inv.sectors),
        "Geography Preference": inv.geography_preference || "",
        "Number of Prior Investments": inv.num_investments || "",
        "Years of Experience": inv.years_experience || "",
        "Portfolio Description": inv.past_investments_desc || "",
        "Beyond Funding": formatValue(inv.beyond_funding),
        "ROI Horizon": inv.roi_horizon || "",
        "Areas of Interest": inv.areas_of_interest || "",
        "Eligibility Confirmations": formatValue(inv.eligibility_confirmations),
        "Declaration Confirmed": formatValue(inv.declaration_confirmed),
        Message: inv.message || "",
        "Step Reached": 5,
        "Submitted/Updated At": inv.submitted_at
          ? new Date(inv.submitted_at).toLocaleString()
          : "",
      }));

      const partialRows = drafts.map((draft) => ({
        Status: "Partial",
        Name: formatValue(draft.data?.full_name),
        Organization: formatValue(draft.data?.organization),
        Designation: formatValue(draft.data?.investor_type),
        Email: draft.email || formatValue(draft.data?.email),
        Phone: formatValue(draft.data?.phone),
        LinkedIn: formatValue(draft.data?.linkedin),
        Country: formatValue(draft.data?.country),
        "Investment Stage": formatValue(draft.data?.investment_stage),
        "Ticket Size": formatValue(draft.data?.ticket_size),
        Sectors: formatValue(draft.data?.sectors),
        "Geography Preference": formatValue(draft.data?.geography_preference),
        "Number of Prior Investments": formatValue(draft.data?.num_investments),
        "Years of Experience": formatValue(draft.data?.years_experience),
        "Portfolio Description": formatValue(draft.data?.past_investments_desc),
        "Beyond Funding": formatValue(draft.data?.beyond_funding),
        "ROI Horizon": formatValue(draft.data?.roi_horizon),
        "Areas of Interest": formatValue(draft.data?.areas_of_interest),
        Message: "",
        "Step Reached": draft.step_reached || 0,
        "Submitted/Updated At": draft.updated_at
          ? new Date(draft.updated_at).toLocaleString()
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet([...completeRows, ...partialRows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");
      XLSX.writeFile(
        workbook,
        `assesme-investors-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("Investor records exported");
    } catch (error) {
      console.error("Investor export error:", error);
      toast.error("Failed to export investor records");
    }
  };

  const renderPartial = () => (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">Partial Submissions</h3>
      <p className="text-sm text-neutral-600 mb-4">{drafts.length} draft records</p>
      {drafts.length === 0 ? (
        <p className="text-sm text-slate-600">No partial investor submissions.</p>
      ) : (
        <div className="space-y-3">
          {drafts.slice(0, 30).map((draft) => {
            const previewItems = extractDraftPreview(draft.data);
            return (
              <div key={draft.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-sm font-medium text-slate-800">
                    {draft.email || draft.data?.email || "No email yet"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Updated: {new Date(draft.updated_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-slate-600 mt-1 mb-2">
                  Step reached: {draft.step_reached} / 5
                </p>
                {previewItems.length === 0 ? (
                  <p className="text-xs text-slate-500">No draft fields captured yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {previewItems.map(([key, value]) => (
                      <div key={key} className="text-xs text-slate-700 bg-slate-50 rounded px-2 py-1.5">
                        <span className="font-semibold text-slate-600">{key.replaceAll("_", " ")}: </span>
                        <span>{formatValue(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderComplete = () => {
    if (investors.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">No complete investor registrations yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {investors.map((inv) => (
          <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{inv.full_name}</h3>
                    <p className="text-sm font-medium text-neutral-500">
                      {inv.designation} at <span className="text-neutral-700">{inv.organization}</span>
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-sm font-semibold text-slate-700">{new Date(inv.submitted_at).toLocaleDateString()}</div>
                  <div className="text-xs text-neutral-400">{new Date(inv.submitted_at).toLocaleTimeString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 pb-6 border-b border-neutral-100">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact</p>
                  <div className="text-sm space-y-1">
                    <p className="text-slate-800">{inv.email}</p>
                    <p className="text-slate-600">{inv.phone}</p>
                    <p className="text-slate-600">{inv.country}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Investment Profile</p>
                  <div className="flex flex-wrap gap-2">
                    {inv.investment_stage && <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">{inv.investment_stage}</span>}
                    {inv.ticket_size && <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">{inv.ticket_size}</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</p>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold px-2.5 py-1 inline-flex">
                    Complete Submission
                  </span>
                </div>
              </div>

              {inv.areas_of_interest && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Submission Details</span>
                  {inv.areas_of_interest.split(" | ").map((part, i) => {
                    const colonIdx = part.indexOf(": ");
                    if (colonIdx > -1) {
                      return (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="font-semibold text-neutral-600 flex-shrink-0 min-w-[130px]">{part.slice(0, colonIdx)}:</span>
                          <span className="text-neutral-700">{part.slice(colonIdx + 2)}</span>
                        </div>
                      );
                    }
                    return <p key={i} className="text-sm text-neutral-700">{part}</p>;
                  })}
                </div>
              )}
              {structuredInvestorRows(inv).length > 0 && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3 mt-4">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Structured Details</span>
                  {structuredInvestorRows(inv).map(([label, value]) => (
                    <div key={label} className="flex gap-2 text-sm">
                      <span className="font-semibold text-neutral-600 flex-shrink-0 min-w-[170px]">{label}:</span>
                      <span className="text-neutral-700">{formatValue(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Investor Registrations</h2>
          <p className="text-neutral-600 mt-1">
            {investors.length} complete, {drafts.length} partial
          </p>
        </div>
        <button onClick={exportInvestorsToExcel} className="btn-primary flex items-center">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-2 inline-flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("complete")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "complete"
              ? "bg-primary-50 text-primary-700"
              : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Complete ({investors.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("partial")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "partial"
              ? "bg-primary-50 text-primary-700"
              : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Partial ({drafts.length})
        </button>
      </div>

      {activeTab === "partial" ? renderPartial() : renderComplete()}
    </div>
  );
}
