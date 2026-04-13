import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { api } from "../../../services/api";

export default function InvestorsTab() {
  const [investors, setInvestors] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Investor Registrations</h2>
        <p className="text-neutral-600 mt-1">{investors.length} total registrations</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Partial Saves (Drafts)</h3>
        <p className="text-sm text-neutral-600 mb-4">{drafts.length} draft entries</p>
        {drafts.length === 0 ? (
          <p className="text-sm text-slate-600">No investor drafts yet.</p>
        ) : (
          <div className="space-y-3">
            {drafts.slice(0, 20).map((draft) => (
              <div key={draft.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-sm font-medium text-slate-800">{draft.email || "No email yet"}</p>
                  <p className="text-xs text-slate-500">Updated: {new Date(draft.updated_at).toLocaleString()}</p>
                </div>
                <p className="text-xs text-slate-600 mt-1">Step reached: {draft.step_reached} / 5</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {investors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">No investor registrations yet.</p>
        </div>
      ) : (
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
                      {inv.designation && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">
                          {inv.designation}
                        </span>
                      )}
                      {inv.investment_stage && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">
                          {inv.investment_stage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ticket Size</p>
                    <div className="flex flex-wrap gap-2">
                      {inv.ticket_size && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">
                          {inv.ticket_size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {inv.areas_of_interest && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Areas of Interest &amp; Details</span>
                    {inv.areas_of_interest.split(" | ").map((part, i) => {
                      const colonIdx = part.indexOf(": ");
                      if (colonIdx > -1) {
                        return (
                          <div key={i} className="flex gap-2 text-sm">
                            <span className="font-semibold text-neutral-600 flex-shrink-0 min-w-[100px]">{part.slice(0, colonIdx)}:</span>
                            <span className="text-neutral-700">{part.slice(colonIdx + 2)}</span>
                          </div>
                        );
                      }
                      return <p key={i} className="text-sm text-neutral-700">{part}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
