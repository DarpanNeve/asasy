import { createContext, useContext, useState, useEffect } from 'react'
import { api, setAuthToken, removeAuthToken } from '../services/api'
import Cookies from 'js-cookie'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('access_token')
    if (token) {
      setAuthToken(token)
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = Cookies.get('refresh_token')
      if (!refreshTokenValue) throw new Error('No refresh token')
      
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshTokenValue
      })
      
      const { access_token, refresh_token: newRefreshToken } = response.data
      
      Cookies.set('access_token', access_token, { 
        expires: 1,
        secure: true,
        sameSite: 'strict'
      })
      
      if (newRefreshToken) {
        Cookies.set('refresh_token', newRefreshToken, { 
          expires: 7,
          secure: true,
          sameSite: 'strict'
        })
      }
      
      setAuthToken(access_token)
      return access_token
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      throw error
    }
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      username: email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const { access_token, refresh_token, user: userData } = response.data
    
    // Store tokens in httpOnly cookies for security
    Cookies.set('access_token', access_token, { 
      expires: 1, // 1 day
      secure: true,
      sameSite: 'strict'
    })
    Cookies.set('refresh_token', refresh_token, { 
      expires: 7, // 7 days
      secure: true,
      sameSite: 'strict'
    })
    
    setAuthToken(access_token)
    setUser(userData)
    
    return response.data
  }

  const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  }

  const verifyEmail = async (email, otp) => {
    const response = await api.post('/auth/verify-email-otp', {
      email,
      otp,
    })
    return response.data
  }

  const googleLogin = async (credential) => {
    try {
      const response = await api.post('/auth/google', {
        credential,
      })

      const { access_token, refresh_token, user: userData } = response.data
      
      Cookies.set('access_token', access_token, { 
        expires: 1,
        secure: true,
        sameSite: 'strict'
      })
      Cookies.set('refresh_token', refresh_token, { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      })
      
      setAuthToken(access_token)
      setUser(userData)
      
      return response.data
    } catch (error) {
      // Handle profile completion requirement
      if (error.response?.status === 400 && 
          error.response?.data?.detail?.includes("Phone number is required")) {
        throw error // Let the calling component handle the redirect
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      removeAuthToken()
      setUser(null)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.patch('/users/me', profileData)
      setUser(response.data)
      return response.data
    } catch (error) {
      // Handle 401 Unauthorized - try to refresh token
      if (error.response?.status === 401) {
        try {
          await refreshToken()
          // Retry the update after token refresh
          const response = await api.patch('/users/me', profileData)
          setUser(response.data)
          return response.data
        } catch (refreshError) {
          // If refresh fails, redirect to profile completion
          throw new Error("Phone number is required. Please complete your profile.")
        }
      }
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    verifyEmail,
    googleLogin,
    logout,
    updateProfile,
    refreshToken,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}