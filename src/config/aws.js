export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-west-1',
  cognito: {
    userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || 'us-west-1_DSzdhSGBI',
    userPoolClientId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_CLIENT_ID || '7vfnnrecbdandieqk13mep6mst',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://hglmst0fsi.execute-api.us-west-1.amazonaws.com',
  }
}

export const adminConfig = {
  role: import.meta.env.VITE_ADMIN_ROLE || 'admin',
  // PCI DSS Compliance settings
  pciCompliance: {
    maskCardNumbers: true,
    showOnlyLast4: true,
    auditAllActions: true,
    sessionTimeout: 15 * 60 * 1000, // 15 minutes
    requireStrongAuth: true
  }
}


