import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Crown, Rocket, Diamond, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { tokenAPI } from "../services/api";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [userBalance, setUserBalance] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (user) fetchUserBalance();
  }, [user]);

  const fetchUserBalance = async () => {
    try {
      const response = await tokenAPI.getBalance();
      setUserBalance(response.data);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/experts", label: "Experts" },
    { to: "/investors", label: "Investors" },
    { to: "/technologies", label: "Technologies" },
    { to: "/prototype", label: "Prototype" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`bg-white dark:bg-slate-900 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-md border-b border-neutral-200 dark:border-slate-700/60"
          : "shadow-sm border-b border-neutral-100 dark:border-slate-800/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative flex items-center h-16">
              <img
                src="/logo.svg"
                alt="Assesme Logo"
                className="h-10 w-auto object-contain dark:brightness-125"
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => window.scrollTo(0, 0)}
                  className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md group"
                >
                  <span
                    className={
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-neutral-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }
                  >
                    {label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all duration-200 ml-1"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <Link
                to="/reports"
                className="ml-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 text-sm whitespace-nowrap btn-glow"
                onClick={() => window.scrollTo(0, 0)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-neutral-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-sm"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 text-sm whitespace-nowrap btn-glow"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Get Started
                </Link>
              </>
            )}
            {user && userBalance && (
              <div className="flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-200 dark:border-slate-700 ml-1">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1.5" />
                <span className="text-gray-500 dark:text-slate-400 text-xs mr-1">Tokens</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {userBalance.available_tokens.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-neutral-500 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 shadow-lg border-t border-neutral-100 dark:border-slate-800 z-40"
            >
              <div className="px-4 pt-3 pb-4 space-y-1">
                {navLinks.map(({ to, label }, i) => {
                  const isActive = location.pathname === to;
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link
                        to={to}
                        className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-neutral-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        onClick={handleNavigation}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
                {user ? (
                  <Link
                    to="/reports"
                    className="block px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-2 text-sm"
                    onClick={handleNavigation}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2.5 text-neutral-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors duration-200 text-sm font-medium"
                      onClick={handleNavigation}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-2 text-sm"
                      onClick={handleNavigation}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
              {user && userBalance && (
                <div className="px-4 pb-4">
                  <div className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-fit gap-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-500 dark:text-slate-400 text-sm">Tokens</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {userBalance.available_tokens.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
