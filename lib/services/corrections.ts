import { User, Correction, Material, ApiResponse } from '@/types'
import { isStudent, isSchoolAdmin, isSuperAdmin, canManageSchool } from '@/lib/auth'
import { demoData } from '@/lib/services/demo-data'

/**
 * Corrections Service
 * 
 * Handles teacher feedback, notes, and approval workflow for student materials
 * 
 * Integration Notes:
 * - Replace demo data with real database queries
 * - Add rich text editor support for correction content
 * - Implement real-time updates using WebSocket/Socket.io
 * - Add version control for correction history
 * - Consider implementing collaborative commenting features
 */

interface CorrectionFilters {
  materialId?: string | null;
  studentId?: string | null;
  schoolId?: string | null;
  status?: string | null;
  page: number;
  limit: number;
}

interface CreateCorrectionData {
  material_id: string;
  content: string;
  type: Correction['type'];
  line_number?: number;
  highlight_text?: string;
}

interface UpdateCorrectionData {
  content?: string;
  status?: Correction['status'];
  type?: Correction['type'];
}

class CorrectionsService {
  /**
   * Get corrections based on user role and filters
   * 
   * Students: Only corrections on their materials
   * School Admins: Corrections on materials from their school
   * Super Admins: All corrections
   */
  async getCorrections(user: User, filters: CorrectionFilters): Promise<ApiResponse<Correction[]>> {
    try {
      let corrections = demoData.corrections

      // Apply role-based filtering
      if (isStudent(user)) {
        // Get materials belonging to the student
        const studentMaterials = demoData.materials
          .filter(m => m.student_id === user.id)
          .map(m => m.id)
        corrections = corrections.filter(c => studentMaterials.includes(c.material_id))
      } else if (isSchoolAdmin(user)) {
        // Get materials from the school
        const schoolMaterials = demoData.materials
          .filter(m => m.school_id === user.profile.school_id)
          .map(m => m.id)
        corrections = corrections.filter(c => schoolMaterials.includes(c.material_id))
      }
      // Super admins see all corrections

      // Apply additional filters
      if (filters.materialId) {
        corrections = corrections.filter(c => c.material_id === filters.materialId)
      }
      if (filters.status) {
        corrections = corrections.filter(c => c.status === filters.status)
      }

      // Pagination
      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit
      const paginatedCorrections = corrections.slice(startIndex, endIndex)

      return {
        data: paginatedCorrections,
        success: true,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: corrections.length,
          totalPages: Math.ceil(corrections.length / filters.limit)
        }
      }

    } catch (error) {
      console.error('Error fetching corrections:', error)
      throw new Error('Failed to fetch corrections')
    }
  }

  /**
   * Create a new correction (teacher feedback)
   */
  async createCorrection(user: User, data: CreateCorrectionData): Promise<Correction> {
    try {
      // Check if material exists
      const material = demoData.materials.find(m => m.id === data.material_id)
      if (!material) {
        throw new Error('Material not found')
      }

      // Permission checks
      if (isStudent(user)) {
        throw new Error('Students cannot create corrections')
      } else if (isSchoolAdmin(user)) {
        // School admins can only correct materials from their school
        if (material.school_id !== user.profile.school_id) {
          throw new Error('Cannot correct materials outside your school')
        }
      } else if (!isSuperAdmin(user)) {
        throw new Error('Insufficient permissions')
      }

      // In real implementation:
      // 1. Validate correction data
      // 2. Store in database
      // 3. Send real-time notification to student
      // 4. Update material status if needed

      const newCorrection: Correction = {
        id: `corr_${Date.now()}`,
        material_id: data.material_id,
        teacher_id: user.id,
        content: data.content,
        type: data.type,
        status: 'active',
        line_number: data.line_number,
        highlight_text: data.highlight_text,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add to demo data (in real app, save to database)
      demoData.corrections.push(newCorrection)

      // Update material status based on correction type
      if (data.type === 'rejection') {
        await this.updateMaterialStatus(material.id, 'requires_changes')
      } else if (data.type === 'approval') {
        await this.updateMaterialStatus(material.id, 'approved')
      }

      // Send notification to student
      await this.notifyStudent(material.student_id, newCorrection)

      return newCorrection

    } catch (error) {
      console.error('Error creating correction:', error)
      throw error
    }
  }

  /**
   * Update correction
   */
  async updateCorrection(user: User, correctionId: string, updates: UpdateCorrectionData): Promise<Correction> {
    try {
      const correctionIndex = demoData.corrections.findIndex(c => c.id === correctionId)
      if (correctionIndex === -1) {
        throw new Error('Correction not found')
      }

      const correction = demoData.corrections[correctionIndex]

      // Permission checks
      if (isStudent(user)) {
        // Students can only mark corrections as resolved
        if (updates.status !== 'resolved') {
          throw new Error('Students can only mark corrections as resolved')
        }
        
        // Check if correction is on their material
        const material = demoData.materials.find(m => m.id === correction.material_id)
        if (!material || material.student_id !== user.id) {
          throw new Error('Cannot update corrections on materials you do not own')
        }
      } else if (isSchoolAdmin(user)) {
        // School admins can update corrections they created or on their school materials
        const material = demoData.materials.find(m => m.id === correction.material_id)
        if (!material || material.school_id !== user.profile.school_id) {
          throw new Error('Cannot update corrections outside your school')
        }
      } else if (!isSuperAdmin(user)) {
        throw new Error('Insufficient permissions')
      }

      // Apply updates
      const updatedCorrection = {
        ...correction,
        ...updates,
        updated_at: new Date().toISOString()
      }

      demoData.corrections[correctionIndex] = updatedCorrection

      // Send notification about correction update
      if (updates.status === 'resolved') {
        await this.notifyTeacher(correction.teacher_id, updatedCorrection, 'resolved')
      }

      return updatedCorrection

    } catch (error) {
      console.error('Error updating correction:', error)
      throw error
    }
  }

  /**
   * Resolve correction (mark as addressed)
   */
  async resolveCorrection(user: User, correctionId: string): Promise<Correction> {
    return this.updateCorrection(user, correctionId, { status: 'resolved' })
  }

  /**
   * Archive correction
   */
  async archiveCorrection(user: User, correctionId: string): Promise<Correction> {
    if (!canManageSchool(user) && !isSuperAdmin(user)) {
      throw new Error('Insufficient permissions to archive corrections')
    }

    return this.updateCorrection(user, correctionId, { status: 'archived' })
  }

  /**
   * Get corrections for a specific material
   */
  async getCorrectionsForMaterial(user: User, materialId: string): Promise<Correction[]> {
    const response = await this.getCorrections(user, {
      materialId,
      page: 1,
      limit: 100 // Get all corrections for the material
    })
    
    return response.data
  }

  /**
   * Bulk approve material with optional feedback
   */
  async approveMaterialWithFeedback(
    user: User, 
    materialId: string, 
    feedback?: string
  ): Promise<{ material: Material; correction?: Correction }> {
    if (!canManageSchool(user) && !isSuperAdmin(user)) {
      throw new Error('Insufficient permissions to approve materials')
    }

    const result: { material: Material; correction?: Correction } = {
      material: await this.updateMaterialStatus(materialId, 'approved')
    }

    if (feedback) {
      result.correction = await this.createCorrection(user, {
        material_id: materialId,
        content: feedback,
        type: 'approval'
      })
    }

    return result
  }

  /**
   * Private helper methods
   */
  private async updateMaterialStatus(materialId: string, status: Material['status']): Promise<Material> {
    const materialIndex = demoData.materials.findIndex(m => m.id === materialId)
    if (materialIndex === -1) {
      throw new Error('Material not found')
    }

    demoData.materials[materialIndex] = {
      ...demoData.materials[materialIndex],
      status,
      updated_at: new Date().toISOString(),
      reviewed_at: status === 'approved' || status === 'rejected' ? new Date().toISOString() : undefined
    }

    return demoData.materials[materialIndex]
  }

  private async notifyStudent(studentId: string, correction: Correction): Promise<void> {
    // In real implementation, send notification to student
    console.log(`Notifying student ${studentId} about new correction: ${correction.type}`)
  }

  private async notifyTeacher(teacherId: string, correction: Correction, action: string): Promise<void> {
    // In real implementation, send notification to teacher
    console.log(`Notifying teacher ${teacherId} about correction ${action}: ${correction.id}`)
  }
}

export const correctionsService = new CorrectionsService()