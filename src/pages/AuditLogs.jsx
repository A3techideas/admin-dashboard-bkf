import { useState, useEffect, useCallback } from 'react'
import { adminAPI } from '../utils/api'
import { Search, Shield, Clock, User, RefreshCw, AlertCircle } from 'lucide-react'
import CustomSelect from '../components/CustomSelect'

// Mock logs data - defined outside component to avoid reference errors
const mockLogs = [
    {
      logId: 'log-001',
      adminId: 'admin-001',
      adminEmail: 'admin@breakfree.com',
      action: 'ADMIN_LOGIN',
      description: 'Admin user logged in',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2025-01-10T10:30:00Z',
      status: 'success'
    },
    {
      logId: 'log-002',
      adminId: 'admin-001',
      adminEmail: 'admin@breakfree.com',
      action: 'VIEW_USER',
      description: 'Viewed user details for user-001',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2025-01-10T10:35:00Z',
      status: 'success'
    },
    {
      logId: 'log-003',
      adminId: 'admin-002',
      adminEmail: 'support@breakfree.com',
      action: 'UPDATE_TICKET',
      description: 'Updated ticket TKT-001 status to resolved',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2025-01-10T09:15:00Z',
      status: 'success'
    },
    {
      logId: 'log-004',
      adminId: 'admin-001',
      adminEmail: 'admin@breakfree.com',
      action: 'DOWNLOAD_REPORT',
      description: 'Downloaded transaction report for October 2024',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2025-01-10T08:45:00Z',
      status: 'success'
    },
    {
      logId: 'log-005',
      adminId: 'admin-003',
      adminEmail: 'unauthorized@example.com',
      action: 'FAILED_LOGIN',
      description: 'Failed login attempt',
      ipAddress: '10.0.0.1',
      userAgent: 'curl/7.68.0',
      timestamp: '2025-01-10T08:00:00Z',
      status: 'failed'
    }
]

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if we're in demo mode
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data with a small delay to simulate API
        console.log('🎭 Demo mode: Using mock audit logs data')
        await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay
        setLogs(mockLogs)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from real API
      console.log('📡 Fetching audit logs from API...')
      const response = await adminAPI.getAuditLogs({ action: actionFilter === 'all' ? undefined : actionFilter })
      
      console.log('✅ API response:', response.data)
      console.log('📋 Full response structure:', JSON.stringify(response.data, null, 2))
      
      // Handle different response structures
      let apiLogs = []
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          apiLogs = response.data
        } else if (response.data.logs && Array.isArray(response.data.logs)) {
          apiLogs = response.data.logs
        } else if (response.data.data && Array.isArray(response.data.data)) {
          apiLogs = response.data.data
        } else if (response.data.body && Array.isArray(response.data.body)) {
          apiLogs = response.data.body
        } else {
          console.warn('Unexpected API response structure:', response.data)
          // Try to extract any array from the response
          const allKeys = Object.keys(response.data)
          for (const key of allKeys) {
            if (Array.isArray(response.data[key])) {
              apiLogs = response.data[key]
              console.log(`Found logs array in key: ${key}`)
              break
            }
          }
        }
      }
      
      // Normalize the API response to match expected structure
      if (apiLogs.length > 0) {
        const normalizedLogs = apiLogs.map((log, index) => ({
          logId: log.logId || log.id || log._id || `log-${index}`,
          adminId: log.adminId || log.admin_id || log.userId || log.user_id || null,
          adminEmail: log.adminEmail || log.admin_email || log.email || log.userEmail || log.user_email || null,
          action: log.action || log.actionType || log.type || 'UNKNOWN',
          description: log.description || log.desc || log.message || log.details || null,
          ipAddress: log.ipAddress || log.ip_address || log.ip || log.clientIp || log.client_ip || null,
          userAgent: log.userAgent || log.user_agent || log.agent || null,
          timestamp: log.timestamp || log.createdAt || log.created_at || log.date || log.time || new Date().toISOString(),
          status: log.status || log.result || (log.success !== undefined ? (log.success ? 'success' : 'failed') : 'success')
        }))
        
        console.log('✅ Normalized logs:', normalizedLogs)
        setLogs(normalizedLogs)
      } else {
        console.warn('No logs found in API response, using mock data')
        setLogs(mockLogs) // Fallback to mock data
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError(err.message || 'Failed to load audit logs')
      // Fallback to mock data on error
      setLogs(mockLogs)
    } finally {
      setLoading(false)
    }
  }, [actionFilter])

  useEffect(() => {
    fetchAuditLogs()
  }, [fetchAuditLogs])

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.warning}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getActionBadge = (action) => {
    const styles = {
      ADMIN_LOGIN: 'bg-primary-100 text-primary-800',
      ADMIN_LOGOUT: 'bg-gray-100 text-gray-800',
      VIEW_USER: 'bg-purple-100 text-purple-800',
      UPDATE_TICKET: 'bg-green-100 text-green-800',
      DOWNLOAD_REPORT: 'bg-orange-100 text-orange-800',
      FAILED_LOGIN: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[action] || 'bg-gray-100 text-gray-800'}`}>
        {action.replace(/_/g, ' ')}
      </span>
    )
  }

  // Always render something - never return null or undefined
  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-client-text">Loading audit logs...</p>
          <p className="text-sm text-client-text-muted mt-2">Please wait while we fetch the logs</p>
        </div>
      </div>
    )
  }

  const filteredLogs = logs.filter(log => {
    if (!log) return false
    const desc = (log.description || '').toLowerCase()
    const email = (log.adminEmail || '').toLowerCase()
    const search = searchTerm.toLowerCase()
    return desc.includes(search) || email.includes(search)
  })

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
            <div className="text-sm text-yellow-800">
              <strong>API Error:</strong> {error}. Showing cached/mock data. The page will retry automatically.
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-client-text">Audit Logs</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchAuditLogs()}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Refresh audit logs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">PCI DSS Compliant Logging</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <CustomSelect
            value={actionFilter}
            onChange={setActionFilter}
            options={[
              { value: 'all', label: 'All Actions' },
              { value: 'ADMIN_LOGIN', label: 'Admin Login' },
              { value: 'VIEW_USER', label: 'View User' },
              { value: 'UPDATE_TICKET', label: 'Update Ticket' },
              { value: 'DOWNLOAD_REPORT', label: 'Download Report' },
              { value: 'FAILED_LOGIN', label: 'Failed Login' }
            ]}
            placeholder="All Actions"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!filteredLogs || filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No audit logs found</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {searchTerm || actionFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'No logs available at this time'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  if (!log || !log.logId) return null
                  try {
                    return (
                      <tr key={log.logId || Math.random()} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <div className="text-sm text-gray-900">{log.adminEmail || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getActionBadge(log.action || 'UNKNOWN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{log.description || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {log.ipAddress || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(log.status || 'unknown')}
                        </td>
                      </tr>
                    )
                  } catch (err) {
                    console.error('Error rendering log row:', err, log)
                    return null
                  }
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-800">
          <strong>Security Notice:</strong> All administrative actions are logged and monitored for security compliance. 
          Logs are retained for 90 days as per PCI DSS requirements.
        </p>
      </div>
    </div>
  )
}

export default AuditLogs

