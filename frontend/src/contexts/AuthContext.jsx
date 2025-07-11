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
      if (error.response?.status === 401) {
        logout()
      }
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
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      })
      
      if (newRefreshToken) {
        Cookies.set('refresh_token', newRefreshToken, { 
          expires: 7,
          secure: window.location.protocol === 'https:',
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
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const { access_token, refresh_token, user: userData } = response.data
    
    Cookies.set('access_token', access_token, { 
      expires: 1,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    })
    Cookies.set('refresh_token', refresh_token, { 
      expires: 7,
      secure: window.location.protocol === 'https:',
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

      if (response.data.profile_incomplete) {
        return {
          profile_incomplete: true,
          user: response.data.user,
          message: response.data.message
        }
      }

      const { access_token, refresh_token, user: userData } = response.data
      
      Cookies.set('access_token', access_token, { 
        expires: 1,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      })
      Cookies.set('refresh_token', refresh_token, { 
        expires: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      })
      
      setAuthToken(access_token)
      setUser(userData)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const completeProfile = async (userId, phone) => {
    try {
      const response = await api.post('/auth/complete-profile', {
        user_id: userId,
        phone: phone
      })

      const { access_token, refresh_token, user: userData } = response.data
      
      Cookies.set('access_token', access_token, { 
        expires: 1,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      })
      Cookies.set('refresh_token', refresh_token, { 
        expires: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      })
      
      setAuthToken(access_token)
      setUser(userData)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      const token = Cookies.get('access_token')
      if (token) {
        await api.post('/auth/logout')
      }
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
      if (error.response?.status === 401) {
        try {
          await refreshToken()
          const response = await api.patch('/users/me', profileData)
          setUser(response.data)
          return response.data
        } catch (refreshError) {
          throw new Error("Phone number is required. Please complete your profile.")
        }
      }
      throw error
    }
  }

  // Function to refresh user data (including subscription status)
  const refreshUserData = async () => {
    try {
      const response = await api.get('/users/me')
      setUser(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to refresh user data:', error)
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
    completeProfile,
    logout,
    updateProfile,
    refreshToken,
    refreshUserData,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}