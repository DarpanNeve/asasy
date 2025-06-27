import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  BarChart3,
  FileText,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Send,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description:
        "Generate comprehensive technology assessment reports in minutes using advanced AI algorithms.",
    },
    {
      icon: FileText,
      title: "Professional Reports",
      description:
        "Export publication-ready PDF reports with detailed analysis and professional formatting.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with data encryption and reliable cloud infrastructure.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share reports with your team and collaborate on technology assessments seamlessly.",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Perfect for getting started",
      features: [
        "1 free AI-powered report",
        "Basic PDF export",
        "Email support",
        "Rapid snapshot analysis",
      ],
      popular: false,
    },
    {
      name: "Intermediate",
      price: "₹999",
      period: "/month",
      description: "In-depth feasibility analysis",
      features: [
        "10 AI-powered reports",
        "In-depth feasibility analysis",
        "Technical readiness assessment",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Advanced",
      price: "₹2,999",
      period: "/month",
      description: "Comprehensive due-diligence",
      features: [
        "25 AI-powered reports",
        "Comprehensive due-diligence",
        "TRL assessment",
        "Commercialization options",
      ],
      popular: false,
    },
    {
      name: "Comprehensive",
      price: "₹9,999",
      period: "/month",
      description: "Full commercialization blueprint",
      features: [
        "Unlimited reports",
        "Full commercialization blueprint",
        "Global FTO analysis",
        "24/7 dedicated support",
      ],
      popular: false,
    },
  ];

  const handleGenerateReport = async (data) => {
    if (!user) {
      toast.error("Please sign in to generate reports");
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/reports/generate", {
        idea: data.idea,
      });

      toast.success("Report generation started! Redirecting to dashboard...");
      reset();
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You've used your free report. Please upgrade to continue.");
        navigate("/subscription");
      } else {
        toast.error(error.response?.data?.detail || "Failed to generate report");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gradient">
                Asasy
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Pricing
              </a>
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with ChatGPT-style Interface */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              AI-Powered Technology
              <span className="text-gradient block">Assessment Reports</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Describe your technology idea and get a comprehensive assessment report in minutes.
              Start with a free report - no credit card required.
            </p>
          </div>

          {/* ChatGPT-style Input Interface */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit(handleGenerateReport)} className="space-y-4">
              <div className="relative">
                <textarea
                  {...register("idea", {
                    required: "Please describe your technology idea",
                    minLength: {
                      value: 50,
                      message: "Please provide at least 50 characters",
                    },
                  })}
                  rows={6}
                  className="w-full p-6 pr-16 border-2 border-neutral-200 rounded-2xl shadow-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-none text-lg"
                  placeholder="Describe your technology idea, innovation, or concept here... For example: 'AI-powered smart home automation system with voice control and predictive analytics for energy optimization...'"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="absolute bottom-4 right-4 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-6 w-6" />
                  )}
                </button>
              </div>
              {errors.idea && (
                <p className="text-error-600 text-sm ml-2">{errors.idea.message}</p>
              )}
            </form>

            {/* Quick Examples */}
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500 mb-4">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "AI-powered medical diagnosis system",
                  "Blockchain-based supply chain tracking",
                  "IoT smart agriculture monitoring",
                  "Renewable energy storage solution"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const textarea = document.querySelector('textarea');
                      if (textarea) textarea.value = example;
                    }}
                    className="px-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Status indicators */}
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-neutral-600">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-primary-500 mr-2" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-success-500 mr-2" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-warning-500 mr-2" />
                <span>Results in Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need to conduct thorough technology assessments and
              make data-driven decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6 group-hover:bg-primary-200 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Choose Your Analysis Depth
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              From quick snapshots to comprehensive blueprints. Start free and upgrade as needed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card relative ${
                  plan.popular ? "ring-2 ring-primary-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-neutral-900">
                      {plan.price}
                    </span>
                    <span className="text-neutral-600">{plan.period}</span>
                  </div>
                  <p className="text-neutral-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success-500 mr-3 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={user ? "/dashboard" : "/signup"}
                    className={`w-full ${
                      plan.popular ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {plan.name === "Basic" ? "Start Free" : "Get Started"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Analyze Your Technology?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of innovators who trust Asasy for their technology assessment needs.
          </p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="btn bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-3"
          >
            {user ? "Go to Dashboard" : "Start Your Free Analysis"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
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
                AI-powered technology assessment reports for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-white transition-colors"
                  >
                    Free Trial
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
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