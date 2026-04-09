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
  Target,
  Lightbulb,
  FileSearch,
  Map,
  ArrowRight,
  Star,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const MISSION_PILLARS = [
  {
    icon: FileSearch,
    color: "bg-blue-600",
    title: "Evidence-Based Validation",
    description:
      "Every report is grounded in WIPO, EPO, NIH, and OECD standards — not guesswork.",
  },
  {
    icon: Shield,
    color: "bg-teal-600",
    title: "IP-First Thinking",
    description:
      "We treat your intellectual property as the core asset and structure every assessment accordingly.",
  },
  {
    icon: Globe,
    color: "bg-emerald-600",
    title: "Global Commercialization",
    description:
      "From Indian filings to international licensing, we give you globally relevant insights.",
  },
  {
    icon: Target,
    color: "bg-orange-500",
    title: "Investor-Ready Output",
    description:
      "Every report is structured to be readable by VCs, government bodies, and industry partners.",
  },
  {
    icon: Users,
    color: "bg-blue-700",
    title: "Ecosystem for All",
    description:
      "Startups, academia, R&D labs, investors, and incubators — one platform for the whole innovation stack.",
  },
  {
    icon: Lightbulb,
    color: "bg-teal-700",
    title: "From Idea to Impact",
    description:
      "We walk with you from early validation through commercialization pathways and funding readiness.",
  },
];

const STATS = [
  { value: "9,840+", label: "Innovators Trusted Us" },
  { value: "92%", label: "Report Accuracy" },
  { value: "30+", label: "Assessment Parameters" },
  { value: "5+", label: "Countries Served" },
];

const FOUNDER_HIGHLIGHTS = [
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

const REPORT_TYPES = [
  {
    name: "Advanced Report",
    tokens: "7,500",
    priceINR: "₹799",
    priceUSD: "$9.99",
    tokenColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-200 dark:border-teal-800/50",
    bg: "bg-teal-50 dark:bg-teal-900/30",
    description:
      "VC-ready analysis with SWOT, ROI model, and commercialization paths",
    highlights: [
      "24+ parameters",
      "Market & SWOT analysis",
      "Preliminary ROI model",
      "IP & Regulatory overview",
    ],
  },
  {
    name: "Comprehensive Report",
    tokens: "9,000",
    priceINR: "₹999",
    priceUSD: "$11.99",
    tokenColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800/50",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    description:
      "Full due-diligence — IP claims, 5-yr forecasts, global FTO, funding strategy",
    highlights: [
      "30+ parameters",
      "5-Year ROI projections",
      "Global FTO (US, EU, India, China)",
      "Funding & Exit strategy",
    ],
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden py-40 md:py-52">
        <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              India's First AI-Powered Tech Assessment Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              The Story Behind{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Assesme
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              We built Assesme because too many innovations die not from lack of
              potential, but from lack of structured validation. We are changing
              that — one report at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
              {[
                "AI-Powered Analysis",
                "Experts Certified",
                "Investor-Ready Reports",
              ].map((pill) => (
                <div
                  key={pill}
                  className="flex items-center bg-white/10  border border-white/20 px-4 py-2 rounded-full text-white"
                >
                  <CheckCircle className="w-4 h-4 text-teal-400 mr-2" />
                  {pill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat, index) => (
              <motion.div key={index} variants={fadeUp} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
              What We Stand For
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Our Mission &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We advance technology transfer by making professional IP
              assessments accessible, fast, and data-driven.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {MISSION_PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 ${pillar.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Founder
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A recognized innovator with a proven track record across IP,
              technology, and entrepreneurship
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
                  className="w-48 h-48 object-cover object-center rounded-full shadow-xl"
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
              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">
                Founder & Chief Innovation Officer
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Distinguished solution finder and versatile innovator with
                expertise across multiple technical domains. A serial inventor,
                speaker, and startup advisor who has translated research into
                real-world commercial value.
              </p>
              <div className="flex gap-3 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3 fill-current" /> DRDO Award 2022
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                  80+ Patents
                </span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {FOUNDER_HIGHLIGHTS.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    className="flex items-start space-x-4 bg-white dark:bg-slate-800/80 rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-300"
                  >
                    <div
                      className={`w-11 h-11 ${highlight.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
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

      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Our Assessment{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Report Types
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Two comprehensive report types designed for different stages and
              purposes.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-7"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {REPORT_TYPES.map((report, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`${report.bg} rounded-2xl p-8 border-2 ${report.borderColor} shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {report.name}
                    </h3>
                    <p className={`font-semibold text-sm ${report.tokenColor}`}>
                      {report.tokens} tokens · {report.priceINR} /{" "}
                      {report.priceUSD}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${report.tokenColor} bg-white dark:bg-slate-800 border border-current font-semibold`}
                  >
                    {report.tokens} tokens
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
                  {report.description}
                </p>
                <ul className="space-y-2">
                  {report.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold px-8 py-3.5 rounded-full btn-glow hover:shadow-xl transition-all duration-200"
            >
              View Pricing <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              About the Founder
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
                "His extensive experience spans multiple start-ups in Ed-tech, Information-Tech, Legal-Tech, and Food-Tech, showcasing his ability to navigate and innovate across diverse industries. His role as an IoT Specialist, startup consultant, and advisor highlights his capacity to provide strategic, actionable insights that drive growth and innovation.",
                "Mr. Bharti's reputation as a speaker is well-established, having delivered over 50+ seminars, sharing his profound knowledge and innovative ideas. As a guest lecturer at multiple universities, he inspires the next generation of scientists and entrepreneurs.",
                "Renowned for his brainstorming prowess and strategic planning, Mr. Bharti excels in developing, organizing, and delivering compelling proof-of-concept demonstrations. His ability to quickly identify issues and devise reliable solutions makes him a valuable asset, capable of transforming sectors with his innovative approaches.",
              ].map((para, i) => (
                <p
                  key={i}
                  className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
