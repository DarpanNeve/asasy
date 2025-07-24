import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Zap,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  FileText,
  Star,
  PlayCircle,
  Sparkles,
  Brain,
  Rocket,
  Crown,
  Diamond,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TokenPricingSection from "../components/TokenPricingSection";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency, formatPriceWithOriginal } from "../utils/currencyUtils";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Analysis",
      description:
        "Generate comprehensive technology assessment reports in minutes using advanced AI algorithms with 92% accuracy rate.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      title: "RTTP Certified",
      description:
        "Work with Registered Technology Transfer Professionals for expert IP commercialization guidance and industry expertise.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Results in Minutes",
      description:
        "Get instant analysis in less than 60 seconds. No more waiting weeks for technology assessments.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Enterprise Security",
      description:
        "Enterprise-grade security ensures your intellectual property and sensitive data remain protected.",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: "Global Network",
      description:
        "Access to worldwide network of technology transfer offices and IP licensing experts.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: "Data-Driven Decisions",
      description:
        "Make confident commercialization decisions with comprehensive market insights and licensing data.",
      color: "from-orange-500 to-red-600",
    },
  ];

  const stats = [
    { value: "92%", label: "Accuracy Rate" },
    { value: "<60s", label: "Analysis Time" },
    { value: "1000+", label: "Technology Leaders" },
    { value: "5+", label: "Countries Served" },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Research Director, MIT",
      content:
        "The AI-powered reports provided insights we never considered. It transformed our approach to technology transfer.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, BioTech Innovations",
      content:
        "Assesme helped us identify the perfect licensing strategy. We closed our first major deal within 3 months.",
      rating: 5,
    },
    {
      name: "Prof. James Wilson",
      role: "Stanford University",
      content:
        "Professional, accurate, and incredibly fast. Our commercialization success rate improved by 40%.",
      rating: 5,
    },
  ];

  const reportTypes = [
    {
      name: "Basic Report",
      tokens: "2,500",
      price: "₹2,490", // Updated to INR
      description: "Essential analysis and insights",
      features: [
        "Executive Summary",
        "Technology Overview",
        "Market Assessment",
        "IP Landscape",
        "Next Steps",
      ],
      color: "from-blue-500 to-blue-600",
      icon: Zap,
    },
    {
      name: "Advanced Report",
      tokens: "7,500",
      price: "₹7,470", // Updated to INR
      description: "Comprehensive analysis with detailed insights",
      features: [
        "Everything in Basic",
        "Competitive Analysis",
        "Business Case",
        "Financial Estimates",
        "Go-to-Market Plan",
      ],
      color: "from-purple-500 to-purple-600",
      icon: Crown,
      popular: true,
    },
    {
      name: "Comprehensive Report",
      tokens: "9,000",
      price: "₹8,970", // Updated to INR
      description: "Premium analysis with AI-driven insights",
      features: [
        "Everything in Advanced",
        "5-Year ROI Projections",
        "Funding Strategy",
        "Implementation Roadmap",
        "Risk Assessment",
      ],
      color: "from-emerald-500 to-emerald-600",
      icon: Diamond,
    },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/reports");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Currency Notice */}
      <div className="bg-blue-50 border-b border-blue-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-blue-800">
              <span className="text-sm font-medium">
                💰 All prices displayed in Indian Rupees (INR) including 18% GST
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Technology Assessment Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight"
            >
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Innovation
              </span>{" "}
              Into Commercial Success
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Get AI-powered technology assessment reports and connect with
              certified RTTP experts to accelerate your innovation
              commercialization journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Rocket className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/rttp"
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center"
              >
                <Users className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Meet RTTP Experts
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 text-sm font-medium"
            >
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                3,000 Free Tokens
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Instant Reports
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Assesme?
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with expert human
              insight to deliver unparalleled technology assessment
              capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Report Type
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From basic assessments to comprehensive analysis, we have the
              right solution for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative bg-white rounded-xl p-8 shadow-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    report.popular
                      ? "border-orange-200 shadow-xl"
                      : "border-neutral-200 hover:shadow-xl"
                  }`}
                >
                  {report.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${report.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {report.name}
                    </h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {report.price}
                    </div>
                    <div className="text-sm text-neutral-600 mb-4">
                      {report.tokens} Tokens
                    </div>
                    <p className="text-neutral-600">{report.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {report.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-neutral-700"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-3 px-6 bg-gradient-to-r ${report.color} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    Get Started
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Don't just take our word for it. See what researchers and
              innovators have to say about Assesme.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Pricing Section */}
      <TokenPricingSection
        compact={false}
        showReportTypes={true}
        showHeader={true}
        className="bg-white"
      />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Innovation?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of researchers, entrepreneurs, and institutions who
              trust Assesme for their technology assessment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="group bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center font-semibold"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/rttp"
                className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center font-semibold"
              >
                <Award className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Talk to Experts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}