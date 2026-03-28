import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SOCIAL = [
  { href: "https://x.com/Assesme_AI", Icon: Twitter, label: "Twitter" },
  { href: "https://www.linkedin.com/company/assesme-ai/", Icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.facebook.com/people/Assesme-AI/61578640013629/", Icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/assesme_ai?igsh=NDA3NjBibWhsbDZq&utm_source=qr", Icon: Instagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 mb-12 border-b border-slate-800 dark:border-slate-800/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div variants={fadeUp}>
            <Link to="/" className="inline-flex items-center mb-6">
              <div className="relative flex items-center h-16">
                <img
                  src="/logoas.png"
                  alt="Assesme Logo"
                  className="h-18 w-auto object-contain brightness-150"
                />
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm mb-6">
              Empowering innovation through expert technology transfer guidance and AI-powered assessment reports.
            </p>
            <div className="flex space-x-4">
              {SOCIAL.map(({ href, Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="w-9 h-9 bg-slate-800 dark:bg-slate-800/60 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold mb-5 text-white uppercase tracking-wide">Services</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              {[
                { to: "/pricing", label: "AI Reports" },
                { to: "/experts", label: "Experts" },
                { to: "/investors", label: "Investors" },
                { to: "/technologies", label: "Submit Technology" },
                { to: "/prototype", label: "Prototype" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-blue-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold mb-5 text-white uppercase tracking-wide">Company</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/pricing", label: "Pricing" },
                { to: "/contact", label: "Contact" },
                { to: "/careers", label: "Careers" },
                { to: "/blog", label: "Blog" },
                { to: "/press-releases", label: "Press Releases" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-blue-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Contact */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold mb-5 text-white uppercase tracking-wide">Legal & Contact</h3>
            <ul className="space-y-3 text-slate-400 text-sm mb-6">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/pricing-policy", label: "Pricing Policy" },
                { to: "/refund-policy", label: "Refund Policy" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-blue-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:support@assesme.com" className="hover:text-blue-400 transition-colors duration-200">
                  support@assesme.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+919667576014" className="hover:text-blue-400 transition-colors duration-200">
                  +91-9667576014
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Vastav Intellect IP Solutions LLP</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Assesme, developed by Vastav Intellect IP Solutions LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
