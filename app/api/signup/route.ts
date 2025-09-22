import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { signUpSchema } from '@/lib/validations'
import { isSupabaseConfigured } from '@/lib/env'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2)

  try {
    console.log(`[${requestId}] Starting signup request`)

    if (!isSupabaseConfigured()) {
      console.error(`[${requestId}] Supabase not properly configured`)
      return NextResponse.json(
        { error: 'Database not configured. Please check environment variables.' },
        { status: 503 }
      )
    }

    const supabase = createClient()
    console.log(`[${requestId}] Request received from origin:`, request.headers.get('origin'))

    const body = await request.json()
    console.log(`[${requestId}] Request body received, fields:`, Object.keys(body))

    // Validazione dati
    let validatedData
    try {
      console.log(`[${requestId}] Validating request data with schema`)
      validatedData = signUpSchema.parse(body)
      console.log(`[${requestId}] Validation successful, role: ${validatedData.role}`)
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(`[${requestId}] Validation error:`, error.issues)
        return NextResponse.json(
          { error: 'Invalid request data', details: error.issues },
          { status: 400 }
        )
      }
      throw error
    }

    // Signup Supabase Auth
    console.log(`[${requestId}] Creating user with Supabase Auth`)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          first_name: validatedData.first_name,
          last_name: validatedData.last_name || null,
          company: validatedData.company || null,
          brand_id: validatedData.brand_id || null,
          verified: false,
          active: true,
          role: validatedData.role,
        }
      }
    })

    if (authError) {

      console.error(`[${requestId}] Supabase auth error:`, authError)

      if (authError.message.includes('fetch failed') || authError.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { error: 'Unable to connect to authentication service. Please check your network connection and try again.' },
          { status: 503 }
        )
      }
      if (
        authError.message.includes('already registered') ||
        authError.message.includes('User already registered')
      ) {

        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 }
        )
      }
      if (authError.message.includes('Invalid email')) {
        return NextResponse.json(
          { error: 'Please provide a valid email address.' },
          { status: 400 }
        )
      }
      if (authError.message.includes('Password')) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long.' },
          { status: 400 }
        )
      }
      return NextResponse.json(
 copilot/fix-eee52a11-2927-4db8-8257-2a6d52178a1d
        { error: authError.message || 'Authentication failed. Please try again.' },

        { status: 400 }
      )
    }

    if (!authData.user) {
      console.error(`[${requestId}] No user returned from Supabase auth`)
      return NextResponse.json(
        { error: 'No user returned from authentication. Please try again.' },
        { status: 500 }
      )
    }


    // Crea profilo utente
    console.log(`[${requestId}] User created successfully with ID: ${authData.user.id}`)
    console.log(`[${requestId}] Creating user profile in database`)

    const userProfile = {
      user_id: authData.user.id,
      role: validatedData.role,
      brand_id: validatedData.brand_id || null,
      verified: false,
      active: true,

      company: validatedData.company || null,
      email: validatedData.email,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name || null,

    }

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([userProfile])
      .select()
      .single()

    if (profileError) {
      console.error(`[${requestId}] Profile creation error:`, profileError)
      // Cleanup auth user se fallisce creazione profilo
      try {
        console.log(`[${requestId}] Attempting to clean up auth user due to profile creation failure`)
        await supabase.auth.admin.deleteUser(authData.user.id)
        console.log(`[${requestId}] Auth user cleanup successful`)
      } catch (cleanupError) {
        console.error(`[${requestId}] Failed to cleanup auth user:`, cleanupError)
      }

      if (profileError.message?.includes('relation "user_profiles" does not exist')) {
        return NextResponse.json(
          { error: 'Database tables are not set up. Please contact support.' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: profileError.message || 'Failed to create user profile. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`[${requestId}] Profile created successfully`)
    return NextResponse.json(
      {
        message: 'Account created successfully! Please check your email to verify your account.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          profile: profileData
        }
      },
      { status: 201 }
    )

  } catch (error) {
    // Errore non previsto
    console.error(`[${requestId}] Unexpected error in signup:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        requestId: requestId,
        details: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    )
  }
}
