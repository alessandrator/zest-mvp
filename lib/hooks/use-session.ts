'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

interface SessionState {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useSession() {
  const [sessionState, setSessionState] = useState<SessionState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setSessionState({ user: null, loading: false, error })
          return
        }

        setSessionState({ 
          user: session?.user || null, 
          loading: false, 
          error: null 
        })
      } catch (error) {
        console.error('Session check failed:', error)
        setSessionState({ 
          user: null, 
          loading: false, 
          error: error as Error 
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSessionState({ 
            user: session?.user || null, 
            loading: false, 
            error: null 
          })
        } else if (event === 'SIGNED_OUT') {
          setSessionState({ 
            user: null, 
            loading: false, 
            error: null 
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Force session refresh function
  const refreshSession = async () => {
    setSessionState(prev => ({ ...prev, loading: true }))
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        setSessionState({ user: null, loading: false, error })
        return false
      }

      setSessionState({ 
        user: data.session?.user || null, 
        loading: false, 
        error: null 
      })
      return true
    } catch (error) {
      setSessionState({ 
        user: null, 
        loading: false, 
        error: error as Error 
      })
      return false
    }
  }

  return {
    ...sessionState,
    refreshSession
  }
}