import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, User, Building2, FileText, CheckCircle, XCircle } from 'lucide-react'

/**
 * Audit Log Component
 * 
 * Displays a timeline of recent administrative actions and system events.
 * Provides visibility into platform activity for monitoring and compliance.
 * 
 * Backend Integration Points:
 * - GET /api/admin/audit-log - Fetch recent audit log entries
 * - WebSocket connection for real-time log updates
 * - Pagination for historical entries
 */
export function AuditLog() {
  // TODO: Replace with real API calls and real-time updates
  const auditEntries = [
    {
      id: 1,
      action: 'Brand Approval',
      description: 'Approved registration for "TechFlow Solutions"',
      user: 'Super Admin',
      timestamp: '2 minutes ago',
      type: 'approval',
      icon: Building2,
      status: 'success'
    },
    {
      id: 2,
      action: 'Campaign Review',
      description: 'Reviewed campaign "Summer App Launch" by EcoTech',
      user: 'Super Admin',
      timestamp: '15 minutes ago',
      type: 'review',
      icon: FileText,
      status: 'pending'
    },
    {
      id: 3,
      action: 'User Registration',
      description: 'New school admin registered: Milano University',
      user: 'System',
      timestamp: '1 hour ago',
      type: 'registration',
      icon: User,
      status: 'info'
    },
    {
      id: 4,
      action: 'Payment Processed',
      description: 'Influencer payout completed: €250.00',
      user: 'System',
      timestamp: '2 hours ago',
      type: 'payment',
      icon: CheckCircle,
      status: 'success'
    },
    {
      id: 5,
      action: 'Security Alert',
      description: 'Multiple failed login attempts detected',
      user: 'Security System',
      timestamp: '3 hours ago',
      type: 'security',
      icon: XCircle,
      status: 'warning'
    },
    {
      id: 6,
      action: 'Data Export',
      description: 'Monthly report generated for Q4 analytics',
      user: 'Super Admin',
      timestamp: '5 hours ago',
      type: 'export',
      icon: Activity,
      status: 'success'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-orange-600 bg-orange-50'
      case 'pending':
        return 'text-blue-600 bg-blue-50'
      case 'info':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'approval':
        return 'text-green-600'
      case 'review':
        return 'text-blue-600'
      case 'registration':
        return 'text-indigo-600'
      case 'payment':
        return 'text-emerald-600'
      case 'security':
        return 'text-red-600'
      case 'export':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="border-2 border-zest-black shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-stencil font-bold text-zest-black">
            Audit Log
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>Live Activity</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {auditEntries.map((entry, index) => {
            const Icon = entry.icon
            return (
              <div key={entry.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${getStatusColor(entry.status)}`}>
                    <Icon className={`w-4 h-4 ${getActionTypeColor(entry.type)}`} />
                  </div>
                  {index < auditEntries.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zest-black">
                      {entry.action}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {entry.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      by {entry.user}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* View More Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View Complete Audit Log →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}