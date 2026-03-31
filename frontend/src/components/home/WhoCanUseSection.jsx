import { motion } from "framer-motion";
import { Lightbulb, Landmark, FlaskConical, Briefcase, Building, Handshake } from "lucide-react";

const USERS = [
  {
    icon: Lightbulb,
    color: "from-blue-500 to-blue-700",
    title: "Startups & Founders",
    description: "Validate ideas before investing years of effort.",
  },
  {
    icon: Landmark,
    color: "from-teal-500 to-teal-700",
    title: "Universities & Academia",
    description: "Assess research outputs, patents, and student innovations.",
  },
  {
    icon: FlaskConical,
    color: "from-emerald-500 to-emerald-700",
    title: "R&D Labs & Corporates",
    description: "De-risk projects and identify commercialization paths.",
  },
  {
    icon: Briefcase,
    color: "from-orange-500 to-orange-700",
    title: "Investors & VCs",
    description: "Get standardized, comparable due diligence reports.",
  },
  {
    icon: Building,
    color: "from-blue-600 to-blue-800",
    title: "Government & Policy Bodies",
    description: "Evaluate funding proposals with data-driven reports.",
  },
  {
    icon: Handshake,
    color: "from-teal-600 to-teal-800",
    title: "Incubators & Accelerators",
    description: "Screen applications and guide startups with structured assessments.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhoCanUseSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
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
            Built For Everyone
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Who Can Use{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Assesme?
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Built for the entire innovation ecosystem
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {USERS.map((user, index) => {
            const Icon = user.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-slate-800/70 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${user.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {user.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {user.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
