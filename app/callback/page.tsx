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
        
        // Wait a bit to ensure session is properly established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if user session exists
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          toast.error('Failed to verify session')
          router.push('/login')
          return
        }

        if (session?.user) {
          // Session exists, redirect to dashboard
          toast.success('Login successful! Welcome back.')
          router.push('/dashboard')
        } else {
          // No session, redirect to login
          toast.error('Session not found. Please login again.')
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