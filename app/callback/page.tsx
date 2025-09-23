'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        
        console.log('[Callback] Starting session validation...')
        console.log('[Callback] Current cookies before validation:', document.cookie)
        
        // Initial session check
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        console.log('[Callback] Initial session check:', {
          hasSession: !!session,
          hasUser: !!user,
          sessionError: sessionError?.message,
          userError: userError?.message,
          sessionUserId: session?.user?.id,
          userUserId: user?.id
        })

        // If we have errors that are not related to configuration, show them
        if (sessionError && !sessionError.message?.includes('not configured')) {
          console.error('[Callback] Session error:', sessionError)
          toast.error('Session validation failed. Please login again.')
          router.push('/login')
          return
        }

        if (userError && !userError.message?.includes('not configured')) {
          console.error('[Callback] User error:', userError)
          toast.error('Session validation failed. Please login again.')
          router.push('/login')
          return
        }

        // If we don't have session or user data, try to refresh session
        if (!session || !user) {
          console.log('[Callback] No session or user found, attempting refresh...')
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          console.log('[Callback] Refresh result:', {
            hasSession: !!refreshData?.session,
            hasUser: !!refreshData?.user,
            sessionUserId: refreshData?.session?.user?.id,
            userUserId: refreshData?.user?.id,
            error: refreshError?.message
          })
          
          if (refreshError && !refreshError.message?.includes('not configured')) {
            console.error('[Callback] Session refresh error:', refreshError)
            toast.error('Failed to establish session. Please login again.')
            router.push('/login')
            return
          }

          if (!refreshData?.session && !refreshData?.user) {
            // Still no session or user after refresh
            console.error('[Callback] Still no session or user after refresh')
            toast.error('Session not found. Please login again.')
            router.push('/login')
            return
          }
        }

        // Final validation - check both session and user one more time as required
        console.log('[Callback] Final validation checks...')
        const { data: { session: finalSession }, error: finalSessionError } = await supabase.auth.getSession()
        const { data: { user: finalUser }, error: finalUserError } = await supabase.auth.getUser()
        
        console.log('[Callback] Final validation result:', {
          hasSession: !!finalSession,
          hasUser: !!finalUser,
          sessionError: finalSessionError?.message,
          userError: finalUserError?.message,
          sessionUserId: finalSession?.user?.id,
          userUserId: finalUser?.id,
          sessionAccessToken: !!finalSession?.access_token,
          sessionRefreshToken: !!finalSession?.refresh_token,
          sessionExpiresAt: finalSession?.expires_at
        })
        
        if (finalSessionError && !finalSessionError.message?.includes('not configured')) {
          console.error('[Callback] Final session check error:', finalSessionError)
          toast.error('Failed to verify session')
          router.push('/login')
          return
        }

        if (finalUserError && !finalUserError.message?.includes('not configured')) {
          console.error('[Callback] Final user check error:', finalUserError)
          toast.error('Failed to verify user')
          router.push('/login')
          return
        }

        // Check if we have valid session and user data
        const validSession = finalSession && finalSession.access_token && finalSession.user
        const validUser = finalUser && finalUser.id
        const validUserId = validSession?.user?.id || validUser?.id

        if (validSession && validUser && validUserId) {
          // Success - we have both valid session and user
          console.log('[Callback] Session validation successful:', {
            sessionId: finalSession.user.id,
            userId: validUserId,
            userEmail: finalSession?.user?.email || finalUser?.email
          })
          
          // Log final cookie state for debugging
          console.log('[Callback] Final cookies before redirect:', document.cookie)
          
          // Success message
          toast.success('Login successful! Welcome back.')
          
          // Small delay to ensure middleware sees the session (as required)
          console.log('[Callback] Final delay before redirect...')
          await new Promise(resolve => setTimeout(resolve, 500))
          
          console.log('[Callback] Redirecting to dashboard...')
          router.push('/dashboard')
        } else {
          // No valid session or user found after all attempts
          console.error('[Callback] No valid session or user found after all attempts')
          console.error('[Callback] Final state:', {
            session: finalSession ? 'exists but invalid' : 'null',
            user: finalUser ? 'exists but invalid' : 'null',
            sessionHasUser: !!finalSession?.user,
            sessionHasToken: !!finalSession?.access_token,
            userHasId: !!finalUser?.id
          })
          toast.error('Session validation failed. Please login again.')
          router.push('/login')
        }
      } catch (error) {
        console.error('[Callback] Callback error:', error)
        console.error('[Callback] Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        })
        toast.error('An error occurred. Please try again.')
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verifying your session...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  )
}