import { useState } from 'react'
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react'

const Reports = () => {
  const [reportType, setReportType] = useState('transactions')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [generating, setGenerating] = useState(false)

  const reports = [
    {
      id: 1,
      name: 'Monthly Transaction Report',
      type: 'transactions',
      date: '2025-01-01',
      size: '2.5 MB',
      status: 'completed'
    },
    {
      id: 2,
      name: 'User Activity Report',
      type: 'users',
      date: '2024-12-15',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Revenue Analytics',
      type: 'revenue',
      date: '2024-12-01',
      size: '3.2 MB',
      status: 'completed'
    }
  ]

  const handleGenerateReport = async () => {
    setGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false)
      alert('Report generated successfully!')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Generate and download reports</p>
        </div>
      </div>

      {/* Generate New Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="transactions">Transactions Report</option>
            <option value="users">User Activity Report</option>
            <option value="revenue">Revenue Analytics</option>
            <option value="compliance">Compliance Report</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Previous Reports */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Previous Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">Size: {report.size}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports

