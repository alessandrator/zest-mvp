import { createClient } from '@/lib/supabase/server'
import { UserRole, User } from '@/types'
import { Database } from '@/types/supabase'
import { cache } from 'react'

// Helper function to create a fallback profile for users who exist in auth but not in user_profiles
async function createFallbackProfile(supabase: ReturnType<typeof createClient>, authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}): Promise<User | null> {
  try {
    console.log(`[createFallbackProfile] Attempting to create fallback profile for user ${authUser.id}`)
    
    // Extract metadata from auth user if available
    const metadata = authUser.user_metadata || {}
    
    const fallbackProfileData: Database['public']['Tables']['user_profiles']['Insert'] = {
      user_id: authUser.id,
      first_name: (metadata.first_name as string) || 'User',
      last_name: (metadata.last_name as string) || '',
      company: (metadata.company as string) || null,
      brand_id: (metadata.brand_id as string) || null,
      school_id: (metadata.school_id as string) || null,
      role: (metadata.role as UserRole) || 'student', // Default to student
      verified: false,
      active: true,
      avatar_url: null,
      phone: null,
      bio: null,
      website: null,
      social_links: null,
    }

    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([fallbackProfileData])
      .select('*')
      .single()

    if (createError) {
      console.error(`[createFallbackProfile] Failed to create fallback profile for user ${authUser.id}:`, createError.message)
      return null
    }

    if (!newProfile) {
      console.error(`[createFallbackProfile] No profile data returned after creation for user ${authUser.id}`)
      return null
    }

    console.log(`[createFallbackProfile] Successfully created fallback profile for user ${authUser.id}`)

    // Return the complete User object
    return {
      id: authUser.id,
      email: authUser.email!,
      role: newProfile.role,
      profile: {
        id: newProfile.id,
        user_id: newProfile.user_id,
        first_name: newProfile.first_name,
        last_name: newProfile.last_name,
        avatar_url: newProfile.avatar_url,
        phone: newProfile.phone,
        company: newProfile.company,
        school_id: newProfile.school_id,
        brand_id: newProfile.brand_id,
        bio: newProfile.bio,
        website: newProfile.website,
        social_links: newProfile.social_links,
        verified: newProfile.verified,
        active: newProfile.active,
        created_at: newProfile.created_at,
        updated_at: newProfile.updated_at,
      },
      created_at: authUser.created_at!,
      updated_at: newProfile.updated_at,
    }
  } catch (error) {
    console.error(`[createFallbackProfile] Unexpected error creating fallback profile for user ${authUser.id}:`, error)
    return null
  }
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.warn('[getCurrentUser] Supabase auth error:', error.message)
    return null
  }

  if (!user) {
    console.log('[getCurrentUser] No authenticated user found')
    return null
  }

  console.log(`[getCurrentUser] Found authenticated user: ${user.id} (${user.email})`)

  // Get user profile with explicit type assertion
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error(`[getCurrentUser] Profile lookup error for user ${user.id}:`, profileError.message)
    
    // Check if the table doesn't exist
    if (profileError.message?.includes('relation "user_profiles" does not exist')) {
      console.error('[getCurrentUser] CRITICAL: user_profiles table does not exist')
      return null
    }

    // Check if it's just a missing profile (not found)
    if (profileError.code === 'PGRST116') {
      console.warn(`[getCurrentUser] No profile found in user_profiles for user ${user.id}, this user may need profile creation`)
      
      // Try to create a minimal profile for this user if they don't have one
      // This is a fallback for existing auth users without profiles
      const fallbackProfile = await createFallbackProfile(supabase, user)
      if (fallbackProfile) {
        console.log(`[getCurrentUser] Successfully created fallback profile for user ${user.id}`)
        return fallbackProfile
      }
      
      return null
    }

    // For other database errors, return null
    return null
  }

  if (!profileData) {
    console.warn(`[getCurrentUser] Profile data is null for user ${user.id}`)
    return null
  }

  console.log(`[getCurrentUser] Successfully loaded profile for user ${user.id} with role: ${profileData.role}`)

  // Type assertion for the profile data
  const profile = profileData as {
    id: string
    user_id: string
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

  // Validate that the profile has required data
  if (!profile.role) {
    console.error(`[getCurrentUser] Profile for user ${user.id} is missing required role field`)
    return null
  }

  if (!profile.active) {
    console.warn(`[getCurrentUser] Profile for user ${user.id} is inactive`)
    return null
  }

  const userObject = {
    id: user.id,
    email: user.email!,
    role: profile.role,
    profile: {
      id: profile.id,
      user_id: profile.user_id,
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

  console.log(`[getCurrentUser] Returning user object for ${user.id} with role ${profile.role}`)
  return userObject
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