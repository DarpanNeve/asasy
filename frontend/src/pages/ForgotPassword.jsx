import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { handleApiError } from "../utils/errorHandler";

const ForgotPassword = () => {
  const [step, setStep] = useState("request_otp"); // 'request_otp', 'verify_otp', 'reset_password'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (step === "request_otp") {
        const response = await api.post("/auth/forgot-password", { email });
        setMessage(
          response.data.message ||
            "If an account with that email exists, a password reset OTP has been sent."
        );
        setStep("verify_otp");
      } else if (step === "verify_otp") {
        const response = await api.post("/auth/verify-password-reset-otp", {
          email,
          otp,
        });
        setMessage(response.data.message || "OTP verified successfully.");
        setStep("reset_password");
      } else if (step === "reset_password") {
        if (newPassword !== confirmNewPassword) {
          setError("New passwords do not match.");
          return;
        }
        if (newPassword.length < 8) {
          setError("New password must be at least 8 characters long.");
          return;
        }
        // Add more password strength validation if needed (e.g., regex for uppercase, lowercase, digit)

        const response = await api.post("/auth/reset-password", {
          email,
          otp,
          new_password: newPassword,
        });
        setMessage(response.data.message || "Password reset successfully.");
        // Optionally redirect to login page after successful reset
        navigate("/login");
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          {step === "request_otp" && (
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Send OTP
                </button>
              </div>
            </div>
          )}

          {step === "verify_otp" && (
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="otp">
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          {step === "reset_password" && (
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="text-green-500 text-sm mt-4">{message}</p>
          )}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <p className="text-sm mt-4 text-center">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
