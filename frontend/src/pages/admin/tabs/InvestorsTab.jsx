import { useState, useEffect } from "react";
import { User, TrendingUp } from "lucide-react";
import { api } from "../../../services/api";

export default function InvestorsTab() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/onboarding/investors");
      setInvestors(response.data);
    } catch (error) {
      console.error("Failed to fetch investors:", error);
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Investor Registrations</h2>
        <p className="text-neutral-600 mt-1">{investors.length} total registrations</p>
      </div>
      {investors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <TrendingUp className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No investor registrations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {investors.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0 border border-indigo-100">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{inv.full_name}</h3>
                      <p className="text-sm font-medium text-neutral-500">{inv.designation} at <span className="text-neutral-700">{inv.organization}</span></p>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-neutral-700">{new Date(inv.submitted_at).toLocaleDateString()}</div>
                    <div className="text-xs text-neutral-400">{new Date(inv.submitted_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 pb-6 border-b border-neutral-100">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact Details</p>
                    <div className="text-sm space-y-1">
                      <p className="text-neutral-800 hover:text-blue-600 transition-colors cursor-pointer">{inv.email}</p>
                      <p className="text-neutral-600">{inv.phone}</p>
                      <p className="text-neutral-600">{inv.country}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Investment Focus</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">{inv.investment_focus}</span>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100">{inv.investment_stage} Stage</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ticket Size</p>
                    <p className="text-sm font-semibold text-neutral-800 bg-neutral-100 inline-flex items-center px-3 py-1.5 rounded-lg border border-neutral-200">
                      {inv.ticket_size}
                    </p>
                  </div>
                </div>

                {(inv.areas_of_interest || inv.message) && (
                  <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
                    {inv.areas_of_interest && (
                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Areas of Interest</span>
                        <p className="text-sm text-neutral-700 leading-relaxed">{inv.areas_of_interest}</p>
                      </div>
                    )}
                    {inv.message && (
                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Personal Message</span>
                        <p className="text-sm text-neutral-700 leading-relaxed italic">"{inv.message}"</p>
                      </div>
                    )}
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
