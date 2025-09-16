'use client'

import { useState, useCallback } from 'react'
import { ApiResponse, Material, Correction, UserPermissions, Notification } from '@/types'

/**
 * API Client Hooks for Frontend-Backend Communication
 * 
 * These hooks provide a clean interface for dashboard components to interact
 * with the backend services through fetch API calls.
 * 
 * Integration Notes:
 * - Replace fetch with your preferred HTTP client (axios, SWR, React Query, etc.)
 * - Add proper error handling and loading states
 * - Implement optimistic updates for better UX
 * - Add request/response interceptors for authentication
 * - Consider implementing real-time updates with WebSocket
 */

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Generic API hook
function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const request = useCallback(async (url: string, options?: RequestInit) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<T> | T = await response.json()
      const data = 'data' in result ? result.data : result
      
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }, [])

  return { ...state, request }
}

// Materials API hook
export function useMaterials() {
  const { data, loading, error, request } = useApi<Material[]>()

  const getMaterials = useCallback(async (filters: {
    status?: string
    studentId?: string
    schoolId?: string
    page?: number
    limit?: number
  } = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    return request(`/api/materials?${params.toString()}`)
  }, [request])

  const createMaterial = useCallback(async (materialData: {
    title: string
    description: string
    subject?: string
    tags?: string[]
    file_type: string
    file_url?: string
  }) => {
    return request('/api/materials', {
      method: 'POST',
      body: JSON.stringify(materialData)
    })
  }, [request])

  const updateMaterial = useCallback(async (id: string, updates: {
    title?: string
    description?: string
    status?: Material['status']
    visibility?: Material['visibility']
  }) => {
    return request('/api/materials', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    })
  }, [request])

  return {
    materials: data,
    loading,
    error,
    getMaterials,
    createMaterial,
    updateMaterial
  }
}

// Corrections API hook
export function useCorrections() {
  const { data, loading, error, request } = useApi<Correction[]>()

  const getCorrections = useCallback(async (filters: {
    materialId?: string
    studentId?: string
    schoolId?: string
    status?: string
    page?: number
    limit?: number
  } = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    return request(`/api/corrections?${params.toString()}`)
  }, [request])

  const createCorrection = useCallback(async (correctionData: {
    material_id: string
    content: string
    type: Correction['type']
    line_number?: number
    highlight_text?: string
  }) => {
    return request('/api/corrections', {
      method: 'POST',
      body: JSON.stringify(correctionData)
    })
  }, [request])

  const updateCorrection = useCallback(async (id: string, updates: {
    content?: string
    status?: Correction['status']
    type?: Correction['type']
  }) => {
    return request('/api/corrections', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    })
  }, [request])

  return {
    corrections: data,
    loading,
    error,
    getCorrections,
    createCorrection,
    updateCorrection
  }
}

// Permissions API hook
export function usePermissions() {
  const { data, loading, error, request } = useApi<UserPermissions[]>()

  const getPermissions = useCallback(async (filters: {
    userId?: string
    schoolId?: string
    role?: string
    page?: number
    limit?: number
  } = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    return request(`/api/permissions?${params.toString()}`)
  }, [request])

  const updatePermission = useCallback(async (permissionData: {
    userId: string
    permissions: Partial<UserPermissions>
    reason?: string
  }) => {
    return request('/api/permissions', {
      method: 'POST',
      body: JSON.stringify(permissionData)
    })
  }, [request])

  const blockUser = useCallback(async (userId: string, reason: string) => {
    return request('/api/permissions', {
      method: 'PUT',
      body: JSON.stringify({ userId, action: 'block', reason })
    })
  }, [request])

  const unblockUser = useCallback(async (userId: string) => {
    return request('/api/permissions', {
      method: 'PUT',
      body: JSON.stringify({ userId, action: 'unblock' })
    })
  }, [request])

  const authorizeUser = useCallback(async (userId: string, permissions: Partial<UserPermissions>) => {
    return request('/api/permissions', {
      method: 'PUT',
      body: JSON.stringify({ userId, action: 'authorize', permissions })
    })
  }, [request])

  return {
    permissions: data,
    loading,
    error,
    getPermissions,
    updatePermission,
    blockUser,
    unblockUser,
    authorizeUser
  }
}

