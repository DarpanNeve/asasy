import { useState, useEffect } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
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
    .slice(0, 12);

export default function TechnologiesTab() {
  const [technologies, setTechnologies] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const [technologiesResponse, draftsResponse] = await Promise.all([
        api.get("/onboarding/technologies"),
        api.get("/onboarding/technologies/drafts"),
      ]);
      setTechnologies(technologiesResponse.data);
      setDrafts(draftsResponse.data);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
      toast.error("Failed to load technology records");
    } finally {
      setLoading(false);
    }
  };

  const exportTechnologiesToExcel = () => {
    try {
      const completeRows = technologies.map((tech) => ({
        Status: "Complete",
        "Technology Title": tech.technology_title || "",
        "Inventor Name": tech.inventor_name || "",
        Organization: tech.organization || "",
        Email: tech.email || "",
        Phone: tech.phone || "",
        Country: tech.country || "",
        Category: tech.category || "",
        "IP Status": tech.ip_status || "",
        "TRL Level": tech.trl_level || "",
        Description: tech.description || "",
        "Problem Solved": tech.problem_solved || "",
        "Unique Value": tech.unique_value || "",
        Seeking: tech.seeking || "",
        "Additional Info": tech.additional_info || "",
        "Step Reached": 5,
        "Submitted/Updated At": tech.submitted_at
          ? new Date(tech.submitted_at).toLocaleString()
          : "",
      }));

      const partialRows = drafts.map((draft) => ({
        Status: "Partial",
        "Technology Title": formatValue(draft.data?.technology_title),
        "Inventor Name": formatValue(draft.data?.inventor_name),
        Organization: formatValue(draft.data?.organization),
        Email: draft.email || formatValue(draft.data?.email),
        Phone: formatValue(draft.data?.phone),
        Country: formatValue(draft.data?.country),
        Category: formatValue(draft.data?.category),
        "IP Status": formatValue(draft.data?.ip_status),
        "TRL Level": formatValue(draft.data?.trl_level),
        Description: formatValue(draft.data?.description),
        "Problem Solved": formatValue(draft.data?.problem_solved),
        "Unique Value": formatValue(draft.data?.unique_value),
        Seeking: formatValue(draft.data?.seeking),
        "Additional Info": "",
        "Step Reached": draft.step_reached || 0,
        "Submitted/Updated At": draft.updated_at
          ? new Date(draft.updated_at).toLocaleString()
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet([...completeRows, ...partialRows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Technologies");
      XLSX.writeFile(
        workbook,
        `assesme-technologies-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("Technology records exported");
    } catch (error) {
      console.error("Technology export error:", error);
      toast.error("Failed to export technology records");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Technology Submissions</h2>
          <p className="text-neutral-600 mt-1">
            {technologies.length} complete, {drafts.length} partial
          </p>
        </div>
        <button onClick={exportTechnologiesToExcel} className="btn-primary flex items-center">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Partial Submissions</h3>
        <p className="text-sm text-neutral-600 mb-4">{drafts.length} draft records</p>
        {drafts.length === 0 ? (
          <p className="text-sm text-slate-600">No partial technology submissions.</p>
        ) : (
          <div className="space-y-3">
            {drafts.slice(0, 30).map((draft) => {
              const previewItems = extractDraftPreview(draft.data);
              return (
                <div key={draft.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-sm font-medium text-slate-800">
                      {draft.data?.technology_title || draft.email || "Untitled draft"}
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

      {technologies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">No complete technology submissions yet.</p>
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
                      <a href={`mailto:${tech.email}`} className="text-slate-800 hover:text-blue-600 transition-colors">{tech.email}</a>
                      <p className="text-slate-600">{tech.phone}</p>
                      <p className="text-slate-600">{tech.country}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Classification</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.category && <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">{tech.category}</span>}
                      {tech.trl_level && <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">{tech.trl_level}</span>}
                      {tech.ip_status && <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium px-2.5 py-1">{tech.ip_status}</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</p>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold px-2.5 py-1 inline-flex">
                      Complete Submission
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
                  {tech.description && (
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Description</span>
                      <p className="text-sm text-neutral-700 leading-relaxed">{tech.description}</p>
                    </div>
                  )}
                  {tech.problem_solved && (
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Problem Solved</span>
                      <p className="text-sm text-neutral-700 leading-relaxed">{tech.problem_solved}</p>
                    </div>
                  )}
                  {tech.unique_value && (
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Unique Value</span>
                      <p className="text-sm text-neutral-700 leading-relaxed">{tech.unique_value}</p>
                    </div>
                  )}
                  {tech.additional_info && (
                    <div className="pt-3 border-t border-slate-200 space-y-3">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Additional Details</span>
                      {tech.additional_info.split(" | ").map((part, i) => {
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
