import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
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
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
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
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">No technology submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{tech.technology_title}</h3>
                      <p className="text-sm font-medium text-neutral-500">
                        {tech.inventor_name} at <span className="text-neutral-700">{tech.organization}</span>
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-slate-700">{new Date(tech.submitted_at).toLocaleDateString()}</div>
                    <div className="text-xs text-neutral-400">{new Date(tech.submitted_at).toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 pb-6 border-b border-neutral-100">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact</p>
                    <div className="text-sm space-y-1">
                      <a href={"mailto:" + tech.email} className="text-slate-800 hover:text-blue-600 transition-colors">{tech.email}</a>
                      <p className="text-slate-600">{tech.phone}</p>
                      <p className="text-slate-600">{tech.country}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Classification</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.category && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">
                          {tech.category}
                        </span>
                      )}
                      {tech.trl_level && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">
                          {tech.trl_level}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">IP &amp; Seeking</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.ip_status && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">
                          {tech.ip_status}
                        </span>
                      )}
                    </div>
                    {tech.seeking && (
                      <p className="text-sm text-slate-700">{tech.seeking}</p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 space-y-5 border border-slate-100">
                  {tech.description && (
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Description</span>
                      <p className="text-sm text-neutral-700 leading-relaxed">{tech.description}</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
                    {tech.problem_solved && (
                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Problem Solved</span>
                        <p className="text-sm text-neutral-700 leading-relaxed">{tech.problem_solved}</p>
                      </div>
                    )}
                    {tech.unique_value && (
                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Solution / Unique Value</span>
                        <p className="text-sm text-neutral-700 leading-relaxed">{tech.unique_value}</p>
                      </div>
                    )}
                  </div>
                  {tech.additional_info && (
                    <div className="pt-3 border-t border-slate-200 space-y-3">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Additional Details</span>
                      {tech.additional_info.split(" | ").map((part, i) => {
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
