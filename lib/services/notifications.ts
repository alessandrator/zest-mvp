import { User, Notification, ApiResponse } from '@/types'
import { demoData } from '@/lib/services/demo-data'

/**
 * Notifications Service
 * 
 * Handles real-time notifications between all dashboard roles
 * 
 * Integration Notes:
 * - Replace demo data with real database and WebSocket implementation
 * - Add WebSocket/Socket.io server for real-time notifications
 * - Implement push notifications for mobile apps (FCM, APNS)
 * - Add email notification system for important updates (SendGrid, AWS SES)
 * - Consider implementing notification preferences and filtering
 * - Add notification templates for consistent messaging
 */

interface NotificationFilters {
  read?: boolean;
  type?: string | null;
  page: number;
  limit: number;
}

interface CreateNotificationData {
  title: string;
  message: string;
  type: Notification['type'];
  action_url?: string;
  target_user_id?: string; // If not provided, notification goes to current user
}

class NotificationsService {
  /**
   * Get notifications for the current user
   */
  async getNotifications(user: User, filters: NotificationFilters): Promise<ApiResponse<Notification[]>> {
    try {
      let notifications = demoData.notifications.filter(n => n.user_id === user.id)

      // Apply filters
      if (filters.read !== undefined) {
        notifications = notifications.filter(n => n.read === filters.read)
      }
      if (filters.type) {
        notifications = notifications.filter(n => n.type === filters.type)
      }

      // Sort by creation date (newest first)
      notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      // Pagination
      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit
      const paginatedNotifications = notifications.slice(startIndex, endIndex)

      return {
        data: paginatedNotifications,
        success: true,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: notifications.length,
          totalPages: Math.ceil(notifications.length / filters.limit)
        }
      }

    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw new Error('Failed to fetch notifications')
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(user: User, data: CreateNotificationData): Promise<Notification> {
    try {
      const targetUserId = data.target_user_id || user.id

      // In real implementation:
      // 1. Validate notification data
      // 2. Store in database
      // 3. Send real-time update via WebSocket
      // 4. Send push notification if user is offline
      // 5. Send email if notification is critical

      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        user_id: targetUserId,
        title: data.title,
        message: data.message,
        type: data.type,
        read: false,
        action_url: data.action_url,
        created_at: new Date().toISOString()
      }

      // Add to demo data (in real app, save to database)
      demoData.notifications.push(newNotification)

      // Send real-time notification
      await this.sendRealTimeNotification(targetUserId, newNotification)

      return newNotification

    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(user: User, notificationId: string): Promise<Notification> {
    try {
      const notificationIndex = demoData.notifications.findIndex(
        n => n.id === notificationId && n.user_id === user.id
      )
      
      if (notificationIndex === -1) {
        throw new Error('Notification not found')
      }

      const updatedNotification = {
        ...demoData.notifications[notificationIndex],
        read: true
      }

      demoData.notifications[notificationIndex] = updatedNotification

      return updatedNotification

    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(user: User): Promise<{ updated: number }> {
    try {
      let updatedCount = 0

      demoData.notifications.forEach((notification, index) => {
        if (notification.user_id === user.id && !notification.read) {
          demoData.notifications[index] = { ...notification, read: true }
          updatedCount++
        }
      })

      return { updated: updatedCount }

    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  /**
   * Update notification
   */
  async updateNotification(user: User, notificationId: string, updates: Partial<Notification>): Promise<Notification> {
    try {
      const notificationIndex = demoData.notifications.findIndex(
        n => n.id === notificationId && n.user_id === user.id
      )
      
      if (notificationIndex === -1) {
        throw new Error('Notification not found')
      }

      const updatedNotification = {
        ...demoData.notifications[notificationIndex],
        ...updates
      }

      demoData.notifications[notificationIndex] = updatedNotification

      return updatedNotification

    } catch (error) {
      console.error('Error updating notification:', error)
      throw error
    }
  }

  /**
   * Get unread notification count for user
   */
  async getUnreadCount(user: User): Promise<number> {
    try {
      return demoData.notifications.filter(n => n.user_id === user.id && !n.read).length
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(user: User, notificationId: string): Promise<void> {
    try {
      const notificationIndex = demoData.notifications.findIndex(
        n => n.id === notificationId && n.user_id === user.id
      )
      
      if (notificationIndex === -1) {
        throw new Error('Notification not found')
      }

      demoData.notifications.splice(notificationIndex, 1)

    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  /**
   * System notification helpers for cross-dashboard communication
   */

  /**
   * Notify school admin about new student upload
   */
  async notifyNewStudentUpload(schoolId: string, studentName: string, materialTitle: string): Promise<void> {
    const schoolAdmins = demoData.users.filter(
      u => u.role === 'school_admin' && u.profile.school_id === schoolId
    )

    for (const admin of schoolAdmins) {
      await this.createNotification(admin, {
        title: 'New Student Upload',
        message: `${studentName} has uploaded "${materialTitle}" for review`,
        type: 'info',
        action_url: '/dashboard/school/materials'
      })
    }
  }

  /**
   * Notify student about correction/feedback
   */
  async notifyStudentCorrection(studentId: string, materialTitle: string, correctionType: string): Promise<void> {
    const student = demoData.users.find(u => u.id === studentId)
    if (!student) return

    const typeMap = {
      'feedback': { title: 'New Feedback', type: 'info' as const },
      'approval': { title: 'Material Approved', type: 'success' as const },
      'rejection': { title: 'Material Needs Changes', type: 'warning' as const }
    }

    const notifConfig = typeMap[correctionType as keyof typeof typeMap] || typeMap.feedback

    await this.createNotification(student, {
      title: notifConfig.title,
      message: `Your material "${materialTitle}" has received ${correctionType}`,
      type: notifConfig.type,
      action_url: '/dashboard/student/materials'
    })
  }

  /**
   * Notify super admin about material pending approval
   */
  async notifyMaterialPendingApproval(materialTitle: string, schoolName: string): Promise<void> {
    const superAdmins = demoData.users.filter(u => u.role === 'super_admin')

    for (const admin of superAdmins) {
      await this.createNotification(admin, {
        title: 'Material Pending Approval',
        message: `"${materialTitle}" from ${schoolName} is pending your approval`,
        type: 'info',
        action_url: '/dashboard/admin/approvals'
      })
    }
  }

  /**
   * Notify about permission changes
   */
  async notifyPermissionChange(userId: string, changes: string[]): Promise<void> {
    const user = demoData.users.find(u => u.id === userId)
    if (!user) return

    await this.createNotification(user, {
      title: 'Permissions Updated',
      message: `Your permissions have been updated: ${changes.join(', ')}`,
      type: 'info',
      action_url: '/dashboard/profile'
    })
  }

  /**
   * Broadcast notification to all users of specific roles
   */
  async broadcastToRoles(roles: string[], notification: CreateNotificationData): Promise<void> {
    const targetUsers = demoData.users.filter(u => roles.includes(u.role))

    for (const user of targetUsers) {
      await this.createNotification(user, {
        ...notification,
        target_user_id: user.id
      })
    }
  }

  /**
   * Private helper methods
   */
  private async sendRealTimeNotification(userId: string, notification: Notification): Promise<void> {
    // In real implementation, send via WebSocket
    console.log(`Real-time notification to user ${userId}:`, notification.title)
  }

  private async sendPushNotification(userId: string, notification: Notification): Promise<void> {
    // In real implementation, send push notification
    console.log(`Push notification to user ${userId}:`, notification.title)
  }

  private async sendEmailNotification(userId: string, notification: Notification): Promise<void> {
    // In real implementation, send email
    console.log(`Email notification to user ${userId}:`, notification.title)
  }
}

export const notificationsService = new NotificationsService()