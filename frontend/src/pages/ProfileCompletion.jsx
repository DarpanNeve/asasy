import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Phone, BarChart3, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function ProfileCompletion() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from navigation state
  const userData = location.state?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.name || "",
      phone: userData?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    if (!userData?.id) {
      toast.error("User information missing. Please try logging in again.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      await completeProfile(userData.id, data.phone);
      toast.success("Profile completed successfully!");
      
      // Redirect to intended destination or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // If no user data, redirect to login
  if (!userData) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-x-2 mb-8">
            <BarChart3 className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gradient">Asasy</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Please provide your phone number to continue
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  disabled
                  className="pl-10 input bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  value={userData.name}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Name cannot be changed after Google sign-in
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-neutral-700"
              >
                Phone Number *
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
              <p className="mt-1 text-xs text-neutral-500">
                Required for account verification and support
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Completing Profile...
                  </div>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              By completing your profile, you agree to our{" "}
              <a href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}