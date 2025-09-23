import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Ricevi la sessione dal client
  const body = await request.json()
  const { access_token, refresh_token } = body

  // Scrivi i cookie HTTP-only validi per il middleware/server
  if (access_token) {
    cookies().set('sb-access-token', access_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 settimana
    })
  }
  if (refresh_token) {
    cookies().set('sb-refresh-token', refresh_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return NextResponse.json({ ok: true })
}