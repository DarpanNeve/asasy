import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, FileText, CreditCard, TrendingUp, Users, Clock, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    reportsGenerated: 0,
    totalReports: 0,
    activeSubscription: null,
    lastReportDate: null,
  })
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse] = await Promise.all([
        api.get('/users/me/stats'),
        api.get('/reports/recent?limit=5'),
      ])
      
      setStats(statsResponse.data)
      setRecentReports(reportsResponse.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Reports Generated',
      value: stats.reportsGenerated,
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      name: 'Free Reports Left',
      value: Math.max(0, 1 - stats.reportsGenerated),
      icon: TrendingUp,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      name: 'Active Plan',
      value: stats.activeSubscription?.plan || 'Free',
      icon: CreditCard,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      name: 'Account Status',
      value: user?.is_verified ? 'Verified' : 'Pending',
      icon: Users,
      color: user?.is_verified ? 'text-success-600' : 'text-warning-600',
      bgColor: user?.is_verified ? 'bg-success-50' : 'bg-warning-50',
    },
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="mt-2 text-neutral-600">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div key={stat.name} className="card-hover">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Generate Report */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Generate New Report</h3>
            <FileText className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-neutral-600 mb-6">
            Create a comprehensive technology assessment report with AI-powered insights.
          </p>
          <Link
            to="/reports"
            className="btn-primary w-full flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate Report
          </Link>
        </div>

        {/* Subscription Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Subscription</h3>
            <CreditCard className="h-6 w-6 text-secondary-600" />
          </div>
          {stats.activeSubscription ? (
            <div>
              <p className="text-neutral-600 mb-2">
                Current Plan: <span className="font-medium">{stats.activeSubscription.plan}</span>
              </p>
              <p className="text-neutral-600 mb-6">
                Expires: {new Date(stats.activeSubscription.activeUntil).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-neutral-600 mb-6">
              You're on the free plan. Upgrade to generate unlimited reports.
            </p>
          )}
          <Link
            to="/subscription"
            className="btn-secondary w-full"
          >
            {stats.activeSubscription ? 'Manage Subscription' : 'View Plans'}
          </Link>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Reports</h3>
          <Link
            to="/reports"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        {recentReports.length > 0 ? (
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report._id}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{report.reportType}</h4>
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.status === 'completed' 
                      ? 'bg-success-100 text-success-800'
                      : report.status === 'processing'
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-error-100 text-error-800'
                  }`}>
                    {report.status}
                  </span>
                  {report.status === 'completed' && (
                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline btn-sm"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-900 mb-2">No reports yet</h4>
            <p className="text-neutral-600 mb-6">
              Generate your first technology assessment report to get started.
            </p>
            <Link to="/reports" className="btn-primary">
              Generate Your First Report
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}