'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/hooks/use-session'
import { LoadingSpinner } from '@/components/ui/loading'

interface ClientAuthGuardProps {
  children: React.ReactNode
}

export function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const { user, loading, error } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If we're not loading and there's no user, redirect to login
    if (!loading && !user) {
      console.log('No user found in ClientAuthGuard, redirecting to login')
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">Verifying authentication...</p>
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Authentication error occurred</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // If no user and not loading, we're redirecting (return null to prevent flash)
  if (!user) {
    return null
  }

  return <>{children}</>
}