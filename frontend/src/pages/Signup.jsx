import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BarChart3,
  Phone,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

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

  // Google Sign-In initialization
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      console.log("Initializing Google Sign-In for Signup...");

      // Check if Google library is loaded
      if (!window.google || !window.google.accounts) {
        console.error("Google library not loaded");
        return;
      }

      // Check if client ID is available
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("Google Client ID not found in environment variables");
        toast.error("Google Client ID not configured");
        return;
      }

      console.log("Client ID found:", clientId.substring(0, 10) + "...");

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });

        setGoogleInitialized(true);
        console.log("Google Sign-In initialized successfully for Signup");
      } catch (error) {
        console.error("Google Sign-In initialization error:", error);
        toast.error("Failed to initialize Google Sign-In");
      }
    };

    const loadGoogleScript = () => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(
          'script[src*="accounts.google.com/gsi/client"]'
        );
        if (existingScript) {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            existingScript.onload = resolve;
            existingScript.onerror = reject;
          }
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
        // Give a small delay for the library to be fully ready
        setTimeout(initializeGoogleSignIn, 200);
      } catch (error) {
        console.error("Failed to load Google Script:", error);
        toast.error("Failed to load Google Sign-In");
      }
    };

    setupGoogleSignIn();

    // Cleanup function
    return () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          console.log("Error canceling Google Sign-In:", error);
        }
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    console.log("Google response received in Signup");
    setGoogleLoading(true);

    try {
      if (!response || !response.credential) {
        throw new Error("No credential received from Google");
      }

      console.log("Calling googleLogin with credential...");
      const result = await googleLogin(response.credential);

      // Check if profile completion is needed
      if (result && result.profile_incomplete) {
        toast.error("Please complete your profile");
        navigate("/profile-completion", {
          state: {
            user: result.user,
            from: location,
          },
          replace: true,
        });
        return;
      }

      toast.success("Welcome to Assesme!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Google login failed";
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google signup button clicked");
    console.log("Google initialized:", googleInitialized);

    if (!googleInitialized) {
      toast.error(
        "Google Sign-In is not ready yet. Please try again in a moment."
      );
      return;
    }

    if (!window.google || !window.google.accounts) {
      toast.error("Google Sign-In not available");
      return;
    }

    setGoogleLoading(true);

    try {
      // Try to show the One Tap prompt first
      window.google.accounts.id.prompt((notification) => {
        console.log("Google prompt notification:", notification);

        if (notification.isNotDisplayed()) {
          console.log(
            "Prompt not displayed:",
            notification.getNotDisplayedReason()
          );
        } else if (notification.isSkippedMoment()) {
          console.log("Prompt skipped:", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log("Prompt dismissed:", notification.getDismissedReason());
        }

        // If prompt doesn't work, user can still click the button
        if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment() ||
          notification.isDismissedMoment()
        ) {
          setGoogleLoading(false);
        }
      });
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google Sign-In error. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Alternative Google button click handler for direct sign-in
  const handleDirectGoogleSignIn = () => {
    if (!googleInitialized || !window.google || !window.google.accounts) {
      toast.error("Google Sign-In not available");
      return;
    }

    setGoogleLoading(true);

    // Create a temporary div for the Google button
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-9999px";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    try {
      window.google.accounts.id.renderButton(tempDiv, {
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "rectangular",
        width: 250,
      });

      // Trigger click on the rendered button
      setTimeout(() => {
        const googleButton = tempDiv.querySelector('div[role="button"]');
        if (googleButton) {
          googleButton.click();
        } else {
          console.log("Google button not found, falling back to prompt");
          window.google.accounts.id.prompt();
        }
        document.body.removeChild(tempDiv);
      }, 100);
    } catch (error) {
      console.error("Direct Google sign-up error:", error);
      document.body.removeChild(tempDiv);
      setGoogleLoading(false);
      toast.error("Google Sign-In error. Please try again.");
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
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-400 to-purple-600">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
          <div>
            <Link
              to="/"
              className="flex items-center justify-center group mb-8"
            >
              <div className="relative flex items-center h-16">
                <img
                  src="/logoas.png"
                  alt="Logo"
                  className="h-18 w-auto object-contain"
                />
              </div>
            </Link>
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
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center text-lg tracking-wider ${
                    otpErrors.otp ? "border-error-600" : ""
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Hero */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-8">
        <div className="text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            Start Your Innovation Journey Today
          </h2>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            Sign up to get AI-powered technology assessment reports and connect
            with industry experts.
          </p>
          <BarChart3 className="w-32 h-32 mx-auto mt-8 opacity-75" />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="flex items-center group">
              <div className="relative flex items-center h-16">
                <img
                  src="/logoas.png"
                  alt="Logo"
                  className="mr-7 mb-4 h-18 w-auto object-contain"
                />
              </div>
            </Link>
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
                onClick={handleDirectGoogleSignIn}
                disabled={googleLoading || !googleInitialized}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {googleLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                    {!googleInitialized
                      ? "Loading Google..."
                      : "Continue with Google"}
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
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.name ? "border-error-600" : ""
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
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.email ? "border-error-600" : ""
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
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.phone ? "border-error-600" : ""
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
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.password ? "border-error-600" : ""
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
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.confirmPassword ? "border-error-600" : ""
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
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-500"
                    target="_blank"
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
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            </form>

            {/* Hidden div for Google button rendering - Alternative approach */}
            <div id="google-signup-button" style={{ display: "none" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
