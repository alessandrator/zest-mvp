'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CampaignCard } from './campaign-card'
import { ProjectCard } from './project-card'
import { Plus, Target, CheckCircle, FileText, Star, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Database } from '@/types/supabase'
import { User } from '@/types'

type Campaign = Database['public']['Tables']['campaigns']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type CampaignAcceptance = Database['public']['Tables']['campaign_acceptances']['Row']

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([])
  const [acceptedCampaigns, setAcceptedCampaigns] = useState<CampaignAcceptance[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    acceptedCampaigns: 0,
    submittedProjects: 0,
    approvedProjects: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch available campaigns (public and active)
      const campaignResponse = await fetch('/api/campaigns?status=active&public=true')
      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json()
        setAvailableCampaigns(campaignData.campaigns || [])
      }

      // Fetch accepted campaigns
      const acceptanceResponse = await fetch(`/api/campaign-acceptances?user_id=${user.id}`)
      if (acceptanceResponse.ok) {
        const acceptanceData = await acceptanceResponse.json()
        setAcceptedCampaigns(acceptanceData.acceptances || [])
        setStats(prev => ({
          ...prev,
          acceptedCampaigns: acceptanceData.acceptances?.length || 0,
        }))
      }

      // Fetch my projects
      const projectResponse = await fetch(`/api/projects?user_id=${user.id}`)
      if (projectResponse.ok) {
        const projectData = await projectResponse.json()
        setMyProjects(projectData.projects || [])
        
        const submittedProjects = projectData.projects?.filter((p: Project) => p.status !== 'draft').length || 0
        const approvedProjects = projectData.projects?.filter((p: Project) => p.status === 'approved').length || 0
        
        setStats(prev => ({
          ...prev,
          submittedProjects,
          approvedProjects,
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleAcceptCampaign = async (campaignId: string) => {
    try {
      const response = await fetch('/api/campaign-acceptances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_id: campaignId }),
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
      } else {
        const error = await response.json()
        alert(error.error || 'Errore durante l\'accettazione della campagna')
      }
    } catch (error) {
      console.error('Error accepting campaign:', error)
      alert('Errore durante l\'accettazione della campagna')
    }
  }

  const handleVote = async (projectId: string, value: number) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, value }),
      })

      if (response.ok) {
        alert('Voto inviato con successo!')
      } else {
        const error = await response.json()
        alert(error.error || 'Errore durante il voto')
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Errore durante il voto')
    }
  }

  const filteredCampaigns = availableCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const acceptedCampaignIds = acceptedCampaigns.map((acc) => acc.campaign_id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard {user.role === 'student' ? 'Studente' : 'Creator'}
              </h1>
              <p className="text-sm text-gray-600">
                Benvenuto, {user.profile.first_name}
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus size={16} className="mr-2" />
                Nuovo Progetto
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CheckCircle size={16} className="mr-2" />
                Campagne Accettate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.acceptedCampaigns}</div>
              <p className="text-xs text-gray-600">Partecipazioni attive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText size={16} className="mr-2" />
                Progetti Inviati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.submittedProjects}</div>
              <p className="text-xs text-gray-600">Totali</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target size={16} className="mr-2" />
                Progetti Approvati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.approvedProjects}</div>
              <p className="text-xs text-gray-600">Successi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Star size={16} className="mr-2" />
                Valutazione Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-gray-600">Su 5 stelle</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Campaigns */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Campagne Disponibili</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cerca campagne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                currentUserRole={user.role}
                hasAccepted={acceptedCampaignIds.includes(campaign.id)}
                onAccept={handleAcceptCampaign}
              />
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <Target size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Nessuna campagna trovata
                </h4>
                <p className="text-gray-600">
                  {searchTerm ? 'Prova con un termine di ricerca diverso' : 'Non ci sono campagne disponibili al momento'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* My Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">I Miei Progetti</h3>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects">
                Vedi Tutti
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {myProjects.slice(0, 4).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                currentUserRole={user.role}
                onVote={handleVote}
              />
            ))}
          </div>

          {myProjects.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun progetto ancora
                </h4>
                <p className="text-gray-600 mb-4">
                  Accetta una campagna e crea il tuo primo progetto
                </p>
                <Button asChild>
                  <Link href="/dashboard/projects/new">
                    Crea Progetto
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}