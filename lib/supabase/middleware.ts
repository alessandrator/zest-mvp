import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  // Use placeholder values during build if environment variables are not available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  // Skip Supabase client creation if using placeholder values
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  console.log('[Middleware] Auth check for:', request.nextUrl.pathname, 'User:', user?.id || 'none')

  if (userError) {
    console.warn('[Middleware] Error getting user:', userError.message)
  }

  // Determine if user is authenticated (check both user and session for reliability)
  let isAuthenticated = !!user
  let session = null

  // For dashboard routes or if no user found, also check session as fallback
  if (!user || request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('[Middleware] Checking session as well for better reliability')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    session = sessionData.session
    
    if (sessionError) {
      console.warn('[Middleware] Error getting session:', sessionError.message)
    } else if (session?.user) {
      console.log('[Middleware] Found valid session:', session.user.id)
      isAuthenticated = true
    }
  }

  console.log('[Middleware] Authentication status:', { 
    isAuthenticated, 
    hasUser: !!user, 
    hasSession: !!session,
    route: request.nextUrl.pathname 
  })

  // Check if this is a protected route that requires authentication
  const isProtectedRoute = !(
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/campaigns') ||
    request.nextUrl.pathname.startsWith('/request-access') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/reset-password') ||
    request.nextUrl.pathname.startsWith('/dashboard/demo') ||
    request.nextUrl.pathname.startsWith('/callback') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname === '/'
  )

  // Special handling for dashboard routes - require authentication
  if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    console.log('[Middleware] Dashboard access attempt without valid authentication, redirecting to login')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (!isAuthenticated && isProtectedRoute) {
    // No authentication and trying to access protected route, redirect to login
    console.log(`[Middleware] Protected route access attempt without authentication: ${request.nextUrl.pathname}`)
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}