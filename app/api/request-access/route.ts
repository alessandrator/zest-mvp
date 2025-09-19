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
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate the request data
    const validatedData = requestAccessSchema.parse(body)

    // Insert the access request into Supabase
    const accessRequest: AccessRequestData = {
      email: validatedData.email,
      role: validatedData.role,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      company: validatedData.company || null,
      message: validatedData.message,
    }

    // Note: This will work once the access_requests table is created in Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('access_requests')
      .insert([accessRequest])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      
      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'An access request with this email already exists. Please contact support if you need assistance.' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to submit access request. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Access request submitted successfully!',
        data: data
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