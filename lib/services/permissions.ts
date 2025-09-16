import { User, UserPermissions, ApiResponse } from '@/types'
import { isSchoolAdmin, isSuperAdmin } from '@/lib/auth'
import { demoData } from '@/lib/services/demo-data'

/**
 * Permissions Service
 * 
 * Handles user permissions, student authorization/blocking, and access control
 * 
 * Integration Notes:
 * - Replace demo data with real RBAC (Role-Based Access Control) system
 * - Implement permission caching with Redis for performance
 * - Add audit logging for all permission changes
 * - Consider using libraries like Casbin for complex permission management
 * - Implement time-based permissions with automatic expiration
 */

interface PermissionFilters {
  userId?: string | null;
  schoolId?: string | null;
  role?: string | null;
  page: number;
  limit: number;
}

interface UpdatePermissionData {
  userId: string;
  permissions: Partial<UserPermissions>;
  reason?: string;
}

class PermissionsService {
  /**
   * Get permissions based on user role and filters
   * 
   * School Admins: Permissions for users in their school
   * Super Admins: All permissions
   */
  async getPermissions(user: User, filters: PermissionFilters): Promise<ApiResponse<UserPermissions[]>> {
    try {
      let permissions = demoData.permissions

      // Apply role-based filtering
      if (isSchoolAdmin(user)) {
        // Get users from the same school
        const schoolUsers = demoData.users
          .filter(u => u.profile.school_id === user.profile.school_id)
          .map(u => u.id)
        permissions = permissions.filter(p => schoolUsers.includes(p.user_id))
      } else if (!isSuperAdmin(user)) {
        throw new Error('Insufficient permissions to view user permissions')
      }
      // Super admins see all permissions

      // Apply additional filters
      if (filters.userId) {
        permissions = permissions.filter(p => p.user_id === filters.userId)
      }
      if (filters.schoolId) {
        const schoolUsers = demoData.users
          .filter(u => u.profile.school_id === filters.schoolId)
          .map(u => u.id)
        permissions = permissions.filter(p => schoolUsers.includes(p.user_id))
      }

      // Pagination
      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit
      const paginatedPermissions = permissions.slice(startIndex, endIndex)

      return {
        data: paginatedPermissions,
        success: true,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: permissions.length,
          totalPages: Math.ceil(permissions.length / filters.limit)
        }
      }

    } catch (error) {
      console.error('Error fetching permissions:', error)
      throw new Error('Failed to fetch permissions')
    }
  }

  /**
   * Get permissions for a specific user
   */
  async getUserPermissions(user: User, targetUserId: string): Promise<UserPermissions> {
    try {
      // Permission checks
      if (user.id !== targetUserId && !isSchoolAdmin(user) && !isSuperAdmin(user)) {
        throw new Error('Insufficient permissions to view user permissions')
      }

      if (isSchoolAdmin(user)) {
        // Check if target user is in the same school
        const targetUser = demoData.users.find(u => u.id === targetUserId)
        if (!targetUser || targetUser.profile.school_id !== user.profile.school_id) {
          throw new Error('Cannot view permissions for users outside your school')
        }
      }

      const userPermissions = demoData.permissions.find(p => p.user_id === targetUserId)
      if (!userPermissions) {
        // Return default permissions if not found
        return this.getDefaultPermissions(targetUserId)
      }

      return userPermissions

    } catch (error) {
      console.error('Error fetching user permissions:', error)
      throw error
    }
  }

  /**
   * Update user permissions
   */
  async updateUserPermission(user: User, data: UpdatePermissionData): Promise<UserPermissions> {
    try {
      // Permission checks
      if (!isSchoolAdmin(user) && !isSuperAdmin(user)) {
        throw new Error('Insufficient permissions to update user permissions')
      }

      if (isSchoolAdmin(user)) {
        // Check if target user is in the same school
        const targetUser = demoData.users.find(u => u.id === data.userId)
        if (!targetUser || targetUser.profile.school_id !== user.profile.school_id) {
          throw new Error('Cannot update permissions for users outside your school')
        }

        // School admins cannot grant super admin permissions
        if (data.permissions.can_manage_users || data.permissions.can_approve) {
          throw new Error('School admins cannot grant system-wide permissions')
        }
      }

      const permissionIndex = demoData.permissions.findIndex(p => p.user_id === data.userId)
      
      let updatedPermissions: UserPermissions
      if (permissionIndex === -1) {
        // Create new permissions entry
        updatedPermissions = {
          ...this.getDefaultPermissions(data.userId),
          ...data.permissions
        }
        demoData.permissions.push(updatedPermissions)
      } else {
        // Update existing permissions
        updatedPermissions = {
          ...demoData.permissions[permissionIndex],
          ...data.permissions
        }
        demoData.permissions[permissionIndex] = updatedPermissions
      }

      // Log permission change
      await this.logPermissionChange(user.id, data.userId, data.permissions, data.reason)

      // Send notification to user about permission change
      await this.notifyPermissionChange(data.userId, data.permissions)

      return updatedPermissions

    } catch (error) {
      console.error('Error updating user permissions:', error)
      throw error
    }
  }

  /**
   * Block user from uploading or other activities
   */
  async blockUser(user: User, targetUserId: string, reason: string): Promise<UserPermissions> {
    if (!isSchoolAdmin(user) && !isSuperAdmin(user)) {
      throw new Error('Insufficient permissions to block users')
    }

    return this.updateUserPermission(user, {
      userId: targetUserId,
      permissions: {
        is_blocked: true,
        block_reason: reason,
        blocked_at: new Date().toISOString(),
        blocked_by: user.id,
        can_upload: false
      },
      reason: `User blocked: ${reason}`
    })
  }

  /**
   * Unblock user
   */
  async unblockUser(user: User, targetUserId: string): Promise<UserPermissions> {
    if (!isSchoolAdmin(user) && !isSuperAdmin(user)) {
      throw new Error('Insufficient permissions to unblock users')
    }

    return this.updateUserPermission(user, {
      userId: targetUserId,
      permissions: {
        is_blocked: false,
        block_reason: undefined,
        blocked_at: undefined,
        blocked_by: undefined,
        can_upload: true // Restore default upload permission
      },
      reason: 'User unblocked'
    })
  }

  /**
   * Authorize user with specific permissions
   */
  async authorizeUser(user: User, targetUserId: string, permissions: Partial<UserPermissions>): Promise<UserPermissions> {
    if (!isSchoolAdmin(user) && !isSuperAdmin(user)) {
      throw new Error('Insufficient permissions to authorize users')
    }

    return this.updateUserPermission(user, {
      userId: targetUserId,
      permissions,
      reason: 'User authorization updated'
    })
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: keyof UserPermissions): Promise<boolean> {
    try {
      const userPermissions = demoData.permissions.find(p => p.user_id === userId)
      if (!userPermissions) {
        const defaultPermissions = this.getDefaultPermissions(userId)
        return defaultPermissions[permission] as boolean
      }

      return userPermissions[permission] as boolean

    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  /**
   * Check if user is blocked
   */
  async isUserBlocked(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'is_blocked')
  }

  /**
   * Get users that can be managed by the current user
   */
  async getManageableUsers(user: User): Promise<User[]> {
    if (isSuperAdmin(user)) {
      return demoData.users
    } else if (isSchoolAdmin(user)) {
      return demoData.users.filter(u => u.profile.school_id === user.profile.school_id)
    } else {
      return []
    }
  }

  /**
   * Private helper methods
   */
  private getDefaultPermissions(userId: string): UserPermissions {
    const targetUser = demoData.users.find(u => u.id === userId)
    const role = targetUser?.role || 'student'

    return {
      user_id: userId,
      can_upload: role === 'student' || role === 'influencer',
      can_review: role === 'school_admin' || role === 'super_admin',
      can_approve: role === 'super_admin',
      can_manage_school: role === 'school_admin' || role === 'super_admin',
      can_manage_users: role === 'super_admin',
      is_blocked: false
    }
  }

  private async logPermissionChange(
    grantedBy: string,
    userId: string,
    changes: Partial<UserPermissions>,
    reason?: string
  ): Promise<void> {
    // In real implementation, log to audit table
    console.log(`Permission change by ${grantedBy} for user ${userId}:`, changes, reason)
  }

  private async notifyPermissionChange(userId: string, changes: Partial<UserPermissions>): Promise<void> {
    // In real implementation, send notification to user
    console.log(`Notifying user ${userId} about permission changes:`, changes)
  }
}

export const permissionsService = new PermissionsService()