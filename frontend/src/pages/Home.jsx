import { useState, useEffect } from "react";
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
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Globe,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get("/plans");
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

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
      title: "RTTP Certified",
      description:
        "Work with Registered Technology Transfer Professionals for expert IP commercialization guidance.",
    },
    {
      icon: Users,
      title: "Global Network",
      description:
        "Access to worldwide network of technology transfer offices and IP licensing experts.",
    },
  ];

  const commercializationSteps = [
    {
      step: 1,
      title: "Identify & Protect Your Innovation",
      description: "Draft your invention. File for a Research Paper, Patent, Design, or Copyright. Ensure IP is legally protected before disclosure.",
      icon: Lightbulb
    },
    {
      step: 2,
      title: "Conduct a Technology Assessment",
      description: "Analyse technical feasibility. Study market demand, competition, and IP strength. Choose from 4 report formats (Basic to Comprehensive).",
      icon: FileText
    },
    {
      step: 3,
      title: "Evaluate Commercial Potential",
      description: "Who will use it? What problems does it solve? What's the ROI? Which countries/industries are best suited?",
      icon: Target
    },
    {
      step: 4,
      title: "Choose a Commercialisation Path",
      description: "Licensing to industry, Startup/Spin-off creation, Joint Ventures & Partnerships, Government or CSR Integration.",
      icon: TrendingUp
    },
    {
      step: 5,
      title: "Go-to-Market & Launch",
      description: "Prototype and test. Secure regulatory approvals. Develop marketing and customer strategy. Launch MVP.",
      icon: Award
    },
    {
      step: 6,
      title: "Scale, Monetise & Monitor",
      description: "Track performance. Optimize business model. Expand IP portfolio globally. License to more territories or sectors.",
      icon: Globe
    }
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
        toast.error("You've reached your report limit. Please upgrade to continue.");
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
                href="#journey"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                IP Journey
              </a>
              <a
                href="#pricing"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Pricing
              </a>
              <Link
                to="/rttp"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                RTTP Experts
              </Link>
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

      {/* Hero Section with Report Generator */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              AI-Powered IP
              <span className="text-gradient block">Commercialization Reports</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Transform your innovation into commercial success. Get comprehensive technology assessment 
              reports with expert RTTP guidance. Start with a free report - no credit card required.
            </p>
          </div>

          {/* Report Generator */}
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
                  placeholder="Describe your technology innovation, patent idea, or research concept here... For example: 'AI-powered smart home automation system with voice control and predictive analytics for energy optimization...'"
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
                <span>RTTP Certified</span>
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
              Powerful Features for IP Commercialization
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need to conduct thorough technology assessments and
              make data-driven commercialization decisions.
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

      {/* IP Commercialization Journey */}
      <section id="journey" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              IP Commercialisation Journey
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Follow our proven 6-step process to transform your innovation into commercial success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commercializationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <IconComponent className="h-6 w-6 text-primary-600 mr-2" />
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Choose Your Analysis Depth
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              From basic assessments to comprehensive IP commercialization blueprints. 
              Start free and upgrade as needed.
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`card relative ${
                    plan.is_popular ? "ring-2 ring-primary-500 scale-105" : ""
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {plan.highlight_text || "Most Popular"}
                      </span>
                    </div>
                  )}
                  
                  {plan.badge_text && !plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-secondary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {plan.badge_text}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      {plan.price_inr === 0 ? (
                        <span className="text-4xl font-bold text-neutral-900">Free</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-neutral-900">
                            ₹{Math.round(plan.price_inr / 100)}
                          </span>
                          <span className="text-neutral-600">/month</span>
                        </>
                      )}
                    </div>
                    <p className="text-neutral-600 mb-6">{plan.description}</p>
                    
                    {/* Report Formats */}
                    <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                      <p className="text-sm font-medium text-primary-900 mb-1">
                        Report Formats: {plan.report_formats.join(", ")}
                      </p>
                      <p className="text-xs text-primary-700">
                        {plan.report_pages} • {plan.reports_limit || "Unlimited"} reports/month
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8 text-left">
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
                        plan.is_popular ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {plan.price_inr === 0 ? "Start Free" : "Get Started"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RTTP Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <BookOpen className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Work with Certified RTTP Experts
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Access Registered Technology Transfer Professionals (RTTPs) – experts in IP licensing, 
              tech transfer, and commercialisation. Get expert guidance to maximize your innovation's potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rttp"
                className="btn bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-3"
              >
                Learn About RTTP
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
              >
                {user ? "Get Expert Help" : "Start Your Journey"}
              </Link>
            </div>
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
                AI-powered IP commercialization reports for modern innovators and researchers.
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
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    to="/rttp"
                    className="hover:text-white transition-colors"
                  >
                    RTTP Experts
                  </Link>
                </li>
                <li>
                  <a href="#journey" className="hover:text-white transition-colors">
                    IP Journey
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Consulting
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