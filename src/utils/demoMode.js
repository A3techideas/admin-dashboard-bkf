/**
 * Demo Mode Utility
 * 
 * This utility helps determine if the application is running in demo mode
 * and provides consistent demo mode detection across all components.
 */

/**
 * Check if the application is running in demo mode
 * @returns {boolean} True if in demo mode, false otherwise
 */
export const isDemoMode = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  
  return (
    apiBaseUrl === 'http://localhost:3001' || 
    !apiBaseUrl ||
    apiBaseUrl.includes('localhost') ||
    apiBaseUrl.includes('demo') ||
    apiBaseUrl.includes('mock')
  )
}

/**
 * Get demo mode configuration
 * @returns {object} Demo mode configuration
 */
export const getDemoConfig = () => {
  return {
    isDemo: isDemoMode(),
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    environment: import.meta.env.MODE,
    nodeEnv: import.meta.env.NODE_ENV
  }
}

/**
 * Log demo mode status
 */
export const logDemoMode = () => {
  if (isDemoMode()) {
    console.log('🎭 Demo Mode: Application is running in demo mode')
    console.log('🎭 Demo Mode: All API calls will use mock data')
    console.log('🎭 Demo Mode: No backend connection required')
  }
}

/**
 * Create a demo mode wrapper for API calls
 * @param {Function} apiCall - The API call function
 * @param {*} mockData - The mock data to return in demo mode
 * @returns {Promise} Promise that resolves with either API data or mock data
 */
export const withDemoMode = async (apiCall, mockData) => {
  if (isDemoMode()) {
    console.log('🎭 Demo Mode: Using mock data instead of API call')
    return Promise.resolve(mockData)
  }
  
  try {
    return await apiCall()
  } catch (error) {
    console.error('API call failed, falling back to mock data:', error)
    return mockData
  }
}

/**
 * Demo mode indicator component props
 */
export const getDemoModeIndicator = () => {
  return {
    show: isDemoMode(),
    text: '🎭 DEMO MODE',
    className: 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium'
  }
}

