'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.log('[Logout] Starting logout process...')
        
        const supabase = createClient()
        
        // Sign out the user
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('[Logout] Sign out error:', error)
          
          // If Supabase is not configured, just clear local state and redirect
          if (error.message?.includes('not configured')) {
            console.log('[Logout] Supabase not configured, redirecting to login')
            toast.success('Logged out successfully')
            router.push('/login')
            return
          }
          
          toast.error('Error during logout: ' + error.message)
          router.push('/login')
          return
        }

        console.log('[Logout] User signed out successfully')
        
        // Clear any additional local storage or session data if needed
        localStorage.clear()
        sessionStorage.clear()
        
        // Show success message
        toast.success('Logged out successfully')
        
        // Small delay to ensure the logout is processed
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirect to login page
        console.log('[Logout] Redirecting to login...')
        router.push('/login')
        
      } catch (error) {
        console.error('[Logout] Logout error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Logout failed'
        toast.error('Error during logout: ' + errorMessage)
        router.push('/login')
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Signing you out...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete the logout process.
        </p>
      </div>
    </div>
  )
}