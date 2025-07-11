import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, BarChart3, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, verifyEmail, googleLogin } = useAuth();
  const navigate = useNavigate();

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

  // Initialize Google Sign-In without FedCM
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            use_fedcm_for_prompt: false, // Disable FedCM
          });
          
          // Also initialize OAuth2 for popup method
          window.gapi?.load('auth2', () => {
            window.gapi.auth2.init({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            });
          });
        } catch (error) {
          console.error("Google Sign-In initialization error:", error);
        }
      }
    };

    // Load Google APIs
    const loadGoogleAPIs = () => {
      // Load Google Identity Services
      if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        const gsiScript = document.createElement('script');
        gsiScript.src = 'https://accounts.google.com/gsi/client';
        gsiScript.async = true;
        gsiScript.defer = true;
        gsiScript.onload = initializeGoogleSignIn;
        document.head.appendChild(gsiScript);
      }
      
      // Load Google API Platform Library (for popup method)
      if (!document.querySelector('script[src*="apis.google.com/js/platform.js"]')) {
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/platform.js';
        gapiScript.async = true;
        gapiScript.defer = true;
        document.head.appendChild(gapiScript);
      }
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      loadGoogleAPIs();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      const result = await googleLogin(response.credential);
      
      // Check if profile completion is needed
      if (result.profile_incomplete) {
        toast.error("Please complete your profile");
        navigate("/profile-completion", { 
          state: { 
            user: result.user 
          },
          replace: true 
        });
        return;
      }
      
      toast.success("Welcome to Asasy!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.detail || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    
    try {
      // Try popup method first (more reliable than FedCM)
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          authInstance.signIn().then(async (googleUser) => {
            const idToken = googleUser.getAuthResponse().id_token;
            await handleGoogleResponse({ credential: idToken });
          }).catch((error) => {
            console.error("Google popup login error:", error);
            toast.error("Google Sign-In cancelled or failed");
            setGoogleLoading(false);
          });
          return;
        }
      }
      
      // Fallback to GSI prompt
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              toast.error("Google Sign-In not available. Please use email signup.");
              setGoogleLoading(false);
            }
          });
        } catch (error) {
          console.log("GSI prompt failed:", error);
          toast.error("Google Sign-In not available. Please use email signup.");
          setGoogleLoading(false);
        }
      } else {
        toast.error("Google Sign-In not loaded. Please refresh the page.");
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google Sign-In error. Please try again.");
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      setSignupEmail(data.email);
      setShowOtpForm(true);
      toast.success(
        "Account created! Please verify your email with the OTP sent."
      );
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
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
      toast.error(
        error.response?.data?.detail || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtpForm) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center justify-center gap-x-2 mb-8">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gradient">Asasy</span>
            </div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
              Verify your email
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-600">
              We've sent a verification code to{" "}
              <span className="font-medium text-primary-600">
                {signupEmail}
              </span>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmitOtp(onOtpSubmit)}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-neutral-700"
              >
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  {...registerOtp("otp", {
                    required: "Verification code is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Please enter a valid 6-digit code",
                    },
                  })}
                  type="text"
                  maxLength={6}
                  className={`input text-center text-lg tracking-wider ${
                    otpErrors.otp ? "input-error" : ""
                  }`}
                  placeholder="000000"
                />
              </div>
              {otpErrors.otp && (
                <p className="mt-1 text-sm text-error-600">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowOtpForm(false)}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Back to signup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
    

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center gap-x-2 mb-8 lg:hidden">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gradient">Asasy</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2" />
                    Connecting...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Full name *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    type="text"
                    autoComplete="name"
                    className={`pl-10 input ${
                      errors.name ? "input-error" : ""
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email address *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className={`pl-10 input ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Phone number *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[\d\s\-\(\)]{10,}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    type="tel"
                    autoComplete="tel"
                    className={`pl-10 input ${
                      errors.phone ? "input-error" : ""
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`pl-10 pr-10 input ${
                      errors.password ? "input-error" : ""
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Confirm password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`pl-10 pr-10 input ${
                      errors.confirmPassword ? "input-error" : ""
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  {...register("agreeTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 block text-sm text-neutral-700"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-error-600">
                  {errors.agreeTerms.message}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}