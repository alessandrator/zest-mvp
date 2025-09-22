import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProfileForUser } from '@/lib/auth/sync'
import { UserRole } from '@/types'

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9)
  
  try {
    console.log(`[${requestId}] Profile sync API called`)
    
    const supabase = createClient()
    
    // Authenticate the request (only allow authenticated users or admins)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.warn(`[${requestId}] Unauthorized access to profile sync API`)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { action, userId, profileData } = body

    if (action === 'create_profile' && userId) {
      console.log(`[${requestId}] Creating profile for user ${userId}`)
      
      const result = await createProfileForUser(userId, {
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        role: profileData?.role as UserRole,
        company: profileData?.company,
        brand_id: profileData?.brand_id,
        school_id: profileData?.school_id,
      })

      if (result.success) {
        console.log(`[${requestId}] Successfully created profile for user ${userId}`)
        return NextResponse.json({ 
          success: true, 
          message: `Profile created for user ${userId}` 
        })
      } else {
        console.error(`[${requestId}] Failed to create profile for user ${userId}: ${result.error}`)
        return NextResponse.json(
          { error: result.error || 'Failed to create profile' },
          { status: 500 }
        )
      }
    }

    if (action === 'check_profile' && userId) {
      console.log(`[${requestId}] Checking profile for user ${userId}`)
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile not found
          console.log(`[${requestId}] No profile found for user ${userId}`)
          return NextResponse.json({
            exists: false,
            message: `No profile found for user ${userId}`
          })
        } else {
          console.error(`[${requestId}] Error checking profile for user ${userId}: ${profileError.message}`)
          return NextResponse.json(
            { error: profileError.message },
            { status: 500 }
          )
        }
      }

      console.log(`[${requestId}] Profile found for user ${userId} with role: ${profile.role}`)
      return NextResponse.json({
        exists: true,
        profile: {
          id: profile.id,
          role: profile.role,
          first_name: profile.first_name,
          last_name: profile.last_name,
          active: profile.active,
          verified: profile.verified,
          created_at: profile.created_at,
        }
      })
    }

    if (action === 'sync_current_user') {
      console.log(`[${requestId}] Syncing profile for current user ${user.id}`)
      
      // Check if current user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // No profile exists, create one
        console.log(`[${requestId}] Creating profile for current user ${user.id}`)
        
        const result = await createProfileForUser(user.id, {
          first_name: user.user_metadata?.first_name as string || 'User',
          last_name: user.user_metadata?.last_name as string || '',
          role: (user.user_metadata?.role as UserRole) || 'student',
          company: user.user_metadata?.company as string || undefined,
          brand_id: user.user_metadata?.brand_id as string || undefined,
          school_id: user.user_metadata?.school_id as string || undefined,
        })

        if (result.success) {
          console.log(`[${requestId}] Successfully created profile for current user ${user.id}`)
          return NextResponse.json({ 
            success: true, 
            created: true,
            message: `Profile created for user ${user.id}` 
          })
        } else {
          console.error(`[${requestId}] Failed to create profile for current user ${user.id}: ${result.error}`)
          return NextResponse.json(
            { error: result.error || 'Failed to create profile' },
            { status: 500 }
          )
        }
      } else if (profileError) {
        console.error(`[${requestId}] Error checking profile for current user ${user.id}: ${profileError.message}`)
        return NextResponse.json(
          { error: profileError.message },
          { status: 500 }
        )
      } else {
        console.log(`[${requestId}] Profile already exists for current user ${user.id}`)
        return NextResponse.json({
          success: true,
          created: false,
          message: `Profile already exists for user ${user.id}`,
          profile: {
            id: profile.id,
            role: profile.role,
            first_name: profile.first_name,
            last_name: profile.last_name,
          }
        })
      }
    }

    console.warn(`[${requestId}] Invalid action: ${action}`)
    return NextResponse.json(
      { error: 'Invalid action. Supported actions: create_profile, check_profile, sync_current_user' },
      { status: 400 }
    )

  } catch (error) {
    console.error(`[${requestId}] Unexpected error in profile sync API:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const requestId = Math.random().toString(36).substr(2, 9)
  
  console.log(`[${requestId}] Profile sync API info requested`)
  
  return NextResponse.json({
    message: 'Profile Sync API',
    endpoints: {
      'POST /api/profile-sync': {
        description: 'Sync user profiles with auth users',
        actions: {
          'sync_current_user': 'Create profile for the current authenticated user if missing',
          'check_profile': 'Check if a profile exists for a specific user (requires userId parameter)',
          'create_profile': 'Create profile for a specific user (requires userId and profileData parameters)'
        },
        example: {
          action: 'sync_current_user'
        }
      }
    }
  })
}