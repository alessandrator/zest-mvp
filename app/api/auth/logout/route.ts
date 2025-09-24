import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    
    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('[Logout] Sign out error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[Logout] User signed out successfully')
    
    // Create response and clear any remaining auth cookies
    const response = NextResponse.json({ success: true })
    
    // Clear any potential auth cookies (though Supabase should handle this)
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    
    return response
  } catch (error) {
    console.error('[Logout] Logout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Logout failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}