import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const LEADERS = [
  {
    name: "Mr. Venkatesh Bharti",
    role: "Scientist & Director",
    image: "/venkatesh_bharti.jpeg",
    linkedin: "https://www.linkedin.com/in/venkatesh-bharti/",
  },
  {
    name: "Ms. Deepa Kohli",
    role: "Academic & Innovation Ecosystem Leader",
    image: "/deepa_kohli.jpeg",
    linkedin: "https://www.linkedin.com/in/deep-kohli-13874a283/",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function LeadershipSection() {
  return (
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
            Driven by Innovation. Backed by Experience.
          </h2>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-6 max-w-3xl mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {LEADERS.map((leader) => (
            <motion.article
              key={leader.name}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center"
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="w-28 h-28 rounded-full object-cover mb-5 border-4 border-blue-100 dark:border-blue-900 shadow-md"
              />
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{leader.name}</h3>
              <p className="text-blue-700 dark:text-blue-400 font-medium text-sm mb-4">{leader.role}</p>
              <a
                href={leader.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
                View on LinkedIn
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
