import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, BarChart3, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const inputBase =
  "block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border rounded-lg shadow-sm focus:outline-none input-glow transition-colors duration-200 text-sm";
const inputOk = "border-slate-300 dark:border-slate-600";
const inputErr = "border-red-400 dark:border-red-500";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Google Sign-In initialization
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || !window.google.accounts) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        toast.error("Google Client ID not configured");
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });
        setGoogleInitialized(true);
      } catch (error) {
        toast.error("Failed to initialize Google Sign-In");
      }
    };

    const loadGoogleScript = () => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          'script[src*="accounts.google.com/gsi/client"]'
        );
        if (existingScript) {
          if (window.google && window.google.accounts) resolve();
          else { existingScript.onload = resolve; existingScript.onerror = reject; }
          return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const setupGoogleSignIn = async () => {
      try {
        await loadGoogleScript();
        setTimeout(initializeGoogleSignIn, 200);
      } catch {
        toast.error("Failed to load Google Sign-In");
      }
    };

    setupGoogleSignIn();

    return () => {
      if (window.google && window.google.accounts) {
        try { window.google.accounts.id.cancel(); } catch {}
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      if (!response || !response.credential) throw new Error("No credential received from Google");
      const result = await googleLogin(response.credential);
      if (result && result.profile_incomplete) {
        toast.error("Please complete your profile");
        navigate("/profile-completion", { state: { user: result.user, from: location }, replace: true });
        return;
      }
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectGoogleSignIn = () => {
    if (!googleInitialized || !window.google || !window.google.accounts) {
      toast.error("Google Sign-In not available");
      return;
    }
    setGoogleLoading(true);
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-9999px";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);
    try {
      window.google.accounts.id.renderButton(tempDiv, {
        theme: "outline", size: "large", text: "signin_with", shape: "rectangular", width: 250,
      });
      setTimeout(() => {
        const googleButton = tempDiv.querySelector('div[role="button"]');
        if (googleButton) googleButton.click();
        else window.google.accounts.id.prompt();
        document.body.removeChild(tempDiv);
      }, 100);
    } catch (error) {
      document.body.removeChild(tempDiv);
      setGoogleLoading(false);
      toast.error("Google Sign-In error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-slate-950">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="flex items-center group">
              <div className="relative flex items-center h-16">
                <img src="/logoas.png" alt="Logo" className="mr-7 mb-4 h-18 w-auto object-contain" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                  })}
                  type="email"
                  autoComplete="email"
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`${inputBase} pr-10 ${errors.password ? inputErr : inputOk}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 btn-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : "Sign in"}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <motion.button
              type="button"
              onClick={handleDirectGoogleSignIn}
              disabled={googleLoading || !googleInitialized}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {googleLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {!googleInitialized ? "Loading Google..." : "Continue with Google"}
                </>
              )}
            </motion.button>

            <div id="google-signin-button" style={{ display: "none" }} />
          </form>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-900 dark:to-slate-900 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
        <div className="relative text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white/90 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Platform
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Unlock Your Technology's<br />Potential
            </h2>
            <p className="text-lg opacity-80 max-w-md mx-auto leading-relaxed">
              Get AI-powered insights and connect with experts to accelerate your
              innovation journey.
            </p>
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mt-10 shadow-2xl">
              <BarChart3 className="w-12 h-12 text-white opacity-90" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
