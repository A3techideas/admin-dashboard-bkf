import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Mail, Lock, User, CreditCard } from 'lucide-react'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden fixed inset-0" style={{ backgroundColor: '#1A2B4D' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-32 w-3 h-3 bg-primary-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-20 w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-80 left-40 w-5 h-5 bg-primary-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-20 w-3 h-3 bg-primary-300 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-60 right-40 w-4 h-4 bg-primary-500 rounded-full animate-pulse delay-3000"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary-400 rounded-full animate-pulse delay-2500"></div>
      </div>

      {/* Network Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="network" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#60A5FA" opacity="0.3"/>
              <line x1="0" y1="10" x2="20" y2="10" stroke="#60A5FA" strokeWidth="0.5" opacity="0.2"/>
              <line x1="10" y1="0" x2="10" y2="20" stroke="#60A5FA" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)"/>
        </svg>
      </div>


      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
            {/* Card Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-client-text mb-2">BreakFree</h2>
              <p className="text-sm text-client-text-muted">Admin Dashboard Access</p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-client-text mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-client-text placeholder-client-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="Username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-client-text mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-client-text placeholder-client-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="Password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Help Link */}
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Alternative Options */}
            <div className="mt-8 flex justify-center space-x-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-500" />
                </div>
                <span className="text-xs text-client-text-muted">Identity</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary-500" />
                </div>
                <span className="text-xs text-client-text-muted">Finance</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-client-text-muted">
                Secure admin access with PCI DSS compliance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

