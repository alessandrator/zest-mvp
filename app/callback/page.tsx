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
      
      try {
        const supabase = createClient()
        
        // First, check both session and user for comprehensive validation
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
          userUserId: userData?.user?.id
        })
        
        if (sessionError) {
          console.error('[Callback] Initial session error:', sessionError)
          // Check if it's a configuration error vs actual auth error
          if (sessionError.message?.includes('not configured')) {
            toast.error('Authentication service is not configured. Please contact support.')
          } else {
            toast.error('Failed to verify session')
          }
          router.push('/login')
          return
        }

        // If no session yet, wait a bit and try again (for timing issues)
        if (!sessionData?.session && !userData?.user) {
          console.log('[Callback] No session or user found, waiting and retrying...')
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Try to refresh the session
          console.log('[Callback] Refreshing session...')
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          console.log('[Callback] Refresh result:', {
            hasSession: !!refreshData?.session,
            hasUser: !!refreshData?.user,
            error: refreshError?.message
          })
          
          if (refreshError) {
            console.error('[Callback] Session refresh error:', refreshError)
            toast.error('Failed to establish session. Please login again.')
            router.push('/login')
            return
          }

          if (!refreshData?.session) {
            // Still no session after refresh
            console.error('[Callback] Still no session after refresh')
            toast.error('Session not found. Please login again.')
            router.push('/login')
            return
          }
        }

        // Final validation - check both session and user one more time
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
          sessionRefreshToken: !!session?.refresh_token
        })
        
        if (finalSessionError) {
          console.error('[Callback] Final session check error:', finalSessionError)
          toast.error('Failed to verify session')
          router.push('/login')
          return
        }

        if (finalUserError) {
          console.error('[Callback] Final user check error:', finalUserError)
          toast.error('Failed to verify user')
          router.push('/login')
          return
        }

        // Check if we have either a valid session or user (as per requirements)
        if ((session?.user) || user) {
          // Valid authentication found
          const validUserId = session?.user?.id || user?.id
          console.log('[Callback] Session/user validated successfully:', validUserId)
          toast.success('Login successful! Welcome back.')
          
          // Log cookie information for debugging
          console.log('[Callback] Current cookies:', document.cookie)
          
          // Force one more small delay to ensure middleware sees the session
          console.log('[Callback] Final delay before redirect...')
          await new Promise(resolve => setTimeout(resolve, 500))
          
          console.log('[Callback] Redirecting to dashboard...')
          router.push('/dashboard')
        } else {
          // No valid session or user found after all attempts
          console.error('[Callback] No valid session or user found after all attempts')
          toast.error('Session validation failed. Please login again.')
          router.push('/login')
        }
      } catch (error) {
        console.error('[Callback] Callback error:', error)
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