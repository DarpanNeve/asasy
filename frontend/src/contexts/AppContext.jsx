import { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../services/api'

const AppContext = createContext({})

// App state reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload }
    case 'SET_PLANS':
      return { ...state, plans: action.payload }
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
  subscription: null,
  plans: [],
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
    fetchPlans()
    fetchSubscription()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans')
      dispatch({ type: 'SET_PLANS', payload: response.data })
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    }
  }

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/subscriptions/current')
      dispatch({ type: 'SET_SUBSCRIPTION', payload: response.data })
    } catch (error) {
      // User might not have a subscription
      dispatch({ type: 'SET_SUBSCRIPTION', payload: null })
    }
  }

  const updateSubscription = (subscription) => {
    dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription })
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
    fetchPlans,
    fetchSubscription,
    updateSubscription,
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