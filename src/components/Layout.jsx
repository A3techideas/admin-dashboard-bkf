import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDemoModeIndicator } from '../utils/demoMode'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Ticket, 
  FileText, 
  Shield,
  Settings,
  LogOut,
  Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'

const Layout = () => {
  const { user, logout, sessionExpiry } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionExpiry) {
        const remaining = Math.max(0, sessionExpiry - Date.now())
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionExpiry])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Audit Logs', href: '/audit-logs', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-primary-600">
            <h1 className="text-xl font-bold text-white">BreakFree Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            {/* Session timer */}
            <div className="mb-3 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center text-xs text-yellow-800">
                <Clock className="w-4 h-4 mr-2" />
                <span>Session: {timeLeft}</span>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
                </h2>
              </div>
              <div className="flex-1 flex justify-center">
                <p className="text-xl font-semibold text-primary-600 italic">
                  Your Money Your Control.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>


        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>

        {/* PCI DSS Compliance Notice */}
        <footer className="px-8 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span>PCI DSS Compliant • All sensitive data is masked</span>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                All admin actions are logged for security auditing
              </div>
              {/* Demo Mode Indicator */}
              {getDemoModeIndicator().show && (
                <div className={getDemoModeIndicator().className}>
                  {getDemoModeIndicator().text}
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout

