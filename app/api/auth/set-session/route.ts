import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Missing access_token or refresh_token' },
        { status: 400 }
      )
    }

    // Set cookies using the server client
    const supabase = createClient()
    
    // Set the session with the provided tokens
    const { data: sessionData, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (error) {
      console.error('[SetSession] Error setting session:', error)
      return NextResponse.json(
        { error: 'Failed to set session' },
        { status: 500 }
      )
    }

    console.log('[SetSession] Session set successfully:', {
      hasSession: !!sessionData.session,
      hasUser: !!sessionData.user,
      userId: sessionData.session?.user?.id
    })

    // Manually set cookies to ensure they're properly configured
    const cookieStore = cookies()
    
    try {
      // Set auth cookies with proper configuration
      cookieStore.set('sb-access-token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      cookieStore.set('sb-refresh-token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      console.log('[SetSession] Cookies set manually')
    } catch (cookieError) {
      console.warn('[SetSession] Failed to set manual cookies:', cookieError)
      // Don't fail the request if manual cookie setting fails
    }

    return NextResponse.json({
      success: true,
      message: 'Session set successfully',
      user: {
        id: sessionData.user?.id,
        email: sessionData.user?.email,
      }
    })

  } catch (error) {
    console.error('[SetSession] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}