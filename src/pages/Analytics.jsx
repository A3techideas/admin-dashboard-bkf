import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { formatCurrency } from '../utils/pciCompliance'
import { TrendingUp, DollarSign, Users, Activity, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import CustomSelect from '../components/CustomSelect'

// Mock data - defined outside component
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
      
      // Check if we should use demo mode (only if explicitly set to localhost:3001)
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001'
      
      if (isDemoMode) {
        console.log('🎭 Demo mode: Using mock analytics data')
        setAnalytics(mockAnalytics)
        setLoading(false)
        return
      }
      
      // Always try to fetch real data from API
      console.log('📡 Fetching real-time analytics data from API...', { 
        dateRange,
        baseURL: import.meta.env.VITE_API_BASE_URL || 'default AWS URL'
      })
      
      // Fetch from API - handle errors gracefully
      let transactionData = null
      let revenueData = null
      let userData = null
      let statsData = null
      
      try {
        const transactionResponse = await adminAPI.getTransactionAnalytics({ dateRange })
        transactionData = transactionResponse?.data || transactionResponse
        console.log('✅ Transaction analytics:', transactionData)
      } catch (err) {
        console.warn('⚠️ Transaction analytics API error:', err.message, err.response?.data)
      }
      
      try {
        const revenueResponse = await adminAPI.getRevenueAnalytics({ dateRange })
        revenueData = revenueResponse?.data || revenueResponse
        console.log('✅ Revenue analytics:', revenueData)
      } catch (err) {
        console.warn('⚠️ Revenue analytics API error:', err.message, err.response?.data)
      }
      
      try {
        // Try requesting user growth data with explicit parameters
        const userResponse = await adminAPI.getUserAnalytics({ 
          dateRange,
          type: 'growth', // Try requesting growth trend specifically
          groupBy: 'month' // Try requesting monthly grouping
        })
        userData = userResponse?.data || userResponse
        console.log('✅ User analytics API response:', JSON.stringify(userData, null, 2))
        
        // If still no growth data, try without those params (some APIs don't support them)
        if (!userData?.userGrowth && !userData?.growth && !userData?.userTrend && !Array.isArray(userData)) {
          console.log('⚠️ No growth data found, trying without type/groupBy parameters...')
          const userResponse2 = await adminAPI.getUserAnalytics({ dateRange })
          const userData2 = userResponse2?.data || userResponse2
          // Only use if it has growth data
          if (userData2?.userGrowth || userData2?.growth || userData2?.userTrend || Array.isArray(userData2)) {
            userData = userData2
            console.log('✅ Found growth data in alternative response:', JSON.stringify(userData, null, 2))
          }
        }
      } catch (err) {
        console.error('❌ User analytics API error:', err.message)
        console.error('Error response:', err.response?.data || err.response)
        userData = null
      }
      
      try {
        const statsResponse = await adminAPI.getDashboardStats()
        statsData = statsResponse?.data || statsResponse
        console.log('✅ Dashboard stats:', statsData)
      } catch (err) {
        console.warn('⚠️ Dashboard stats API error:', err.message, err.response?.data)
      }
      
      console.log('📊 All API responses:', {
        transactionData,
        revenueData,
        userData,
        statsData
      })
      
      // Transform API data to match chart structure
      const transformedAnalytics = transformApiDataToAnalytics({
        transactionData,
        revenueData,
        userData,
        statsData,
        dateRange,
        hasApiData: !!(transactionData || revenueData || userData || statsData)
      })
      
      // Check if we actually got real data (not empty arrays and not identical to mock)
      const hasRealRevenueData = transformedAnalytics.revenueByDay && 
        transformedAnalytics.revenueByDay.length > 0 &&
        JSON.stringify(transformedAnalytics.revenueByDay) !== JSON.stringify(mockAnalytics.revenueByDay)
      
      const hasRealUserData = transformedAnalytics.userGrowth && 
        transformedAnalytics.userGrowth.length > 0 &&
        JSON.stringify(transformedAnalytics.userGrowth) !== JSON.stringify(mockAnalytics.userGrowth)
      
      if (hasRealRevenueData || hasRealUserData) {
        console.log('✅ Using REAL API data:', {
          revenue: hasRealRevenueData,
          userGrowth: hasRealUserData,
          revenuePoints: transformedAnalytics.revenueByDay?.length || 0,
          userGrowthPoints: transformedAnalytics.userGrowth?.length || 0
        })
      } else {
        console.log('⚠️ No real data detected, but API was called. Using transformed data or mock:', {
          revenueData: !!revenueData,
          userData: !!userData,
          revenueByDayLength: transformedAnalytics.revenueByDay?.length || 0,
          userGrowthLength: transformedAnalytics.userGrowth?.length || 0
        })
      }
      
      setAnalytics(transformedAnalytics)
    } catch (err) {
      console.error('❌ Critical error fetching analytics:', err)
      console.error('Error details:', err.response?.data || err.message)
      // Only fallback to mock on critical errors
      console.log('🔄 Falling back to mock data due to critical error')
      setAnalytics(mockAnalytics)
    } finally {
      setLoading(false)
    }
  }

  // Transform API response data to match chart structure
  const transformApiDataToAnalytics = ({ transactionData, revenueData, userData, statsData, dateRange, hasApiData }) => {
    console.log('🔄 Transforming API data:', { transactionData, revenueData, userData, statsData, hasApiData })
    
    // Use API data if available, otherwise fall back to mock data
    const summary = statsData?.summary || transactionData?.summary || {
      totalRevenue: revenueData?.totalRevenue || statsData?.totalRevenue || 0,
      totalTransactions: transactionData?.totalTransactions || statsData?.totalTransactions || 0,
      averageTransaction: transactionData?.averageTransaction || statsData?.averageTransaction || 0,
      activeUsers: userData?.activeUsers || statsData?.activeUsers || userData?.totalUsers || 0
    }

    // Format revenue by day from API response - handle multiple possible formats
    let revenueByDay = revenueData?.revenueByDay || revenueData?.dailyRevenue || revenueData?.revenueTrend || 
                       revenueData?.data || revenueData?.chartData ||
                       transactionData?.revenueByDay || transactionData?.dailyRevenue || 
                       statsData?.revenueByDay || []
    
    console.log('💰 Raw revenueByDay:', revenueByDay)
    
    // If it's an array but not in the right format, transform it
    if (Array.isArray(revenueByDay) && revenueByDay.length > 0) {
      // Check if already in correct format
      if (revenueByDay[0].date && revenueByDay[0].revenue !== undefined) {
        // Already correct, just ensure numeric values
        revenueByDay = revenueByDay.map(item => ({
          date: item.date || item.day || item.timestamp,
          revenue: Number(item.revenue || 0)
        }))
      } else if (revenueByDay[0].date && !revenueByDay[0].revenue) {
        // Has date but revenue might be under different key
        revenueByDay = revenueByDay.map(item => ({
          date: item.date || item.day || item.timestamp,
          revenue: Number(item.revenue || item.amount || item.value || item.total || item.count || 0)
        }))
      } else {
        // Try to transform from various formats
        revenueByDay = revenueByDay.map((item, index) => {
          // Handle different property names
          const date = item.date || item.day || item.timestamp || item.time || item.label || item.period || 
                      (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : null) ||
                      `Day ${index + 1}`
          const revenue = item.revenue || item.amount || item.value || item.total || item.count || 0
          return { 
            date: date.toString(), 
            revenue: Number(revenue) || 0 
          }
        })
      }
    }
    
    console.log('✅ Transformed revenueByDay:', revenueByDay)

    // Format transactions by type from API response
    let transactionsByType = transactionData?.transactionsByType || transactionData?.byType || 
                             transactionData?.typeBreakdown || transactionData?.data || []
    
    if (Array.isArray(transactionsByType) && transactionsByType.length > 0) {
      if (!transactionsByType[0].type && !transactionsByType[0].count) {
        // Transform from various formats
        transactionsByType = transactionsByType.map(item => ({
          type: item.type || item.name || item.category || item.transactionType || 'Other',
          count: Number(item.count || item.transactionCount || item.number || item.quantity || 0),
          amount: Number(item.amount || item.totalAmount || item.value || item.revenue || 0)
        }))
      } else {
        // Ensure numeric values
        transactionsByType = transactionsByType.map(item => ({
          type: item.type || item.name || 'Other',
          count: Number(item.count || 0),
          amount: Number(item.amount || 0)
        }))
      }
    }

    // Format user growth from API response - check multiple possible locations
    let userGrowth = null
    
    // Try to find user growth data in various possible locations
    if (userData) {
      // Check direct properties
      userGrowth = userData.userGrowth || 
                   userData.growth || 
                   userData.monthlyGrowth || 
                   userData.userTrend || 
                   userData.growthTrend ||
                   userData.trend ||
                   userData.monthlyData ||
                   userData.timeSeries
      
      // Check nested in data property
      if (!userGrowth && userData.data) {
        userGrowth = userData.data.userGrowth ||
                     userData.data.growth ||
                     userData.data.trend ||
                     (Array.isArray(userData.data) ? userData.data : null)
      }
      
      // Check if entire response is an array
      if (!userGrowth && Array.isArray(userData)) {
        userGrowth = userData
      }
      
      // Check chartData property
      if (!userGrowth && userData.chartData) {
        userGrowth = userData.chartData
      }
      
      // Check if response has monthly breakdown
      if (!userGrowth && userData.monthly) {
        userGrowth = userData.monthly
      }
      
      // Check if response has breakdown by period
      if (!userGrowth && userData.byPeriod) {
        userGrowth = userData.byPeriod
      }
    }
    
    // Ensure it's an array
    if (!Array.isArray(userGrowth)) {
      userGrowth = []
    }
    
    console.log('👥 Raw userGrowth from API:', userGrowth)
    console.log('👥 Full userData structure:', JSON.stringify(userData, null, 2))
    
    // If no growth data found, log a warning with available data
    if (userData && userGrowth.length === 0) {
      console.warn('⚠️ API returned user data but no time-series growth data. Response only contains summary stats:', {
        totalUsers: userData.totalUsers,
        activeUsers: userData.activeUsers,
        hasUserGrowth: !!userData.userGrowth,
        hasGrowth: !!userData.growth,
        hasTrend: !!userData.trend,
        isArray: Array.isArray(userData),
        allKeys: Object.keys(userData || {})
      })
      console.warn('💡 The API endpoint /admin/analytics/users may not support time-series data. It only returns summary statistics.')
    }
    
    // Transform array to chart format
    if (Array.isArray(userGrowth) && userGrowth.length > 0) {
      // Check if already in correct format { month, users }
      if (userGrowth[0].month !== undefined && userGrowth[0].users !== undefined) {
        // Already correct format, just ensure numeric values
        userGrowth = userGrowth.map(item => ({
          month: String(item.month || item.period || 'N/A'),
          users: Number(item.users || 0)
        }))
      } else if (userGrowth[0].date || userGrowth[0].timestamp || userGrowth[0].time) {
        // Has date field - extract month and count
        userGrowth = userGrowth.map((item) => {
          let month = 'N/A'
          let users = 0
          
          // Extract month from date
          const dateField = item.date || item.timestamp || item.time || item.createdAt
          if (dateField) {
            try {
              const date = new Date(dateField)
              month = date.toLocaleDateString('en-US', { month: 'short' })
            } catch (e) {
              month = String(dateField).substring(0, 7) // Use first 7 chars if date parsing fails
            }
          }
          
          // Extract user count
          users = Number(item.users || item.count || item.total || item.activeUsers || item.userCount || 0)
          
          return { month, users }
        })
      } else {
        // Generic transformation - try to find any numeric and label fields
        userGrowth = userGrowth.map((item, index) => {
          let month = item.month || item.period || item.label || item.name || `Period ${index + 1}`
          let users = Number(item.users || item.count || item.total || item.activeUsers || item.value || item.y || 0)
          return { month: String(month), users }
        })
      }
    }
    
    console.log('✅ Transformed userGrowth:', userGrowth)

    // Only use mock data if we have NO API data at all
    // If we have API data (even if empty), use it (charts will show "No data available")
    const useMockFallback = !hasApiData
    
    // For userGrowth specifically, check if we got userData from API
    const hasUserApiData = !!userData
    const useMockForUserGrowth = !hasUserApiData
    
    console.log('🔍 Data availability check:', {
      hasApiData,
      useMockFallback,
      hasUserApiData,
      useMockForUserGrowth,
      revenueByDayLength: revenueByDay.length,
      userGrowthLength: userGrowth.length,
      transactionsByTypeLength: transactionsByType.length,
      revenueData: !!revenueData,
      userData: !!userData,
      transactionData: !!transactionData,
      userGrowthIsArray: Array.isArray(userGrowth),
      userGrowthFirstItem: userGrowth?.[0]
    })
    
    const result = {
      summary: {
        totalRevenue: Number(summary.totalRevenue || (useMockFallback ? mockAnalytics.summary.totalRevenue : 0)),
        totalTransactions: Number(summary.totalTransactions || (useMockFallback ? mockAnalytics.summary.totalTransactions : 0)),
        averageTransaction: Number(summary.averageTransaction || 
          (summary.totalRevenue && summary.totalTransactions ? 
            (summary.totalRevenue / summary.totalTransactions) : 
            (useMockFallback ? mockAnalytics.summary.averageTransaction : 0))),
        activeUsers: Number(summary.activeUsers || (useMockFallback ? mockAnalytics.summary.activeUsers : 0))
      },
      // CRITICAL: Only use mock if NO API data was received at all
      // If API was called (even if it returned empty arrays), use the real empty arrays
      // This ensures charts show "No data available" instead of fake mock data
      revenueByDay: useMockFallback ? mockAnalytics.revenueByDay : revenueByDay,
      transactionsByType: useMockFallback ? mockAnalytics.transactionsByType : transactionsByType,
      // For userGrowth, only use mock if userData API call completely failed
      // If userData exists (even if userGrowth array is empty), use the real empty array
      userGrowth: useMockForUserGrowth ? mockAnalytics.userGrowth : (userGrowth || [])
    }
    
    console.log('✅ Final transformed analytics data:', {
      summary: result.summary,
      revenueByDayCount: result.revenueByDay.length,
      userGrowthCount: result.userGrowth.length,
      transactionsByTypeCount: result.transactionsByType.length
    })
    
    return result
  }


  const data = analytics || mockAnalytics

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - Date Selector */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-client-text-muted" />
          <CustomSelect
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '1y', label: 'Last year' }
            ]}
            placeholder="Last 30 days"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-500 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(data.summary.totalRevenue)}</p>
        </div>
        <div className="bg-primary-500 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Total Transactions</p>
          <p className="text-3xl font-bold mt-1">{data.summary.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-primary-500 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm opacity-90">Avg Transaction</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(data.summary.averageTransaction)}</p>
        </div>
        <div className="bg-primary-500 rounded-lg shadow p-6 text-white">
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
        <h3 className="text-lg font-semibold text-client-text mb-4">Revenue Over Time</h3>
        <div style={{ width: '100%', height: '350px' }}>
          {data.revenueByDay && data.revenueByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#102A43" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#102A43" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  if (!value) return ''
                  try {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  } catch {
                    return value.toString().substring(0, 10)
                  }
                }}
              />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => {
                  try {
                    const date = new Date(label)
                    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  } catch {
                    return label
                  }
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#102A43" 
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-client-text-muted">
              <p>No revenue data available for the selected period</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions by Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-client-text mb-4">Transactions by Type</h3>
        <div style={{ width: '100%', height: '350px' }}>
          {data.transactionsByType && data.transactionsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.transactionsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#102A43"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#102A43"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Amount ($)') {
                    return formatCurrency(value)
                  }
                  return value.toLocaleString()
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#102A43" name="Count" />
              <Bar yAxisId="right" dataKey="amount" fill="#3B82F6" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-client-text-muted">
              <p>No transaction data available for the selected period</p>
            </div>
          )}
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-client-text mb-4">User Growth Trend</h3>
        <div style={{ width: '100%', height: '300px' }}>
          {data.userGrowth && data.userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#102A43' }}
                />
                <YAxis 
                  tick={{ fill: '#102A43' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#102A43" 
                  strokeWidth={3}
                  dot={{ fill: '#102A43', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-client-text-muted">
              <p>No user growth data available for the selected period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics

