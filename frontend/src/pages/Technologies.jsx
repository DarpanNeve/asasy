import { useState } from "react";
import {
  CheckCircle,
  Send,
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  Lightbulb,
  Globe,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
import { api } from "../services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  "AgriTech", "BioTech", "CleanTech", "DeepTech", "EdTech",
  "HealthTech", "InfoTech", "MedTech", "Manufacturing", "Other",
];

const IP_STATUSES = [
  "Patent Filed", "Patent Granted", "Provisional Application",
  "Trade Secret", "Copyright", "No IP Protection",
];

const TRL_LEVELS = [
  "TRL 1 - Basic Research",
  "TRL 2 - Technology Concept",
  "TRL 3 - Proof of Concept",
  "TRL 4 - Lab Validation",
  "TRL 5 - Relevant Environment",
  "TRL 6 - Prototype Demo",
  "TRL 7 - System Prototype",
  "TRL 8 - System Complete",
  "TRL 9 - Proven System",
];

export default function Technologies() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    technology_title: "", inventor_name: "", organization: "",
    email: "", phone: "", country: "", category: "", ip_status: "",
    trl_level: "", description: "", problem_solved: "", unique_value: "",
    seeking: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.technology_title) e.technology_title = "Required";
    if (!form.inventor_name) e.inventor_name = "Required";
    if (!form.organization) e.organization = "Required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.country) e.country = "Required";
    if (!form.category) e.category = "Required";
    if (!form.ip_status) e.ip_status = "Required";
    if (!form.trl_level) e.trl_level = "Required";
    if (!form.description || form.description.length < 20) e.description = "Minimum 20 characters";
    if (!form.problem_solved || form.problem_solved.length < 10) e.problem_solved = "Minimum 10 characters";
    if (!form.unique_value || form.unique_value.length < 10) e.unique_value = "Minimum 10 characters";
    if (!form.seeking) e.seeking = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post("/onboarding/technologies", form);
      setSubmitted(true);
      toast.success("Technology submitted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlights = [
    { icon: ShieldCheck, title: "IP Protection Guidance", desc: "Our team reviews your IP status and advises on strengthening your protection before commercialisation." },
    { icon: FlaskConical, title: "TRL-Based Assessment", desc: "Technologies are assessed using the standard Technology Readiness Level framework for objective benchmarking." },
    { icon: Globe, title: "Global Licensing Network", desc: "Gain access to industry partners, investors, and licensees across 5+ countries actively seeking innovations." },
    { icon: Lightbulb, title: "Expert Commercialisation Support", desc: "RTTP-certified professionals guide you through licensing, spin-off formation, and market entry strategy." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-40 md:py-56">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Submit Your Technology
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Are you an inventor, researcher, or IP holder with a technology ready for commercialisation? Register your innovation on Assesme's platform to connect with investors and licensees.
          </p>
          <a
            href="#submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors duration-200 shadow-sm"
          >
            Submit Technology <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Why Submit */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Why Register on Assesme</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">A structured path from research lab to commercial market.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{p.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section id="submit" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Technology Registration</h2>
            <p className="text-lg text-neutral-600">Complete the form below to list your technology on our platform.</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Submission Received</h3>
              <p className="text-neutral-600">Thank you for submitting your technology. A confirmation has been sent to your email. Our RTTP team will review and contact you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-base font-semibold text-neutral-800 mb-4 pb-2 border-b border-slate-100">Technology Details</h3>
                <div className="space-y-4">
                  <Field label="Technology Title" name="technology_title" value={form.technology_title} onChange={handleChange} error={errors.technology_title} placeholder="Name or brief title of the technology" />
                  <TextareaField label="Description" name="description" value={form.description} onChange={handleChange} error={errors.description} placeholder="Describe the technology, how it works, and its current state of development..." rows={4} required />
                  <TextareaField label="Problem Being Solved" name="problem_solved" value={form.problem_solved} onChange={handleChange} error={errors.problem_solved} placeholder="What problem does this technology address?" rows={3} required />
                  <TextareaField label="Unique Value Proposition" name="unique_value" value={form.unique_value} onChange={handleChange} error={errors.unique_value} placeholder="What makes this technology distinct from existing solutions?" rows={3} required />
                  <Field label="Seeking" name="seeking" value={form.seeking} onChange={handleChange} error={errors.seeking} placeholder="e.g. Licensing partner, Investment, Co-development" />
                </div>
              </div>

              {/* Classification */}
              <div>
                <h3 className="text-base font-semibold text-neutral-800 mb-4 pb-2 border-b border-slate-100">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectField label="Technology Category" name="category" value={form.category} onChange={handleChange} error={errors.category} options={CATEGORIES} placeholder="Select category" />
                  <SelectField label="IP Status" name="ip_status" value={form.ip_status} onChange={handleChange} error={errors.ip_status} options={IP_STATUSES} placeholder="Select IP status" />
                  <SelectField label="TRL Level" name="trl_level" value={form.trl_level} onChange={handleChange} error={errors.trl_level} options={TRL_LEVELS} placeholder="Select TRL level" />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-base font-semibold text-neutral-800 mb-4 pb-2 border-b border-slate-100">Inventor / Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Inventor / Submitter Name" name="inventor_name" value={form.inventor_name} onChange={handleChange} error={errors.inventor_name} placeholder="Full name" />
                  <Field label="Organization / Institution" name="organization" value={form.organization} onChange={handleChange} error={errors.organization} placeholder="University, company, or research lab" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
                  <Field label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} placeholder="Country" />
                </div>
              </div>

              <div className="text-center pt-2">
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-10 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-sm">
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit Technology"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
