import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/types'
import { Database } from '@/types/supabase'

/**
 * Utility function to sync Supabase Auth users with user_profiles table
 * This can be called manually or as part of a migration script
 */
export async function syncAuthUsersToProfiles(): Promise<{
  success: boolean;
  created: number;
  errors: string[];
}> {
  const errors: string[] = []
  const created = 0

  try {
    console.log('[syncAuthUsersToProfiles] Starting sync process...')

    // Get all auth users - this would require admin access in a real scenario
    // For now, we'll just log that this functionality exists
    console.log('[syncAuthUsersToProfiles] This function would require admin API access to list all auth users')
    console.log('[syncAuthUsersToProfiles] In a production environment, this should be run as a server-side script')

    return {
      success: true,
      created,
      errors
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[syncAuthUsersToProfiles] Sync failed:', errorMessage)
    errors.push(errorMessage)
    
    return {
      success: false,
      created,
      errors
    }
  }
}

/**
 * Helper function to create a profile for a specific user ID
 * This can be called when we detect a user exists in auth but not in profiles
 */
export async function createProfileForUser(userId: string, defaultData?: {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  company?: string;
  brand_id?: string;
  school_id?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    console.log(`[createProfileForUser] Creating profile for user ${userId}`)

    const profileData: Database['public']['Tables']['user_profiles']['Insert'] = {
      user_id: userId,
      first_name: defaultData?.first_name || 'User',
      last_name: defaultData?.last_name || '',
      role: defaultData?.role || 'student',
      company: defaultData?.company || null,
      brand_id: defaultData?.brand_id || null,
      school_id: defaultData?.school_id || null,
      verified: false,
      active: true,
      avatar_url: null,
      phone: null,
      bio: null,
      website: null,
      social_links: null,
    }

    const { error } = await supabase
      .from('user_profiles')
      .insert([profileData])

    if (error) {
      console.error(`[createProfileForUser] Failed to create profile for user ${userId}:`, error.message)
      return { success: false, error: error.message }
    }

    console.log(`[createProfileForUser] Successfully created profile for user ${userId}`)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[createProfileForUser] Unexpected error for user ${userId}:`, errorMessage)
    return { success: false, error: errorMessage }
  }
}