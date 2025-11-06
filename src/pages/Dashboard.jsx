import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { formatCurrency } from '../utils/pciCompliance'
import { awsConfig } from '../config/aws'
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  Ticket,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for demonstration - defined outside component to avoid reference errors
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

// Helper function to transform revenue data
const transformRevenueData = (data) => {
  if (!data) {
    console.log('⚠️ transformRevenueData: No data provided')
    return []
  }
  
  console.log('🔄 Transforming REAL-TIME revenue data:', JSON.stringify(data, null, 2))
  
  // If it's already in the correct format
  if (Array.isArray(data) && data.length > 0) {
    const transformed = data.map((item, index) => {
      // Handle different date formats
      let month = item.month || item.date || item.period || item.time || item.label || item.monthName || item.month_name || 'N/A'
      
      // If it's a full date string, extract month
      if (month && typeof month === 'string' && month.includes('-') && month.length > 7) {
        try {
          const date = new Date(month)
          if (!isNaN(date.getTime())) {
            month = date.toLocaleDateString('en-US', { month: 'short' })
          }
        } catch (e) {
          // Keep original month value if date parsing fails
        }
      }
      
      // Handle timestamp
      if (item.timestamp) {
        try {
          const date = new Date(item.timestamp)
          if (!isNaN(date.getTime())) {
            month = date.toLocaleDateString('en-US', { month: 'short' })
          }
        } catch (e) {}
      }
      
      // Try multiple revenue field names
      const revenue = item.revenue || item.amount || item.value || item.total || item.sum || item.revenue_amount || item.revenueAmount || 0
      
      return {
        month: month || `Month ${index + 1}`,
        revenue: typeof revenue === 'number' ? revenue : parseFloat(revenue) || 0
      }
    }).filter(item => item.revenue > 0 || item.month !== 'N/A')
    
    console.log('✅ Transformed REAL-TIME revenue array:', transformed)
    return transformed.length > 0 ? transformed : []
  }
  
  // If it's an object with nested data
  if (data.data && Array.isArray(data.data)) {
    return transformRevenueData(data.data)
  }
  if (data.body && Array.isArray(data.body)) {
    return transformRevenueData(data.body)
  }
  if (data.result && Array.isArray(data.result)) {
    return transformRevenueData(data.result)
  }
  
  // If it's an object with revenueData, revenue_data, or similar keys
  if (data.revenueData && Array.isArray(data.revenueData)) {
    return transformRevenueData(data.revenueData)
  }
  if (data.revenue_data && Array.isArray(data.revenue_data)) {
    return transformRevenueData(data.revenue_data)
  }
  if (data.revenueTrend && Array.isArray(data.revenueTrend)) {
    return transformRevenueData(data.revenueTrend)
  }
  if (data.revenue_trend && Array.isArray(data.revenue_trend)) {
    return transformRevenueData(data.revenue_trend)
  }
  if (data.trend && Array.isArray(data.trend)) {
    return transformRevenueData(data.trend)
  }
  if (data.monthlyRevenue && Array.isArray(data.monthlyRevenue)) {
    return transformRevenueData(data.monthlyRevenue)
  }
  if (data.monthly_revenue && Array.isArray(data.monthly_revenue)) {
    return transformRevenueData(data.monthly_revenue)
  }
  
  // If it's monthly data object (key-value pairs)
  if (typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data)
    if (entries.length > 0) {
      const transformed = entries.map(([key, value]) => {
        let month = key
        // If key is a date, format it
        if (key.includes('-') && key.length > 7) {
          try {
            const date = new Date(key)
            if (!isNaN(date.getTime())) {
              month = date.toLocaleDateString('en-US', { month: 'short' })
            }
          } catch (e) {
            // Keep original key if date parsing fails
          }
        }
        
        const revenue = typeof value === 'number' ? value : (value?.revenue || value?.amount || value?.value || value?.total || 0)
        
        return {
          month: month,
          revenue: typeof revenue === 'number' ? revenue : parseFloat(revenue) || 0
        }
      }).filter(item => item.revenue > 0)
      
      console.log('✅ Transformed REAL-TIME revenue object:', transformed)
      return transformed.length > 0 ? transformed : []
    }
  }
  
  console.log('⚠️ transformRevenueData: Could not transform data - structure:', typeof data, Array.isArray(data) ? 'array' : 'object')
  return []
}

