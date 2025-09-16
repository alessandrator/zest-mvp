'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, GraduationCap, Megaphone, Shield, CheckCircle } from 'lucide-react'

/**
 * Quick Actions Component
 * 
 * Provides rapid access to common superadmin approval and management tasks.
 * Features prominent action buttons for brand approval, school approval, campaign approval, and anonymization toggle.
 * 
 * Backend Integration Points:
 * - POST /api/admin/brands/approve - Approve new brand applications
 * - POST /api/admin/schools/approve - Approve new school registrations
 * - POST /api/admin/campaigns/approve - Approve pending campaigns
 * - POST /api/admin/anonymization/toggle - Toggle platform-wide anonymization settings
 */
export function QuickActions() {
  // TODO: Replace with real API calls
  const handleBrandApproval = () => {
    console.log('Navigate to brand approval workflow')
    // Implementation: Navigate to brand approval page or trigger approval modal
  }

  const handleSchoolApproval = () => {
    console.log('Navigate to school approval workflow')
    // Implementation: Navigate to school approval page or trigger approval modal
  }

  const handleCampaignApproval = () => {
    console.log('Navigate to campaign approval workflow')
    // Implementation: Navigate to campaign approval page or trigger approval modal
  }

  const handleAnonymizationToggle = () => {
    console.log('Toggle anonymization settings')
    // Implementation: Toggle anonymization and show confirmation
  }

  const actions = [
    {
      title: 'Approva Nuovo Brand',
      description: 'Revisiona e approva richieste di registrazione brand',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      onClick: handleBrandApproval,
      pendingCount: 3
    },
    {
      title: 'Approva Nuova Scuola',
      description: 'Verifica e approva registrazioni istituti scolastici',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      onClick: handleSchoolApproval,
      pendingCount: 2
    },
    {
      title: 'Approva Campagna',
      description: 'Valuta e approva nuove campagne marketing',
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      onClick: handleCampaignApproval,
      pendingCount: 7
    },
    {
      title: 'Toggle Anonimizzazione',
      description: 'Gestisci impostazioni privacy e anonimizzazione',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      onClick: handleAnonymizationToggle,
      pendingCount: null
    }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-stencil font-bold text-zest-black">
          Azioni Rapide
        </h2>
        <div className="text-sm text-gray-600">
          Gestione centralizzata delle approvazioni
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card key={index} className="border-2 border-zest-black shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${action.bgColor}`}>
                    <Icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  {action.pendingCount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {action.pendingCount}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-zest-black">
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <Button 
                  onClick={action.onClick}
                  className={`w-full ${action.bgColor} ${action.hoverColor} ${action.color} border-2 border-current font-medium transition-all duration-200`}
                  variant="outline"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Gestisci
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}