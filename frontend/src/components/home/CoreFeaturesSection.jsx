import { motion } from "framer-motion";
import {
  Sparkles, Users, Shield, TrendingUp, Award, BarChart3, Lock, Globe,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    color: "from-blue-500 to-blue-700",
    title: "AI-Powered Reports",
    description: "Data-backed, globally benchmarked outputs in under 15 minutes.",
  },
  {
    icon: Users,
    color: "from-teal-500 to-teal-700",
    title: "Expert Integration",
    description: "Access to top technology transfer professionals worldwide.",
  },
  {
    icon: Shield,
    color: "from-emerald-500 to-emerald-700",
    title: "IP Landscape & FTO",
    description: "Minimize legal risks with freedom-to-operate analysis.",
  },
  {
    icon: TrendingUp,
    color: "from-orange-500 to-orange-700",
    title: "Commercialisation Paths",
    description: "Licensing, startup creation, JV, or CSR integration.",
  },
  {
    icon: Award,
    color: "from-blue-600 to-blue-800",
    title: "Regulatory Mapping",
    description: "FDA, CE, BIS, AIS compliance readiness assessment.",
  },
  {
    icon: BarChart3,
    color: "from-teal-600 to-teal-800",
    title: "Financial Projections",
    description: "Cost models, TAM/SAM/SOM, and 5-year ROI forecasts.",
  },
  {
    icon: Lock,
    color: "from-emerald-600 to-emerald-800",
    title: "Enterprise Security",
    description: "Your IP and sensitive data stay private and protected.",
  },
  {
    icon: Globe,
    color: "from-blue-500 to-blue-700",
    title: "Global Market Access",
    description: "Connect with partners, investors, and customers worldwide.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function CoreFeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800"
    >
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
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Commercialise
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A full suite of AI-powered tools for every stage of the innovation journey
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group relative bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 overflow-hidden"
              >
                {/* hover bg shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-blue-600/10 transition-all duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
