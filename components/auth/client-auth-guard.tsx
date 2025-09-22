'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { requireClientAuth } from '@/lib/auth/client'
import { LoadingSpinner } from '@/components/ui/loading'

interface ClientAuthGuardProps {
  children: React.ReactNode
}

export function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await requireClientAuth()
        
        if (user) {
          setIsAuthenticated(true)
        } else {
          // No valid session, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
        router.push('/login')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyAuth()
  }, [router])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">Verifying authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirecting to login
  }

  return <>{children}</>
}