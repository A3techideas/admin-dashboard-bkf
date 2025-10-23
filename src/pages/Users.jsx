import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { maskEmail, maskPhone, formatCurrency } from '../utils/pciCompliance'
import { Search, Filter, Eye, MoreVertical, AlertCircle } from 'lucide-react'
import CustomSelect from '../components/CustomSelect'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [page, filter, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock users data')
        setUsers(mockUsers)
        setTotalPages(5)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from API
      const response = await adminAPI.getUsers({
        page,
        limit: 20,
        filter,
        search: searchTerm
      })
      setUsers(response.data.users || mockUsers)
      setTotalPages(response.data.totalPages || 5)
    } catch (err) {
      console.error('Error fetching users:', err)
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  // Mock data
  const mockUsers = [
    {
      userId: 'user-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      status: 'active',
      joinDate: '2024-01-15',
      totalTransactions: 45,
      totalSpent: 12450.50,
      lastActive: '2025-01-10'
    },
    {
      userId: 'user-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      status: 'active',
      joinDate: '2024-02-20',
      totalTransactions: 32,
      totalSpent: 8920.25,
      lastActive: '2025-01-09'
    },
    {
      userId: 'user-003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567892',
      status: 'inactive',
      joinDate: '2024-03-10',
      totalTransactions: 18,
      totalSpent: 4560.00,
      lastActive: '2024-09-15'
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-client-text-muted" />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-client-text"
            />
          </div>
          <CustomSelect
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' }
            ]}
            placeholder="All Users"
          />
          <button className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-client-text">{user.name}</div>
                      <div className="text-xs text-client-text-muted">{user.userId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-client-text masked-data">{maskEmail(user.email)}</div>
                      <div className="text-xs text-client-text-muted masked-data">{maskPhone(user.phone)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-client-text">
                    {user.totalTransactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-client-text">
                    {formatCurrency(user.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-client-text-muted">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-500 hover:text-primary-700 mr-3">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-client-text-muted hover:text-client-text">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-primary-100 px-6 py-3 flex items-center justify-between border-t border-primary-200">
          <div className="text-sm text-client-text">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-client-text bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-client-text bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PCI DSS Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
          <div className="text-sm text-yellow-800">
            <strong>Privacy Notice:</strong> Email addresses and phone numbers are masked in compliance with PCI DSS and privacy regulations. 
            Full contact information is never displayed in the admin interface.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users

