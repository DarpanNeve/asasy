import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "https://backend.assesme.com/";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          Cookies.set("access_token", access_token, {
            expires: 1,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });

          // Retry original request with new token
          original.headers.Authorization = `Bearer ${access_token}`;
          return api(original);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        // Only redirect if we're not already on login/signup pages
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/signup") &&
          !window.location.pathname.includes("/")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Don't show error toast for auth errors or network errors
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      const message = error.response?.data?.detail || "An error occurred";
      if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.response?.status >= 400) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

// API methods
export const authAPI = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    return api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  signup: (userData) => api.post("/auth/signup", userData),

  verifyEmail: (email, otp) =>
    api.post("/auth/verify-email-otp", { email, otp }),

  googleAuth: (credential) => api.post("/auth/google", { credential }),

  logout: () => api.post("/auth/logout"),

  refreshToken: (refreshToken) =>
    api.post("/auth/refresh", { refresh_token: refreshToken }),
};

export const userAPI = {
  getProfile: () => api.get("/users/me"),

  updateProfile: (data) => api.patch("/users/me", data),

  getStats: () => api.get("/users/me/stats"),
};

export const tokenAPI = {
  getPackages: () => api.get("/tokens/packages"),

  getBalance: () => api.get("/tokens/balance"),

  createOrder: (packageId) =>
    api.post("/tokens/purchase/create-order", { package_id: packageId }),

  verifyPayment: (paymentData) =>
    api.post("/tokens/purchase/verify-payment", paymentData),

  getTransactions: () => api.get("/tokens/transactions"),
};

export const reportAPI = {
  generateReport: (idea) => api.post("/reports/generate", { idea }),

  getReports: (params = {}) => api.get("/reports", { params }),

  getRecentReports: (limit = 5) => api.get(`/reports/recent?limit=${limit}`),

  getReportById: (reportId) => api.get(`/reports/${reportId}`),

  downloadReport: (reportId) =>
    api.get(`/reports/${reportId}/download`, { responseType: "blob" }),
};

export default api;
