import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, GraduationCap, Clock, TrendingUp, Users } from 'lucide-react'

/**
 * Dashboard Overview Component
 * 
 * Displays key platform metrics in card format for superadmin dashboard.
 * Shows totals for active brands, schools, pending campaigns, monthly votes, and top influencers.
 * 
 * Backend Integration Points:
 * - GET /api/admin/metrics/brands/active - Total active brands count
 * - GET /api/admin/metrics/schools/active - Total active schools count  
 * - GET /api/admin/metrics/campaigns/pending - Campaigns awaiting approval count
 * - GET /api/admin/metrics/votes/monthly - Total votes for current month
 * - GET /api/admin/metrics/influencers/monthly - Lead influencer data for current month
 */
export function DashboardOverview() {
  // TODO: Replace with real API calls
  const metrics = {
    activeBrands: 42,
    activeSchools: 28,
    pendingCampaigns: 7,
    monthlyVotes: 1547,
    leadInfluencers: 15
  }

  const cards = [
    {
      title: 'Totale Brand Attivi',
      value: metrics.activeBrands,
      description: 'Brand verificati e attivi',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Totale Scuole Attive',
      value: metrics.activeSchools,
      description: 'Istituti scolastici registrati',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Campagne in Attesa',
      value: metrics.pendingCampaigns,
      description: 'Richieste di approvazione',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Voti Totali Mese',
      value: metrics.monthlyVotes.toLocaleString(),
      description: 'Interazioni questo mese',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Lead Influencer Mese',
      value: metrics.leadInfluencers,
      description: 'Top performer del mese',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="border-2 border-zest-black shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-stencil font-bold text-zest-black mb-1">
                {card.value}
              </div>
              <p className="text-sm text-gray-600">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}