import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Leggi i cookie che abbiamo scritto tramite /api/auth/set-session
  const accessToken = request.cookies.get('sb-access-token')?.value
  const refreshToken = request.cookies.get('sb-refresh-token')?.value

  const isAuthenticated = !!accessToken && !!refreshToken

  // Logging per debug
  console.log('[Middleware] sb-access-token:', !!accessToken)
  console.log('[Middleware] sb-refresh-token:', !!refreshToken)
  console.log('[Middleware] Authenticated:', isAuthenticated)

  // Blocca accesso se non autenticato su tutte le route /dashboard (tranne eventuali eccezioni)
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Altrimenti lascia proseguire
  return NextResponse.next()
}