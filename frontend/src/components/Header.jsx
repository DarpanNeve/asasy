import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-neutral-100 sticky top-0 z-50"> {/* Enhanced shadow and border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative flex items-center h-16">
              <img
                src="/logoas.png"
                alt="Assesme Logo" /* Changed alt text for clarity */
                className="h-17 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200"> {/* Enhanced hover and added font-medium */}
              Home
            </Link>
            <Link to="/about" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              About Us
            </Link>

            <Link to="/careers" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Careers
            </Link>
            <Link to="/blog" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Blog
            </Link>
            <Link to="/press-releases" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Press
            </Link>
            <Link to="/pricing" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Pricing
            </Link>
            <Link to="/rttp" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              RTTP Experts
            </Link>
            <Link to="/contact" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Contact Us
            </Link>

            {user ? (
              <Link to="/reports" className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"> {/* Styled as a gradient button */}
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"> {/* Styled as a gradient button */}
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /* Added focus styling */
              aria-label="Toggle mobile menu" /* Added aria-label for accessibility */
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-neutral-200 py-4 z-40"> {/* Positioned absolutely, added shadow and padding */}
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3"> {/* Increased space-y */}
              <Link
                to="/"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200" /* Enhanced hover and rounded */
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/careers"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/press-releases"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Press
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/rttp"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                RTTP Experts
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              {user ? (
                <Link
                  to="/reports"
                  className="block px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2" /* Styled as a solid button */
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
