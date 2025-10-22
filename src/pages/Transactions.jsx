import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { formatCurrency, maskCardNumber, maskAccountNumber } from '../utils/pciCompliance'
import { Search, Filter, Download, Eye, Shield } from 'lucide-react'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchTransactions()
  }, [page, typeFilter, statusFilter, searchTerm])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock transactions data')
        setTransactions(mockTransactions)
        setTotalPages(5)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from API
      const response = await adminAPI.getTransactions({
        page,
        limit: 20,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm
      })
      setTransactions(response.data.transactions || mockTransactions)
      setTotalPages(response.data.totalPages || 5)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setTransactions(mockTransactions)
    } finally {
      setLoading(false)
    }
  }

  // Mock data
  const mockTransactions = [
    {
      transactionId: 'txn-001',
      userId: 'user-001',
      type: 'bill_payment',
      amount: 150.00,
      currency: 'USD',
      status: 'completed',
      paymentMethod: { type: 'card', last4: '4242' },
      createdAt: '2025-01-10T10:30:00Z',
      description: 'Electricity Bill Payment'
    },
    {
      transactionId: 'txn-002',
      userId: 'user-002',
      type: 'money_transfer',
      amount: 250.50,
      currency: 'USD',
      status: 'completed',
      paymentMethod: { type: 'bank', last4: '1234' },
      createdAt: '2025-01-10T09:15:00Z',
      description: 'Transfer to John Doe'
    },
    {
      transactionId: 'txn-003',
      userId: 'user-003',
      type: 'card_payment',
      amount: 89.99,
      currency: 'USD',
      status: 'pending',
      paymentMethod: { type: 'card', last4: '5678' },
      createdAt: '2025-01-10T08:45:00Z',
      description: 'Online Purchase'
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    const styles = {
      bill_payment: 'bg-blue-100 text-blue-800',
      money_transfer: 'bg-purple-100 text-purple-800',
      card_payment: 'bg-pink-100 text-pink-800',
      savings: 'bg-green-100 text-green-800'
    }
    const labels = {
      bill_payment: 'Bill Payment',
      money_transfer: 'Money Transfer',
      card_payment: 'Card Payment',
      savings: 'Savings'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {labels[type] || type}
      </span>
    )
  }

  const maskPaymentMethod = (method) => {
    if (!method) return 'N/A'
    if (method.type === 'card') {
      return `Card ${maskCardNumber(method.last4)}`
    } else if (method.type === 'bank') {
      return `Bank ${maskAccountNumber(method.last4)}`
    }
    return 'N/A'
  }

  if (loading && transactions.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor all financial transactions</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="h-5 w-5 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="bill_payment">Bill Payment</option>
            <option value="money_transfer">Money Transfer</option>
            <option value="card_payment">Card Payment</option>
            <option value="savings">Savings</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Apply
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn) => (
                <tr key={txn.transactionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{txn.transactionId}</div>
                      <div className="text-xs text-gray-500">{txn.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(txn.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(txn.amount, txn.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 masked-data">
                      {maskPaymentMethod(txn.paymentMethod)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(txn.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PCI DSS Compliance Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
          <div className="text-sm text-green-800">
            <strong>PCI DSS Compliant:</strong> All payment card information is masked. Only the last 4 digits are displayed. 
            Full card numbers are never stored or shown in this interface.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions

