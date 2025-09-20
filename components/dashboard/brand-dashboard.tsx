'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CampaignCard } from './campaign-card'
import { ProjectCard } from './project-card'
import { Plus, Target, Users, FileText, BarChart3, Eye } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/supabase'
import { User } from '@/types'

type Campaign = Database['public']['Tables']['campaigns']['Row']
type Project = Database['public']['Tables']['projects']['Row']

interface BrandDashboardProps {
  user: User
}

export function BrandDashboard({ user }: BrandDashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplications: 0,
    totalProjects: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch campaigns
      const campaignResponse = await fetch(`/api/campaigns?brand_id=${user.profile.brand_id}`)
      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json()
        setCampaigns(campaignData.campaigns || [])
        
        // Calculate stats
        const activeCampaigns = campaignData.campaigns?.filter((c: Campaign) => c.status === 'active').length || 0
        setStats(prev => ({
          ...prev,
          totalCampaigns: campaignData.campaigns?.length || 0,
          activeCampaigns,
        }))
      }

      // Fetch recent projects for brand campaigns
      const projectResponse = await fetch(`/api/projects?brand_id=${user.profile.brand_id}`)
      if (projectResponse.ok) {
        const projectData = await projectResponse.json()
        setProjects(projectData.projects?.slice(0, 5) || [])
        setStats(prev => ({
          ...prev,
          totalProjects: projectData.projects?.length || 0,
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.profile.brand_id])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleApproveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error approving project:', error)
    }
  }

  const handleRejectProject = async (projectId: string, reason: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejection_reason: reason }),
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error rejecting project:', error)
    }
  }

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
                Dashboard Brand
              </h1>
              <p className="text-sm text-gray-600">
                Benvenuto, {user.profile.first_name}
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/campaigns/new">
                <Plus size={16} className="mr-2" />
                Nuova Campagna
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
                <Target size={16} className="mr-2" />
                Campagne Totali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</div>
              <p className="text-xs text-gray-600">
                {stats.activeCampaigns} attive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users size={16} className="mr-2" />
                Candidature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
              <p className="text-xs text-gray-600">Ricevute</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText size={16} className="mr-2" />
                Progetti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
              <p className="text-xs text-gray-600">Inviati</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 size={16} className="mr-2" />
                Prestazioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <p className="text-xs text-gray-600">Tasso di successo</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Le Mie Campagne</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/campaigns">
                  <Eye size={14} className="mr-1" />
                  Vedi Tutte
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {campaigns.slice(0, 3).map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  currentUserRole={user.role}
                  showActions={false}
                />
              ))}
              {campaigns.length === 0 && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Target size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Nessuna campagna ancora
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Crea la tua prima campagna per iniziare
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/campaigns/new">
                        Crea Campagna
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Progetti Recenti</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/projects">
                  <Eye size={14} className="mr-1" />
                  Vedi Tutti
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserRole={user.role}
                  onApprove={handleApproveProject}
                  onReject={handleRejectProject}
                />
              ))}
              {projects.length === 0 && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Nessun progetto ancora
                    </h4>
                    <p className="text-gray-600">
                      I progetti inviati appariranno qui
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}