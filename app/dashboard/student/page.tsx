import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { materialsService } from '@/lib/services/materials'
import { correctionsService } from '@/lib/services/corrections'
import { notificationsService } from '@/lib/services/notifications'
import { StudentDashboardInteractive } from '@/components/dashboards/student-dashboard-interactive'

/**
 * Student Dashboard Page
 * 
 * Features:
 * - Upload new materials
 * - View submitted materials and their status
 * - Receive feedback and corrections from teachers
 * - Track approval progress
 * 
 * Integration Notes:
 * - Replace demo service calls with real API calls
 * - Add file upload handling with progress bars
 * - Implement real-time notification updates
 * - Add material versioning for revisions
 */

export default async function StudentDashboardPage() {
  try {
    // Ensure user is authenticated and is a student
    const user = await requireRole('student')

    // Fetch student's materials
    const materialsResponse = await materialsService.getMaterials(user, {
      page: 1,
      limit: 10,
      status: null,
      studentId: null,
      schoolId: null
    })

    // Fetch recent corrections on student's materials
    const correctionsResponse = await correctionsService.getCorrections(user, {
      page: 1,
      limit: 5,
      materialId: null,
      studentId: user.id,
      schoolId: null,
      status: 'active'
    })

    // Fetch recent notifications
    const notificationsResponse = await notificationsService.getNotifications(user, {
      page: 1,
      limit: 5,
      read: false,
      type: null
    })

    // Get unread notifications count
    const unreadCount = await notificationsService.getUnreadCount(user)

    const dashboardData = {
      user,
      materials: materialsResponse.data,
      materialsPagination: materialsResponse.pagination,
      corrections: correctionsResponse.data,
      notifications: notificationsResponse.data,
      unreadNotifications: unreadCount,
      stats: {
        totalMaterials: materialsResponse.pagination?.total || 0,
        approvedMaterials: materialsResponse.data.filter(m => m.status === 'approved').length,
        pendingMaterials: materialsResponse.data.filter(m => m.status === 'submitted' || m.status === 'under_review').length,
        materialsNeedingChanges: materialsResponse.data.filter(m => m.status === 'requires_changes').length
      }
    }

    return <StudentDashboardInteractive {...dashboardData} />

  } catch (error) {
    console.error('Student dashboard error:', error)
    redirect('/dashboard')
  }
}