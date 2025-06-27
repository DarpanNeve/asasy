import toast from 'react-hot-toast'

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error)
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || defaultMessage
    toast.error(message)
    return message
  } else if (error.request) {
    // Request was made but no response received
    const message = 'Network error. Please check your connection.'
    toast.error(message)
    return message
  } else {
    // Something else happened
    toast.error(defaultMessage)
    return defaultMessage
  }
}

export const withErrorHandling = (asyncFn, defaultMessage) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      handleApiError(error, defaultMessage)
      throw error
    }
  }
}