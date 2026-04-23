import { motion } from "framer-motion";
import { Lightbulb, FileText, Target, TrendingUp, Award, Globe } from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Identify & Protect Your Innovation",
    description: "Draft your invention. File for a Research Paper, Patent, Design, or Copyright. Ensure IP is legally protected before disclosure.",
    icon: Lightbulb,
  },
  {
    step: 2,
    title: "Conduct a Technology Assessment",
    description: "Analyse technical feasibility. Study market demand, competition, and IP strength. Choose from 2 report formats (Advanced or Comprehensive).",
    icon: FileText,
  },
  {
    step: 3,
    title: "Evaluate Commercial Potential",
    description: "Who will use it? What problems does it solve? What's the ROI? Which countries/industries are best suited?",
    icon: Target,
  },
  {
    step: 4,
    title: "Choose a Commercialisation Path",
    description: "Licensing to industry, Startup/Spin-off creation, Joint Ventures & Partnerships, Government or CSR Integration.",
    icon: TrendingUp,
  },
  {
    step: 5,
    title: "Go-to-Market & Launch",
    description: "Prototype and test. Secure regulatory approvals. Develop marketing and customer strategy. Launch MVP.",
    icon: Award,
  },
  {
    step: 6,
    title: "Scale, Monetise & Monitor",
    description: "Track performance. Optimize business model. Expand IP portfolio globally. License to more territories or sectors.",
    icon: Globe,
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function CommercializationSection() {
  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
            Proven Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Commercialisation{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform your innovation into commercial success through our{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">systematic 6-step methodology</span>
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {STEPS.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group relative"
              >
                <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-400 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-blue-600/10 transition-all duration-500" />
                  <div className="relative p-8 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">{step.step}</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-700 dark:to-blue-900/40 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-3 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
