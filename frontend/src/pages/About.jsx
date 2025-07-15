import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, Zap, Shield, Globe, Users, TrendingUp, Award, Clock } from 'lucide-react';

export default function AboutUs() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Analysis",
      description: "Generate comprehensive technology assessment reports in minutes using advanced AI algorithms with 99% accuracy rate."
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      title: "RTTP Certified",
      description: "Work with Registered Technology Transfer Professionals for expert IP commercialization guidance and industry expertise."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Results in Minutes",
      description: "Get instant analysis in less than 60 seconds. No more waiting weeks for technology assessments."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Enterprise Security",
      description: "Enterprise-grade security ensures your intellectual property and sensitive data remain protected."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: "Global Network",
      description: "Access to worldwide network of technology transfer offices and IP licensing experts."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: "Data-Driven Decisions",
      description: "Make confident commercialization decisions with comprehensive market insights and licensing data."
    }
  ];

  const reportTypes = [
    {
      name: "Basic",
      description: "Ideal for early-stage IP assessments",
      features: ["Technology overview", "Basic market analysis", "IP landscape scan"]
    },
    {
      name: "Advanced",
      description: "Includes licensing and market insights",
      features: ["Comprehensive analysis", "Licensing opportunities", "Market potential assessment", "Competitive landscape"]
    },
    {
      name: "Comprehensive",
      description: "Complete due diligence + commercialization plan",
      features: ["Full due diligence", "Commercialization strategy", "Risk assessment", "Implementation roadmap", "ROI projections"]
    }
  ];

  const stats = [
    { value: "99%", label: "Accuracy Rate" },
    { value: "<60s", label: "Analysis Time" },
    { value: "1000+", label: "Technology Leaders" },
    { value: "50+", label: "Countries Served" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">Assesme</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your innovation into commercial success with our AI-powered technology assessment platform. 
            Get comprehensive reports with expert RTTP guidance in minutes, not weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              AI-Powered Analysis
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              RTTP Certified
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Results in Minutes
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing technology transfer by making professional IP assessments accessible, 
              fast, and data-driven. Our AI-powered platform empowers innovators to make confident 
              commercialization decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Powerful Features for IP Commercialization</h3>
              <p className="text-gray-600 mb-6">
                Everything you need to conduct thorough technology assessments and make data-driven 
                commercialization decisions with confidence.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Advanced AI algorithms for comprehensive analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Professional PDF reports with expert formatting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">RTTP-certified guidance and recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Global network of technology transfer experts</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Trusted by Innovation Leaders</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Universities</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Startups</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Enterprises</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Globe className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Rttp expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose TechAssess AI?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with expert human insight to deliver 
              unparalleled technology assessment capabilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Assessment Report Types</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from three comprehensive report types designed to meet your specific needs and timeline.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reportTypes.map((report, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{report.name}</h3>
                  <p className="text-gray-600">{report.description}</p>
                </div>
                <ul className="space-y-3">
                  {report.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
     

      {/* Footer */}
   
    </div>
  );
}