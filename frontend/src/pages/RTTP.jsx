import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Calendar,
  ExternalLink,
  Star,
  Zap,
  Sparkles,
  ChevronRight,
  PlayCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function RTTP() {
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const [calError, setCalError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cal.com direct booking URL
  const calDirectURL = "https://cal.com/assesme/15min";

  // Try to load Cal.com embed script
  useEffect(() => {
    const loadCalScript = () => {
      if (window.Cal) {
        initializeCal();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => {
        console.log("Cal.com script loaded");
        initializeCal();
      };
      script.onerror = () => {
        console.error("Failed to load Cal.com script");
        setCalError(true);
      };
      document.head.appendChild(script);
    };

    const initializeCal = () => {
      if (window.Cal) {
        try {
          window.Cal("init", {
            origin: "https://app.cal.com",
          });
          setCalLoaded(true);
          console.log("Cal.com initialized successfully");
        } catch (error) {
          console.error("Cal.com initialization error:", error);
          setCalError(true);
        }
      }
    };

    loadCalScript();
  }, []);

  const handleDirectBooking = () => {
    window.open(calDirectURL, "_blank");
  };

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
      color: "from-yellow-400 to-orange-500",
      details:
        "Our RTTP experts help you identify market gaps, validate technical feasibility, and position your innovation for maximum commercial impact.",
      features: [
        "Market Gap Analysis",
        "Technical Feasibility",
        "Commercial Positioning",
      ],
    },
    {
      area: "IP Licensing Strategy",
      description: "Help you license to industry, startups, or global players",
      icon: FileText,
      color: "from-blue-400 to-indigo-500",
      details:
        "Develop comprehensive licensing strategies, negotiate terms, and connect with potential licensees across industries and geographies.",
      features: [
        "Licensing Strategy",
        "Term Negotiation",
        "Global Connections",
      ],
    },
    {
      area: "Startup Formation",
      description: "Guide business model, cap tables, and investor readiness",
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
      details:
        "From concept to company - we guide you through business model development, equity structures, and preparing for investment rounds.",
      features: [
        "Business Model Design",
        "Cap Table Structure",
        "Investor Readiness",
      ],
    },
    {
      area: "Funding Roadmap",
      description: "Map SBIR/VC/CSR/Angel investments and pitch readiness",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
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
      features: [
        "Market Entry Strategy",
        "Regulatory Compliance",
        "Partnership Development",
      ],
    },
    {
      area: "Compliance & Risk",
      description: "Ensure regulatory and legal due diligence is done right",
      icon: Shield,
      color: "from-red-400 to-rose-500",
      details:
        "Comprehensive risk assessment, regulatory compliance guidance, and legal due diligence for technology commercialization.",
      features: [
        "Risk Assessment",
        "Legal Due Diligence",
        "Compliance Guidance",
      ],
    },
  ];

  const benefits = [
    {
      title: "Builds Trust for Investors",
      description: "Professional validation increases investor confidence",
      icon: Shield,
    },
    {
      title: "Increases Commercialisation Success Rate",
      description: "Proven methodologies improve your chances of success",
      icon: TrendingUp,
    },
    {
      title: "Avoids Legal/IP Mistakes",
      description: "Expert guidance prevents costly legal pitfalls",
      icon: CheckCircle2,
    },
    {
      title: "Access to Global Network",
      description: "Connect with tech transfer offices worldwide",
      icon: Globe,
    },
    {
      title: "Academic Institution Support",
      description: "Specialized guidance for research commercialization",
      icon: BookOpen,
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Research Director, MIT",
      content:
        "Working with RTTPs transformed our approach to technology transfer. The expertise and network they provided was invaluable.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, BioTech Innovations",
      content:
        "The RTTP guidance helped us navigate the complex licensing landscape and secure our first major deal.",
      rating: 5,
    },
    {
      name: "Prof. James Wilson",
      role: "Stanford University",
      content:
        "Professional, knowledgeable, and results-driven. Our commercialization success rate improved significantly.",
      rating: 5,
    },
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

      if (!response.ok) throw new Error("Failed to submit contact form");

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
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 shadow-lg">
              <Award className="h-10 w-10 text-blue-600" />
            </div>

            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Certified Technology Transfer Experts
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Work with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                RTTP Experts
              </span>
            </h1>

            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access Registered Technology Transfer Professionals (RTTPs) –
              experts in IP licensing, tech transfer, and commercialisation. Get
              the guidance you need to transform your innovation into commercial
              success.
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => window.open("https://forms.gle/rttp-expert-form", "_blank")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <User className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Join as Expert
                <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDirectBooking}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://www.youtube.com/watch?v=your-video-id"
                target="_blank"
                rel="noopener noreferrer"
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center"
              >
                <PlayCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Learn More
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-neutral-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                500+ Global RTTPs
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                4.9/5 Rating
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-600" />
                50+ Countries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced What is RTTP Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                What is an{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RTTP?
                </span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                A Registered Technology Transfer Professional (RTTP) is a
                certified expert who specializes in moving innovations from
                research institutions to commercial markets. They bridge the gap
                between academic research and industry applications.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-neutral-600 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-6 opacity-10"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-neutral-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">
                      500+
                    </h3>
                    <p className="text-neutral-600">Global RTTPs</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">
                      85%
                    </h3>
                    <p className="text-neutral-600">Success Rate</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">
                      50+
                    </h3>
                    <p className="text-neutral-600">Countries</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Building className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">
                      1000+
                    </h3>
                    <p className="text-neutral-600">Institutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section
        id="services"
        className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RTTPs
              </span>{" "}
              Can Help You
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Our network of certified RTTPs provides comprehensive support
              across all aspects of technology transfer and commercialization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  onClick={() =>
                    setSelectedService(selectedService === index ? null : index)
                  }
                >
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`}
                  ></div>

                  <div className="relative">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.area}
                    </h3>

                    <p className="text-neutral-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Feature list */}
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-sm text-neutral-500"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      <span className="text-sm">Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {selectedService === index && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 animate-in slide-in-from-top-2">
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {service.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Don't just take our word for it. See what researchers and
              innovators have to say about working with RTTPs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-neutral-50 rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow"
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
                    <User className="w-5 h-5 text-white" />
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Form Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-xl text-neutral-600">
              Have questions about working with RTTPs? We're here to help.
            </p>
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
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.reason.message}
                  </p>
                )}
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
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2 text-blue-600" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
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
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
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
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="mr-2 h-5 w-5 group-hover:animate-pulse" />
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
