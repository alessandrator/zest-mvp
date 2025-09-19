import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  // Return a mock client if using placeholder values
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        resetPasswordForEmail: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}