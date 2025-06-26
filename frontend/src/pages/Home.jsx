import { Link } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

export default function Home() {
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechStart Inc.",
      content:
        "Asasy has revolutionized how we evaluate new technologies. The AI-generated reports are incredibly detailed and save us weeks of research.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Innovation Director, Global Corp",
      content:
        "The quality of analysis is outstanding. We use Asasy for all our technology assessment needs.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Product Manager, StartupXYZ",
      content:
        "Simple to use, powerful results. Asasy helps us make informed technology decisions quickly.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹999",
      period: "/month",
      description: "Perfect for individuals and small teams",
      features: [
        "10 AI-powered reports",
        "Professional PDF exports",
        "Email support",
        "Basic analytics dashboard",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "50 AI-powered reports",
        "Advanced PDF customization",
        "Priority support",
        "Team collaboration",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹9,999",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited reports",
        "Custom branding",
        "24/7 phone support",
        "Dedicated account manager",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gradient">
                  Asasy
                </span>
              </div>
            </a>
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
              {/* <a
                href="#testimonials"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Testimonials
              </a> */}
              <Link
                to="/login"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              AI-Powered Technology
              <span className="text-gradient block">Assessment Reports</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Generate comprehensive technology assessment reports in minutes.
              Make informed decisions with AI-powered analysis and professional
              documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
            <p className="text-sm text-neutral-500 mt-4">
              Get your first report absolutely free • No credit card required
            </p>
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start with a free report and
              upgrade as you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <span className="text-4xl font-bold text-neutral-900">
                      {plan.price}
                    </span>
                    <span className="text-neutral-600">{plan.period}</span>
                  </div>
                  <p className="text-neutral-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`w-full ${
                      plan.popular ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              See what our customers are saying about their experience with
              Asasy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-warning-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-neutral-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </p>
                  <p className="text-neutral-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Technology Assessment Process?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Asasy for their technology
            evaluation needs.
          </p>
          <Link
            to="/signup"
            className="btn bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-3"
          >
            Start Your Free Trial
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
