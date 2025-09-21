import { createClient } from '@/lib/supabase/server'
import { UserRole, User } from '@/types'
import { cache } from 'react'

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile with explicit type assertion
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profileData) {
    return null
  }

  // Type assertion for the profile data
  const profile = profileData as {
    id: string
    user_id: string
    email?: string
    role: UserRole
    first_name: string
    last_name: string
    avatar_url: string | null
    phone: string | null
    company: string | null
    school_id: string | null
    brand_id: string | null
    bio: string | null
    website: string | null
    social_links: Record<string, unknown> | null
    verified: boolean
    active: boolean
    created_at: string
    updated_at: string
  }

  return {
    id: user.id,
    email: user.email!,
    role: profile.role,
    profile: {
      id: profile.id,
      user_id: profile.user_id,
      email: profile.email || user.email!,
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
      company: profile.company,
      school_id: profile.school_id,
      brand_id: profile.brand_id,
      bio: profile.bio,
      website: profile.website,
      social_links: profile.social_links,
      verified: profile.verified,
      active: profile.active,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    },
    created_at: user.created_at!,
    updated_at: profile.updated_at,
  }
})

export async function requireAuth(allowedRoles?: UserRole[]) {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}

export async function requireRole(role: UserRole) {
  return requireAuth([role])
}

export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role
}

export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false
}

export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, 'super_admin')
}

export function isBrand(user: User | null): boolean {
  return hasRole(user, 'brand')
}

export function isSchoolAdmin(user: User | null): boolean {
  return hasRole(user, 'school_admin')
}

export function isStudent(user: User | null): boolean {
  return hasRole(user, 'student')
}

export function isInfluencer(user: User | null): boolean {
  return hasRole(user, 'influencer')
}

export function isConsumer(user: User | null): boolean {
  return hasRole(user, 'consumer')
}

export function canApplyToCampaigns(user: User | null): boolean {
  return hasAnyRole(user, ['student', 'influencer', 'consumer'])
}

export function canManageCampaigns(user: User | null): boolean {
  return hasAnyRole(user, ['brand', 'super_admin'])
}

export function canManageSchool(user: User | null): boolean {
  return hasAnyRole(user, ['school_admin', 'super_admin'])
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    brand: 'Brand',
    school_admin: 'School Admin',
    student: 'Student',
    consumer: 'Consumer',
    influencer: 'Influencer',
  }
  
  return roleNames[role]
}