import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProblemSection from "../components/about/ProblemSection";
import PipelineSection from "../components/about/PipelineSection";
import DifferentiatorsSection from "../components/about/DifferentiatorsSection";
import VisionMissionSection from "../components/about/VisionMissionSection";
import PlatformSection from "../components/about/PlatformSection";
import LeadershipSection from "../components/about/LeadershipSection";
import StakeholdersSection from "../components/about/StakeholdersSection";
import CTASection from "../components/about/CTASection";
import { Sparkles, Gauge, Timer, Users, Briefcase, ArrowRight } from "lucide-react";

const QUICK_STATS = [
  { icon: Gauge, value: "92%", label: "Analysis Accuracy" },
  { icon: Timer, value: "< 15 Min", label: "Assessment Time" },
  { icon: Users, value: "1000+", label: "Innovators & Technologies Evaluated" },
  { icon: Briefcase, value: "Multi-Domain", label: "Expertise Across Industries" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const HERO_STEPS = [
  { label: "Assess", color: "#3b82f6" },
  { label: "Build", color: "#14b8a6" },
  { label: "Qualify", color: "#10b981" },
  { label: "Match", color: "#f59e0b" },
  { label: "Fund", color: "#8b5cf6" },
  { label: "Scale", color: "#f43f5e" },
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
              About Assessme
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              From Idea to Investment — We Make Innovation Work
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Assessme is an AI-powered technology assessment and commercialization platform
              that helps innovators evaluate, build, qualify, and connect with investors —
              through a structured, data-driven ecosystem.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/15 mb-12">
              {HERO_STEPS.map((step, idx) => (
                <React.Fragment key={step.label}>
                  <span
                    className="text-sm md:text-base font-bold"
                    style={{ color: step.color }}
                  >
                    {step.label}
                  </span>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-slate-500" />}
                </React.Fragment>
              ))}
            </div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {QUICK_STATS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    className="bg-white/5 border border-white/15 rounded-2xl p-5 text-left"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div className="text-sm text-slate-300 mt-1">{item.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ProblemSection />
      <PipelineSection />
      <DifferentiatorsSection />
      <VisionMissionSection />
      <PlatformSection />
      <LeadershipSection />
      <StakeholdersSection />
      <CTASection />

      <Footer />
    </div>
  );
}
