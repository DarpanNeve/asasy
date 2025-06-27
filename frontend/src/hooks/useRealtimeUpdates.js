import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { api } from '../services/api'

export const useRealtimeUpdates = () => {
  const { user } = useAuth()
  const { updateReport, updateSubscription } = useApp()
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!user) return

    // Poll for updates every 30 seconds
    const pollForUpdates = async () => {
      try {
        // Check for report updates
        const reportsResponse = await api.get('/reports/recent?limit=5')
        const reports = reportsResponse.data
        
        reports.forEach(report => {
          updateReport(report)
        })

        // Check for subscription updates
        const subscriptionResponse = await api.get('/subscriptions/current')
        updateSubscription(subscriptionResponse.data)
      } catch (error) {
        console.error('Failed to poll for updates:', error)
      }
    }

    // Start polling
    intervalRef.current = setInterval(pollForUpdates, 30000)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [user, updateReport, updateSubscription])

  return null
}