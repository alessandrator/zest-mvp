'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectCard } from './project-card'
import { CheckCircle, Clock, Target, Users, AlertTriangle } from 'lucide-react'
import { User } from '@/types'
import { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type MarketTest = Database['public']['Tables']['market_tests']['Row']

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([])
  const [pendingMarketTests, setPendingMarketTests] = useState<MarketTest[]>([])
  const [stats, setStats] = useState({
    pendingProjects: 0,
    pendingMarketTests: 0,
    totalUsers: 0,
    activeCampaigns: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch pending projects
      const projectResponse = await fetch('/api/projects?status=submitted')
      if (projectResponse.ok) {
        const projectData = await projectResponse.json()
        setPendingProjects(projectData.projects || [])
        setStats(prev => ({
          ...prev,
          pendingProjects: projectData.projects?.length || 0,
        }))
      }

      // Fetch pending market tests
      const marketTestResponse = await fetch('/api/market-tests?status=draft')
      if (marketTestResponse.ok) {
        const marketTestData = await marketTestResponse.json()
        setPendingMarketTests(marketTestData.marketTests || [])
        setStats(prev => ({
          ...prev,
          pendingMarketTests: marketTestData.marketTests?.length || 0,
        }))
      }

      // Fetch general stats
      const campaignResponse = await fetch('/api/campaigns?status=active')
      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json()
        setStats(prev => ({
          ...prev,
          activeCampaigns: campaignData.campaigns?.length || 0,
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

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

  const handleApproveMarketTest = async (marketTestId: string) => {
    try {
      const response = await fetch(`/api/market-tests/${marketTestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error approving market test:', error)
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
                Dashboard Super Admin
              </h1>
              <p className="text-sm text-gray-600">
                Benvenuto, {user.profile.first_name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock size={16} className="mr-2" />
                Progetti in Attesa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingProjects}</div>
              <p className="text-xs text-gray-600">Da approvare</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Test di Mercato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pendingMarketTests}</div>
              <p className="text-xs text-gray-600">Da approvare</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target size={16} className="mr-2" />
                Campagne Attive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div>
              <p className="text-xs text-gray-600">In corso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users size={16} className="mr-2" />
                Utenti Totali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-xs text-gray-600">Registrati</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock size={20} />
                Progetti da Approvare
              </h3>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {stats.pendingProjects}
              </Badge>
            </div>
            <div className="space-y-4">
              {pendingProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserRole={user.role}
                  onApprove={handleApproveProject}
                  onReject={handleRejectProject}
                />
              ))}
              {pendingProjects.length === 0 && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Tutto aggiornato!
                    </h4>
                    <p className="text-gray-600">
                      Non ci sono progetti in attesa di approvazione
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Pending Market Tests */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={20} />
                Test di Mercato da Approvare
              </h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {stats.pendingMarketTests}
              </Badge>
            </div>
            <div className="space-y-4">
              {pendingMarketTests.map((marketTest) => (
                <Card key={marketTest.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {marketTest.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {marketTest.description?.substring(0, 100)}...
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">
                        Bozza
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveMarketTest(marketTest.id)}
                      >
                        Approva
                      </Button>
                      <Button size="sm" variant="outline">
                        Visualizza
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingMarketTests.length === 0 && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Tutto aggiornato!
                    </h4>
                    <p className="text-gray-600">
                      Non ci sono test di mercato in attesa di approvazione
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