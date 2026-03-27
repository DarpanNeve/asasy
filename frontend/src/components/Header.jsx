import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Menu, X, Zap, Crown, Rocket, Diamond } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState(null);
  const [tokenPackages, setTokenPackages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    fetchTokenPackages();
    if (user) {
      fetchUserBalance();
    }
  }, [user]);

  const fetchTokenPackages = async () => {
    try {
      const response = await api.get("/tokens/packages");
      let packages = response.data.map((pkg) => ({
        ...pkg,
        icon: getIconForPackage(pkg.package_type),
        color: getColorForPackage(pkg.package_type),
        hoverColor: getHoverColorForPackage(pkg.package_type),
        popular: pkg.package_type === "pro",
      }));

      packages.push({
        id: "enterprise-display",
        name: "Enterprise",
        package_type: "enterprise",
        tokens: 100000,
        price_usd: "Custom",
        description: "Custom solutions for large organizations",
        icon: Diamond,
        color: "from-orange-500 to-orange-600",
        hoverColor: "from-orange-600 to-orange-700",
        popular: false,
        isContactOnly: true,
      });

      setTokenPackages(packages);
    } catch (error) {
      console.error("Failed to fetch token packages:", error);
      toast.error("Failed to load token packages");
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await api.get("/tokens/balance");
      setUserBalance(response.data);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const getColorForPackage = (type) => {
    switch (type) {
      case "starter": return "from-blue-500 to-blue-600";
      case "pro": return "from-teal-500 to-teal-600";
      case "max": return "from-emerald-500 to-emerald-600";
      case "enterprise": return "from-orange-500 to-orange-600";
      default: return "from-blue-500 to-blue-600";
    }
  };

  const getHoverColorForPackage = (type) => {
    switch (type) {
      case "starter": return "from-blue-600 to-blue-700";
      case "pro": return "from-teal-600 to-teal-700";
      case "max": return "from-emerald-600 to-emerald-700";
      case "enterprise": return "from-orange-600 to-orange-700";
      default: return "from-blue-600 to-blue-700";
    }
  };

  const getIconForPackage = (type) => {
    switch (type) {
      case "starter": return Zap;
      case "pro": return Crown;
      case "max": return Rocket;
      case "enterprise": return Diamond;
      default: return Zap;
    }
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navLinks = [
    { to: "/about", label: "About" },
    { to: "/experts", label: "Experts" },
    { to: "/investors", label: "Investors" },
    { to: "/technologies", label: "Technologies" },
    { to: "/prototype", label: "Prototype" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group flex-shrink-0"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative flex items-center h-16">
              <img
                src="/logoas.png"
                alt="Assesme Logo"
                className="h-17 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm whitespace-nowrap"
                onClick={() => window.scrollTo(0, 0)}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <Link
                to="/reports"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm whitespace-nowrap"
                onClick={() => window.scrollTo(0, 0)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm whitespace-nowrap"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Get Started
                </Link>
              </>
            )}
            {user && userBalance && (
              <div className="flex items-center px-3 py-1.5 bg-white rounded-full shadow border border-gray-200">
                <Zap className="w-4 h-4 text-blue-600 mr-1.5" />
                <span className="text-gray-700 text-sm mr-1">Tokens:</span>
                <span className="font-bold text-blue-600 text-sm">
                  {userBalance.available_tokens.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-neutral-200 py-2 z-40">
            <div className="px-1 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={handleNavigation}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <Link
                  to="/reports"
                  className="block px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                  onClick={handleNavigation}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                    onClick={handleNavigation}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                    onClick={handleNavigation}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
            {user && userBalance && (
              <div className="px-4 pb-3">
                <div className="flex items-center px-4 py-2 bg-white rounded-full shadow border border-gray-200 w-fit">
                  <Zap className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700 mr-2">Tokens:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {userBalance.available_tokens.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
