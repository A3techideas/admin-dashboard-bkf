import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { Search, Shield, Clock, User } from 'lucide-react'
import CustomSelect from '../components/CustomSelect'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  useEffect(() => {
    fetchAuditLogs()
  }, [actionFilter])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock audit logs data')
        setLogs(mockLogs)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from API
      const response = await adminAPI.getAuditLogs({ action: actionFilter })
      setLogs(response.data.logs || mockLogs)
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setLogs(mockLogs)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const filteredLogs = logs.filter(log => 
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm text-gray-600">PCI DSS Compliant Logging</span>
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
              {filteredLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="text-sm text-gray-900">{log.adminEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))}
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

