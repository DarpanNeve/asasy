import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  TrendingUp,
  Shield,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  DollarSign,
  Building,
  FileText,
  Phone,
  User,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const calDirectURL = "https://cal.com/assesme/15min";

const SERVICES = [
  {
    area: "Tech Scouting",
    description: "Validate your innovation and position it correctly",
    icon: Lightbulb,
    color: "bg-amber-500",
    details:
      "Our experts help you identify market gaps, validate technical feasibility, and position your innovation for maximum commercial impact.",
    features: [
      "Market Gap Analysis",
      "Technical Feasibility",
      "Commercial Positioning",
    ],
  },
  {
    area: "IP Licensing Strategy",
    description: "Help you license to industry, startups, or global players",
    icon: FileText,
    color: "bg-blue-600",
    details:
      "Develop comprehensive licensing strategies, negotiate terms, and connect with potential licensees across industries and geographies.",
    features: ["Licensing Strategy", "Term Negotiation", "Global Connections"],
  },
  {
    area: "Startup Formation",
    description: "Guide business model, cap tables, and investor readiness",
    icon: TrendingUp,
    color: "bg-emerald-600",
    details:
      "From concept to company we guide you through business model development, equity structures, and preparing for investment rounds.",
    features: [
      "Business Model Design",
      "Cap Table Structure",
      "Investor Readiness",
    ],
  },
  {
    area: "Funding Roadmap",
    description: "Map SBIR/VC/CSR/Angel investments and pitch readiness",
    icon: DollarSign,
    color: "bg-teal-600",
    details:
      "Create strategic funding pathways including government grants, venture capital, corporate partnerships, and angel investments.",
    features: ["Grant Applications", "VC Connections", "Pitch Preparation"],
  },
  {
    area: "Global Market Access",
    description: "Prepare your tech/IP for international commercialisation",
    icon: Globe,
    color: "bg-cyan-600",
    details:
      "Navigate international markets, regulatory requirements, and establish global partnerships for technology transfer.",
    features: [
      "Market Entry Strategy",
      "Regulatory Compliance",
      "Partnership Development",
    ],
  },
  {
    area: "Compliance & Risk",
    description: "Ensure regulatory and legal due diligence is done right",
    icon: Shield,
    color: "bg-rose-600",
    details:
      "Comprehensive risk assessment, regulatory compliance guidance, and legal due diligence for technology commercialization.",
    features: ["Risk Assessment", "Legal Due Diligence", "Compliance Guidance"],
  },
];

const BENEFITS = [
  {
    title: "Builds Trust for Investors",
    description: "Professional validation increases investor confidence",
    icon: Shield,
  },
  {
    title: "Increases Commercialisation Success Rate",
    description: "Proven methodologies improve your chances of success",
    icon: TrendingUp,
  },
  {
    title: "Avoids Legal/IP Mistakes",
    description: "Expert guidance prevents costly legal pitfalls",
    icon: CheckCircle2,
  },
  {
    title: "Access to Global Network",
    description: "Connect with tech transfer offices worldwide",
    icon: Globe,
  },
  {
    title: "Academic Institution Support",
    description: "Specialized guidance for research commercialization",
    icon: BookOpen,
  },
];

