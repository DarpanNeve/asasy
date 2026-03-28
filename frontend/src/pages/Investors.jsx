import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  CheckCircle,
  Send,
  DollarSign,
  Target,
  ArrowRight,
  Sparkles,
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

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

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
    { icon: Target, title: "Curated Deal Flow", desc: "Access pre-screened technologies validated by RTTP professionals across 10+ sectors.", color: "from-blue-500 to-blue-700" },
    { icon: Globe, title: "Global Reach", desc: "Technologies from universities, R&D labs, and independent inventors across 5+ countries.", color: "from-teal-500 to-cyan-600" },
    { icon: BarChart3, title: "Due Diligence Ready", desc: "Every technology comes with a structured assessment report covering TRL, IP, and market data.", color: "from-emerald-500 to-teal-600" },
    { icon: DollarSign, title: "Multiple Entry Points", desc: "Invest directly, co-develop, or license — flexible structures to match your strategy.", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      {/* Hero */}
      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Investor Network
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Investor Onboarding
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join Assesme's investor network to access a curated pipeline of validated, IP-protected technologies ready for licensing, investment, or co-development.
            </p>
            <motion.a
              href="#register"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
            >
              Register as Investor <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Why Invest Through Assesme
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              A structured, transparent process for discovering and investing in validated innovations.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {whyPoints.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${p.color} rounded-xl flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-2">{p.title}</h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pie Chart Section */}
      {stats && stats.total > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
                Technology Portfolio
              </h2>
              <p className="text-lg text-neutral-500 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.total}</span>{" "}
                technologies registered across {stats.by_category.length} sectors
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <PieChartSVG data={stats.by_category} total={stats.total} />
              </motion.div>
              <motion.div
                className="space-y-3"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {stats.by_category.map((item, i) => {
                  const pct = Math.round((item.count / stats.total) * 100);
                  return (
                    <motion.div key={item.category} variants={fadeUp} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-neutral-700 dark:text-slate-300 truncate">{item.category}</span>
                          <span className="text-sm text-neutral-500 dark:text-slate-400 ml-2">{item.count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                            style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Registration Form */}
      <section id="register" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Investor Registration
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400">Complete the form below to join our investor network.</p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-100 mb-2">Registration Received</h3>
              <p className="text-neutral-600 dark:text-slate-400">Thank you for registering. A confirmation has been sent to your email. Our team will be in touch shortly.</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm space-y-6"
            >
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
              <TextareaField label="Areas of Interest" name="areas_of_interest" value={form.areas_of_interest} onChange={handleChange} placeholder="Describe specific technologies, sectors, or problem areas you are interested in..." rows={3} optional />
              <TextareaField label="Additional Message" name="message" value={form.message} onChange={handleChange} placeholder="Any specific requirements or questions..." rows={3} optional />
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </motion.button>
              </div>
            </motion.form>
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
  const innerR = 52;
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
    return { d, color: SECTOR_COLORS[i % SECTOR_COLORS.length] };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <motion.path
          key={i}
          d={s.d}
          fill={s.color}
          stroke="white"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#1e293b">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#64748b">Technologies</text>
    </svg>
  );
}
