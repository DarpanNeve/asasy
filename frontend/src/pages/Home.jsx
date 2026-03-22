import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FileText,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Send,
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Globe,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Quote,
  Check,
  Briefcase,
  FlaskConical,
  Building,
  Handshake,
  Landmark,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { createReportPdf } from "../utils/reportUtils";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedComplexity, setSelectedComplexity] = useState("advanced");
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    // Auto rotate logos and testimonials
    const logoInterval = setInterval(() => {
      setActiveLogoIndex((prev) => (prev + 1) % logos.length);
    }, 3000);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(logoInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const coreFeatures = [
    {
      icon: Sparkles,
      title: "AI-Powered Reports",
      description: "Data-backed, globally benchmarked outputs.",
    },
    {
      icon: Users,
      title: "Expert Integration",
      description: "Access to top technology transfer professionals worldwide.",
    },
    {
      icon: Shield,
      title: "IP Landscape & Freedom-to-Operate",
      description: "Minimize legal risks early.",
    },
    {
      icon: TrendingUp,
      title: "Commercialisation Pathways",
      description: "Licensing, startup creation, JV, or CSR integration.",
    },
    {
      icon: Award,
      title: "Regulatory & Compliance Mapping",
      description: "FDA, CE, BIS, AIS readiness.",
    },
    {
      icon: BarChart3,
      title: "Financial & ROI Projections",
      description: "Cost models, TAM/SAM/SOM, 5-year forecasts.",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Your data stays private and protected.",
    },
    {
      icon: Globe,
      title: "Global Market Access",
      description: "Connect with partners, investors, and customers worldwide.",
    },
  ];

  const commercializationSteps = [
    {
      step: 1,
      title: "Identify & Protect Your Innovation",
      description:
        "Draft your invention. File for a Research Paper, Patent, Design, or Copyright. Ensure IP is legally protected before disclosure.",
      icon: Lightbulb,
    },
    {
      step: 2,
      title: "Conduct a Technology Assessment",
      description:
        "Analyse technical feasibility. Study market demand, competition, and IP strength. Choose from 2 report formats (Advanced or Comprehensive).",
      icon: FileText,
    },
    {
      step: 3,
      title: "Evaluate Commercial Potential",
      description:
        "Who will use it? What problems does it solve? What's the ROI? Which countries/industries are best suited?",
      icon: Target,
    },
    {
      step: 4,
      title: "Choose a Commercialisation Path",
      description:
        "Licensing to industry, Startup/Spin-off creation, Joint Ventures & Partnerships, Government or CSR Integration.",
      icon: TrendingUp,
    },
    {
      step: 5,
      title: "Go-to-Market & Launch",
      description:
        "Prototype and test. Secure regulatory approvals. Develop marketing and customer strategy. Launch MVP.",
      icon: Award,
    },
    {
      step: 6,
      title: "Scale, Monetise & Monitor",
      description:
        "Track performance. Optimize business model. Expand IP portfolio globally. License to more territories or sectors.",
      icon: Globe,
    },
  ];

  const logos = [
    { id: 1, name: "MIT", initials: "MIT" },
    { id: 2, name: "Stanford University", initials: "SU" },
    { id: 3, name: "ETH Zurich", initials: "ETH" },
    { id: 4, name: "University of Cambridge", initials: "UC" },
    { id: 5, name: "Indian Institute of Science", initials: "IIS" },
    { id: 6, name: "National University of Singapore", initials: "NUS" },
    { id: 7, name: "Imperial College London", initials: "ICL" },
    { id: 8, name: "University of Toronto", initials: "UoT" },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Dr. Jane Doe",
      role: "Director, Tech Transfer Office",
      content:
        "Asasy transformed how we assess technologies. The AI report identified market opportunities we completely missed. This platform is a game-changer for university TTOs.",
      rating: 5,
    },
    {
      id: 2,
      name: "Prof. Alan Richards",
      role: "Research Lead, AI Lab",
      content:
        "The RTTP expert guidance helped us license our AI algorithm to a Fortune 500 company. The commercialization blueprint was incredibly detailed and actionable.",
      rating: 5,
    },
    {
      id: 3,
      name: "Dr. Sanjay Kumar",
      role: "IP Manager",
      content:
        "We've reduced our technology assessment time from weeks to hours. The professional reports have impressed our stakeholders and increased our licensing success rate.",
      rating: 4,
    },
    {
      id: 4,
      name: "Dr. Elena Rodriguez",
      role: "Biotech Researcher",
      content:
        "As a researcher, I had no idea how to commercialize my work. Asasy guided me through the entire process - from patent filing to licensing agreements. Truly invaluable!",
      rating: 5,
    },
  ];

  const handleGenerateReport = async (data) => {
    if (!user) {
      toast.error("Please sign in to generate reports");
      navigate("/login");
      return;
    }

    // Check token requirements based on complexity
    const tokenRequirements = {
      advanced: 7500,
      comprehensive: 9000,
    };

    // Use selected complexity from state
    const complexity = selectedComplexity;
    const requiredTokens = tokenRequirements[complexity];

    // Fetch current user balance to check if they have enough tokens
    try {
      const balanceResponse = await api.get("/tokens/balance");
      const userBalance = balanceResponse.data;

      if (userBalance.available_tokens < requiredTokens) {
        toast.error(
          `Insufficient tokens. Required: ${requiredTokens}, Available: ${userBalance.available_tokens}. Please purchase more tokens.`
        );
        navigate("/login-pricing");
        return;
      }
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
      // Continue with generation attempt - let backend handle token validation
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/reports/generate", {
        idea: data.idea,
        complexity: selectedComplexity,
      });

      toast.success(
        `Report generation started using ${requiredTokens} tokens! You will be notified when complete.`
      );
      reset();

      // Navigate to reports page to view the generating report
      navigate("/reports");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          error.response?.data?.detail ||
            "Insufficient tokens. Please purchase more tokens."
        );
        navigate("/login-pricing");
      } else {
        toast.error(
          error.response?.data?.detail || "Failed to generate report"
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardHover = {
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-teal-400/15 to-teal-300/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div
          className="absolute inset-0 opacity-[0.02] z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(15,23,42,0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Trust Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full mb-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <span className="text-sm font-medium text-slate-700">
                Trusted by 100+ innovators
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              AI-Powered Technology
              <motion.span
                className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Assessment Reports
              </motion.span>
            </h1>

            <motion.p
              className="text-xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Validate, Protect, and Scale Your Innovation with Confidence.
            </motion.p>
            <motion.p
              className="text-lg text-slate-500 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Transform your research, startup idea, or IP into a market-ready
              opportunity. Get instant, AI-driven assessment reports that cover
              technical feasibility, IP strength, market readiness,
              commercialisation potential, and risk analysis.
            </motion.p>
            <motion.p
              className="text-lg text-slate-500 mb-8 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Trusted by innovators, startups, universities, incubators, and
              enterprises.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {[
                { icon: Sparkles, text: "AI-Powered Analysis", color: "blue" },
                {
                  icon: Shield,
                  text: "Certified Experts",
                  color: "emerald",
                },
                { icon: Zap, text: "Reports in Minutes", color: "amber" },
                {
                  icon: FileText,
                  text: "Token-Based Flexible Pricing",
                  color: "teal",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-${feature.color}-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  <feature.icon
                    className={`h-4 w-4 text-${feature.color}-500`}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <a
                href="#generate-report"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#generate-report")
                    .scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started Now
                <ArrowRight className="ml-3 h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Assesme? Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Assesme?
            </h2>
            <p className="text-xl text-slate-600 mx-auto mb-12">
              Today, most innovations never reach the market — not because they
              lack potential, but because they lack structured validation.
              Assesme solves this by providing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Instant Technology Assessment Reports",
                description: "Aligned with WIPO, EPO, NIH, and OECD standards.",
              },
              {
                title: "IP & Patentability Insights",
                description: "For national and international filings.",
              },
              {
                title: "Market, Competition & Risk Analysis",
                description: "For better decision-making.",
              },
              {
                title: "Commercialisation Roadmaps",
                description: "For licensing, spin-offs, or partnerships.",
              },
              {
                title: "TRL & Feasibility Checks",
                description: "For early-stage research and prototypes.",
              },
              {
                title: "Investor-Ready Documentation",
                description: "To improve fundraising success.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CheckCircle className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Use Assesme? Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Who Can Use Assesme?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
              Assesme is built for the entire innovation ecosystem
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Startups & Founders",
                description: "Validate ideas before investing years of effort.",
              },
              {
                icon: Landmark,
                title: "Universities & Academia",
                description:
                  "Assess research outputs, patents, and student innovations.",
              },
              {
                icon: FlaskConical,
                title: "R&D Labs & Corporates",
                description:
                  "De-risk projects and identify commercialization paths.",
              },
              {
                icon: Briefcase,
                title: "Investors & VCs",
                description:
                  "Get standardized, comparable due diligence reports.",
              },
              {
                icon: Building,
                title: "Government & Policy Bodies",
                description:
                  "Evaluate funding proposals with data-driven reports.",
              },
              {
                icon: Handshake,
                title: "Incubators & Accelerators",
                description:
                  "Screen applications and guide startups with structured assessments.",
              },
            ].map((user, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <user.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {user.title}
                </h3>
                <p className="text-slate-600">{user.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-400/8 to-teal-300/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div
          className="absolute inset-0 opacity-[0.015] z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(15,23,42,0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Core Features
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={fadeIn}
                  whileHover="hover"
                >
                  <div className="relative h-full p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <motion.div
                      className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-500 group-hover:to-blue-800 transition-all duration-500 shadow-md group-hover:shadow-lg"
                      variants={cardHover}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="relative z-10 h-10 w-10 text-blue-600 group-hover:text-white transition-colors duration-500" />
                    </motion.div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How Assesme Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-12">
              How Assesme Works
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-10 bottom-10 w-0.5 hidden md:block" />
            {[
              {
                icon: Lightbulb,
                title: "Describe Your Innovation",
                description:
                  "Share details about your idea, prototype, or patent.",
              },
              {
                icon: Zap,
                title: "AI Review",
                description:
                  "Assesme’s engine analyses and validates across 30+ parameters.",
              },
              {
                icon: FileText,
                title: "Download Your Report",
                description:
                  "Receive structured, investor-grade PDF instantly.",
              },
              {
                icon: Users,
                title: "Get Guidance",
                description:
                  "Connect with experts for next steps, IP licensing, or funding.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:order-2"
                  }`}
                >
                  <div className="p-6 bg-white rounded-2xl shadow-md">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-16 h-16 bg-blue-600 rounded-full items-center justify-center text-white font-bold z-10 shadow-lg flex-shrink-0 md:order-1">
                  <step.icon className="h-8 w-8" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits of Using Assesme Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-12">
              Benefits of Using Assesme
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                for: "Startups",
                benefit: "De-risk your business model before scaling.",
              },
              {
                for: "Researchers",
                benefit:
                  "Ensure your work has real-world commercialisation potential.",
              },
              {
                for: "Corporates",
                benefit: "Benchmark internal R&D with industry trends.",
              },
              {
                for: "Investors",
                benefit: "Standardised evaluation of deal flow.",
              },
              {
                for: "Policy Makers",
                benefit: "Transparent, data-driven innovation assessment.",
              },
              {
                for: "Accelerators",
                benefit:
                  "Identify high-potential ventures faster with objective insights.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-slate-50 p-8 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {item.for}
                </h3>
                <p className="text-slate-600">{item.benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Generator Section */}
      <section id="generate-report" className="py-24 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit(handleGenerateReport)}
              className="space-y-6"
            >
              <div className="relative">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Choose Report Complexity
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: "advanced",
                        name: "Advanced",
                        tokens: "7,500",
                        description: "Comprehensive analysis",
                        color: "teal",
                      },
                      {
                        id: "comprehensive",
                        name: "Comprehensive",
                        tokens: "9,000",
                        description: "Premium analysis",
                        color: "emerald",
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedComplexity(option.id)}
                        disabled={isGenerating}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          selectedComplexity === option.id
                            ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                            : "border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-md"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`font-semibold ${
                              selectedComplexity === option.id
                                ? `text-${option.color}-700`
                                : "text-slate-700"
                            }`}
                          >
                            {option.name}
                          </h3>
                          <div
                            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              selectedComplexity === option.id
                                ? `border-${option.color}-500 bg-${option.color}-500`
                                : "border-slate-300"
                            }`}
                          >
                            {selectedComplexity === option.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          {option.tokens} tokens
                        </p>
                        <p className="text-xs text-slate-500">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Describe Your Technology Innovation
                </label>
                <div className="relative">
                  <textarea
                    {...register("idea", {
                      required: "Please describe your technology idea",
                      minLength: {
                        value: 50,
                        message: "Please provide at least 50 characters",
                      },
                    })}
                    rows={6}
                    className="w-full p-6 pr-16 border-2 border-slate-200 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none resize-none text-lg transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm"
                    placeholder="Include the following elements for better analysis..."
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-6 w-6" />
                    )}
                  </button>
                </div>
                {errors.idea && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.idea.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Your Report...
                  </>
                ) : (
                  <>
                    Generate Assessment Report
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-10">
            Download Sample Reports
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Advance */}
            <a
              href="/assets/pdf/advance-sample.pdf"
              download
              className="group bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4 text-secondary-600">📄</div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2 group-hover:text-secondary-600">
                Advance
              </h3>
              <p className="text-sm text-neutral-500">
                Includes licensing and market insights
              </p>
            </a>

            {/* Comprehensive */}
            <a
              href="/assets/pdf/comprehensive-sample.pdf"
              download
              className="group bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4 text-accent-600">📄</div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2 group-hover:text-accent-600">
                Comprehensive
              </h3>
              <p className="text-sm text-neutral-500">
                Complete due diligence + commercialization plan
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      {/* <section className="py-0 pb-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        Subtle Background Pattern
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(15,23,42,0.15) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-full mb-4 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                Live Innovation Network
              </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              Trusted by innovators at
            </h3>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Join thousands of technology leaders who trust our AI-powered
              assessment platform
            </p>
          </motion.div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-blue-50/30 to-blue-50/30 animate-gradient-x"></div>

              <div className="relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8">
                  {logos.map((logo, index) => (
                    <motion.div
                      key={logo.id}
                      className="flex flex-col items-center group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: index === activeLogoIndex ? 1 : 0.6,
                        y: index === activeLogoIndex ? -8 : 0,
                        scale: index === activeLogoIndex ? 1.05 : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      whileHover={{
                        scale: 1.1,
                        opacity: 1,
                        y: -12,
                      }}
                      onClick={() => setActiveLogoIndex(index)}
                    >
        
                      <div
                        className={`
                  relative w-16 h-16 md:w-20 md:h-20 rounded-2xl 
                  ${
                    index === activeLogoIndex
                      ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/25"
                      : "bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-blue-200"
                  }
                  flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  border-2 border-white/50
                  backdrop-blur-sm
                `}
                      >

                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>


                        <span
                          className={`
                    font-bold text-lg md:text-xl relative z-10
                    ${
                      index === activeLogoIndex
                        ? "text-white"
                        : "text-slate-700 group-hover:text-blue-700"
                    }
                    transition-colors duration-300
                  `}
                        >
                          {logo.initials}
                        </span>
                        {index === activeLogoIndex && (
                          <motion.div
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}
                      </div>

                      
                      <motion.span
                        className={`
                    mt-3 text-xs md:text-sm font-medium text-center leading-tight
                    ${
                      index === activeLogoIndex
                        ? "text-slate-800"
                        : "text-slate-600 group-hover:text-slate-800"
                    }
                    transition-colors duration-300
                  `}
                        animate={{
                          opacity: index === activeLogoIndex ? 1 : 0.8,
                        }}
                      >
                        {logo.name}
                      </motion.span>

                      
                      <motion.p
                        className="mt-1 text-xs text-slate-500 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ height: 0 }}
                        whileHover={{ height: "auto" }}
                      >
                        Innovation Leader
                      </motion.p>
                    </motion.div>
                  ))}
                </div>
              </div>

           
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  className="ml-4 p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-white/50 group"
                  onClick={() =>
                    setActiveLogoIndex((prev) =>
                      prev === 0 ? logos.length - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  className="mr-4 p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-white/50 group"
                  onClick={() =>
                    setActiveLogoIndex((prev) => (prev + 1) % logos.length)
                  }
                >
                  <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                </button>
              </div>
            </div>

            
            <div className="flex justify-center mt-6 space-x-2">
              {logos.map((_, index) => (
                <button
                  key={index}
                  className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${
                index === activeLogoIndex
                  ? "bg-blue-500 w-8"
                  : "bg-slate-300 hover:bg-slate-400"
              }
            `}
                  onClick={() => setActiveLogoIndex(index)}
                />
              ))}
            </div>
          </div>

        
        </div>
      </section> */}

      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08)_0%,transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Proven Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-blue-900 bg-clip-text text-transparent mb-6">
              Commercialisation Journey
            </h2>
            <p className="text-xl text-slate-600 mx-auto leading-relaxed">
              Transform your innovation into commercial success through our
              <span className="text-blue-600 font-semibold">
                {" "}
                systematic 6-step methodology
              </span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commercializationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Card background with glassmorphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 group-hover:shadow-2xl transition-all duration-500" />

                  {/* Glowing border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-blue-500/20 rounded-2xl transition-all duration-500" />

                  <div className="relative p-8 h-full flex flex-col">
                    {/* Step number with gradient background */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <span className="text-white font-bold text-lg">
                            {step.step}
                          </span>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Icon with animated background */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <IconComponent className="h-6 w-6 text-blue-600 group-hover:text-teal-600 transition-colors duration-500" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>

                    {/* Subtle connecting line for flow */}
                    {index < commercializationSteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Call to action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          ></motion.div>
        </div>
      </section>

      {/* RTTP Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Work with RTTP Experts
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Access Registered Technology Transfer Professionals (RTTPs) –
              experts in IP licensing, tech transfer, and commercialisation. Get
              expert guidance to maximize your innovation's potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rttp"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Learn About RTTP
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              {/* Secondary button for RTTPs to join */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What Innovators Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Join thousands of researchers and innovators accelerating IP
              commercialization.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                className="card p-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-6">
                  <Quote className="h-12 w-12 text-primary-200" />
                </div>

                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-current mx-1"
                      />
                    )
                  )}
                </div>

                <p className="text-xl text-neutral-700 italic text-center mb-8">
                  "{testimonials[activeTestimonial].content}"
                </p>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center text-primary-700 font-bold text-xl mb-3">
                    {testimonials[activeTestimonial].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <p className="font-bold text-neutral-900 text-lg">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-neutral-600">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === activeTestimonial
                      ? "bg-primary-600"
                      : "bg-neutral-300"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
