import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = Cookies.get('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token } = response.data
          Cookies.set('access_token', access_token, { 
            expires: 1,
            secure: true,
            sameSite: 'strict'
          })

          // Retry original request with new token
          original.headers.Authorization = `Bearer ${access_token}`
          return api(original)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Show error toast for non-401 errors
    if (error.response?.status !== 401) {
      const message = error.response?.data?.detail || 'An error occurred'
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization']
}

// API methods
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { username: email, password }),
  
  signup: (userData) =>
    api.post('/auth/signup', userData),
  
  verifyEmail: (email, otp) =>
    api.post('/auth/verify-email-otp', { email, otp }),
  
  googleAuth: (credential) =>
    api.post('/auth/google', { credential }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
}

export const userAPI = {
  getProfile: () =>
    api.get('/users/me'),
  
  updateProfile: (data) =>
    api.patch('/users/me', data),
  
  getStats: () =>
    api.get('/users/me/stats'),
}

export const subscriptionAPI = {
  getPlans: () =>
    api.get('/plans'),
  
  createOrder: (planId) =>
    api.post('/subscriptions/create-order', { plan_id: planId }),
  
  verifyPayment: (paymentData) =>
    api.post('/subscriptions/verify-payment', paymentData),
  
  getCurrentSubscription: () =>
    api.get('/subscriptions/current'),
  
  cancelSubscription: () =>
    api.delete('/subscriptions/cancel'),
}

export const reportAPI = {
  generateReport: (idea) =>
    api.post('/reports/generate', { idea }),
  
  getReports: (params = {}) =>
    api.get('/reports', { params }),
  
  getRecentReports: (limit = 5) =>
    api.get(`/reports/recent?limit=${limit}`),
  
  getReportById: (reportId) =>
    api.get(`/reports/${reportId}`),
  
  downloadReport: (reportId) =>
    api.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
}

export default api