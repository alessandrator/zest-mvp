import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requestAccessSchema } from '@/lib/validations'
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
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate the request data
    const validatedData = requestAccessSchema.parse(body)

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      
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
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create user profile
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
      console.error('Profile creation error:', profileError)
      
      // If profile creation fails, we should clean up the auth user
      // Note: In a real app, you might want to handle this in a transaction
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { error: 'Failed to create user profile. Please try again.' },
        { status: 500 }
      )
    }

    // Also store the access request for admin tracking
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
    } catch (error) {
      console.log('Access request table not yet created, skipping insert:', error)
    }

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
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}