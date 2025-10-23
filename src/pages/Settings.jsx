import { useState } from 'react'
import { Shield, Bell, Lock, Database, AlertCircle } from 'lucide-react'

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('15')

  const handleSaveSettings = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6 w-full">
      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-client-text">Security Settings</h3>
          </div>
        </div>
        <div className="p-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-client-text mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-client-text"
              />
              <p className="text-xs text-client-text-muted mt-1">
                Automatically log out after this period of inactivity
              </p>
            </div>
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Two-Factor Authentication</p>
                <p className="text-xs text-client-text-muted">Require 2FA for all admin logins</p>
              </div>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-client-text">Notification Settings</h3>
          </div>
        </div>
        <div className="p-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Email Notifications</p>
                <p className="text-xs text-client-text-muted">Receive email alerts for important events</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Security Alerts</p>
                <p className="text-xs text-client-text-muted">Get notified of suspicious activities</p>
              </div>
              <button
                onClick={() => setSecurityAlerts(!securityAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securityAlerts ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securityAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PCI DSS Compliance */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-client-text">PCI DSS Compliance</h3>
          </div>
        </div>
        <div className="p-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Card Number Masking</p>
                <p className="text-xs text-client-text-muted">Always mask sensitive card information</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Enabled
              </span>
            </div>
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Audit Logging</p>
                <p className="text-xs text-client-text-muted">Log all admin actions automatically</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Data Encryption</p>
                <p className="text-xs text-client-text-muted">Encrypt sensitive data at rest and in transit</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-client-text">Data Management</h3>
          </div>
        </div>
        <div className="p-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Export Data</p>
                <p className="text-xs text-client-text-muted">Export analytics and reports</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-client-text rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Export
              </button>
            </div>
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <p className="text-sm font-medium text-client-text">Data Retention</p>
                <p className="text-xs text-client-text-muted">Configure data retention policies</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-client-text rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Save Settings
        </button>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> Changing security settings may affect system access. 
            Ensure you understand the implications before making changes.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings


