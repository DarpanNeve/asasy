import { useState } from "react";
import {
  CheckCircle,
  Send,
  ArrowRight,
  Cpu,
  Wrench,
  Code2,
  Box,
  FlaskConical,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
import { api } from "../services/api";
import toast from "react-hot-toast";

const PROTOTYPE_TYPES = [
  "Electronic / Hardware",
  "Mechanical / Structural",
  "Software / Digital MVP",
  "3D Model / CAD",
  "Chemical / Material",
  "Other",
];

const BUDGETS = [
  "< ₹1L",
  "₹1L – ₹5L",
  "₹5L – ₹20L",
  "₹20L – ₹50L",
  "₹50L+",
];

const TIMELINES = [
  "< 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "> 12 months",
];

const SERVICES = [
  {
    icon: Cpu,
    title: "Electronic & Hardware Prototyping",
    desc: "PCB design, embedded systems, sensor integration, and functional hardware builds for IoT, robotics, and instrumentation projects.",
  },
  {
    icon: Wrench,
    title: "Mechanical & Structural Builds",
    desc: "Precision fabrication, CNC machining, and structural prototyping for mechanical devices, medical equipment, and industrial applications.",
  },
  {
    icon: Code2,
    title: "Software & Digital MVPs",
    desc: "Rapid development of web apps, mobile apps, and SaaS MVPs to validate your digital product concept with real users.",
  },
  {
    icon: Box,
    title: "3D Modelling & CAD",
    desc: "Detailed 3D models, technical drawings, and CAD files for patent applications, investor presentations, or manufacturing handoffs.",
  },
  {
    icon: FlaskConical,
    title: "Chemical & Material Prototyping",
    desc: "Lab-scale formulation, material testing, and proof-of-concept builds for chemical, pharmaceutical, and advanced materials innovations.",
  },
  {
    icon: Shield,
    title: "IP Documentation Support",
    desc: "Technical drawings, functional specifications, and prototype documentation to strengthen patent applications and licensing packages.",
  },
];

const PROCESS = [
  { step: "01", title: "Submit Inquiry", desc: "Fill out the inquiry form with your technology description, prototype type, budget, and timeline." },
  { step: "02", title: "Initial Assessment", desc: "Our prototyping team reviews your submission and contacts you within 48 hours to discuss feasibility and approach." },
  { step: "03", title: "Scope & Proposal", desc: "We prepare a detailed scope of work with cost and timeline estimates for your review and approval." },
  { step: "04", title: "Prototype Development", desc: "Development begins with regular milestone updates. You retain full IP ownership throughout the process." },
  { step: "05", title: "Delivery & Documentation", desc: "Receive the completed prototype along with technical documentation, CAD files, and IP-ready deliverables." },
];

export default function Prototype() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "", organization: "", email: "", phone: "",
    tech_description: "", prototype_type: "", budget_range: "",
    timeline: "", message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name) e.full_name = "Required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.tech_description || form.tech_description.length < 20) e.tech_description = "Minimum 20 characters";
    if (!form.prototype_type) e.prototype_type = "Required";
    if (!form.budget_range) e.budget_range = "Required";
    if (!form.timeline) e.timeline = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post("/onboarding/prototype", form);
      setSubmitted(true);
      toast.success("Inquiry submitted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-40 md:py-56">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Prototype Development Services
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-10">
            From concept to working prototype — Assesme connects innovators with specialist engineers and developers to build, validate, and document their technology for commercialisation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#inquiry"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm"
            >
              Submit Inquiry <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="border border-slate-300 text-neutral-700 hover:bg-slate-100 font-medium px-8 py-3 rounded-lg inline-flex items-center justify-center gap-2 transition-colors duration-200"
            >
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Prototyping Capabilities</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Specialist support across hardware, software, mechanical, and materials domains.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">A clear, milestone-driven process from initial inquiry to final delivery.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PROCESS.map((p, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-6 border border-slate-200 h-full">
                  <div className="text-3xl font-bold text-blue-100 mb-3">{p.step}</div>
                  <h3 className="font-semibold text-neutral-900 mb-2 text-sm">{p.title}</h3>
                  <p className="text-neutral-600 text-xs leading-relaxed">{p.desc}</p>
                </div>
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">IP Stays Yours</h3>
              <p className="text-neutral-600 text-sm">All prototypes are developed under NDA. You retain full intellectual property ownership.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">48-Hour Response</h3>
              <p className="text-neutral-600 text-sm">Our prototyping team responds to all inquiries within 48 business hours with an initial feasibility assessment.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Specialist Engineers</h3>
              <p className="text-neutral-600 text-sm">Work with domain-specific engineers handpicked for your technology type and sector.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Submit a Prototype Inquiry</h2>
            <p className="text-lg text-neutral-600">Describe your technology and requirements. Our team will respond within 48 hours.</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Inquiry Received</h3>
              <p className="text-neutral-600">Thank you for reaching out. A confirmation has been sent to your email. Our prototyping team will contact you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} placeholder="Your full name" />
                <Field label="Organization" name="organization" value={form.organization} onChange={handleChange} placeholder="Company, university, or individual" optional />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
              </div>
              <TextareaField
                label="Technology Description"
                name="tech_description"
                value={form.tech_description}
                onChange={handleChange}
                error={errors.tech_description}
                placeholder="Describe the technology you want prototyped. Include the core function, target application, and any existing technical documentation..."
                rows={5}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField label="Prototype Type" name="prototype_type" value={form.prototype_type} onChange={handleChange} error={errors.prototype_type} options={PROTOTYPE_TYPES} placeholder="Select type" />
                <SelectField label="Budget Range" name="budget_range" value={form.budget_range} onChange={handleChange} error={errors.budget_range} options={BUDGETS} placeholder="Select budget" />
                <SelectField label="Timeline" name="timeline" value={form.timeline} onChange={handleChange} error={errors.timeline} options={TIMELINES} placeholder="Select timeline" />
              </div>
              <TextareaField
                label="Additional Notes"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any specific requirements, constraints, or questions for our team..."
                rows={3}
                optional
              />
              <div className="text-center pt-2">
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-10 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-sm">
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
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
