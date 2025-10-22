import axios from 'axios'
import { awsConfig } from '../config/aws'

const api = axios.create({
  baseURL: awsConfig.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Admin API endpoints
export const adminAPI = {
  // Analytics
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getUserAnalytics: (params) => api.get('/admin/analytics/users', { params }),
  getTransactionAnalytics: (params) => api.get('/admin/analytics/transactions', { params }),
  getRevenueAnalytics: (params) => api.get('/admin/analytics/revenue', { params }),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  
  // Transactions
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  getTransactionById: (transactionId) => api.get(`/admin/transactions/${transactionId}`),
  
  // Tickets
  getTickets: (params) => api.get('/admin/tickets', { params }),
  getTicketById: (ticketId) => api.get(`/admin/tickets/${ticketId}`),
  updateTicket: (ticketId, data) => api.put(`/admin/tickets/${ticketId}`, data),
  
  // Reports
  generateReport: (reportType, params) => api.post('/admin/reports/generate', { reportType, ...params }),
  getReports: () => api.get('/admin/reports'),
  downloadReport: (reportId) => api.get(`/admin/reports/${reportId}/download`, { responseType: 'blob' }),
  
  // Audit Logs
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  
  // Authentication
  login: (credentials) => api.post('/admin/auth/login', credentials),
  logout: () => api.post('/admin/auth/logout'),
  verifyToken: () => api.get('/admin/auth/verify'),
}

export default api


