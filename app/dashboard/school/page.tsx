import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { materialsService } from '@/lib/services/materials'
import { correctionsService } from '@/lib/services/corrections'
import { permissionsService } from '@/lib/services/permissions'
import { notificationsService } from '@/lib/services/notifications'
import { SchoolDashboard } from '@/components/dashboards/school-dashboard'

/**
 * School Admin Dashboard Page
 * 
 * Features:
 * - Review student materials from their school
 * - Add corrections and feedback
 * - Manage student permissions (block/authorize)
 * - Monitor school performance and statistics
 * 
 * Integration Notes:
 * - Replace demo service calls with real API calls
 * - Add bulk operations for managing multiple materials
 * - Implement advanced filtering and search
 * - Add analytics and reporting features
 */

export default async function SchoolDashboardPage() {
  try {
    // Ensure user is authenticated and is a school admin
    const user = await requireRole('school_admin')

    // Fetch materials from the school for review
    const materialsResponse = await materialsService.getMaterials(user, {
      page: 1,
      limit: 10,
      status: null,
      studentId: null,
      schoolId: user.profile.school_id || undefined
    })

    // Fetch recent corrections made by this admin
    const correctionsResponse = await correctionsService.getCorrections(user, {
      page: 1,
      limit: 10,
      materialId: null,
      studentId: null,
      schoolId: user.profile.school_id || undefined,
      status: null
    })

    // Fetch users that can be managed (school students)
    const manageableUsers = await permissionsService.getManageableUsers(user)

    // Fetch permissions for school users
    const permissionsResponse = await permissionsService.getPermissions(user, {
      page: 1,
      limit: 20,
      userId: null,
      schoolId: user.profile.school_id || undefined,
      role: null
    })

    // Fetch notifications
    const notificationsResponse = await notificationsService.getNotifications(user, {
      page: 1,
      limit: 5,
      read: false,
      type: null
    })

    const unreadCount = await notificationsService.getUnreadCount(user)

    // Calculate statistics
    const pendingReview = materialsResponse.data.filter(m => 
      m.status === 'submitted' || m.status === 'under_review'
    ).length

    const totalStudents = manageableUsers.filter(u => u.role === 'student').length
    const activeStudents = manageableUsers.filter(u => 
      u.role === 'student' && 
      !permissionsResponse.data.find(p => p.user_id === u.id)?.is_blocked
    ).length

    const dashboardData = {
      user,
      materials: materialsResponse.data,
      materialsPagination: materialsResponse.pagination,
      corrections: correctionsResponse.data,
      manageableUsers,
      permissions: permissionsResponse.data,
      notifications: notificationsResponse.data,
      unreadNotifications: unreadCount,
      stats: {
        totalMaterials: materialsResponse.pagination?.total || 0,
        pendingReview,
        totalStudents,
        activeStudents,
        correctionsThisWeek: correctionsResponse.data.filter(c => 
          new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      }
    }

    return <SchoolDashboard {...dashboardData} />

  } catch (error) {
    console.error('School dashboard error:', error)
    redirect('/dashboard')
  }
}