// Notifications API hook
export function useNotifications() {
  const { data, loading, error, request } = useApi<Notification[]>()

  const getNotifications = useCallback(async (filters: {
    read?: boolean
    type?: string
    page?: number
    limit?: number
  } = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    return request(`/api/notifications?${params.toString()}`)
  }, [request])

  const createNotification = useCallback(async (notificationData: {
    title: string
    message: string
    type: Notification['type']
    action_url?: string
    target_user_id?: string
  }) => {
    return request('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    })
  }, [request])

  const markAsRead = useCallback(async (id: string) => {
    return request('/api/notifications', {
      method: 'PUT',
      body: JSON.stringify({ id, action: 'markRead' })
    })
  }, [request])

  const markAllAsRead = useCallback(async () => {
    return request('/api/notifications', {
      method: 'PUT',
      body: JSON.stringify({ action: 'markAllRead' })
    })
  }, [request])

  return {
    notifications: data,
    loading,
    error,
    getNotifications,
    createNotification,
    markAsRead,
    markAllAsRead
  }
}

/**
 * Dashboard-specific composite hooks that combine multiple API calls
 */

// Student dashboard hook
export function useStudentDashboard() {
  const materials = useMaterials()
  const corrections = useCorrections()
  const notifications = useNotifications()

  const loadDashboard = useCallback(async () => {
    try {
      await Promise.all([
        materials.getMaterials({ page: 1, limit: 10 }),
        corrections.getCorrections({ page: 1, limit: 5, status: 'active' }),
        notifications.getNotifications({ page: 1, limit: 5, read: false })
      ])
    } catch (error) {
      console.error('Failed to load student dashboard:', error)
    }
  }, [materials, corrections, notifications])

  return {
    materials,
    corrections,
    notifications,
    loadDashboard,
    loading: materials.loading || corrections.loading || notifications.loading
  }
}

// School admin dashboard hook
export function useSchoolDashboard() {
  const materials = useMaterials()
  const corrections = useCorrections()
  const permissions = usePermissions()
  const notifications = useNotifications()

  const loadDashboard = useCallback(async (schoolId: string) => {
    try {
      await Promise.all([
        materials.getMaterials({ schoolId, page: 1, limit: 10 }),
        corrections.getCorrections({ schoolId, page: 1, limit: 10 }),
        permissions.getPermissions({ schoolId, page: 1, limit: 20 }),
        notifications.getNotifications({ page: 1, limit: 5, read: false })
      ])
    } catch (error) {
      console.error('Failed to load school dashboard:', error)
    }
  }, [materials, corrections, permissions, notifications])

  return {
    materials,
    corrections,
    permissions,
    notifications,
    loadDashboard,
    loading: materials.loading || corrections.loading || permissions.loading || notifications.loading
  }
}

// Super admin dashboard hook
export function useSuperAdminDashboard() {
  const materials = useMaterials()
  const permissions = usePermissions()
  const notifications = useNotifications()

  const loadDashboard = useCallback(async () => {
    try {
      await Promise.all([
        materials.getMaterials({ page: 1, limit: 15 }),
        permissions.getPermissions({ page: 1, limit: 50 }),
        notifications.getNotifications({ page: 1, limit: 10, read: false })
      ])
    } catch (error) {
      console.error('Failed to load super admin dashboard:', error)
    }
  }, [materials, permissions, notifications])

  return {
    materials,
    permissions,
    notifications,
    loadDashboard,
    loading: materials.loading || permissions.loading || notifications.loading
  }
}