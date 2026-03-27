import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Users,
  Globe,
  TrendingUp,
  Shield,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  DollarSign,
  Building,
  FileText,
  Phone,
  User,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const calDirectURL = "https://cal.com/assesme/15min";

const SERVICES = [
  {
    area: "Tech Scouting",
    description: "Validate your innovation and position it correctly",
    icon: Lightbulb,
    color: "from-yellow-400 to-orange-500",
    details:
      "Our experts help you identify market gaps, validate technical feasibility, and position your innovation for maximum commercial impact.",
    features: ["Market Gap Analysis", "Technical Feasibility", "Commercial Positioning"],
  },
  {
    area: "IP Licensing Strategy",
    description: "Help you license to industry, startups, or global players",
    icon: FileText,
    color: "from-blue-400 to-blue-600",
    details:
      "Develop comprehensive licensing strategies, negotiate terms, and connect with potential licensees across industries and geographies.",
    features: ["Licensing Strategy", "Term Negotiation", "Global Connections"],
  },
  {
    area: "Startup Formation",
    description: "Guide business model, cap tables, and investor readiness",
    icon: TrendingUp,
    color: "from-green-400 to-emerald-500",
    details:
      "From concept to company — we guide you through business model development, equity structures, and preparing for investment rounds.",
    features: ["Business Model Design", "Cap Table Structure", "Investor Readiness"],
  },
  {
    area: "Funding Roadmap",
    description: "Map SBIR/VC/CSR/Angel investments and pitch readiness",
    icon: DollarSign,
    color: "from-teal-400 to-teal-600",
    details:
      "Create strategic funding pathways including government grants, venture capital, corporate partnerships, and angel investments.",
    features: ["Grant Applications", "VC Connections", "Pitch Preparation"],
  },
  {
    area: "Global Market Access",
    description: "Prepare your tech/IP for international commercialisation",
    icon: Globe,
    color: "from-teal-400 to-cyan-500",
    details:
      "Navigate international markets, regulatory requirements, and establish global partnerships for technology transfer.",
    features: ["Market Entry Strategy", "Regulatory Compliance", "Partnership Development"],
  },
  {
    area: "Compliance & Risk",
    description: "Ensure regulatory and legal due diligence is done right",
    icon: Shield,
    color: "from-red-400 to-rose-500",
    details:
      "Comprehensive risk assessment, regulatory compliance guidance, and legal due diligence for technology commercialization.",
    features: ["Risk Assessment", "Legal Due Diligence", "Compliance Guidance"],
  },
];

const BENEFITS = [
  { title: "Builds Trust for Investors", description: "Professional validation increases investor confidence", icon: Shield },
  { title: "Increases Commercialisation Success Rate", description: "Proven methodologies improve your chances of success", icon: TrendingUp },
  { title: "Avoids Legal/IP Mistakes", description: "Expert guidance prevents costly legal pitfalls", icon: CheckCircle2 },
  { title: "Access to Global Network", description: "Connect with tech transfer offices worldwide", icon: Globe },
  { title: "Academic Institution Support", description: "Specialized guidance for research commercialization", icon: BookOpen },
];

export default function Experts() {
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://backend.assesme.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          message: data.message,
          reason: data.reason,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      const result = await response.json();
      toast.success(result.message || "Thank you for your inquiry! We will get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to submit your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Work with Our Experts
          </h1>
          <p className="text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Access certified technology transfer and commercialisation professionals — specialists in IP licensing, tech transfer, and market access. Get the guidance you need to transform your innovation into commercial success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={calDirectURL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-8 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-sm"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="https://forms.gle/1AHvijC9uidoGeig8"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-base font-medium px-8 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <User className="mr-2 h-5 w-5" />
              Join as Expert
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* What is our Expert Network */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Who Are Our{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Experts?
                </span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Our network comprises Registered Technology Transfer Professionals (RTTPs) and certified commercialisation specialists who bridge the gap between academic research and industry application. They are globally recognised, domain-specific, and results-driven.
              </p>
              <div className="space-y-4">
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">{b.title}</h3>
                        <p className="text-neutral-600 text-sm">{b.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl transform rotate-6 opacity-10" />
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-neutral-100">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Users, stat: "500+", label: "Global Experts", color: "from-blue-100 to-blue-200", iconColor: "text-blue-600" },
                    { icon: TrendingUp, stat: "85%", label: "Success Rate", color: "from-green-100 to-teal-100", iconColor: "text-green-600" },
                    { icon: Globe, stat: "50+", label: "Countries", color: "from-teal-100 to-cyan-100", iconColor: "text-teal-600" },
                    { icon: Building, stat: "1000+", label: "Institutions", color: "from-yellow-100 to-orange-100", iconColor: "text-yellow-600" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`h-8 w-8 ${item.iconColor}`} />
                        </div>
                        <h3 className="text-3xl font-bold text-neutral-900 mb-2">{item.stat}</h3>
                        <p className="text-neutral-600">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              How Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Experts
              </span>{" "}
              Can Help You
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive support across all aspects of technology transfer and commercialisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedService(selectedService === index ? null : index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.area}
                    </h3>
                    <p className="text-neutral-600 mb-4 leading-relaxed">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      {service.features.map((f, fi) => (
                        <div key={fi} className="flex items-center text-sm text-neutral-500">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span className="text-sm">Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                    {selectedService === index && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-neutral-700 leading-relaxed">{service.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-xl text-neutral-600">Have questions about working with our experts? We're here to help.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-neutral-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Target className="inline h-4 w-4 mr-2 text-blue-600" />
                  Reason for Contact
                </label>
                <select
                  {...register("reason", { required: "Please select a reason" })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a reason...</option>
                  <option value="tech_scouting">Tech Scouting</option>
                  <option value="ip_licensing">IP Licensing</option>
                  <option value="startup_formation">Startup Formation</option>
                  <option value="funding_strategy">Funding Strategy</option>
                  <option value="global_market_access">Global Market Access</option>
                  <option value="compliance_risks">Compliance and Risks</option>
                  <option value="other">Other</option>
                </select>
                {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <User className="inline h-4 w-4 mr-2 text-blue-600" />
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2 text-blue-600" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...register("phone", { required: "Phone number is required" })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2 text-blue-600" />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-2 text-blue-600" />
                  Message
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Tell us about your project or questions..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center mx-auto disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