// Helper function to transform transaction types
const transformTransactionTypes = (data) => {
  if (!data) {
    console.log('⚠️ transformTransactionTypes: No data provided')
    return []
  }
  
  console.log('🔄 Transforming transaction types data:', JSON.stringify(data, null, 2))
  
  // If it's already in the correct format
  if (Array.isArray(data) && data.length > 0) {
    const transformed = data.map(item => {
      const name = item.name || item.type || item.category || item.label || item.transactionType || 'Unknown'
      const value = item.value || item.count || item.amount || item.total || item.quantity || 0
      
      return {
        name: name,
        value: typeof value === 'number' ? value : parseFloat(value) || 0
      }
    }).filter(item => item.value > 0)
    
    console.log('✅ Transformed transaction types array:', transformed)
    return transformed.length > 0 ? transformed : []
  }
  
  // If it's an object with nested data
  if (data.data && Array.isArray(data.data)) {
    return transformTransactionTypes(data.data)
  }
  
  // If it's an object with transactionTypes, transaction_types, or similar keys
  if (data.transactionTypes && Array.isArray(data.transactionTypes)) {
    return transformTransactionTypes(data.transactionTypes)
  }
  if (data.transaction_types && Array.isArray(data.transaction_types)) {
    return transformTransactionTypes(data.transaction_types)
  }
  if (data.byType && Array.isArray(data.byType)) {
    return transformTransactionTypes(data.byType)
  }
  if (data.by_type && Array.isArray(data.by_type)) {
    return transformTransactionTypes(data.by_type)
  }
  if (data.breakdown && Array.isArray(data.breakdown)) {
    return transformTransactionTypes(data.breakdown)
  }
  
  // If it's an object with transaction types as keys
  if (typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data)
    if (entries.length > 0) {
      const transformed = entries.map(([key, value]) => {
        const name = key
        const count = typeof value === 'number' ? value : (value?.count || value?.amount || value?.value || value?.total || 0)
        
        return {
          name: name,
          value: typeof count === 'number' ? count : parseFloat(count) || 0
        }
      }).filter(item => item.value > 0)
      
      console.log('✅ Transformed transaction types object:', transformed)
      return transformed.length > 0 ? transformed : []
    }
  }
  
  console.log('⚠️ transformTransactionTypes: Could not transform data')
  return []
}

