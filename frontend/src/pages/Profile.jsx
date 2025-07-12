import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit3,
  Save,
  X,
  Lock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      await api.post("/auth/change-password", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast.success("Password changed successfully!");
      setShowPasswordForm(false);
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Profile Settings
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your account information and preferences.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Personal Information
              </h2>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-ghost text-sm"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="btn-primary text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner mr-1" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        type="text"
                        className={`input ${errors.name ? "input-error" : ""}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                      <User className="h-5 w-5 text-neutral-400 mr-3" />
                      <span className="text-neutral-900">{user.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <Mail className="h-5 w-5 text-neutral-400 mr-3" />
                    <span className="text-neutral-900">{user.email}</span>
                    {user.is_verified && (
                      <Shield
                        className="h-4 w-4 text-success-500 ml-2"
                        title="Verified"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[+]?[\d\s\-\(\)]{10,}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      type="tel"
                      className={`input ${errors.phone ? "input-error" : ""}`}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-900">
                        {user.phone || "Not provided"}
                      </span>
                    </div>
                  )}
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Security
              </h2>
            </div>

            {!showPasswordForm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Password</p>
                  <p className="text-sm text-neutral-600">
                    Change your account password
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-outline btn-sm"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Change Password
                </button>
              </div>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Current Password
                  </label>
                  <input
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                    type="password"
                    className={`input ${
                      passwordErrors.currentPassword ? "input-error" : ""
                    }`}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-error-600">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    New Password
                  </label>
                  <input
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    type="password"
                    className={`input ${
                      passwordErrors.newPassword ? "input-error" : ""
                    }`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-error-600">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    type="password"
                    className={`input ${
                      passwordErrors.confirmPassword ? "input-error" : ""
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      resetPassword();
                    }}
                    className="btn-outline"
                    disabled={passwordLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2" />
                        Updating...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Account Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Reports Generated</span>
                <span className="font-semibold text-neutral-900">
                  {user.reports_generated}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Account Status</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.is_verified
                      ? "bg-success-100 text-success-800"
                      : "bg-warning-100 text-warning-800"
                  }`}
                >
                  {user.is_verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Member Since</span>
                <span className="font-semibold text-neutral-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              {user.last_login && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Last Login</span>
                  <span className="font-semibold text-neutral-900">
                    {new Date(user.last_login).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
