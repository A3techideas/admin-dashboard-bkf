/**
 * PCI DSS Compliance Utilities
 * 
 * These utilities ensure that sensitive cardholder data is never displayed
 * in the admin dashboard, in compliance with PCI DSS requirements.
 */

/**
 * Masks a card number, showing only the last 4 digits
 * @param {string} cardNumber - The card number to mask
 * @returns {string} - Masked card number (e.g., "**** **** **** 1234")
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return 'N/A'
  
  // If already masked or only last 4 digits
  if (cardNumber.length <= 4) {
    return `**** **** **** ${cardNumber}`
  }
  
  // If full number (should never happen in production)
  const last4 = cardNumber.slice(-4)
  return `**** **** **** ${last4}`
}

/**
 * Masks bank account number, showing only the last 4 digits
 * @param {string} accountNumber - The account number to mask
 * @returns {string} - Masked account number
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return 'N/A'
  
  if (accountNumber.length <= 4) {
    return `****${accountNumber}`
  }
  
  const last4 = accountNumber.slice(-4)
  return `****${last4}`
}

/**
 * Masks email address for privacy
 * @param {string} email - The email to mask
 * @returns {string} - Masked email
 */
export const maskEmail = (email) => {
  if (!email) return 'N/A'
  
  const [username, domain] = email.split('@')
  if (!domain) return email
  
  const maskedUsername = username.length > 2 
    ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
    : username[0] + '*'
  
  return `${maskedUsername}@${domain}`
}

/**
 * Masks phone number, showing only last 4 digits
 * @param {string} phone - The phone number to mask
 * @returns {string} - Masked phone number
 */
export const maskPhone = (phone) => {
  if (!phone) return 'N/A'
  
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 4) {
    return `***-***-${digits}`
  }
  
  const last4 = digits.slice(-4)
  return `***-***-${last4}`
}

/**
 * Formats currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Sanitizes data object to remove sensitive fields
 * @param {object} data - The data object to sanitize
 * @returns {object} - Sanitized data object
 */
export const sanitizeData = (data) => {
  if (!data) return {}
  
  const sensitiveFields = [
    'cardNumber',
    'cvv',
    'cvc',
    'pin',
    'password',
    'accessToken',
    'refreshToken',
    'privateKey',
    'secret',
    'ssn',
    'routingNumber'
  ]
  
  const sanitized = { ...data }
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      delete sanitized[field]
    }
  })
  
  // Mask card-related fields
  if (sanitized.last4) {
    sanitized.displayNumber = maskCardNumber(sanitized.last4)
  }
  
  if (sanitized.lastFourDigits) {
    sanitized.displayNumber = maskAccountNumber(sanitized.lastFourDigits)
  }
  
  return sanitized
}

/**
 * Validates if user has admin privileges
 * @param {object} user - User object
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  if (!user) return false
  
  return user.role === 'admin' || 
         user.groups?.includes('admin') ||
         user.attributes?.['custom:role'] === 'admin'
}

/**
 * Creates audit log entry for admin actions
 * @param {string} action - Action performed
 * @param {object} details - Additional details
 * @returns {object} - Audit log entry
 */
export const createAuditLog = (action, details = {}) => {
  return {
    action,
    timestamp: new Date().toISOString(),
    details: sanitizeData(details),
    source: 'admin-dashboard'
  }
}

/**
 * Redacts sensitive information from strings
 * @param {string} text - Text to redact
 * @returns {string} - Redacted text
 */
export const redactSensitiveInfo = (text) => {
  if (!text) return ''
  
  // Redact card numbers
  text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '**** **** **** ****')
  
  // Redact SSN
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****')
  
  // Redact CVV
  text = text.replace(/\b(cvv|cvc|security code):\s*\d{3,4}\b/gi, '$1: ***')
  
  return text
}