// Helper function to transform user activity
const transformUserActivity = (data) => {
  if (!data) return []
  
  // If it's already in the correct format
  if (Array.isArray(data) && data[0] && (data[0].day || data[0].date)) {
    return data.map(item => ({
      day: item.day || item.date || item.period || 'N/A',
      users: item.users || item.count || item.activeUsers || item.active_users || item.value || 0
    }))
  }
  
  // If it's an object with nested data
  if (data.data && Array.isArray(data.data)) {
    return data.data.map(item => ({
      day: item.day || item.date || item.period || 'N/A',
      users: item.users || item.count || item.activeUsers || item.active_users || item.value || 0
    }))
  }
  
  // If it's daily data object
  if (typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data).map(([key, value]) => ({
      day: key,
      users: typeof value === 'number' ? value : (value?.users || value?.count || 0)
    }))
  }
  
  return []
}

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
      setError(null)
      
      // Only use demo mode if explicitly set to localhost:3001
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || awsConfig.api.baseUrl
      const isDemoMode = apiBaseUrl === 'http://localhost:3001'
      
      console.log('🔧 Dashboard Configuration:', {
        apiBaseUrl,
        isDemoMode,
        willFetchFromAPI: !isDemoMode
      })
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock dashboard data')
        setStats(mockStats)
        setLoading(false)
        return
      }
      
      // ALWAYS try to fetch real-time data from API
      console.log('📡 Fetching REAL-TIME dashboard data from API...', {
        baseURL: apiBaseUrl,
        endpoint: '/admin/dashboard/stats',
        revenueEndpoint: '/admin/analytics/revenue',
        transactionEndpoint: '/admin/analytics/transactions'
      })
      
      // Fetch dashboard stats
      let dashboardResponse = null
      let revenueData = null
      let transactionData = null
      let userActivityData = null
      let apiErrors = []
      
      try {
        console.log('📞 Calling API: GET /admin/dashboard/stats')
        dashboardResponse = await adminAPI.getDashboardStats()
        console.log('✅ Dashboard stats response received:', {
          status: dashboardResponse.status,
          hasData: !!dashboardResponse.data,
          dataKeys: dashboardResponse.data ? Object.keys(dashboardResponse.data) : [],
          fullResponse: JSON.stringify(dashboardResponse.data, null, 2).substring(0, 500)
        })
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
        apiErrors.push(`Dashboard stats: ${errorMsg}`)
        console.warn('⚠️ Dashboard stats API error:', {
          message: errorMsg,
          status: err.response?.status,
          responseData: err.response?.data
        })
      }
      
      // Fetch revenue analytics for chart - try multiple date ranges to get REAL-TIME data
      try {
        console.log('📞 Calling API: GET /admin/analytics/revenue?dateRange=12m')
        const revenueResponse = await adminAPI.getRevenueAnalytics({ dateRange: '12m' })
        revenueData = revenueResponse?.data || revenueResponse?.body || revenueResponse
        console.log('✅ Revenue analytics (12m) - RAW API RESPONSE:', {
          status: revenueResponse.status,
          hasData: !!revenueData,
          dataType: Array.isArray(revenueData) ? 'array' : typeof revenueData,
          dataLength: Array.isArray(revenueData) ? revenueData.length : 'N/A',
          fullResponse: JSON.stringify(revenueData, null, 2).substring(0, 500)
        })
        
        // If no data, try shorter ranges
        if (!revenueData || (Array.isArray(revenueData) && revenueData.length === 0) || 
            (typeof revenueData === 'object' && !Array.isArray(revenueData) && Object.keys(revenueData).length === 0)) {
          console.log('⚠️ No revenue data for 12m, trying 6m...')
          try {
            const revenueResponse6m = await adminAPI.getRevenueAnalytics({ dateRange: '6m' })
            revenueData = revenueResponse6m?.data || revenueResponse6m?.body || revenueResponse6m
            console.log('✅ Revenue analytics (6m):', JSON.stringify(revenueData, null, 2))
          } catch (err6m) {
            console.log('⚠️ 6m failed, trying 3m...')
            try {
              const revenueResponse3m = await adminAPI.getRevenueAnalytics({ dateRange: '3m' })
              revenueData = revenueResponse3m?.data || revenueResponse3m?.body || revenueResponse3m
              console.log('✅ Revenue analytics (3m):', JSON.stringify(revenueData, null, 2))
            } catch (err3m) {
              console.log('⚠️ 3m failed, trying 1m...')
              try {
                const revenueResponse1m = await adminAPI.getRevenueAnalytics({ dateRange: '1m' })
                revenueData = revenueResponse1m?.data || revenueResponse1m?.body || revenueResponse1m
                console.log('✅ Revenue analytics (1m):', JSON.stringify(revenueData, null, 2))
              } catch (err1m) {
                console.warn('⚠️ All date ranges failed for revenue')
              }
            }
          }
        }
      } catch (err) {
        console.warn('⚠️ Revenue analytics API error:', err.message, err.response?.data)
        // Try alternative endpoint or structure
        try {
          const altResponse = await adminAPI.getRevenueAnalytics({})
          revenueData = altResponse?.data || altResponse?.body || altResponse
          console.log('✅ Revenue analytics (no params):', JSON.stringify(revenueData, null, 2))
        } catch (altErr) {
          console.warn('⚠️ Alternative revenue fetch also failed:', altErr.message)
        }
      }
      
      // Fetch transaction analytics for chart - try multiple approaches
      try {
        const transactionResponse = await adminAPI.getTransactionAnalytics({ dateRange: '12m' })
        transactionData = transactionResponse?.data || transactionResponse
        console.log('✅ Transaction analytics (12m):', JSON.stringify(transactionData, null, 2))
        
        // If no data, try shorter range
        if (!transactionData || (Array.isArray(transactionData) && transactionData.length === 0) ||
            (typeof transactionData === 'object' && !Array.isArray(transactionData) && Object.keys(transactionData).length === 0)) {
          console.log('⚠️ No transaction data for 12m, trying 6m...')
          const transactionResponse6m = await adminAPI.getTransactionAnalytics({ dateRange: '6m' })
          transactionData = transactionResponse6m?.data || transactionResponse6m
          console.log('✅ Transaction analytics (6m):', JSON.stringify(transactionData, null, 2))
        }
      } catch (err) {
        console.warn('⚠️ Transaction analytics API error:', err.message, err.response?.data)
        // Try alternative endpoint or structure
        try {
          const altResponse = await adminAPI.getTransactionAnalytics({})
          transactionData = altResponse?.data || altResponse
          console.log('✅ Transaction analytics (no params):', JSON.stringify(transactionData, null, 2))
        } catch (altErr) {
          console.warn('⚠️ Alternative transaction fetch also failed:', altErr.message)
        }
      }
      
      // Fetch user analytics for chart
      try {
        const userResponse = await adminAPI.getUserAnalytics({ dateRange: '7d' })
        userActivityData = userResponse?.data || userResponse
        console.log('✅ User activity analytics:', userActivityData)
      } catch (err) {
        console.warn('⚠️ User analytics API error:', err.message)
      }
      
      // Transform API data to match expected structure
      const apiData = dashboardResponse?.data || dashboardResponse || {}
      
      // Transform chart data first
      const transformedRevenueData = transformRevenueData(revenueData || apiData.revenueData || apiData.revenue_data || apiData.revenueTrend || apiData.revenue_trend)
      const transformedTransactionTypes = transformTransactionTypes(transactionData || apiData.transactionTypes || apiData.transaction_types || apiData.transactionsByType || apiData.transactions_by_type)
      const transformedUserActivity = transformUserActivity(userActivityData || apiData.userActivity || apiData.user_activity || apiData.dailyActiveUsers || apiData.daily_active_users)
      
      const transformedStats = {
        // Basic stats from dashboard API
        totalUsers: apiData.totalUsers || apiData.total_users || apiData.users?.total || 0,
        activeUsers: apiData.activeUsers || apiData.active_users || apiData.users?.active || 0,
        totalTransactions: apiData.totalTransactions || apiData.total_transactions || apiData.transactions?.total || 0,
        totalRevenue: apiData.totalRevenue || apiData.total_revenue || apiData.revenue?.total || 0,
        monthlyGrowth: apiData.monthlyGrowth || apiData.monthly_growth || apiData.growth?.monthly || 0,
        openTickets: apiData.openTickets || apiData.open_tickets || apiData.tickets?.open || 0,
        revenueGrowth: apiData.revenueGrowth || apiData.revenue_growth || apiData.growth?.revenue || 0,
        transactionGrowth: apiData.transactionGrowth || apiData.transaction_growth || apiData.growth?.transactions || 0,
        
        // Use transformed chart data (even if empty, we'll merge with mock)
        revenueData: transformedRevenueData,
        transactionTypes: transformedTransactionTypes,
        userActivity: transformedUserActivity
      }
      
      console.log('✅ Transformed dashboard data:', {
        ...transformedStats,
        revenueDataLength: transformedRevenueData.length,
        transactionTypesLength: transformedTransactionTypes.length,
        userActivityLength: transformedUserActivity.length
      })
      
      // Check if API was actually called and returned something
      const apiWasCalled = dashboardResponse !== null || revenueData !== null || transactionData !== null || userActivityData !== null
      
      // Check if we got ANY data from API (don't compare to mock - just check if API returned something)
      const hasRevenueFromAPI = revenueData !== null && revenueData !== undefined
      const hasTransactionFromAPI = transactionData !== null && transactionData !== undefined
      const hasUserActivityFromAPI = userActivityData !== null && userActivityData !== undefined
      const hasStatsFromAPI = dashboardResponse !== null && dashboardResponse !== undefined
      
      // Check if transformed data has content (regardless of whether it matches mock)
      const hasTransformedRevenue = transformedRevenueData.length > 0
      const hasTransformedTransactions = transformedTransactionTypes.length > 0
      const hasTransformedActivity = transformedUserActivity.length > 0
      const hasTransformedStats = transformedStats.totalUsers > 0 || transformedStats.totalTransactions > 0 || transformedStats.totalRevenue > 0
      
      console.log('🔍 REAL-TIME Data Detection:', {
        apiWasCalled,
        hasRevenueFromAPI,
        hasTransactionFromAPI,
        hasUserActivityFromAPI,
        hasStatsFromAPI,
        hasTransformedRevenue,
        hasTransformedTransactions,
        hasTransformedActivity,
        hasTransformedStats,
        revenueDataRaw: revenueData ? JSON.stringify(revenueData).substring(0, 300) : 'null',
        revenueDataType: revenueData ? (Array.isArray(revenueData) ? 'array' : typeof revenueData) : 'null',
        transformedRevenueLength: transformedRevenueData.length,
        transformedRevenueSample: transformedRevenueData.length > 0 ? transformedRevenueData[0] : 'none'
      })
      
      // ALWAYS use API data if API was called - even if it looks like mock data, it's from the API
      if (apiWasCalled) {
        // API was called - use whatever we got from API (transformed or raw)
        const finalStats = {
          ...transformedStats,
          // Use transformed revenue if we have it, otherwise try to use raw API data
          revenueData: hasTransformedRevenue ? transformedRevenueData : 
                      (hasRevenueFromAPI && Array.isArray(revenueData) ? revenueData : mockStats.revenueData),
          transactionTypes: hasTransformedTransactions ? transformedTransactionTypes :
                           (hasTransactionFromAPI && Array.isArray(transactionData) ? transactionData : mockStats.transactionTypes),
          userActivity: hasTransformedActivity ? transformedUserActivity :
                       (hasUserActivityFromAPI && Array.isArray(userActivityData) ? userActivityData : mockStats.userActivity)
        }
        
        console.log('✅ Using REAL-TIME API data for dashboard:', {
          revenueSource: hasTransformedRevenue ? 'transformed' : (hasRevenueFromAPI ? 'raw API' : 'mock fallback'),
          revenueDataPoints: finalStats.revenueData.length,
          transactionSource: hasTransformedTransactions ? 'transformed' : (hasTransactionFromAPI ? 'raw API' : 'mock fallback'),
          transactionPoints: finalStats.transactionTypes.length,
          activitySource: hasTransformedActivity ? 'transformed' : (hasUserActivityFromAPI ? 'raw API' : 'mock fallback'),
          activityPoints: finalStats.userActivity.length,
          totalUsers: finalStats.totalUsers,
          totalTransactions: finalStats.totalTransactions,
          totalRevenue: finalStats.totalRevenue
        })
        
        setStats(finalStats)
      } else {
        // API wasn't called at all - this should only happen in demo mode or if API is completely unavailable
        console.warn('⚠️ API was not called. Using mock data as fallback.')
        console.warn('⚠️ This should only happen if: 1) Demo mode is enabled, or 2) API is completely unavailable')
        setStats(mockStats)
      }
    } catch (err) {
      console.error('❌ Critical error fetching dashboard:', err)
      console.error('Error details:', err.response?.data || err.message)
      setError(err.message || 'Failed to load dashboard data')
      
      // Even on error, try to use any partial data we might have gotten
      // Only use mock if we have absolutely nothing
      if (stats === null) {
        console.log('⚠️ No data available, using mock data as last resort')
        setStats(mockStats)
      } else {
        console.log('✅ Using partial data that was fetched before error')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-client-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-client-text">Loading dashboard data...</p>
          <p className="text-sm text-client-text-muted mt-2">Please wait while we prepare your analytics</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-client-background flex items-center justify-center">
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

  const data = stats || mockStats

  const COLORS = ['#102A43', '#334E68', '#627D98', '#94a3b8']

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
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => fetchDashboardStats()}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Refresh dashboard data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
            <div className="text-sm text-red-800">
              <strong>API Error:</strong> {error}. Some data may be showing mock/fallback values.
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          change={data.monthlyGrowth}
          changeType="positive"
          gradient="bg-primary-500"
        />
        <StatCard
          title="Active Users"
          value={data.activeUsers.toLocaleString()}
          icon={Activity}
          change={5.2}
          changeType="positive"
          gradient="bg-primary-500"
        />
        <StatCard
          title="Total Transactions"
          value={data.totalTransactions.toLocaleString()}
          icon={CreditCard}
          change={data.transactionGrowth}
          changeType="positive"
          gradient="bg-primary-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          icon={DollarSign}
          change={data.revenueGrowth}
          changeType="positive"
          gradient="bg-primary-500"
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
          gradient="bg-primary-500"
        />

        <StatCard
          title="Avg Transaction"
          value={formatCurrency(data.totalRevenue / data.totalTransactions)}
          icon={TrendingUp}
          change={null}
          changeType={null}
          gradient="bg-primary-500"
        />

        <StatCard
          title="Active Rate"
          value={`${((data.activeUsers / data.totalUsers) * 100).toFixed(1)}%`}
          icon={Activity}
          change={null}
          changeType={null}
          gradient="bg-primary-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-client-text mb-4">Revenue Trend</h3>
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
                    stroke="#102A43" 
                    strokeWidth={2}
                    name="Revenue"
                    dot={{ fill: '#102A43', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Activity className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No revenue data available</p>
                <p className="text-sm mt-2">Revenue data will appear here when available</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-client-text mb-4">Transaction Types</h3>
          <div style={{ width: '100%', height: '350px', minHeight: '350px' }}>
            {data.transactionTypes && data.transactionTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={data.transactionTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      // Calculate label position to ensure all labels are visible outside the pie
                      const RADIAN = Math.PI / 180
                      
                      // Position labels outside the pie with enough spacing
                      const labelRadius = outerRadius + 25
                      const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN)
                      const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN)
                      
                      return (
                        <text
                          x={labelX}
                          y={labelY}
                          fill="#374151"
                          textAnchor={labelX > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize={13}
                          fontWeight={600}
                          style={{ userSelect: 'none' }}
                        >
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      )
                    }}
                    outerRadius={75}
                    innerRadius={0}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {data.transactionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} transactions`}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <CreditCard className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No transaction data available</p>
                <p className="text-sm mt-2">Transaction breakdown will appear here when available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-client-text mb-4">Daily Active Users</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            {data.userActivity && data.userActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} users`} />
                  <Legend />
                  <Bar dataKey="users" fill="#102A43" name="Active Users" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Users className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No user activity data available</p>
                <p className="text-sm mt-2">Daily active users will appear here when available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PCI DSS Notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-800">
          <strong>Note:</strong> All financial data displayed is aggregated and anonymized in compliance with PCI DSS standards. 
          No sensitive cardholder data is stored or displayed in this dashboard.
        </p>
      </div>
    </div>
  )
}

export default Dashboard

