import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { notificationsService } from '@/lib/services/notifications'
import { demoData } from '@/lib/services/demo-data'
import { BrandDashboard } from '@/components/dashboards/brand-dashboard'

/**
 * Brand Dashboard Page
 * 
 * Features:
 * - Create and manage brand campaigns
 * - Browse and recruit influencers and students
 * - Review applications and select collaborators
 * - Monitor campaign performance and ROI
 * 
 * Integration Notes:
 * - Replace demo service calls with real API calls
 * - Add campaign analytics and performance tracking
 * - Implement influencer discovery and matching algorithm
 * - Add budget management and payment processing
 */

export default async function BrandDashboardPage() {
  try {
    // Ensure user is authenticated and is a brand
    const user = await requireRole('brand')

    // Fetch notifications
    const notificationsResponse = await notificationsService.getNotifications(user, {
      page: 1,
      limit: 5,
      read: false,
      type: null
    })

    const unreadCount = await notificationsService.getUnreadCount(user)

    // Get brand's campaigns (from demo data)
    const brandCampaigns = demoData.campaigns?.filter(
      campaign => campaign.brand_id === user.profile.company
    ) || []

    // Get applications for brand's campaigns
    const campaignIds = brandCampaigns.map(c => c.id)
    const applications = demoData.campaignApplications?.filter(
      app => campaignIds.includes(app.campaign_id)
    ) || []

    // Get potential collaborators (students and influencers)
    const potentialCollaborators = demoData.users.filter(
      u => u.role === 'student' || u.role === 'influencer'
    )

    // Calculate statistics
    const activeCampaigns = brandCampaigns.filter(c => c.status === 'active').length
    const totalApplications = applications.length
    const pendingReview = applications.filter(app => app.status === 'pending').length
    const activeCollaborations = applications.filter(app => app.status === 'approved').length

    const dashboardData = {
      user,
      notifications: notificationsResponse.data,
      unreadNotifications: unreadCount,
      campaigns: brandCampaigns.slice(0, 6), // Latest 6 campaigns
      applications: applications.slice(0, 8), // Recent 8 applications
      collaborators: potentialCollaborators.slice(0, 6), // Featured collaborators
      stats: {
        activeCampaigns,
        totalApplications,
        pendingReview,
        activeCollaborations,
        totalBudget: brandCampaigns.reduce((sum, c) => sum + (c.budget_max || 0), 0),
        campaignsCompleted: brandCampaigns.filter(c => c.status === 'completed').length,
        averageROI: 3.2, // Demo ROI
        totalReach: 250000 // Demo reach
      },
      recentActivity: [
        {
          id: '1',
          type: 'application',
          title: 'New Application Received',
          description: 'Lucia Ferrari applied to your EcoLife campaign',
          timestamp: '2024-02-05T14:30:00Z',
          status: 'new'
        },
        {
          id: '2',
          type: 'campaign',
          title: 'TechFlow Campaign Launched',
          description: 'Your campaign is now live and accepting applications',
          timestamp: '2024-02-04T09:00:00Z',
          status: 'active'
        },
        {
          id: '3',
          type: 'collaboration',
          title: 'Content Delivered',
          description: 'Marco Verdi submitted campaign deliverables',
          timestamp: '2024-02-03T16:45:00Z',
          status: 'completed'
        }
      ],
      campaignPerformance: {
        totalImpressions: 1250000,
        totalEngagement: 45000,
        clickThroughRate: 2.8,
        conversionRate: 1.2,
        costPerAcquisition: 15.50
      }
    }

    return <BrandDashboard {...dashboardData} />

  } catch (error) {
    console.error('Brand dashboard error:', error)
    redirect('/dashboard')
  }
}