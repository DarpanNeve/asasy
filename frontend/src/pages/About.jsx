import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  CheckCircle,
  Zap,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Award,
  Clock,
  Trophy,
  BookOpen,
  Sparkles,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutUs() {
  const features = [
    {
      icon: Zap,
      color: "bg-blue-600",
      title: "AI-Powered Analysis",
      description:
        "Generate comprehensive technology assessment reports in minutes using advanced AI algorithms with 92% accuracy rate.",
    },
    {
      icon: Award,
      color: "bg-teal-600",
      title: "RTTP Certified",
      description:
        "Work with Registered Technology Transfer Professionals for expert IP commercialization guidance and industry expertise.",
    },
    {
      icon: Clock,
      color: "bg-emerald-600",
      title: "Results in Minutes",
      description:
        "Get instant analysis in less than 60 seconds. No more waiting weeks for technology assessments.",
    },
    {
      icon: Shield,
      color: "bg-red-600",
      title: "Enterprise Security",
      description:
        "Enterprise-grade security ensures your intellectual property and sensitive data remain protected.",
    },
    {
      icon: Globe,
      color: "bg-teal-600",
      title: "Global Network",
      description:
        "Access to worldwide network of technology transfer offices and IP licensing experts.",
    },
    {
      icon: TrendingUp,
      color: "bg-orange-600",
      title: "Data-Driven Decisions",
      description:
        "Make confident commercialization decisions with comprehensive market insights and licensing data.",
    },
  ];

  const reportTypes = [
    {
      id: "advanced",
      name: "Advanced Report",
      tokens: "7,500",
      tokenColor: "text-teal-600 dark:text-teal-400",
      borderColor: "border-teal-200 dark:border-teal-800",
      description: "Comprehensive analysis with detailed insights",
      features: [
        "Executive Summary (1–2 line value proposition)",
        "Problem/Opportunity Statement",
        "Technology Overview (core idea, brief features)",
        "Key Benefits (USP)",
        "Applications (primary markets/use cases)",
        "IP Snapshot (status & country)",
        "Next Steps (e.g., pilot studies, further R&D)",
        "Expanded Executive Summary (go/no-go recommendation)",
        "Problem & Solution Fit (with background justification)",
        "Technical Feasibility (prototype status, TRL stage)",
        "IP Summary (landscape & freedom-to-operate overview)",
        "Market Signals (interest letters, pilot test data)",
        "Early Competitors (known tech or patent citations)",
        "Regulatory/Compliance Overview",
        "Risk Summary and Key Questions",
        "Detailed Business Case (narrative for VCs)",
        "Technology Description (core claims, development stage, TRL framework)",
        "Market & Competition (segmentation, SWOT analysis, barriers to entry)",
        "TRL & Technical Challenges (scale-up readiness)",
        "Detailed IP & Legal Status (global patent families, claims, FTO risks)",
        "Regulatory Pathways (e.g., CE, FDA, BIS, AIS)",
        "Commercialization Options (spin-off, licensing, JVs)",
        "Preliminary Financial Estimates (cost vs ROI model)",
        "Summary & Go-to-Market Plan",
      ],
    },
    {
      id: "comprehensive",
      name: "Comprehensive Report",
      tokens: "9,000",
      tokenColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      description: "Premium analysis with expert-driven insights",
      features: [
        "Executive Summary (1–2 line value proposition)",
        "Problem/Opportunity Statement",
        "Technology Overview (core idea, brief features)",
        "Key Benefits (USP)",
        "Applications (primary markets/use cases)",
        "IP Snapshot (status & country)",
        "Next Steps (e.g., pilot studies, further R&D)",
        "Expanded Executive Summary (go/no-go recommendation)",
        "Problem & Solution Fit (with background justification)",
        "Technical Feasibility (prototype status, TRL stage)",
        "IP Summary (landscape & freedom-to-operate overview)",
        "Market Signals (interest letters, pilot test data)",
        "Early Competitors (known tech or patent citations)",
        "Regulatory/Compliance Overview",
        "Risk Summary and Key Questions",
        "Detailed Business Case (narrative for VCs)",
        "Technology Description (core claims, development stage, TRL framework)",
        "Market & Competition (segmentation, SWOT analysis, barriers to entry)",
        "TRL & Technical Challenges (scale-up readiness)",
        "Detailed IP & Legal Status (global patent families, claims, FTO risks)",
        "Regulatory Pathways (e.g., CE, FDA, BIS, AIS)",
        "Commercialisation Options (spin-off, licensing, JVs)",
        "Preliminary Financial Estimates (cost vs ROI model)",
        "Summary & Go-to-Market Plan",
        "In-depth IP Claims Analysis (protection scope, robustness)",
        "Global Freedom-to-Operate Report (US, EU, India, China)",
        "Market Analysis (size, trends, addressable market, adoption barriers)",
        "Business Models (licensing, SaaS, product, hybrid)",
        "5-Year ROI & Revenue Projections (unit cost, pricing, TAM/SAM/SOM)",
        "Funding Strategy (grants, accelerators, VC, PE, SBIR)",
        "Licensing & Exit Strategy (terms, IP deal structures)",
        "Team & Strategic Partners Required (talent, advisors)",
        "Implementation Roadmap (milestones, MVP, pilot scaling)",
        "Appendices (patent tables, market research data, technical drawings)",
      ],
    },
  ];

  const stats = [
    { value: "92%", label: "Accuracy Rate" },
    { value: "<60s", label: "Analysis Time" },
    { value: "1000+", label: "Technology Leaders" },
    { value: "5+", label: "Countries Served" },
  ];

  const founderHighlights = [
    {
      icon: Award,
      color: "bg-amber-500",
      title: "Young & Innovative Scientist Award",
      description:
        "Recipient of prestigious DRDO award in 2022, conferred by Defence Minister Shri. Rajnath Singh",
    },
    {
      icon: Trophy,
      color: "bg-blue-600",
      title: "100+ IP Rights",
      description:
        "Holder of over 100 intellectual property rights, including 80+ granted patents",
    },
    {
      icon: BookOpen,
      color: "bg-teal-600",
      title: "50+ Seminars",
      description:
        "Delivered over 50 seminars and guest lectures at multiple universities",
    },
    {
      icon: Users,
      color: "bg-emerald-600",
      title: "Multi-Industry Expert",
      description:
        "Extensive experience across Ed-tech, Information-Tech, Legal-Tech, and Food-Tech startups",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden py-40 md:py-52">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 dark:to-slate-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Assesme
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your innovation into commercial success with our
              technology assessment platform. Get comprehensive reports
              with expert RTTP guidance in days, not weeks.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
              {["AI-Powered Analysis", "RTTP Certified", "Results in Minutes"].map((pill) => (
                <div
                  key={pill}
                  className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white"
                >
                  <CheckCircle className="w-4 h-4 text-teal-400 mr-2" />
                  {pill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeUp} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Meet Our Founder
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Leading innovation with expertise, passion, and a proven track record of success
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative inline-block mb-6">
                <img
                  className="w-48 h-48 object-cover object-center rounded-full shadow-md"
                  src="/person.jpeg"
                  alt="Mr. Venkatesh Bharti"
                />
                <div className="absolute -bottom-0 -right-0 bg-yellow-400 rounded-full p-3 shadow-lg">
                  <Award className="w-6 h-6 text-yellow-800" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Mr. Venkatesh Bharti
              </h3>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">
                Founder & Chief Innovation Officer
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Distinguished solution finder and versatile innovator with
                expertise across multiple technical domains
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {founderHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    className="flex items-start space-x-4 bg-white dark:bg-slate-800/80 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-slate-900 border border-slate-100 dark:border-slate-700 transition-all duration-300"
                  >
                    <div className={`w-11 h-11 ${highlight.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-1">
                        {highlight.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {highlight.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Founder (Bio) Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              About Founder
            </h2>
          </motion.div>

          <motion.div
            className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                "Mr. Venkatesh Bharti is a distinguished and versatile solution finder, renowned for his remarkable contributions across various technical domains. Recipient of the prestigious Young & Innovative Scientist Award from DRDO in 2022, conferred by the Defence Minister of India, Shri. Rajnath Singh, Mr Bharti is celebrated for his groundbreaking achievements.",
                "His accolades extend further, being honoured by IIT Directors and the Naval Chief of India, underscoring his exceptional impact on the scientific community. With over 100 intellectual property rights to his name, including 80+ Granted IP, Mr. Bharti's expertise is unparalleled.",
                "His extensive experience spans multiple start-ups in Ed-tech, Information-Tech, Legal-Tech, and Food-Tech, showcasing his ability to navigate and innovate across diverse industries. His role as an IOT Specialist, startup consultant, and advisor highlights his capacity to provide strategic, actionable insights that drive growth and innovation.",
                "Mr. Bharti's reputation as a speaker is well-established, having delivered over 50+ seminars, and sharing his profound knowledge and innovative ideas. As a guest lecturer at multiple universities, he inspires the next generation of scientists and entrepreneurs.",
                "Renowned for his brainstorming prowess and strategic planning, Mr. Bharti excels in developing, organizing, and delivering compelling proof of concept demonstrations. His ability to quickly identify issues and devise reliable solutions makes him a valuable asset, capable of transforming sectors with his innovative approaches.",
              ].map((para, i) => (
                <p key={i} className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We're advancing technology transfer by making professional
              IP assessments accessible, fast, and data-driven. Our platform
              empowers innovators to make confident commercialization decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Powerful Features for IP Commercialization
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Everything you need to conduct thorough technology assessments
                and make data-driven commercialization decisions with confidence.
              </p>
              <ul className="space-y-4">
                {[
                  "Advanced AI algorithms for comprehensive analysis",
                  "Professional PDF reports with expert formatting",
                  "RTTP-certified guidance and recommendations",
                  "Global network of technology transfer experts",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-700"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Trusted by Innovation Leaders
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { Icon: Users, label: "Universities", color: "from-blue-500 to-blue-700" },
                  { Icon: TrendingUp, label: "Startups", color: "bg-teal-600" },
                  { Icon: Shield, label: "Enterprises", color: "bg-emerald-600" },
                  { Icon: Globe, label: "RTTP Experts", color: "bg-orange-600" },
                ].map(({ Icon, label, color }, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center border border-slate-100 dark:border-slate-600"
                  >
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Why Choose Assesme?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Our platform combines advanced methodology with expert human
              insight to deliver rigorous technology assessment capabilities.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="group bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Report Types Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Assessment Report Types
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Choose from two comprehensive report types designed to meet your
              specific needs and timeline.
            </p>
          </motion.div>

          <motion.div
            className="space-y-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {reportTypes.map((report, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className={`bg-white dark:bg-slate-800/80 rounded-2xl p-8 shadow-lg hover:shadow-xl border ${report.borderColor} transition-shadow duration-300`}
              >
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {report.name}
                    </h3>
                    <p className={`font-semibold ${report.tokenColor} mb-2`}>
                      {report.tokens} tokens
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">{report.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <ul className="space-y-2 sm:columns-2">
                      {report.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start break-inside-avoid">
                          <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
