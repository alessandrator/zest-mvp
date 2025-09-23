import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // Proteggi tutte le route (escludi solo statiche, api, immagini ecc)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}