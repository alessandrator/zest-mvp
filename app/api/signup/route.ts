import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { signUpSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate the request data
    const validatedData = signUpSchema.parse(body)

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
 copilot/fix-2637d606-e541-44f8-8693-b96932aafabd
      options: {
        data: {
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          role: validatedData.role,
          company: validatedData.company || null,
        }
      }
    
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
 main
      
      // Handle specific auth errors
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
copilot/fix-2637d606-e541-44f8-8693-b96932aafabd
        { error: authError.message },

        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

 copilot/fix-2637d606-e541-44f8-8693-b96932aafabd
    // Create user profile in our database

    const userProfile = {
      user_id: authData.user.id,
      role: validatedData.role,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      company: validatedData.company || null,
      school_id: validatedData.school_id || null,
      brand_id: validatedData.brand_id || null,
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
      
      // Note: In a production app, you might want to use database transactions
      // or implement a cleanup job to remove orphaned auth users
      // If profile creation fails, we should clean up the auth user
      // Note: In a real app, you might want to handle this in a transaction
      await supabase.auth.admin.deleteUser(authData.user.id)

      
      return NextResponse.json(
        { error: 'Failed to create user profile. Please try again.' },
        { status: 500 }
      )
    }

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