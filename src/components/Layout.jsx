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
  Clock,
  Menu,
  X
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

const Layout = () => {
  const { user, logout, sessionExpiry, extendSession } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState('15:00')
  const [totalSeconds, setTotalSeconds] = useState(900) // 15 minutes = 900 seconds
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const intervalRef = useRef(null)

  // Calculate remaining time from sessionExpiry
  const calculateRemainingTime = () => {
    if (!sessionExpiry) return 0
    const remaining = Math.max(0, Math.floor((sessionExpiry - Date.now()) / 1000))
    return remaining
  }

  // Start timer immediately when component mounts or sessionExpiry changes
  useEffect(() => {
    if (!sessionExpiry) {
      setTotalSeconds(0)
      setTimeLeft('00:00')
      return
    }
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    const updateTimer = () => {
      const remaining = calculateRemainingTime()
      setTotalSeconds(remaining)
      
      // Update display immediately
      const minutes = Math.floor(remaining / 60)
      const seconds = remaining % 60
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
      setTimeLeft(timeString)
      
      if (remaining <= 0) {
        console.log('Session expired, logging out...')
        clearInterval(intervalRef.current)
        logout()
        return
      }
    }
    
    // Update immediately
    updateTimer()
    
    // Set up interval to update every second
    intervalRef.current = setInterval(updateTimer, 1000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [sessionExpiry, logout])

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

  const handleExtendSession = () => {
    extendSession()
    setTotalSeconds(900) // Reset to 15:00
    setTimeLeft('15:00')
    console.log('Session extended by 15 minutes')
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-client-background">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-white to-gray-50 shadow-2xl border-r border-gray-100 transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-bold text-white">BreakFree Admin</h1>
            </div>
            {/* Mobile close button */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                      : 'text-client-text hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 hover:shadow-md hover:transform hover:scale-102'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                  )}
                  
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white bg-opacity-20'
                      : 'bg-transparent group-hover:bg-primary-200 group-hover:bg-opacity-50'
                  }`}>
                    <Icon className={`w-5 h-5 transition-all duration-200 ${
                      isActive(item.href) ? 'text-white' : 'text-client-text group-hover:text-primary-700'
                    }`} />
                  </div>
                  
                  <span className="ml-3 font-medium">{item.name}</span>
                  
                  {/* Hover effect indicator */}
                  {!isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            {/* Session timer */}
            <div 
              className={`mb-3 px-3 py-2.5 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
                timeLeft && parseInt(timeLeft.split(':')[0]) < 2 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200' 
                  : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200'
              }`}
              onClick={handleExtendSession}
              title="Click to extend session by 15 minutes"
            >
              <div className={`flex items-center ${
                timeLeft && parseInt(timeLeft.split(':')[0]) < 2 
                  ? 'text-red-800' 
                  : 'text-yellow-800'
              }`}>
                <div className={`p-1.5 rounded-lg mr-2.5 ${
                  timeLeft && parseInt(timeLeft.split(':')[0]) < 2 
                    ? 'bg-red-200' 
                    : 'bg-yellow-200'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-base">{timeLeft || '15:00'}</span>
                    <span className="text-xs font-medium opacity-75">({totalSeconds}s)</span>
                  </div>
                  <p className={`text-xs font-medium mt-0.5 ${
                    timeLeft && parseInt(timeLeft.split(':')[0]) < 2 
                      ? 'text-red-700' 
                      : 'text-yellow-700'
                  }`}>
                    {timeLeft && parseInt(timeLeft.split(':')[0]) < 2 
                      ? 'Expiring!' 
                      : 'Session'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-client-text">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="group flex items-center w-full px-4 py-3 text-sm font-medium text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm hover:shadow-md border border-red-200 hover:border-red-300"
            >
              <div className="p-1 bg-red-200 rounded-lg mr-3 group-hover:bg-red-300 transition-colors duration-200">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex-1 lg:flex-none">
                <h2 className="text-xl lg:text-2xl font-bold text-client-text">
                  {navigation.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
                </h2>
              </div>
              
              {/* Desktop tagline - hidden on mobile */}
              <div className="hidden lg:flex flex-1 justify-center">
                <p className="text-xl font-semibold text-primary-500 italic">
                  Your Money Your Control.
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-sm text-client-text-muted">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            {/* Mobile tagline and date */}
            <div className="lg:hidden mt-2">
              <p className="text-sm font-semibold text-primary-500 italic mb-1">
                Your Money Your Control.
              </p>
              <div className="text-xs text-client-text-muted">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>

        {/* PCI DSS Compliance Notice */}
        <footer className="px-4 py-4 lg:px-8 bg-white border-t border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between text-xs text-client-text-muted space-y-2 lg:space-y-0">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-center lg:text-left">PCI DSS Compliant • All sensitive data is masked</span>
            </div>
            <div className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-4">
              <div className="text-center lg:text-left">
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

