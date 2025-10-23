import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { formatCurrency } from '../utils/pciCompliance'
import { TrendingUp, DollarSign, Users, Activity, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock analytics data')
        setAnalytics(mockAnalytics)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from API
      const response = await adminAPI.getTransactionAnalytics({ dateRange })
      setAnalytics(response.data || mockAnalytics)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setAnalytics(mockAnalytics)
    } finally {
      setLoading(false)
    }
  }

  const mockAnalytics = {
    summary: {
      totalRevenue: 892450.75,
      totalTransactions: 45678,
      averageTransaction: 19.54,
      activeUsers: 8932
    },
    revenueByDay: [
      { date: '2025-01-01', revenue: 28500 },
      { date: '2025-01-02', revenue: 31200 },
      { date: '2025-01-03', revenue: 29800 },
      { date: '2025-01-04', revenue: 35600 },
      { date: '2025-01-05', revenue: 33100 },
      { date: '2025-01-06', revenue: 27900 },
      { date: '2025-01-07', revenue: 24800 },
    ],
    transactionsByType: [
      { type: 'Bill Payment', count: 15234, amount: 325000 },
      { type: 'Money Transfer', count: 12456, amount: 280000 },
      { type: 'Savings', count: 9876, amount: 195000 },
      { type: 'Card Payment', count: 8112, amount: 92450 },
    ],
    userGrowth: [
      { month: 'Jan', users: 8932 },
      { month: 'Feb', users: 9200 },
      { month: 'Mar', users: 9500 },
      { month: 'Apr', users: 9800 },
      { month: 'May', users: 10100 },
      { month: 'Jun', users: 10400 },
      { month: 'Jul', users: 10700 },
      { month: 'Aug', users: 11000 },
      { month: 'Sep', users: 11300 },
      { month: 'Oct', users: 11600 },
      { month: 'Nov', users: 11900 },
      { month: 'Dec', users: 12200 },
    ]
  }

  const data = analytics || mockAnalytics

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">Detailed insights and trendss</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(data.summary.totalRevenue)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Total Transactions</p>
          <p className="text-3xl font-bold mt-1">{data.summary.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Avg Transaction</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(data.summary.averageTransaction)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Active Users</p>
          <p className="text-3xl font-bold mt-1">{data.summary.activeUsers.toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueByDay}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions by Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions by Type</h3>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.transactionsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#0ea5e9" name="Count" />
              <Bar yAxisId="right" dataKey="amount" fill="#10b981" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Analytics

