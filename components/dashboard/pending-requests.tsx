'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Building2, GraduationCap, Megaphone, CheckCircle, XCircle, Eye } from 'lucide-react'

/**
 * Pending Requests Component
 * 
 * Displays a table of pending requests requiring admin approval across all platform entities.
 * Includes filters and actions for efficient request management.
 * 
 * Backend Integration Points:
 * - GET /api/admin/requests/pending - Fetch all pending requests
 * - POST /api/admin/requests/:id/approve - Approve specific request
 * - POST /api/admin/requests/:id/reject - Reject specific request
 * - GET /api/admin/requests/:id/details - Get detailed request information
 */
export function PendingRequests() {
  // TODO: Replace with real API calls
  const pendingRequests = [
    {
      id: 'REQ001',
      type: 'Brand Registration',
      requestor: 'TechFlow Solutions S.r.l.',
      requestorEmail: 'admin@techflow.it',
      date: '2024-01-15',
      priority: 'high',
      status: 'pending_review',
      description: 'Registrazione nuovo brand per campagne tech',
      icon: Building2
    },
    {
      id: 'REQ002',
      type: 'School Partnership',
      requestor: 'Università Commerciale Bocconi',
      requestorEmail: 'partnerships@unibocconi.it',
      date: '2024-01-14',
      priority: 'medium',
      status: 'pending_approval',
      description: 'Richiesta partnership istituzionale',
      icon: GraduationCap
    },
    {
      id: 'REQ003',
      type: 'Campaign Approval',
      requestor: 'EcoTech Green Solutions',
      requestorEmail: 'marketing@ecotech.it',
      date: '2024-01-14',
      priority: 'high',
      status: 'pending_review',
      description: 'Campagna "Green Future" per studenti STEM',
      icon: Megaphone
    },
    {
      id: 'REQ004',
      type: 'Brand Registration',
      requestor: 'Milano Fashion Week',
      requestorEmail: 'digital@milanofashionweek.it',
      date: '2024-01-13',
      priority: 'medium',
      status: 'under_review',
      description: 'Partnership per eventi fashion',
      icon: Building2
    },
    {
      id: 'REQ005',
      type: 'Campaign Approval',
      requestor: 'StartupItalia Accelerator',
      requestorEmail: 'hello@startupitalia.eu',
      date: '2024-01-12',
      priority: 'low',
      status: 'pending_documents',
      description: 'Campagna recruitment per giovani talenti',
      icon: Megaphone
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'text-blue-600 bg-blue-50'
      case 'pending_approval':
        return 'text-orange-600 bg-orange-50'
      case 'under_review':
        return 'text-purple-600 bg-purple-50'
      case 'pending_documents':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const handleApprove = (requestId: string) => {
    console.log(`Approving request: ${requestId}`)
    // TODO: Implement API call to approve request
  }

  const handleReject = (requestId: string) => {
    console.log(`Rejecting request: ${requestId}`)
    // TODO: Implement API call to reject request
  }

  const handleViewDetails = (requestId: string) => {
    console.log(`Viewing details for request: ${requestId}`)
    // TODO: Implement navigation to detailed view or modal
  }

  return (
    <Card className="border-2 border-zest-black shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-stencil font-bold text-zest-black">
            Richieste in Sospeso
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{pendingRequests.length} richieste</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Richiedente</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Data</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Priorità</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Stato</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request) => {
                const Icon = request.icon
                return (
                  <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-zest-black">
                          {request.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <div className="text-sm font-medium text-zest-black">
                          {request.requestor}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.requestorEmail}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-600">
                        {request.date}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(request.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleApprove(request.id)}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostra 5 di {pendingRequests.length} richieste
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Precedente
            </Button>
            <Button variant="outline" size="sm">
              Successivo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}