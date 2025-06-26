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
    const response = await api.patch('/users/me', profileData)
    setUser(response.data)
    return response.data
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
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}