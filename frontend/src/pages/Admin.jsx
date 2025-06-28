import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  Download, 
  Search, 
  BarChart3,
  Calendar,
  Hash,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  CreditCard,
  MessageSquare,
  Filter,
  FileSpreadsheet,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userReports, setUserReports] = useState([])
  const [userSubscriptions, setUserSubscriptions] = useState([])
  const [expandedUsers, setExpandedUsers] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [activeTab, setActiveTab] = useState('users')
  const [contactSubmissions, setContactSubmissions] = useState([])
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({})
  const [contactSearchTerm, setContactSearchTerm] = useState('')
  const [contactDateFilter, setContactDateFilter] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`)
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
        setIsAuthenticated(true)
        toast.success('Admin login successful')
        
        sessionStorage.setItem('adminAuth', basicAuth)
        
        // Fetch additional data
        await Promise.all([
          fetchContactSubmissions(basicAuth),
          fetchTransactions(basicAuth),
          fetchStats(basicAuth)
        ])
      } else {
        toast.error('Invalid admin credentials')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchContactSubmissions = async (auth) => {
    try {
      const response = await fetch('/api/contact/submissions', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const submissions = await response.json()
        setContactSubmissions(submissions)
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
    }
  }

  const fetchTransactions = async (auth) => {
    try {
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const transactionsData = await response.json()
        setTransactions(transactionsData)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const fetchStats = async (auth) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUserReports = async (userId) => {
    try {
      const basicAuth = sessionStorage.getItem('adminAuth')
      const response = await fetch(`/api/admin/users/${userId}/reports`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const reportsData = await response.json()
        setUserReports(reportsData)
      } else {
        toast.error('Failed to fetch user reports')
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to fetch reports')
    }
  }

  const fetchUserSubscriptions = async (userId) => {
    try {
      const basicAuth = sessionStorage.getItem('adminAuth')
      const response = await fetch(`/api/admin/users/${userId}/subscriptions`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const subscriptionsData = await response.json()
        setUserSubscriptions(subscriptionsData)
      } else {
        toast.error('Failed to fetch user subscriptions')
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Failed to fetch subscriptions')
    }
  }

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
      if (selectedUser === userId) {
        setSelectedUser(null)
        setUserReports([])
        setUserSubscriptions([])
      }
    } else {
      newExpanded.add(userId)
      setSelectedUser(userId)
      fetchUserReports(userId)
      fetchUserSubscriptions(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const handleDownloadReport = async (reportId) => {
    try {
      const basicAuth = sessionStorage.getItem('adminAuth')
      const response = await fetch(`/api/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `report-${reportId}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Report downloaded')
      } else {
        toast.error('Failed to download report')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed')
    }
  }

  const exportUsersToExcel = async () => {
    try {
      const exportData = users.map(user => ({
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'Not provided',
        'Plan Name': user.plan_name || 'Free',
        'Subscription Status': user.subscription_status || 'none',
        'Reports Generated': user.reports_generated || 0,
        'Registration Date': new Date(user.created_at || Date.now()).toLocaleDateString(),
        'Last Login': user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
      
      XLSX.writeFile(workbook, `asasy-users-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('User list exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export user list')
    }
  }

  const exportTransactions = async () => {
    try {
      const exportData = transactions.map(transaction => ({
        'Transaction ID': transaction.id,
        'User Name': transaction.user_name,
        'User Email': transaction.user_email,
        'Plan Name': transaction.plan_name,
        'Amount (₹)': transaction.amount_paid ? (transaction.amount_paid / 100).toFixed(2) : '0.00',
        'Status': transaction.status,
        'Razorpay Payment ID': transaction.razorpay_payment_id || '',
        'Razorpay Order ID': transaction.razorpay_order_id || '',
        'Active Until': new Date(transaction.active_until).toLocaleDateString(),
        'Created At': new Date(transaction.created_at).toLocaleDateString()
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
      
      XLSX.writeFile(workbook, `asasy-transactions-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Transactions exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export transactions')
    }
  }

  const exportContactSubmissions = async () => {
    try {
      const basicAuth = sessionStorage.getItem('adminAuth')
      const response = await fetch('/api/contact/export', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Contact submissions exported successfully')
      } else {
        toast.error('Failed to export contact submissions')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export contact submissions')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContactSubmissions = contactSubmissions.filter(submission => {
    const matchesSearch = !contactSearchTerm || 
      submission.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(contactSearchTerm.toLowerCase())
    
    const matchesDate = !contactDateFilter || 
      new Date(submission.submitted_at).toDateString() === new Date(contactDateFilter).toDateString()
    
    return matchesSearch && matchesDate
  }).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))

  const formatTokenUsage = (usage) => {
    if (!usage || usage.total === 0) return 'No usage data'
    return `${usage.total} total (${usage.prompt} prompt + ${usage.completion} completion)`
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
            <p className="text-neutral-600 mt-2">Enter admin credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="input"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="input"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2" />
                  Authenticating...
                </div>
              ) : (
                'Login to Admin Panel'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gradient">Asasy Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                {users.length} total users
              </span>
              <button
                onClick={() => {
                  sessionStorage.removeItem('adminAuth')
                  setIsAuthenticated(false)
                  setUsers([])
                  setSelectedUser(null)
                  setUserReports([])
                  setUserSubscriptions([])
                  setContactSubmissions([])
                  setTransactions([])
                }}
                className="btn-outline btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-600">Total Users</h3>
                <p className="text-2xl font-bold text-neutral-900">{stats.total_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-600">Total Reports</h3>
                <p className="text-2xl font-bold text-neutral-900">{stats.total_reports || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-warning-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-600">Active Subscriptions</h3>
                <p className="text-2xl font-bold text-neutral-900">{stats.active_subscriptions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-600">Total Revenue</h3>
                <p className="text-2xl font-bold text-neutral-900">₹{stats.total_revenue_inr?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Users & Reports
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <CreditCard className="h-5 w-5 inline mr-2" />
                Transactions ({transactions.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <MessageSquare className="h-5 w-5 inline mr-2" />
                Contact Submissions ({contactSubmissions.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'users' && (
          <>
            {/* Search and Export */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <button
                  onClick={exportUsersToExcel}
                  className="btn-primary flex items-center"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="card">
                  {/* User Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleUserExpansion(user.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{user.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {user.phone}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            {user.plan_name} ({user.subscription_status})
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {user.reports_generated} reports
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500">
                        {expandedUsers.has(user.id) ? 'Hide' : 'View'} Details
                      </span>
                      {expandedUsers.has(user.id) ? (
                        <ChevronDown className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* User Details */}
                  {expandedUsers.has(user.id) && selectedUser === user.id && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      {/* Subscriptions */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Subscriptions ({userSubscriptions.length})
                        </h4>
                        {userSubscriptions.length === 0 ? (
                          <p className="text-neutral-600">No subscriptions found</p>
                        ) : (
                          <div className="space-y-3">
                            {userSubscriptions.map((subscription) => (
                              <div key={subscription.id} className="bg-neutral-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-neutral-900">Plan:</span>
                                    <p className="text-neutral-600">{subscription.plan_name}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-neutral-900">Status:</span>
                                    <p className={`text-sm font-medium ${
                                      subscription.status === 'active' ? 'text-success-600' :
                                      subscription.status === 'cancelled' ? 'text-error-600' :
                                      'text-warning-600'
                                    }`}>
                                      {subscription.status}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-neutral-900">Amount:</span>
                                    <p className="text-neutral-600">
                                      ₹{subscription.amount_paid ? (subscription.amount_paid / 100).toFixed(2) : '0.00'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-neutral-900">Active Until:</span>
                                    <p className="text-neutral-600">
                                      {new Date(subscription.active_until).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {subscription.razorpay_payment_id && (
                                  <div className="mt-2 text-xs text-neutral-500">
                                    Payment ID: {subscription.razorpay_payment_id}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reports */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Reports ({userReports.length})
                        </h4>
                        {userReports.length === 0 ? (
                          <p className="text-neutral-600">No reports generated yet</p>
                        ) : (
                          <div className="space-y-4">
                            {userReports.map((report) => (
                              <div key={report.id} className="bg-neutral-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-2">
                                      <div className="flex items-center">
                                        <Hash className="h-4 w-4 text-neutral-400 mr-1" />
                                        <span className="text-sm font-mono text-neutral-600">
                                          {report.id.slice(-8)}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-neutral-400 mr-1" />
                                        <span className="text-sm text-neutral-600">
                                          {new Date(report.created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                                        {report.plan_name}
                                      </span>
                                    </div>
                                    
                                    {/* Token Usage */}
                                    <div className="bg-white rounded p-3 mb-3">
                                      <h5 className="text-sm font-medium text-neutral-900 mb-2">
                                        ChatGPT Token Usage
                                      </h5>
                                      <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <span className="text-neutral-600">Prompt:</span>
                                          <span className="ml-2 font-medium text-neutral-900">
                                            {report.token_usage.prompt.toLocaleString()}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-neutral-600">Completion:</span>
                                          <span className="ml-2 font-medium text-neutral-900">
                                            {report.token_usage.completion.toLocaleString()}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-neutral-600">Total:</span>
                                          <span className="ml-2 font-semibold text-primary-600">
                                            {report.token_usage.total.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4">
                                    {report.file_url ? (
                                      <button
                                        onClick={() => handleDownloadReport(report.id)}
                                        className="btn-outline btn-sm"
                                      >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download PDF
                                      </button>
                                    ) : (
                                      <span className="text-sm text-neutral-500 px-3 py-2 bg-neutral-200 rounded">
                                        {report.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            <div className="mb-8">
              <div className="flex justify-end">
                <button
                  onClick={exportTransactions}
                  className="btn-primary flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export Transactions
                </button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-neutral-900">
                              {transaction.user_name}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {transaction.user_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {transaction.plan_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          ₹{transaction.amount_paid ? (transaction.amount_paid / 100).toFixed(2) : '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'active' ? 'bg-success-100 text-success-800' :
                            transaction.status === 'cancelled' ? 'bg-error-100 text-error-800' :
                            'bg-warning-100 text-warning-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono">
                          {transaction.razorpay_payment_id?.slice(-8) || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            {/* Contact Submissions Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or message..."
                      value={contactSearchTerm}
                      onChange={(e) => setContactSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-neutral-400" />
                  <input
                    type="date"
                    value={contactDateFilter}
                    onChange={(e) => setContactDateFilter(e.target.value)}
                    className="input"
                  />
                  {contactDateFilter && (
                    <button
                      onClick={() => setContactDateFilter('')}
                      className="btn-outline btn-sm"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={exportContactSubmissions}
                    className="btn-primary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Submissions List */}
            <div className="space-y-4">
              {filteredContactSubmissions.map((submission) => (
                <div key={submission.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="p-2 bg-secondary-50 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-secondary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">{submission.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-neutral-600">
                            <span>{submission.email}</span>
                            <span>{submission.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                        <h4 className="font-medium text-neutral-900 mb-2">Message:</h4>
                        <p className="text-neutral-700">{submission.message}</p>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-neutral-500">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {new Date(submission.submitted_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredContactSubmissions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No contact submissions found</h3>
                <p className="text-neutral-600">
                  {contactSearchTerm || contactDateFilter 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'No contact form submissions yet'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}