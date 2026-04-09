import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const inputBase =
  "w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border rounded-lg focus:outline-none input-glow transition-colors duration-200";
const inputOk = "border-slate-300 dark:border-slate-600";
const inputErr = "border-red-400 dark:border-red-500";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    reason: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reason) newErrors.reason = "Please select a reason";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://backend.assesme.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: formData.reason,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to submit contact form");
      }

      const result = await response.json();
      setSubmitStatus("success");
      toast.success(
        result.message ||
          "Thank you for your inquiry! We will get back to you soon.",
      );
      setFormData({ reason: "", name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
      toast.error(
        error.message || "Failed to submit your inquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      {/* Hero */}
      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden py-36 md:py-48">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 dark:to-slate-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              We're here to help
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-300">
              Have questions about our services or working with experts? We're
              here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center"
              >
                <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
                <span className="text-teal-800 dark:text-teal-300">
                  Thank you! Your message has been sent successfully.
                </span>
              </motion.div>
            )}
            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center"
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                <span className="text-red-800 dark:text-red-300">
                  Sorry, there was an error sending your message. Please try
                  again.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-6">
              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Target className="inline h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Reason for Contact
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={`${inputBase} ${errors.reason ? inputErr : inputOk}`}
                >
                  <option value="">Select a reason...</option>
                  <option value="global_market_access">General query</option>
                  <option value="custom_pricing">Custom pricing</option>
                  <option value="tech_scouting">Tech Scouting</option>
                  <option value="ip_licensing">IP Licensing</option>
                  <option value="startup_formation">Startup Formation</option>
                  <option value="funding_strategy">Funding Strategy</option>
                  <option value="global_market_access">
                    Global Market Access
                  </option>
                  <option value="compliance_risks">Compliance and Risks</option>
                  <option value="prototyping">Prototyping</option>
                  <option value="other">Other</option>
                </select>
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {errors.reason}
                  </p>
                )}
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <User className="inline h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Phone className="inline h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                    placeholder="Your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputBase} ${errors.message ? inputErr : inputOk} resize-none`}
                  placeholder="Tell us about your project or questions..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="text-center">
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-lg px-8 py-3 rounded-xl btn-glow transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
