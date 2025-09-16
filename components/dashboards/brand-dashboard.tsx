'use client'

import { User, Notification, Campaign, CampaignApplication } from '@/types'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BrandDashboardProps {
  user: User
  notifications: Notification[]
  unreadNotifications: number
  campaigns: Campaign[]
  applications: CampaignApplication[]
  collaborators: User[]
  stats: {
    activeCampaigns: number
    totalApplications: number
    pendingReview: number
    activeCollaborations: number
    totalBudget: number
    campaignsCompleted: number
    averageROI: number
    totalReach: number
  }
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    status: string
  }>
  campaignPerformance: {
    totalImpressions: number
    totalEngagement: number
    clickThroughRate: number
    conversionRate: number
    costPerAcquisition: number
  }
}

export function BrandDashboard({
  user,
  notifications,
  unreadNotifications,
  campaigns,
  applications,
  collaborators,
  stats,
  recentActivity,
  campaignPerformance
}: BrandDashboardProps) {
  // Demo logging for development - in real app these would be used throughout the component
  console.log('Brand dashboard data:', { notifications: notifications.length, campaigns: campaigns.length, collaborators: collaborators.length, unreadNotifications })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Brand Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.profile.first_name}! Manage your campaigns and collaborations.
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingReview}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalReach.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 4).map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Application #{application.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-600">{application.message}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            application.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        <div className="space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                            Approve
                          </button>
                          <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                            Review
                          </button>
                        </div>
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
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Impressions:</span>
                    <span className="font-semibold">{campaignPerformance.totalImpressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Engagement:</span>
                    <span className="font-semibold">{campaignPerformance.totalEngagement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CTR:</span>
                    <span className="font-semibold">{campaignPerformance.clickThroughRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Conversion Rate:</span>
                    <span className="font-semibold">{campaignPerformance.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CPA:</span>
                    <span className="font-semibold">${campaignPerformance.costPerAcquisition}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>
    </div>
  )
}