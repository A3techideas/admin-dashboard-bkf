import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { Search, Filter, MessageSquare, Clock } from 'lucide-react'

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    fetchTickets()
  }, [statusFilter, priorityFilter])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - use mock data
        console.log('🎭 Demo mode: Using mock tickets data')
        setTickets(mockTickets)
        setLoading(false)
        return
      }
      
      // Production mode - fetch from API
      const response = await adminAPI.getTickets({ status: statusFilter, priority: priorityFilter })
      setTickets(response.data.tickets || mockTickets)
    } catch (err) {
      console.error('Error fetching tickets:', err)
      setTickets(mockTickets)
    } finally {
      setLoading(false)
    }
  }

  const mockTickets = [
    {
      ticketId: 'TKT-001',
      userId: 'user-001',
      subject: 'Unable to complete transaction',
      status: 'open',
      priority: 'high',
      category: 'technical',
      createdAt: '2025-01-10T10:30:00Z',
      lastUpdate: '2025-01-10T11:00:00Z',
      assignedTo: 'Support Team'
    },
    {
      ticketId: 'TKT-002',
      userId: 'user-002',
      subject: 'Question about savings account',
      status: 'in_progress',
      priority: 'medium',
      category: 'billing',
      createdAt: '2025-10-09T14:20:00Z',
      lastUpdate: '2025-01-10T09:15:00Z',
      assignedTo: 'John Admin'
    },
    {
      ticketId: 'TKT-003',
      userId: 'user-003',
      subject: 'Account access issue',
      status: 'resolved',
      priority: 'low',
      category: 'account',
      createdAt: '2025-10-08T16:45:00Z',
      lastUpdate: '2025-10-09T10:30:00Z',
      assignedTo: 'Jane Admin'
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.open}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-purple-100 text-purple-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority] || styles.medium}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  if (loading && tickets.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-sm text-gray-600 mt-1">Manage customer support tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.ticketId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.ticketId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ticket.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Tickets

