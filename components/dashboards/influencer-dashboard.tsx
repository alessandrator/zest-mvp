'use client'

import { User, Material, Notification, Campaign, CampaignApplication } from '@/types'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InfluencerDashboardProps {
  user: User
  materials: Material[]
  notifications: Notification[]
  unreadNotifications: number
  campaigns: Campaign[]
  applications: CampaignApplication[]
  stats: {
    portfolioItems: number
    activeCampaigns: number
    pendingApplications: number
    completedCampaigns: number
    totalEarnings: number
    averageRating: number
    totalFollowers: number
    engagementRate: number
  }
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    status: string
  }>
}

export function InfluencerDashboard({
  user,
  materials,
  notifications,
  unreadNotifications,
  campaigns,
  applications,
  stats,
  recentActivity
}: InfluencerDashboardProps) {
  // Demo logging for development - in real app these would be used throughout the component  
  console.log('Influencer dashboard data:', { materials: materials.length, notifications: notifications.length, unreadNotifications })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Influencer Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.profile.first_name}! Manage your campaigns and grow your influence.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.activeCampaigns}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">${stats.totalEarnings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalFollowers.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.engagementRate}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm font-medium">${campaign.budget_min} - ${campaign.budget_max}</span>
                        <button className="px-4 py-2 bg-primary text-white rounded">Apply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="border-l-4 border-blue-500 pl-3">
                      <p className="text-sm font-medium">{application.status}</p>
                      <p className="text-xs text-gray-600">Campaign ID: {application.campaign_id}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}