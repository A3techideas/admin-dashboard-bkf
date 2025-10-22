import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { formatCurrency } from '../utils/pciCompliance'
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  Ticket,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock dashboard data')
        setStats(mockStats)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from API
      const response = await adminAPI.getDashboardStats()
      setStats(response.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      // In demo mode, fallback to mock data
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        console.log('🎭 Demo mode: Using mock data due to API error')
        setStats(mockStats)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your analytics</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Mock data for demonstration (replace with actual API data)
  const mockStats = {
    totalUsers: 45,
    activeUsers: 32,
    totalTransactions: 45678,
    totalRevenue: 892450.75,
    monthlyGrowth: 12.5,
    openTickets: 23,
    revenueGrowth: 8.3,
    transactionGrowth: 15.2,
    revenueData: [
      { month: 'Jan', revenue: 65000 },
      { month: 'Feb', revenue: 72000 },
      { month: 'Mar', revenue: 68000 },
      { month: 'Apr', revenue: 85000 },
      { month: 'May', revenue: 92000 },
      { month: 'Jun', revenue: 89000 },
      { month: 'Jul', revenue: 95000 },
      { month: 'Aug', revenue: 88000 },
      { month: 'Sep', revenue: 92000 },
      { month: 'Oct', revenue: 98000 },
      { month: 'Nov', revenue: 105000 },
      { month: 'Dec', revenue: 112000 },
    ],
    transactionTypes: [
      { name: 'Bill Payment', value: 35 },
      { name: 'Money Transfer', value: 28 },
      { name: 'Savings', value: 22 },
      { name: 'Card Payment', value: 15 },
    ],
    userActivity: [
      { day: 'Mon', users: 1200 },
      { day: 'Tue', users: 1450 },
      { day: 'Wed', users: 1350 },
      { day: 'Thu', users: 1600 },
      { day: 'Fri', users: 1750 },
      { day: 'Sat', users: 980 },
      { day: 'Sun', users: 850 },
    ]
  }

  const data = stats || mockStats

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

  const StatCard = ({ title, value, icon: Icon, change, changeType, gradient }) => (
    <div className={`relative overflow-hidden rounded-xl shadow-lg p-6 ${gradient} transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:brightness-110 cursor-pointer group`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full bg-white"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-12 translate-y-12 rounded-full bg-white"></div>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">{title}</p>
            <p className="text-3xl font-bold text-white mt-2 group-hover:scale-110 transition-transform duration-300">{value}</p>
            {change && (
              <div className={`flex items-center mt-3 text-sm font-medium ${
                changeType === 'positive' ? 'text-green-200' : 'text-red-200'
              } group-hover:text-white transition-colors duration-300`}>
                {changeType === 'positive' ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{change}% from last month</span>
              </div>
            )}
          </div>
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 ml-4">
            <Icon className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          change={data.monthlyGrowth}
          changeType="positive"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Users"
          value={data.activeUsers.toLocaleString()}
          icon={Activity}
          change={5.2}
          changeType="positive"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Total Transactions"
          value={data.totalTransactions.toLocaleString()}
          icon={CreditCard}
          change={data.transactionGrowth}
          changeType="positive"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          icon={DollarSign}
          change={data.revenueGrowth}
          changeType="positive"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Open Tickets"
          value={data.openTickets}
          icon={Ticket}
          change={null}
          changeType={null}
          gradient="bg-gradient-to-br from-red-500 to-red-600"
        />

        <StatCard
          title="Avg Transaction"
          value={formatCurrency(data.totalRevenue / data.totalTransactions)}
          icon={TrendingUp}
          change={null}
          changeType={null}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />

        <StatCard
          title="Active Rate"
          value={`${((data.activeUsers / data.totalUsers) * 100).toFixed(1)}%`}
          icon={Activity}
          change={null}
          changeType={null}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fallback content if charts fail */}
        {!data.revenueData && !data.transactionTypes && (
          <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Charts Loading</h3>
            <p className="text-yellow-700">Chart data is being prepared. Please wait...</p>
          </div>
        )}
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            {data.revenueData && data.revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No revenue data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Types</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            {data.transactionTypes && data.transactionTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.transactionTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.transactionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No transaction data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            {data.userActivity && data.userActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#0ea5e9" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No user activity data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PCI DSS Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All financial data displayed is aggregated and anonymized in compliance with PCI DSS standards. 
          No sensitive cardholder data is stored or displayed in this dashboard.
        </p>
      </div>
    </div>
  )
}

export default Dashboard

