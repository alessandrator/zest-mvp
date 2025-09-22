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
      console.log('[Callback] Starting callback validation...')
      console.log('[Callback] Current URL:', window.location.href)
      console.log('[Callback] Initial cookies:', document.cookie)
      
      try {
        const supabase = createClient()
        
        // First, check both session and user for comprehensive validation as required
        console.log('[Callback] Checking initial session...')
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        console.log('[Callback] Checking initial user...')
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        console.log('[Callback] Initial checks:', {
          hasSession: !!sessionData?.session,
          hasUser: !!userData?.user,
          sessionError: sessionError?.message,
          userError: userError?.message,
          sessionUserId: sessionData?.session?.user?.id,
          userUserId: userData?.user?.id,
          sessionAccessToken: !!sessionData?.session?.access_token,
          sessionRefreshToken: !!sessionData?.session?.refresh_token
        })
        
        if (sessionError && !sessionError.message?.includes('not configured')) {
          console.error('[Callback] Initial session error:', sessionError)
          toast.error('Failed to verify session')
          router.push('/login')
          return
        }

        if (userError && !userError.message?.includes('not configured')) {
          console.error('[Callback] Initial user error:', userError)
          toast.error('Failed to verify user')
          router.push('/login')
          return
        }
        
        // If no session yet, wait a bit and try again (for timing issues)
        if (!sessionData?.session && !userData?.user) {
          console.log('[Callback] No session or user found, waiting and retrying...')
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Try to refresh the session as required
          console.log('[Callback] Refreshing session...')
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
        const { data: { session }, error: finalSessionError } = await supabase.auth.getSession()
        const { data: { user }, error: finalUserError } = await supabase.auth.getUser()
        
        console.log('[Callback] Final validation result:', {
          hasSession: !!session,
          hasUser: !!user,
          sessionError: finalSessionError?.message,
          userError: finalUserError?.message,
          sessionUserId: session?.user?.id,
          userUserId: user?.id,
          sessionAccessToken: !!session?.access_token,
          sessionRefreshToken: !!session?.refresh_token,
          sessionExpiresAt: session?.expires_at
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

        // Check if we have either a valid session or user (as per requirements: "at least one is valid")
        const hasValidSession = session?.user && session?.access_token
        const hasValidUser = user && user.id
        
        console.log('[Callback] Validation summary:', {
          hasValidSession,
          hasValidUser,
          canProceed: hasValidSession || hasValidUser
        })

        if (hasValidSession || hasValidUser) {
          // Valid authentication found - redirect to /dashboard as required
          const validUserId = session?.user?.id || user?.id
          console.log('[Callback] Session/user validated successfully:', validUserId)
          console.log('[Callback] Authentication details:', {
            sessionValid: hasValidSession,
            userValid: hasValidUser,
            userId: validUserId,
            userEmail: session?.user?.email || user?.email
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
            session: session ? 'exists but invalid' : 'null',
            user: user ? 'exists but invalid' : 'null',
            sessionHasUser: !!session?.user,
            sessionHasToken: !!session?.access_token,
            userHasId: !!user?.id
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