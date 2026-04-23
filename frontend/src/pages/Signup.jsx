import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BarChart3,
  Phone,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const inputBase =
  "block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border rounded-lg shadow-sm focus:outline-none input-glow transition-colors duration-200 text-sm";
const inputOk = "border-slate-300 dark:border-slate-600";
const inputErr = "border-red-400 dark:border-red-500";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const { signup, verifyEmail, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || !window.google.accounts) return;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) { toast.error("Google Client ID not configured"); return; }
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });
        setGoogleInitialized(true);
      } catch { toast.error("Failed to initialize Google Sign-In"); }
    };

    const loadGoogleScript = () => new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existingScript) {
        if (window.google && window.google.accounts) resolve();
        else { existingScript.onload = resolve; existingScript.onerror = reject; }
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true; script.defer = true;
      script.onload = resolve; script.onerror = reject;
      document.head.appendChild(script);
    });

    const setupGoogleSignIn = async () => {
      try { await loadGoogleScript(); setTimeout(initializeGoogleSignIn, 200); }
      catch { toast.error("Failed to load Google Sign-In"); }
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
      toast.success("Welcome to Assesme!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDirectGoogleSignIn = () => {
    if (!googleInitialized || !window.google || !window.google.accounts) {
      toast.error("Google Sign-In not available"); return;
    }
    setGoogleLoading(true);
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-9999px";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);
    try {
      window.google.accounts.id.renderButton(tempDiv, {
        theme: "outline", size: "large", text: "signup_with", shape: "rectangular", width: 250,
      });
      setTimeout(() => {
        const googleButton = tempDiv.querySelector('div[role="button"]');
        if (googleButton) googleButton.click();
        else window.google.accounts.id.prompt();
        document.body.removeChild(tempDiv);
      }, 100);
    } catch {
      document.body.removeChild(tempDiv);
      setGoogleLoading(false);
      toast.error("Google Sign-In error. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signup({ name: data.name, email: data.email, password: data.password, phone: data.phone });
      setSignupEmail(data.email);
      setShowOtpForm(true);
      toast.success("Account created! Please verify your email with the OTP sent.");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    setIsLoading(true);
    try {
      await verifyEmail(signupEmail, data.otp);
      toast.success("Email verified successfully! You can now login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtpForm) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-900 dark:to-slate-900 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
        <motion.div
          className="relative max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <Link to="/" className="flex items-center justify-center group mb-8">
              <div className="relative flex items-center h-16">
                <img src="/logo.svg" alt="Assesme" className="h-10 w-auto object-contain" />
              </div>
            </Link>
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Verify your email
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
              We've sent a verification code to{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">{signupEmail}</span>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmitOtp(onOtpSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Verification Code
              </label>
              <input
                {...registerOtp("otp", {
                  required: "Verification code is required",
                  pattern: { value: /^\d{6}$/, message: "Please enter a valid 6-digit code" },
                })}
                type="text"
                maxLength={6}
                className={`block w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border rounded-lg shadow-sm focus:outline-none input-glow text-center text-lg tracking-wider transition-colors ${otpErrors.otp ? inputErr : inputOk}`}
                placeholder="000000"
              />
              {otpErrors.otp && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

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
                  Verifying...
                </div>
              ) : "Verify Email"}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowOtpForm(false)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
              >
                Back to signup
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left side - Hero */}
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
              Start Your Innovation<br />Journey Today
            </h2>
            <p className="text-lg opacity-80 max-w-md mx-auto leading-relaxed">
              Sign up to get AI-powered technology assessment reports and connect
              with industry experts.
            </p>
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mt-10 shadow-2xl">
              <BarChart3 className="w-12 h-12 text-white opacity-90" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-slate-950 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="flex items-center group">
              <div className="relative flex items-center h-16">
                <img src="/logo.svg" alt="Assesme" className="mb-4 h-10 w-auto object-contain" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <div>
            {/* Google */}
            <div className="mb-5">
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
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name *</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                    type="text"
                    autoComplete="name"
                    className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address *</label>
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
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone number *</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: { value: /^[+]?[\d\s\-\(\)]{10,}$/, message: "Please enter a valid phone number" },
                    })}
                    type="tel"
                    autoComplete="tel"
                    className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password *</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: "Password must contain uppercase, lowercase, and a number" },
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`${inputBase} pr-10 ${errors.password ? inputErr : inputOk}`}
                    placeholder="Create a password"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm password *</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`${inputBase} pr-10 ${errors.confirmPassword ? inputErr : inputOk}`}
                    placeholder="Confirm your password"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  {...register("agreeTerms", { required: "You must agree to the terms and conditions" })}
                  type="checkbox"
                  className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-500" target="_blank">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-500" target="_blank">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{errors.agreeTerms.message}
                </p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 btn-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating account...
                  </div>
                ) : "Create account"}
              </motion.button>
            </form>

            <div id="google-signup-button" style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
