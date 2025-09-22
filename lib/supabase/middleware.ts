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

  // Get user first
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.warn('[Middleware] Error getting user:', userError.message)
  }

  // Get session as fallback/additional validation
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.warn('[Middleware] Error getting session:', sessionError.message)
  }

  // Determine if user is authenticated - valid if either user or session exists
  const isAuthenticated = !!(user || session?.user)
  
  // Enhanced logging for debugging
  console.log(`[Middleware] Route: ${request.nextUrl.pathname}`)
  console.log(`[Middleware] User exists: ${!!user}`)
  console.log(`[Middleware] Session exists: ${!!session}`)
  console.log(`[Middleware] Session user exists: ${!!session?.user}`)
  console.log(`[Middleware] Is authenticated: ${isAuthenticated}`)
  
  // Log cookie information for debugging
  const cookies = request.cookies.getAll()
  const authCookies = cookies.filter(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('sb-') || 
    cookie.name.includes('auth')
  )
  console.log(`[Middleware] Auth cookies found: ${authCookies.length}`)
  authCookies.forEach(cookie => {
    console.log(`[Middleware] Cookie: ${cookie.name} = ${cookie.value.substring(0, 20)}...`)
  })

  // Special handling for dashboard routes - enhanced validation (except demo)
  if (request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/dashboard/demo')) {
    if (!isAuthenticated) {
      console.log('[Middleware] Dashboard access denied - no valid authentication found')
      console.log('[Middleware] Redirecting to login')
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    } else {
      console.log('[Middleware] Dashboard access granted - valid authentication found')
    }
  }

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

  if (!isAuthenticated && isProtectedRoute) {
    // No user and trying to access protected route, redirect to login
    console.log(`[Middleware] Protected route access denied: ${request.nextUrl.pathname}`)
    console.log('[Middleware] User not authenticated, redirecting to login')
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