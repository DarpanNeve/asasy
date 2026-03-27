import { useState, useEffect } from "react";
import { Search, Filter, Download, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

export default function ContactsTab() {
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [contactDateFilter, setContactDateFilter] = useState("");

  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  const fetchContactSubmissions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/contact/submissions");
      setContactSubmissions(data);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportContactSubmissions = async () => {
    try {
      const { data } = await api.get("/contact/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Contact submissions exported successfully");
    } catch {
      toast.error("Failed to export contact submissions");
    }
  };

  const filteredContactSubmissions = contactSubmissions
    .filter((submission) => {
      const matchesSearch =
        !contactSearchTerm ||
        submission.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(contactSearchTerm.toLowerCase());

      const matchesDate =
        !contactDateFilter ||
        new Date(submission.submitted_at).toDateString() === new Date(contactDateFilter).toDateString();

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

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
                placeholder="Search by name, email, or message..."
                value={contactSearchTerm}
                onChange={(e) => setContactSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-neutral-400" />
            <input
              type="date"
              value={contactDateFilter}
              onChange={(e) => setContactDateFilter(e.target.value)}
              className="input"
            />
            {contactDateFilter && (
              <button onClick={() => setContactDateFilter("")} className="btn-outline btn-sm">Clear</button>
            )}
            <button onClick={exportContactSubmissions} className="btn-primary flex items-center">
              <Download className="h-4 w-4 mr-1" /> Download CSV
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredContactSubmissions.map((submission) => (
          <div key={submission.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="p-2 bg-secondary-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{submission.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span>{submission.email}</span>
                      <span>{submission.phone}</span>
                    </div>
                    <div>Reason: <span className="font-semibold">{submission.reason ?? "contact"}</span></div>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                  <h4 className="font-medium text-neutral-900 mb-2">Message:</h4>
                  <p className="text-neutral-700">{submission.message}</p>
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-sm text-neutral-500">{new Date(submission.submitted_at).toLocaleDateString()}</div>
                <div className="text-xs text-neutral-400">{new Date(submission.submitted_at).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContactSubmissions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No contact submissions found</h3>
          <p className="text-neutral-600">
            {contactSearchTerm || contactDateFilter ? "Try adjusting your search or filter criteria" : "No contact form submissions yet"}
          </p>
        </div>
      )}
    </>
  );
}
