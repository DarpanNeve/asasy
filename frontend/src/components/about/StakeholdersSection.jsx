import { motion } from "framer-motion";
import { Rocket, Microscope, GraduationCap, Building2, Landmark } from "lucide-react";

const STAKEHOLDERS = [
  { icon: Rocket, label: "Startups & Founders" },
  { icon: Microscope, label: "Researchers & Scientists" },
  { icon: GraduationCap, label: "Universities & Incubation Centers" },
  { icon: Building2, label: "Corporates & R&D Teams" },
  { icon: Landmark, label: "Investors & Venture Networks" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function StakeholdersSection() {
  return (
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
            Built for Every Stakeholder in Innovation
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {STAKEHOLDERS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                  <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span>{item.label}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