const STATS = [
  {
    icon: Users,
    stat: 500,
    suffix: "+",
    label: "Global Experts",
    color: "bg-blue-600",
    iconColor: "text-white",
  },
  {
    icon: TrendingUp,
    stat: 85,
    suffix: "%",
    label: "Success Rate",
    color: "bg-emerald-600",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    stat: 9,
    suffix: "+",
    label: "Countries",
    color: "bg-teal-600",
    iconColor: "text-white",
  },
  {
    icon: Building,
    stat: 45,
    suffix: "+",
    label: "Institutions",
    color: "bg-amber-500",
    iconColor: "text-white",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function useCountUp(target, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          let start = null;
          const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

function StatCard({
  icon: Icon,
  stat,
  suffix,
  label,
  color,
  iconColor,
  delay,
}) {
  const [count, ref] = useCountUp(stat);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div
        className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
      >
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
      <h3 className="text-3xl font-bold text-neutral-900 dark:text-slate-100 mb-1">
        {count}
        {suffix}
      </h3>
      <p className="text-neutral-500 dark:text-slate-400 text-sm">{label}</p>
    </motion.div>
  );
}

export default function Experts() {
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://backend.assesme.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit");
      const result = await response.json();
      toast.success(
        result.message || "Thank you! We will get back to you soon.",
      );
      reset();
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (hasError) =>
    `w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 bg-white dark:bg-slate-800 placeholder:text-neutral-400 dark:placeholder:text-slate-500 text-neutral-900 dark:text-slate-100 input-glow focus:outline-none focus:ring-2 focus:border-blue-500 ${
      hasError
        ? "border-red-400 focus:ring-red-200 dark:focus:ring-red-900/40"
        : "border-neutral-300 dark:border-slate-600 focus:ring-blue-100 dark:focus:ring-blue-900/40 hover:border-neutral-400 dark:hover:border-slate-500"
    }`;

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
              Certified Professionals
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Work with Our Experts
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Access certified technology transfer and commercialisation
              professionals specialists in IP licensing, tech transfer, and
              market access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href={calDirectURL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-lg btn-glow"
              >
                <Calendar className="h-4 w-4" />
                Book Consultation
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://forms.gle/1AHvijC9uidoGeig8"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-lg transition-colors duration-200"
              >
                <User className="h-4 w-4" />
                Join as Expert
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who Are Our Experts */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-6">
                Who Are Our{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Experts?
                </span>
              </h2>
              <p className="text-lg text-neutral-600 dark:text-slate-400 mb-8 leading-relaxed">
                Our network comprises certified commercialisation specialists
                who bridge the gap between academic research and industry
                application.
              </p>
              <motion.div
                className="space-y-2"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="flex items-start p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group cursor-default"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-slate-200 mb-0.5 text-sm">
                          {b.title}
                        </h3>
                        <p className="text-neutral-500 dark:text-slate-400 text-sm">
                          {b.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-xl border border-neutral-100 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-8">
                  {STATS.map((item, i) => (
                    <StatCard key={i} {...item} delay={i * 0.12} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              How Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Experts
              </span>{" "}
              Can Help You
            </h2>
            <p className="text-lg text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive support across all aspects of technology transfer
              and commercialisation.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const isOpen = selectedService === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-interactive cursor-pointer"
                  onClick={() => setSelectedService(isOpen ? null : index)}
                >
                  <div
                    className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-slate-100 mb-2">
                    {service.area}
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-1.5 mb-4">
                    {service.features.map((f, fi) => (
                      <div
                        key={fi}
                        className="flex items-center text-sm text-neutral-500 dark:text-slate-400"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                    <span>{isOpen ? "Show less" : "Learn more"}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.div>
                  </div>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/40 overflow-hidden"
                    >
                      <p className="text-sm text-neutral-700 dark:text-slate-300 leading-relaxed">
                        {service.details}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-slate-100 mb-4">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-neutral-500 dark:text-slate-400">
              Have questions? We're here to help.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-neutral-100 dark:border-slate-800"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
                  <Target className="inline h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                  Reason for Contact
                </label>
                <select
                  {...register("reason", {
                    required: "Please select a reason",
                  })}
                  className={inputCls(errors.reason)}
                >
                  <option value="">Select a reason...</option>
                  <option value="tech_scouting">Tech Scouting</option>
                  <option value="ip_licensing">IP Licensing</option>
                  <option value="startup_formation">Startup Formation</option>
                  <option value="funding_strategy">Funding Strategy</option>
                  <option value="global_market_access">
                    Global Market Access
                  </option>
                  <option value="compliance_risks">Compliance and Risks</option>
                  <option value="other">Other</option>
                </select>
                {errors.reason && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
                    <User className="inline h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Required" })}
                    className={inputCls(errors.name)}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
                    <Phone className="inline h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...register("phone", { required: "Required" })}
                    className={inputCls(errors.phone)}
                    placeholder="Your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
                  <Mail className="inline h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email",
                    },
                  })}
                  className={inputCls(errors.email)}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
                  <MessageSquare className="inline h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                  Message
                </label>
                <textarea
                  {...register("message", { required: "Required" })}
                  rows={4}
                  className={`${inputCls(errors.message)} resize-none`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
