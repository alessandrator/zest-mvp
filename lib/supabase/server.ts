import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  // Return a mock client if using placeholder values
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      from: () => ({
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
        setSession: () => Promise.resolve({ 
          data: { session: null, user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signUp: () => Promise.resolve({ 
          data: { user: null }, 
          error: { 
            message: 'Supabase not configured - please check environment variables',
            status: 503
          } 
        }),
        signInWithPassword: () => Promise.resolve({ 
          data: { session: null, user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        admin: {
          deleteUser: () => Promise.resolve({ data: null, error: null })
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}