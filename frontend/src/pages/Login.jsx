import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, BarChart3, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Initialize Google Sign-In with popup method (no FedCM)
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Disable FedCM
          });

          // Also initialize OAuth2 for popup method
          window.gapi?.load("auth2", () => {
            window.gapi.auth2.init({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            });
          });

          console.log("Google Sign-In initialized successfully");
        } catch (error) {
          console.error("Google Sign-In initialization error:", error);
        }
      }
    };

    // Load Google APIs
    const loadGoogleAPIs = () => {
      // Load Google Identity Services
      if (
        !document.querySelector('script[src*="accounts.google.com/gsi/client"]')
      ) {
        const gsiScript = document.createElement("script");
        gsiScript.src = "https://accounts.google.com/gsi/client";
        gsiScript.async = true;
        gsiScript.defer = true;
        gsiScript.onload = initializeGoogleSignIn;
        document.head.appendChild(gsiScript);
      }

      // Load Google API Platform Library (for popup method)
      if (
        !document.querySelector('script[src*="apis.google.com/js/platform.js"]')
      ) {
        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/platform.js";
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
            user: result.user,
            from: location,
          },
          replace: true,
        });
        return;
      }

      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.detail || "Google login failed");
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
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);

    try {
      // Try the new Google Identity Services first
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {
              // Fallback to popup method
              handleGooglePopupLogin();
            }
          });
          return;
        } catch (error) {
          console.log("GSI prompt failed, trying popup method:", error);
        }
      }

      // Fallback to popup method
      handleGooglePopupLogin();
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google Sign-In error. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleGooglePopupLogin = () => {
    // Use OAuth2 popup method as fallback
    if (window.gapi && window.gapi.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        authInstance
          .signIn()
          .then(async (googleUser) => {
            const idToken = googleUser.getAuthResponse().id_token;
            await handleGoogleResponse({ credential: idToken });
          })
          .catch((error) => {
            console.error("Google popup login error:", error);
            toast.error("Google Sign-In cancelled or failed");
            setGoogleLoading(false);
          });
      } else {
        // Direct OAuth2 URL method as last resort
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const scope = "openid email profile";
        const responseType = "code";

        const authUrl =
          `https://accounts.google.com/oauth/authorize?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `response_type=${responseType}&` +
          `access_type=offline&` +
          `prompt=select_account`;

        window.location.href = authUrl;
      }
    } else {
      toast.error("Google Sign-In not available. Please try email login.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Form */}
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

            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#000" }}
            >
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email address
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
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.password ? "border-error-600" : ""
                    }`}
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-neutral-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
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
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Hero with background */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-8">
        <div className="text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            Unlock Your Technology's Potential
          </h2>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            Get AI-powered insights and connect with experts to accelerate your innovation journey.
          </p>
          <BarChart3 className="w-32 h-32 mx-auto mt-8 opacity-75" />
        </div>
      </div>
    </div>
  );
}
