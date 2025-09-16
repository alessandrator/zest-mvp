import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { materialsService } from '@/lib/services/materials'
import { notificationsService } from '@/lib/services/notifications'
import { demoData } from '@/lib/services/demo-data'
import { InfluencerDashboard } from '@/components/dashboards/influencer-dashboard'

/**
 * Influencer Dashboard Page
 * 
 * Features:
 * - Browse and apply to brand campaigns
 * - Upload portfolio materials and content
 * - Track campaign performance and earnings
 * - Collaborate with brands and receive feedback
 * 
 * Integration Notes:
 * - Replace demo service calls with real API calls
 * - Add campaign matching algorithm based on influencer profile
 * - Implement content analytics and performance tracking
 * - Add direct messaging system with brands
 */

export default async function InfluencerDashboardPage() {
  try {
    // Ensure user is authenticated and is an influencer
    const user = await requireRole('influencer')

    // Fetch influencer's materials/portfolio
    const materialsResponse = await materialsService.getMaterials(user, {
      page: 1,
      limit: 10,
      status: null,
      studentId: null,
      schoolId: null
    })

    // Fetch notifications
    const notificationsResponse = await notificationsService.getNotifications(user, {
      page: 1,
      limit: 5,
      read: false,
      type: null
    })

    const unreadCount = await notificationsService.getUnreadCount(user)

    // Get available campaigns (from demo data)
    const availableCampaigns = demoData.campaigns || []
    
    // Get influencer's applications (from demo data)
    const userApplications = demoData.campaignApplications?.filter(
      app => app.user_id === user.id
    ) || []

    // Calculate statistics
    const portfolioItems = materialsResponse.data.length
    const activeCampaigns = userApplications.filter(app => app.status === 'approved').length
    const pendingApplications = userApplications.filter(app => app.status === 'pending').length
    const completedCampaigns = userApplications.filter(app => app.status === 'completed').length

    const dashboardData = {
      user,
      materials: materialsResponse.data,
      materialsPagination: materialsResponse.pagination,
      notifications: notificationsResponse.data,
      unreadNotifications: unreadCount,
      campaigns: availableCampaigns.slice(0, 6), // Latest 6 campaigns
      applications: userApplications.slice(0, 5), // Recent 5 applications
      stats: {
        portfolioItems,
        activeCampaigns,
        pendingApplications,
        completedCampaigns,
        totalEarnings: completedCampaigns * 250, // Demo calculation
        averageRating: 4.7, // Demo rating
        totalFollowers: 50000, // Demo followers
        engagementRate: 3.2 // Demo engagement rate
      },
      recentActivity: [
        {
          id: '1',
          type: 'application',
          title: 'Applied to TechFlow Campaign',
          description: 'Your application is under review',
          timestamp: '2024-02-05T10:00:00Z',
          status: 'pending'
        },
        {
          id: '2',
          type: 'campaign',
          title: 'EcoLife Campaign Completed',
          description: 'Campaign completed successfully',
          timestamp: '2024-02-03T15:30:00Z',
          status: 'completed'
        },
        {
          id: '3',
          type: 'portfolio',
          title: 'Portfolio Updated',
          description: 'Added new content to your portfolio',
          timestamp: '2024-02-01T12:00:00Z',
          status: 'updated'
        }
      ]
    }

    return <InfluencerDashboard {...dashboardData} />

  } catch (error) {
    console.error('Influencer dashboard error:', error)
    redirect('/dashboard')
  }
}