import { useState } from "react";
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Award,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Globe,
  Zap,
  Heart
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Careers() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const careerOptions = [
    {
      id: "rttp",
      title: "Join as RTTP Expert",
      description: "Share your expertise in technology transfer and help innovators commercialize their research",
      icon: Award,
      color: "from-blue-500 to-indigo-600",
      hoverColor: "from-blue-600 to-indigo-700",
      benefits: [
        "Flexible remote work",
        "Competitive compensation",
        "Global client network",
        "Professional development"
      ],
      requirements: [
        "RTTP certification or equivalent experience",
        "5+ years in technology transfer",
        "Strong communication skills",
        "Industry expertise"
      ],
      formUrl: "https://forms.gle/rttp-expert-form"
    },
    {
      id: "intern",
      title: "Internship Program",
      description: "Gain hands-on experience in technology transfer, AI, and innovation commercialization",
      icon: GraduationCap,
      color: "from-green-500 to-emerald-600",
      hoverColor: "from-green-600 to-emerald-700",
      benefits: [
        "Mentorship program",
        "Real project experience",
        "Certificate of completion",
        "Potential full-time offer"
      ],
      requirements: [
        "Currently enrolled student",
        "Interest in technology transfer",
        "Basic research skills",
        "Commitment to 3+ months"
      ],
      formUrl: "https://forms.gle/internship-program-form"
    },
    {
      id: "job",
      title: "Full-Time Positions",
      description: "Join our team and help build the future of technology transfer and AI-powered innovation",
      icon: Briefcase,
      color: "from-purple-500 to-pink-600",
      hoverColor: "from-purple-600 to-pink-700",
      benefits: [
        "Competitive salary & equity",
        "Health & wellness benefits",
        "Professional development budget",
        "Flexible work arrangements"
      ],
      requirements: [
        "Relevant degree or experience",
        "Passion for innovation",
        "Team collaboration skills",
        "Growth mindset"
      ],
      formUrl: "https://forms.gle/full-time-positions-form"
    }
  ];

  const companyValues = [
    {
      icon: Zap,
      title: "Innovation First",
      description: "We're at the forefront of technology transfer innovation"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Our work helps innovations reach markets worldwide"
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "We believe in the power of diverse teams working together"
    },
    {
      icon: Heart,
      title: "Purpose Driven",
      description: "Every day we help turn research into solutions that matter"
    }
  ];

  const handleApply = (formUrl) => {
    window.open(formUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Join Our{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Mission
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Help us transform the future of technology transfer and innovation commercialization. 
              Join a team that's passionate about turning research into real-world impact.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-neutral-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Remote-First Culture
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-600" />
                Global Team
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                Innovation Focused
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Career{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover how you can contribute to our mission and grow your career with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careerOptions.map((option) => {
              const Icon = option.icon;
              const isHovered = hoveredCard === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 transition-all duration-300 transform ${
                    isHovered ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${isHovered ? option.hoverColor : option.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                    {option.title}
                  </h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-neutral-900 mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-neutral-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-neutral-900 mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {option.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center text-sm text-neutral-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApply(option.formUrl)}
                    className={`w-full py-3 px-6 bg-gradient-to-r ${option.color} hover:${option.hoverColor} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center group`}
                  >
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape our culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join us in transforming how innovations reach the world. Your expertise can help 
            researchers and entrepreneurs turn their ideas into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleApply("https://forms.gle/general-inquiry-form")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors flex items-center justify-center"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}