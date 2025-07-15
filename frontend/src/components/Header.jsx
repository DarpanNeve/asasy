import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         <Link to="/" className="flex items-center group">
  <div className="relative flex items-center h-16">
    <img 
      src="/logoas.png" 
      alt="Logo" 
      className="h-17 w-auto object-contain"
    />
  </div>
</Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              About Us
            </Link>
            
            <Link to="/careers" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Careers
            </Link>
            <Link to="/blog" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Blog
            </Link>
            <Link to="/press-releases" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Press
            </Link>
            <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Pricing
            </Link>
            <Link to="/rttp" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              RTTP Experts
            </Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Contact Us
            </Link>
            
            {user ? (
              <Link to="/reports" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-200">
              <Link
                to="/"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/careers"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/press-releases"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Press
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/rttp"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                RTTP Experts
              </Link>
              {user ? (
                <Link
                  to="/reports"
                  className="block px-3 py-2 text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-blue-600 font-medium"
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