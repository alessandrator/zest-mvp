import { createClient } from '@/lib/supabase/client'

export async function requireClientAuth() {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Client auth error:', error)
      return null
    }
    
    return session?.user || null
  } catch (error) {
    console.error('Client auth check failed:', error)
    return null
  }
}