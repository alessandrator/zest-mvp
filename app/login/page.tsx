'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading'
import { signInSchema } from '@/lib/validations'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('[Login] Starting sign-in process for:', email)

    try {
      // Validate input
      const validatedData = signInSchema.parse({ email, password })
      
      const supabase = createClient()
      console.log('[Login] Attempting signInWithPassword...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

      console.log('[Login] SignIn response:', { 
        hasSession: !!data?.session, 
        hasUser: !!data?.user,
        error: error?.message 
      })

      if (error) {
        console.error('[Login] SignIn error:', error)
        // Check if it's a configuration error vs actual auth error
        if (error.message?.includes('not configured')) {
          toast.error('Authentication service is not configured. Please contact support.')
        } else {
          toast.error(error.message)
        }
        return
      }

      if (data.session) {
        // Session established successfully
        console.log('[Login] Session established:', data.session.user.id)
        toast.success('Login successful! Redirecting...')
        
        // Force session refresh to ensure server-client sync
        console.log('[Login] Refreshing session...')
        const refreshResult = await supabase.auth.refreshSession()
        console.log('[Login] Session refresh result:', { 
          hasSession: !!refreshResult.data?.session,
          error: refreshResult.error?.message 
        })
        
        // Check if we can get the session back
        const { data: sessionCheck } = await supabase.auth.getSession()
        console.log('[Login] Session check after refresh:', { 
          hasSession: !!sessionCheck.session,
          userId: sessionCheck.session?.user?.id 
        })
        
        // Add a longer delay to ensure session cookies are properly set
        console.log('[Login] Waiting 1 second for cookies to be set...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to callback page for proper session validation
        console.log('[Login] Redirecting to callback...')
        router.push('/callback')
      } else {
        // No session established
        console.error('[Login] No session in response data')
        toast.error('Failed to establish session. Please try again.')
      }
    } catch (error) {
      console.error('[Login] Catch block error:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center space-x-2 mb-8">
          <div className="bg-primary rounded-lg p-2">
            <span className="text-dark font-logo font-bold text-xl">Z</span>
          </div>
          <span className="font-logo font-bold text-2xl text-dark">ZEST</span>
        </Link>
        
        <h2 className="text-center text-3xl font-display font-bold text-dark">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary-600"
          >
            Sign up
          </Link>
          {' '}or{' '}
          <Link
            href="/request-access"
            className="font-medium text-primary hover:text-primary-600"
          >
            request access to join
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark">
                  Email address
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark">
                  Password
                </label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:text-primary-600"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">New to ZEST?</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button className="w-full" asChild>
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/signup">
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}