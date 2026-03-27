import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  CheckCircle,
  Send,
  PieChart,
  DollarSign,
  Briefcase,
  Target,
  ArrowRight,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Field, SelectField, TextareaField } from "../components/FormFields";
import { api } from "../services/api";
import toast from "react-hot-toast";

const SECTORS = [
  "AgriTech", "BioTech", "CleanTech", "DeepTech", "EdTech",
  "HealthTech", "InfoTech", "MedTech", "Manufacturing", "Other",
];
const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth Stage", "Any Stage"];
const TICKETS = ["< ₹25L", "₹25L – ₹1Cr", "₹1Cr – ₹5Cr", "₹5Cr – ₹25Cr", "₹25Cr+"];

const SECTOR_COLORS = [
  "#2563eb", "#0891b2", "#059669", "#d97706", "#7c3aed",
  "#db2777", "#dc2626", "#65a30d", "#0284c7", "#6b7280",
];

export default function Investors() {
  const [stats, setStats] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "", organization: "", designation: "", email: "",
    phone: "", country: "", investment_focus: "", investment_stage: "",
    ticket_size: "", areas_of_interest: "", message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/onboarding/technologies/stats");
      setStats(res.data);
    } catch {
      // stats optional
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name) e.full_name = "Required";
    if (!form.organization) e.organization = "Required";
    if (!form.designation) e.designation = "Required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.country) e.country = "Required";
    if (!form.investment_focus) e.investment_focus = "Required";
    if (!form.investment_stage) e.investment_stage = "Required";
    if (!form.ticket_size) e.ticket_size = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post("/onboarding/investors", form);
      setSubmitted(true);
      toast.success("Registration submitted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyPoints = [
    { icon: Target, title: "Curated Deal Flow", desc: "Access pre-screened technologies validated by RTTP professionals across 10+ sectors." },
    { icon: Globe, title: "Global Reach", desc: "Technologies from universities, R&D labs, and independent inventors across 5+ countries." },
    { icon: BarChart3, title: "Due Diligence Ready", desc: "Every technology comes with a structured assessment report covering TRL, IP, and market data." },
    { icon: DollarSign, title: "Multiple Entry Points", desc: "Invest directly, co-develop, or license — flexible structures to match your strategy." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-40 md:py-56">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Investor Onboarding
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Join Assesme's investor network to access a curated pipeline of validated, IP-protected technologies ready for licensing, investment, or co-development.
          </p>
          <a
            href="#register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors duration-200 shadow-sm"
          >
            Register as Investor <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Why Invest Through Assesme</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">A structured, transparent process for discovering and investing in validated innovations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyPoints.map((p, i) => {
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

      {/* Pie Chart Section */}
      {stats && stats.total > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Technology Portfolio
              </h2>
              <p className="text-lg text-neutral-600">
                <span className="font-semibold text-blue-600">{stats.total}</span> technologies registered across {stats.by_category.length} sectors
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <PieChartSVG data={stats.by_category} total={stats.total} />
              </div>
              <div className="space-y-3">
                {stats.by_category.map((item, i) => {
                  const pct = Math.round((item.count / stats.total) * 100);
                  return (
                    <div key={item.category} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-neutral-700 truncate">{item.category}</span>
                          <span className="text-sm text-neutral-500 ml-2">{item.count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Registration Form */}
      <section id="register" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Investor Registration</h2>
            <p className="text-lg text-neutral-600">Complete the form below to join our investor network.</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Registration Received</h3>
              <p className="text-neutral-600">Thank you for registering. A confirmation has been sent to your email. Our team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} placeholder="Your full name" />
                <Field label="Organization / Fund" name="organization" value={form.organization} onChange={handleChange} error={errors.organization} placeholder="Organization or fund name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Designation / Role" name="designation" value={form.designation} onChange={handleChange} error={errors.designation} placeholder="e.g. Managing Partner" />
                <Field label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} placeholder="Country" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField label="Investment Focus" name="investment_focus" value={form.investment_focus} onChange={handleChange} error={errors.investment_focus} options={SECTORS} placeholder="Select sector" />
                <SelectField label="Investment Stage" name="investment_stage" value={form.investment_stage} onChange={handleChange} error={errors.investment_stage} options={STAGES} placeholder="Select stage" />
                <SelectField label="Ticket Size" name="ticket_size" value={form.ticket_size} onChange={handleChange} error={errors.ticket_size} options={TICKETS} placeholder="Select range" />
              </div>
              <TextareaField label="Areas of Interest" name="areas_of_interest" value={form.areas_of_interest} onChange={handleChange} placeholder="Describe specific technologies, sectors, or problem areas you are interested in..." rows={3} />
              <TextareaField label="Additional Message" name="message" value={form.message} onChange={handleChange} placeholder="Any specific requirements or questions..." rows={3} />
              <div className="text-center pt-2">
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-10 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-sm">
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
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

function PieChartSVG({ data, total }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const innerR = 50;
  let cumulative = 0;

  const slices = data.map((item, i) => {
    const pct = item.count / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(endAngle);
    const yi1 = cy + innerR * Math.sin(endAngle);
    const xi2 = cx + innerR * Math.cos(startAngle);
    const yi2 = cy + innerR * Math.sin(startAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi2} ${yi2} Z`;
    return { d, color: SECTOR_COLORS[i % SECTOR_COLORS.length], label: item.category };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} stroke="white" strokeWidth="2" opacity="0.9" />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#1e293b">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#64748b">Technologies</text>
    </svg>
  );
}

