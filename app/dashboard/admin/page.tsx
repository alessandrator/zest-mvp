import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { materialsService } from '@/lib/services/materials'
import { permissionsService } from '@/lib/services/permissions'
import { notificationsService } from '@/lib/services/notifications'
import { demoData } from '@/lib/services/demo-data'
import { SuperAdminDashboard } from '@/components/dashboards/super-admin-dashboard'

/**
 * Super Admin Dashboard Page
 * 
 * Features:
 * - Approve materials for public visibility
 * - Manage all users and permissions across schools
 * - Monitor system-wide statistics and activity
 * - Configure global settings and policies
 * 
 * Integration Notes:
 * - Replace demo service calls with real API calls
 * - Add system monitoring and health checks
 * - Implement advanced analytics and reporting
 * - Add bulk operations for system management
 */

export default async function SuperAdminDashboardPage() {
  try {
    // Ensure user is authenticated and is a super admin
    const user = await requireRole('super_admin')

    // Fetch all materials for approval
    const materialsResponse = await materialsService.getMaterials(user, {
      page: 1,
      limit: 15,
      status: null,
      studentId: null,
      schoolId: null
    })

    // Fetch all permissions
    const permissionsResponse = await permissionsService.getPermissions(user, {
      page: 1,
      limit: 50,
      userId: null,
      schoolId: null,
      role: null
    })

    // Fetch notifications
    const notificationsResponse = await notificationsService.getNotifications(user, {
      page: 1,
      limit: 10,
      read: false,
      type: null
    })

    const unreadCount = await notificationsService.getUnreadCount(user)

    // Get system statistics
    const allUsers = demoData.users
    const allSchools = demoData.schools
    const allMaterials = demoData.materials

    const pendingApproval = materialsResponse.data.filter(m => 
      m.status === 'approved' && m.visibility !== 'public'
    ).length

    const recentUploads = materialsResponse.data.filter(m => 
      new Date(m.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    const blockedUsers = permissionsResponse.data.filter(p => p.is_blocked).length

    const dashboardData = {
      user,
      materials: materialsResponse.data,
      materialsPagination: materialsResponse.pagination,
      permissions: permissionsResponse.data,
      notifications: notificationsResponse.data,
      unreadNotifications: unreadCount,
      systemStats: {
        totalUsers: allUsers.length,
        totalSchools: allSchools.length,
        totalMaterials: allMaterials.length,
        pendingApproval,
        recentUploads,
        blockedUsers,
        activeSchools: allSchools.filter(s => s.active).length,
        verifiedUsers: allUsers.filter(u => u.profile.verified).length
      },
      usersByRole: {
        students: allUsers.filter(u => u.role === 'student').length,
        school_admins: allUsers.filter(u => u.role === 'school_admin').length,
        influencers: allUsers.filter(u => u.role === 'influencer').length,
        brands: allUsers.filter(u => u.role === 'brand').length,
        consumers: allUsers.filter(u => u.role === 'consumer').length
      },
      materialsByStatus: {
        draft: allMaterials.filter(m => m.status === 'draft').length,
        submitted: allMaterials.filter(m => m.status === 'submitted').length,
        under_review: allMaterials.filter(m => m.status === 'under_review').length,
        approved: allMaterials.filter(m => m.status === 'approved').length,
        rejected: allMaterials.filter(m => m.status === 'rejected').length,
        requires_changes: allMaterials.filter(m => m.status === 'requires_changes').length
      }
    }

    return <SuperAdminDashboard {...dashboardData} />

  } catch (error) {
    console.error('Super admin dashboard error:', error)
    redirect('/dashboard')
  }
}