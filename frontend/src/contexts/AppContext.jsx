import { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../services/api'

const AppContext = createContext({})

// App state reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_TOKEN_BALANCE':
      return { ...state, tokenBalance: action.payload }
    case 'SET_TOKEN_PACKAGES':
      return { ...state, tokenPackages: action.payload }
    case 'SET_REPORTS':
      return { ...state, reports: action.payload }
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] }
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id ? action.payload : report
        )
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState = {
  loading: false,
  tokenBalance: null,
  tokenPackages: [],
  reports: [],
  error: null
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Fetch initial data
  useEffect(() => {
    fetchTokenPackages()
    fetchTokenBalance()
  }, [])

  const fetchTokenPackages = async () => {
    try {
      const response = await api.get('/tokens/packages')
      dispatch({ type: 'SET_TOKEN_PACKAGES', payload: response.data })
    } catch (error) {
      console.error('Failed to fetch token packages:', error)
    }
  }

  const fetchTokenBalance = async () => {
    try {
      const response = await api.get('/tokens/balance')
      dispatch({ type: 'SET_TOKEN_BALANCE', payload: response.data })
    } catch (error) {
      // User might not have tokens yet
      dispatch({ type: 'SET_TOKEN_BALANCE', payload: null })
    }
  }

  const updateTokenBalance = (balance) => {
    dispatch({ type: 'SET_TOKEN_BALANCE', payload: balance })
  }

  const addReport = (report) => {
    dispatch({ type: 'ADD_REPORT', payload: report })
  }

  const updateReport = (report) => {
    dispatch({ type: 'UPDATE_REPORT', payload: report })
  }

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    fetchTokenPackages,
    fetchTokenBalance,
    updateTokenBalance,
    addReport,
    updateReport,
    setError,
    clearError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}