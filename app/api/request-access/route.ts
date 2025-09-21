import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requestAccessSchema } from '@/lib/validations'
import { isSupabaseConfigured } from '@/lib/env'
import { ZodError } from 'zod'

interface AccessRequestData {
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  company: string | null;
  message: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2)
  
  try {
    console.log(`[${requestId}] Starting registration request`)
    
    // Check Supabase configuration first
    if (!isSupabaseConfigured()) {
      console.error(`[${requestId}] Supabase not properly configured`)
      return NextResponse.json(
        { error: 'Database not configured. Please check environment variables.' },
        { status: 503 }
      )
    }
    
    const supabase = createClient()
    
    // Log basic request info (without sensitive data)
    console.log(`[${requestId}] Request received from origin:`, request.headers.get('origin'))
    
    const body = await request.json()
    console.log(`[${requestId}] Request body received, fields:`, Object.keys(body))
    
    // Validate the request data
    console.log(`[${requestId}] Validating request data with schema`)
    const validatedData = requestAccessSchema.parse(body)
    console.log(`[${requestId}] Validation successful for email:`, validatedData.email)

    // Create user with Supabase Auth
    console.log(`[${requestId}] Attempting to create user with Supabase Auth`)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      console.error(`[${requestId}] Supabase auth error:`, {
        message: authError.message,
        status: authError.status,
        details: authError
      })
      
      // Handle specific auth errors
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message || 'Failed to create account. Please try again.' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      console.error(`[${requestId}] Auth successful but no user object returned`)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    console.log(`[${requestId}] User created successfully with ID:`, authData.user.id)

    // Create user profile
    console.log(`[${requestId}] Creating user profile`)
    const userProfile = {
      user_id: authData.user.id,
      role: validatedData.role,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      company: validatedData.company || null,
      verified: false,
      active: true,
    }

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([userProfile])
      .select()
      .single()

    if (profileError) {
      console.error(`[${requestId}] Profile creation error:`, {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
        full_error: profileError
      })
      
      // If profile creation fails, we should clean up the auth user
      console.log(`[${requestId}] Attempting to clean up auth user due to profile creation failure`)
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
        console.log(`[${requestId}] Auth user cleanup successful`)
      } catch (cleanupError) {
        console.error(`[${requestId}] Failed to cleanup auth user:`, cleanupError)
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create user profile. Please try again.',
          details: process.env.NODE_ENV === 'development' ? profileError.message : undefined
        },
        { status: 500 }
      )
    }

    console.log(`[${requestId}] User profile created successfully`)

    // Also store the access request for admin tracking
    console.log(`[${requestId}] Storing access request for admin tracking`)
    const accessRequest: AccessRequestData = {
      email: validatedData.email,
      role: validatedData.role,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      company: validatedData.company || null,
      message: validatedData.message,
      password: '[REDACTED]', // Don't store the actual password
    }

    // Store access request (optional, for admin tracking)
    // This will fail silently if the table doesn't exist yet
    try {
      await supabase
        .from('access_requests')
        .insert([{
          ...accessRequest,
          user_id: authData.user.id,
          status: 'approved', // Auto-approve since we're creating the account
        }])
      console.log(`[${requestId}] Access request tracking record created`)
    } catch (error) {
      console.log(`[${requestId}] Access request table not yet created, skipping insert:`, error)
    }

    console.log(`[${requestId}] Registration completed successfully`)
    return NextResponse.json(
      { 
        message: 'Account created successfully! Please check your email to verify your account.',
        data: {
          user: authData.user,
          profile: profileData
        }
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`[${requestId}] Validation error:`, error.issues)
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.issues
        },
        { status: 400 }
      )
    }

    // Log full error details for debugging
    console.error(`[${requestId}] Unexpected error in registration:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    })

    // Return generic error but log specifics
    return NextResponse.json(
      { 
        error: 'Internal server error',
        requestId: requestId,
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : 
          undefined
      },
      { status: 500 }
    )
  }
}