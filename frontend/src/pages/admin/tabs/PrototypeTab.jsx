import { useState, useEffect } from "react";
import { Hash } from "lucide-react";
import { api } from "../../../services/api";

export default function PrototypeTab() {
  const [prototypeInquiries, setPrototypeInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrototypeInquiries();
  }, []);

  const fetchPrototypeInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/onboarding/prototype");
      setPrototypeInquiries(response.data);
    } catch (error) {
      console.error("Failed to fetch prototype inquiries:", error);
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
        <h2 className="text-2xl font-bold text-neutral-900">Prototype Inquiries</h2>
        <p className="text-neutral-600 mt-1">{prototypeInquiries.length} total inquiries</p>
      </div>
      {prototypeInquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <Hash className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No prototype inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prototypeInquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0 border border-rose-100">
                      <Hash className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{inq.full_name}</h3>
                      {inq.organization && <p className="text-sm font-medium text-neutral-500">{inq.organization}</p>}
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-neutral-700">{new Date(inq.submitted_at).toLocaleDateString()}</div>
                    <div className="text-xs text-neutral-400">{new Date(inq.submitted_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 pb-6 border-b border-neutral-100">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact</p>
                    <div className="text-sm space-y-1">
                      <p className="text-neutral-800">{inq.email}</p>
                      <p className="text-neutral-600">{inq.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Requirements</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2.5 py-1 bg-fuchsia-50 text-fuchsia-700 text-xs font-medium rounded-md border border-fuchsia-100">{inq.prototype_type}</span>
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-md border border-teal-100">{inq.timeline}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Budget Range</p>
                    <p className="text-sm font-semibold text-green-700 bg-green-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-green-100">
                      {inq.budget_range}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Technology Description</span>
                    <p className="text-sm text-neutral-700 leading-relaxed font-mono bg-white p-3 rounded border border-slate-200">{inq.tech_description}</p>
                  </div>
                  {inq.message && (
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Additional Notes</span>
                      <p className="text-sm text-neutral-700 leading-relaxed italic border-l-2 border-slate-300 pl-3">"{inq.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
