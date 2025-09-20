'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Users, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/supabase'

type Campaign = Database['public']['Tables']['campaigns']['Row'] & {
  brands?: { name: string }
  _count?: {
    campaign_applications: number
    campaign_acceptances: number
    projects: number
  }
}

interface CampaignCardProps {
  campaign: Campaign
  currentUserRole?: string
  showActions?: boolean
  hasAccepted?: boolean
  hasApplied?: boolean
  onAccept?: (campaignId: string) => void
  onApply?: (campaignId: string) => void
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels = {
  draft: 'Bozza',
  active: 'Attiva',
  paused: 'In pausa',
  completed: 'Completata',
  cancelled: 'Annullata',
}

export function CampaignCard({ 
  campaign, 
  currentUserRole, 
  showActions = true,
  hasAccepted = false,
  hasApplied = false,
  onAccept,
  onApply
}: CampaignCardProps) {
  const canAccept = campaign.status === 'active' && 
                   campaign.public && 
                   ['student', 'influencer'].includes(currentUserRole || '') &&
                   !hasAccepted && !hasApplied
                   
  const canApply = campaign.status === 'active' && 
                  campaign.public && 
                  ['student', 'influencer'].includes(currentUserRole || '') &&
                  !hasApplied

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {campaign.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Brand: {campaign.brands?.name || 'N/A'}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className={`${statusColors[campaign.status as keyof typeof statusColors]} border-0`}>
              {statusLabels[campaign.status as keyof typeof statusLabels]}
            </Badge>
            {campaign.public && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                Pubblica
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Campaign details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {campaign.budget_min && campaign.budget_max && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={14} />
              <span>€{campaign.budget_min} - €{campaign.budget_max}</span>
            </div>
          )}
          
          {campaign.deadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{new Date(campaign.deadline).toLocaleDateString('it-IT')}</span>
            </div>
          )}

          {campaign._count && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={14} />
                <span>{campaign._count.campaign_acceptances || 0} partecipanti</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} />
                <span>{campaign._count.projects || 0} progetti</span>
              </div>
            </>
          )}
        </div>

        {/* Target audience and requirements */}
        {campaign.target_audience && campaign.target_audience.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Target:</p>
            <div className="flex flex-wrap gap-1">
              {campaign.target_audience.map((audience, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {campaign.requirements && campaign.requirements.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Requisiti:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {campaign.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="truncate">{req}</li>
              ))}
              {campaign.requirements.length > 3 && (
                <li className="text-gray-500">+{campaign.requirements.length - 3} altri</li>
              )}
            </ul>
          </div>
        )}

        {/* Status indicators */}
        {hasAccepted && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm text-green-700 font-medium">Hai accettato questa campagna</span>
          </div>
        )}

        {hasApplied && !hasAccepted && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Candidatura inviata</span>
          </div>
        )}

        {/* Dates */}
        <div className="text-xs text-gray-500 mb-4">
          <p>Creata: {new Date(campaign.created_at).toLocaleDateString('it-IT')}</p>
          <p>Aggiornata: {new Date(campaign.updated_at).toLocaleDateString('it-IT')}</p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/campaigns/${campaign.id}`}>
                <Eye size={14} className="mr-1" />
                Visualizza
              </Link>
            </Button>

            {canAccept && onAccept && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onAccept(campaign.id)}
              >
                <CheckCircle size={14} className="mr-1" />
                Accetta
              </Button>
            )}

            {canApply && onApply && !hasAccepted && (
              <Button 
                size="sm"
                onClick={() => onApply(campaign.id)}
              >
                Candidati
              </Button>
            )}

            {campaign.brief_url && (
              <Button size="sm" variant="outline" asChild>
                <a href={campaign.brief_url} target="_blank" rel="noopener noreferrer">
                  Brief
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}