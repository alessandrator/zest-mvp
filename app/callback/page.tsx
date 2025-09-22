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
        
        // First, handle any auth callback from URL (for OAuth flows)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Initial session error:', sessionError)
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
        if (!sessionData?.session) {
          console.log('No session found, waiting and retrying...')
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            console.error('Session refresh error:', refreshError)
            toast.error('Failed to establish session. Please login again.')
            router.push('/login')
            return
          }

          if (!refreshData?.session) {
            // Still no session after refresh
            toast.error('Session not found. Please login again.')
            router.push('/login')
            return
          }
        }

        // Get the current session one more time to be sure
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Final session check error:', error)
          toast.error('Failed to verify session')
          router.push('/login')
          return
        }

        if (session?.user) {
          // Session exists and is valid
          console.log('Session validated successfully:', session.user.id)
          toast.success('Login successful! Welcome back.')
          
          // Force one more small delay to ensure middleware sees the session
          await new Promise(resolve => setTimeout(resolve, 500))
          
          router.push('/dashboard')
        } else {
          // No session found after all attempts
          console.error('No valid session found after all attempts')
          toast.error('Session validation failed. Please login again.')
          router.push('/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
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