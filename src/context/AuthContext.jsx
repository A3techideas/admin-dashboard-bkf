import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { createAuditLog } from '../utils/pciCompliance'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState(null)

  useEffect(() => {
    verifySession()
    
    // Set up session timeout check
    const interval = setInterval(() => {
      if (sessionExpiry && Date.now() > sessionExpiry) {
        logout()
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [sessionExpiry])

  const verifySession = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setLoading(false)
      return
    }

    // Demo mode - check if we're in development
    const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                      !import.meta.env.VITE_API_BASE_URL ||
                      import.meta.env.VITE_API_BASE_URL.includes('localhost')
    
    if (isDemoMode && token.startsWith('demo-token-')) {
      // Demo mode - create demo user
      const demoUser = {
        adminId: 'demo-admin-001',
        email: 'admin@breakfree.com',
        role: 'admin',
        name: 'Demo Admin'
      }
      setUser(demoUser)
      setSessionExpiry(Date.now() + 15 * 60 * 1000)
      setLoading(false)
      return
    }

    try {
      const response = await adminAPI.verifyToken()
      setUser(response.data.user)
      
      // Set session expiry (15 minutes from now)
      setSessionExpiry(Date.now() + 15 * 60 * 1000)
    } catch (error) {
      console.error('Session verification failed:', error)
      localStorage.removeItem('adminToken')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (isDemoMode) {
        // Demo mode - only accept specific credentials
        console.log('🎭 Demo mode: Checking credentials')
        
        // Check for specific admin credentials
        if (email === 'adminbreakfree' && password === 'open4u') {
          const demoUser = {
            adminId: 'demo-admin-001',
            email: email,
            role: 'admin',
            name: 'BreakFree Admin'
          }
          
          localStorage.setItem('adminToken', 'demo-token-' + Date.now())
          setUser(demoUser)
          setSessionExpiry(Date.now() + 15 * 60 * 1000)
          
          console.log(createAuditLog('ADMIN_LOGIN', { 
            adminId: demoUser.adminId,
            email: demoUser.email 
          }))
          
          return { success: true }
        } else {
          return { 
            success: false, 
            error: 'Invalid credentials. Please use adminbreakfree / open4u' 
          }
        }
      }
      
      // Production mode - use real API
      const response = await adminAPI.login({ email, password })
      const { token, user } = response.data

      localStorage.setItem('adminToken', token)
      setUser(user)
      
      // Set session expiry
      setSessionExpiry(Date.now() + 15 * 60 * 1000)

      // Create audit log
      console.log(createAuditLog('ADMIN_LOGIN', { 
        userId: user.userId,
        email: user.email 
      }))

      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const logout = async () => {
    try {
      // Demo mode - check if we're in development
      const isDemoMode = import.meta.env.VITE_API_BASE_URL === 'http://localhost:3001' || 
                        !import.meta.env.VITE_API_BASE_URL ||
                        import.meta.env.VITE_API_BASE_URL.includes('localhost')
      
      if (!isDemoMode) {
        await adminAPI.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('adminToken')
      setUser(null)
      setSessionExpiry(null)
      window.location.href = '/login'
    }
  }

  const extendSession = () => {
    setSessionExpiry(Date.now() + 15 * 60 * 1000)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    extendSession,
    isAuthenticated: !!user,
    sessionExpiry
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

