import { Link } from "react-router-dom";
import { BarChart3, Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center group mb-6">
              <div className="relative flex items-center h-16">
                <img
                  src="/logoas.png"
                  alt="Assesme Logo"
                  className="h-18 w-auto object-contain filter brightness-150" /* Added filter for better contrast on dark bg */
                />
              </div>
            </Link>
            <p className="text-gray-300 leading-relaxed text-sm mb-6">
              Empowering innovation through expert technology transfer guidance and AI-powered assessment reports.
            </p>
            <div className="flex space-x-5">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">AI Reports</Link></li>
              <li><Link to="/rttp" className="hover:text-blue-400 transition-colors">RTTP Experts</Link></li>
              <li><a href="/rttp#contact" className="hover:text-blue-400 transition-colors">Tech Scouting</a></li>
              <li><a href="/rttp#contact" className="hover:text-blue-400 transition-colors">IP Licensing</a></li>
              <li><a href="/rttp#contact" className="hover:text-blue-400 transition-colors">Market Analysis</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link to="/rttp" className="hover:text-blue-400 transition-colors">RTTP Experts</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li> {/* Changed to Link assuming an About Us page */}
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li> {/* Changed to Link assuming a Contact page */}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Legal & Contact</h3>
            <ul className="space-y-3 text-gray-300 text-sm mb-6">
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/pricing-policy" className="hover:text-blue-400 transition-colors">Pricing Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li> {/* Uncommented this as it was in the previous conversation */}
            </ul>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <a href="mailto:support@assesme.com" className="hover:text-blue-400 transition-colors">support@assesme.com</a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <a href="tel:+918743078668" className="hover:text-blue-400 transition-colors">+91-87430-78668</a> {/* Updated phone number from previous context */}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                <span>Vastav Intellect IP Solutions LLP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Bottom Info */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Assesme, developed by Vastav Intellect IP Solutions LLP. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            {/* You can add more links or info here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
