import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  BarChart3,
  Award,
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
} from "lucide-react";
import toast from "react-hot-toast";

export default function RTTP() {
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const services = [
    {
      area: "Tech Scouting",
      description: "Validate your innovation and position it correctly",
      icon: Lightbulb,
      details:
        "Our RTTP experts help you identify market gaps, validate technical feasibility, and position your innovation for maximum commercial impact.",
    },
    {
      area: "IP Licensing Strategy",
      description: "Help you license to industry, startups, or global players",
      icon: FileText,
      details:
        "Develop comprehensive licensing strategies, negotiate terms, and connect with potential licensees across industries and geographies.",
    },
    {
      area: "Startup Formation",
      description: "Guide business model, cap tables, and investor readiness",
      icon: TrendingUp,
      details:
        "From concept to company - we guide you through business model development, equity structures, and preparing for investment rounds.",
    },
    {
      area: "Funding Roadmap",
      description: "Map SBIR/VC/CSR/Angel investments and pitch readiness",
      icon: DollarSign,
      details:
        "Create strategic funding pathways including government grants, venture capital, corporate partnerships, and angel investments.",
    },
    {
      area: "Global Market Access",
      description: "Prepare your tech/IP for international commercialisation",
      icon: Globe,
      details:
        "Navigate international markets, regulatory requirements, and establish global partnerships for technology transfer.",
    },
    {
      area: "Compliance & Risk",
      description: "Ensure regulatory and legal due diligence is done right",
      icon: Shield,
      details:
        "Comprehensive risk assessment, regulatory compliance guidance, and legal due diligence for technology commercialization.",
    },
  ];

  const benefits = [
    "Builds Trust for Investors",
    "Increases Commercialisation Success Rate",
    "Avoids Legal/IP Mistakes",
    "Access to a Global Network of Tech Transfer Offices",
    "Helps Academic & Research Institutions Navigate Commercialisation",
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          message: data.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      const result = await response.json();
      toast.success(
        result.message ||
          "Thank you for your inquiry! We will get back to you soon."
      );
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to submit your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gradient">
                Asasy
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-neutral-600 hover:text-neutral-900">
                Home
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <Award className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Work with Certified
              <span className="text-gradient block">RTTP Experts</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Access Registered Technology Transfer Professionals (RTTPs) –
              experts in IP licensing, tech transfer, and commercialisation. Get
              the guidance you need to transform your innovation into commercial
              success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                Connect with an Expert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#services" className="btn-outline text-lg px-8 py-3">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What is RTTP Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                What Is RTTP?
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                RTTP (Registered Technology Transfer Professional) is a global
                accreditation by ATTP (Alliance of Technology Transfer
                Professionals) for experts who specialize in transforming
                innovations into commercial success.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Intellectual Property Licensing
                    </h3>
                    <p className="text-neutral-600">
                      Expert guidance on IP strategy and licensing deals
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Startup Formation & Fundraising
                    </h3>
                    <p className="text-neutral-600">
                      From concept to company with investor readiness
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      University-Industry Collaborations
                    </h3>
                    <p className="text-neutral-600">
                      Bridge academic research with industry needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Technology Transfer & Commercialisation Strategy
                    </h3>
                    <p className="text-neutral-600">
                      End-to-end commercialization planning and execution
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      Global Network
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Worldwide tech transfer offices
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      Expert Network
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Certified professionals
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      Industry Focus
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Sector-specific expertise
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      Proven Results
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Track record of success
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How RTTP Experts Help Section */}
      <section id="services" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How RTTP Experts Help You
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our certified RTTP professionals provide comprehensive support
              across all aspects of technology commercialization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() =>
                    setSelectedService(selectedService === index ? null : index)
                  }
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                      <IconComponent className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                      {service.area}
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {service.description}
                    </p>
                    {selectedService === index && (
                      <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                        <p className="text-sm text-primary-800">
                          {service.details}
                        </p>
                      </div>
                    )}
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      {selectedService === index ? "Show Less" : "Learn More"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why It Matters
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Working with RTTP-certified experts significantly increases your
              chances of successful technology commercialization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {benefit}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {index === 0 &&
                      "Professional credentials and proven track record build confidence with investors and partners."}
                    {index === 1 &&
                      "RTTP-guided projects have significantly higher success rates in reaching market."}
                    {index === 2 &&
                      "Expert guidance helps you navigate complex IP and legal landscapes safely."}
                    {index === 3 &&
                      "Connect with universities, research institutions, and industry partners worldwide."}
                    {index === 4 &&
                      "Specialized support for academic institutions transitioning research to market."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Get Expert Consultation
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Ready to commercialize your innovation? Contact our RTTP experts
              for personalized guidance.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      className={`pl-10 input ${
                        errors.name ? "input-error" : ""
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[+]?[\d\s\-\(\)]{10,}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      type="tel"
                      className={`pl-10 input ${
                        errors.phone ? "input-error" : ""
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    type="email"
                    className={`pl-10 input ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Query Message *
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-neutral-400" />
                  </div>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                    })}
                    rows={5}
                    className={`pl-10 input resize-none ${
                      errors.message ? "input-error" : ""
                    }`}
                    placeholder="Describe your technology, innovation, or specific questions about commercialization..."
                  />
                </div>
                {errors.message && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Phone className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Expert Help to Commercialise Your IP?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Connect with an RTTP-certified expert on our platform. Schedule
              your first consultation or bundle it in your report plan for
              comprehensive support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-3"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/#pricing"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
              >
                View Report Plans
              </Link>
            </div>
            <p className="mt-6 text-primary-100 text-sm">
              First consultation included with Professional and Enterprise plans
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">Asasy</span>
              </div>
              <p className="text-neutral-400">
                AI-powered IP commercialization with expert RTTP guidance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>Technology Assessment</li>
                <li>IP Licensing Strategy</li>
                <li>Startup Formation</li>
                <li>Market Analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>Documentation</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>Expert Consultation</li>
                <li>Technical Support</li>
                <li>Partnership Inquiries</li>
                <li>Media & Press</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 Asasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
