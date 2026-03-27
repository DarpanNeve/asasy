import { useState, useEffect } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { api } from "../../../services/api";

export default function TechnologiesTab() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const response = await api.get("/onboarding/technologies");
      setTechnologies(response.data);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
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
        <h2 className="text-2xl font-bold text-neutral-900">Technology Submissions</h2>
        <p className="text-neutral-600 mt-1">{technologies.length} total submissions</p>
      </div>
      {technologies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <FileSpreadsheet className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No technology submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0 border border-amber-100">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{tech.technology_title}</h3>
                      <p className="text-sm font-medium text-neutral-500">{tech.inventor_name} at <span className="text-neutral-700">{tech.organization}</span></p>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-neutral-700">{new Date(tech.submitted_at).toLocaleDateString()}</div>
                    <div className="text-xs text-neutral-400">{new Date(tech.submitted_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-neutral-100">
                  <div className="space-y-2 lg:col-span-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact</p>
                    <div className="text-sm space-y-1">
                      <p className="text-neutral-800 hover:text-blue-600 cursor-pointer">{tech.email}</p>
                      <p className="text-neutral-600">{tech.phone}</p>
                      <p className="text-neutral-600">{tech.country}</p>
                    </div>
                  </div>
                  <div className="space-y-4 lg:col-span-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Classification</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-100">{tech.category}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-md border border-red-100">{tech.ip_status}</span>
                        <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-md border border-cyan-100">{tech.trl_level}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Currently Seeking</p>
                      <p className="text-sm font-medium text-neutral-800">{tech.seeking}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 space-y-5 border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Description</span>
                    <p className="text-sm text-neutral-700 leading-relaxed">{tech.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Problem Solved
                      </span>
                      <p className="text-sm text-neutral-700 leading-relaxed">{tech.problem_solved}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Unique Value
                      </span>
                      <p className="text-sm text-neutral-700 leading-relaxed">{tech.unique_value}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
