import { Link } from "react-router-dom";
import { BarChart3, Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Asasy
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed mb-4">
              Empowering innovation through expert technology transfer guidance and AI-powered assessment reports.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/pricing" className="hover:text-white transition-colors">AI Reports</Link></li>
              <li><Link to="/rttp" className="hover:text-white transition-colors">RTTP Experts</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Tech Scouting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IP Licensing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Market Analysis</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/rttp" className="hover:text-white transition-colors">RTTP Experts</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/pricing-policy" className="hover:text-white transition-colors">Pricing Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              &copy; 2024 Asasy. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-neutral-400">
                <Mail className="w-4 h-4 mr-2" />
                support@asasy.com
              </div>
              <div className="flex items-center text-sm text-neutral-400">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}