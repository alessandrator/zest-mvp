import { User, Material, ApiResponse } from '@/types'
import { isStudent, isSchoolAdmin, isSuperAdmin, canManageSchool } from '@/lib/auth'
import { demoData } from '@/lib/services/demo-data'

/**
 * Materials Service
 * 
 * Handles student uploads, school review, and super admin approval
 * 
 * Integration Notes:
 * - Replace demo data with real database queries (Supabase, Prisma, etc.)
 * - Add real file upload handling with cloud storage (AWS S3, Cloudinary, etc.)
 * - Implement proper transaction handling for atomic operations
 * - Add indexing for search and filtering performance
 * - Consider implementing file versioning system
 */

interface MaterialFilters {
  status?: string | null;
  studentId?: string | null;
  schoolId?: string | null;
  page: number;
  limit: number;
}

interface CreateMaterialData {
  title: string;
  description: string;
  subject?: string;
  tags?: string[];
  file_type: string;
  file_url?: string;
}

interface UpdateMaterialData {
  title?: string;
  description?: string;
  status?: Material['status'];
  visibility?: Material['visibility'];
  reviewed_at?: string;
  approved_at?: string;
}

class MaterialsService {
  /**
   * Get materials based on user role and filters
   * 
   * Students: Only their own materials
   * School Admins: Materials from their school students
   * Super Admins: All materials
   */
  async getMaterials(user: User, filters: MaterialFilters): Promise<ApiResponse<Material[]>> {
    try {
      let materials = demoData.materials

      // Apply role-based filtering
      if (isStudent(user)) {
        materials = materials.filter(m => m.student_id === user.id)
      } else if (isSchoolAdmin(user)) {
        materials = materials.filter(m => m.school_id === user.profile.school_id)
      }
      // Super admins see all materials

      // Apply additional filters
      if (filters.status) {
        materials = materials.filter(m => m.status === filters.status)
      }
      if (filters.studentId) {
        materials = materials.filter(m => m.student_id === filters.studentId)
      }
      if (filters.schoolId) {
        materials = materials.filter(m => m.school_id === filters.schoolId)
      }

      // Pagination
      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit
      const paginatedMaterials = materials.slice(startIndex, endIndex)

      return {
        data: paginatedMaterials,
        success: true,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: materials.length,
          totalPages: Math.ceil(materials.length / filters.limit)
        }
      }

    } catch (error) {
      console.error('Error fetching materials:', error)
      throw new Error('Failed to fetch materials')
    }
  }

  /**
   * Create a new material (student upload)
   */
  async createMaterial(user: User, data: CreateMaterialData): Promise<Material> {
    try {
      // Only students can create materials
      if (!isStudent(user)) {
        throw new Error('Only students can upload materials')
      }

      // Check if user has upload permissions
      const userPermissions = demoData.permissions.find(p => p.user_id === user.id)
      if (userPermissions?.is_blocked) {
        throw new Error('User is blocked from uploading materials')
      }

      // In real implementation:
      // 1. Validate file upload
      // 2. Store file in cloud storage
      // 3. Create database record
      // 4. Send notification to school admin

      const newMaterial: Material = {
        id: `mat_${Date.now()}`,
        student_id: user.id,
        school_id: user.profile.school_id || undefined,
        title: data.title,
        description: data.description,
        file_url: data.file_url,
        file_type: data.file_type,
        status: 'submitted',
        visibility: 'school',
        subject: data.subject,
        tags: data.tags || [],
        metadata: {},
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add to demo data (in real app, save to database)
      demoData.materials.push(newMaterial)

      // Send notification to school admin
      if (user.profile.school_id) {
        await this.notifySchoolAdmin(user.profile.school_id, newMaterial)
      }

      return newMaterial

    } catch (error) {
      console.error('Error creating material:', error)
      throw error
    }
  }

  /**
   * Update material (review, approval, etc.)
   */
  async updateMaterial(user: User, materialId: string, updates: UpdateMaterialData): Promise<Material> {
    try {
      const materialIndex = demoData.materials.findIndex(m => m.id === materialId)
      if (materialIndex === -1) {
        throw new Error('Material not found')
      }

      const material = demoData.materials[materialIndex]

      // Permission checks
      if (isStudent(user)) {
        // Students can only edit their own draft materials
        if (material.student_id !== user.id || material.status !== 'draft') {
          throw new Error('Cannot edit this material')
        }
      } else if (isSchoolAdmin(user)) {
        // School admins can review materials from their school
        if (material.school_id !== user.profile.school_id) {
          throw new Error('Cannot review materials outside your school')
        }
      } else if (!isSuperAdmin(user)) {
        throw new Error('Insufficient permissions')
      }

      // Apply updates
      const updatedMaterial = {
        ...material,
        ...updates,
        updated_at: new Date().toISOString()
      }

      demoData.materials[materialIndex] = updatedMaterial

      // Send notifications based on status changes
      if (updates.status && updates.status !== material.status) {
        await this.notifyStatusChange(updatedMaterial, material.status, updates.status)
      }

      return updatedMaterial

    } catch (error) {
      console.error('Error updating material:', error)
      throw error
    }
  }

  /**
   * Approve material (super admin only)
   */
  async approveMaterial(user: User, materialId: string, visibility: Material['visibility'] = 'public'): Promise<Material> {
    if (!isSuperAdmin(user)) {
      throw new Error('Only super admins can approve materials')
    }

    return this.updateMaterial(user, materialId, {
      status: 'approved',
      visibility,
      approved_at: new Date().toISOString()
    })
  }

  /**
   * Reject material with reason
   */
  async rejectMaterial(user: User, materialId: string, reason: string): Promise<Material> {
    if (!canManageSchool(user) && !isSuperAdmin(user)) {
      throw new Error('Insufficient permissions to reject materials')
    }

    const result = await this.updateMaterial(user, materialId, {
      status: 'rejected',
      reviewed_at: new Date().toISOString()
    })

    // Add rejection reason as correction
    // This would be implemented in corrections service
    console.log(`Material rejected with reason: ${reason}`)
    
    return result
  }

  /**
   * Private helper methods
   */
  private async notifySchoolAdmin(schoolId: string, material: Material): Promise<void> {
    // In real implementation, send notification to school admin
    console.log(`Notifying school ${schoolId} admin about new material: ${material.title}`)
  }

  private async notifyStatusChange(
    material: Material, 
    oldStatus: Material['status'], 
    newStatus: Material['status']
  ): Promise<void> {
    // In real implementation, send notification to student and relevant parties
    console.log(`Material ${material.id} status changed from ${oldStatus} to ${newStatus}`)
  }
}

export const materialsService = new MaterialsService()