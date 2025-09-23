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
      console.log('[Login] Current cookies before login:', document.cookie)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

      console.log('[Login] SignIn response:', { 
        hasSession: !!data?.session, 
        hasUser: !!data?.user,
        sessionUserId: data?.session?.user?.id,
        accessToken: !!data?.session?.access_token,
        refreshToken: !!data?.session?.refresh_token,
        error: error?.message
      })

      if (error) {
        console.error('[Login] Authentication error:', error)
        toast.error(error.message)
        return
      }

      if (data?.session) {
        // Session established successfully
        console.log('[Login] Session established successfully')
        console.log('[Login] Session details:', {
          userId: data.session.user.id,
          email: data.session.user.email,
          accessToken: !!data.session.access_token,
          refreshToken: !!data.session.refresh_token,
          expiresAt: data.session.expires_at
        })

        // Try refreshing session to ensure it's properly established
        const { data: refreshResult, error: refreshError } = await supabase.auth.refreshSession()
        console.log('[Login] Session refresh result:', {
          hasSession: !!refreshResult.data?.session,
          hasUser: !!refreshResult.data?.user,
          error: refreshResult.error?.message 
        })
        
        if (refreshError) {
          console.error('[Login] Session refresh failed:', refreshError)
          toast.error('Failed to establish session. Please try again.')
          return
        }
        
        // Check if we can get the session back
        const { data: sessionCheck, error: sessionCheckError } = await supabase.auth.getSession()
        console.log('[Login] Session check after refresh:', { 
          hasSession: !!sessionCheck.session,
          userId: sessionCheck.session?.user?.id,
          error: sessionCheckError?.message
        })
        
        if (sessionCheckError) {
          console.error('[Login] Session check error:', sessionCheckError)
          toast.error('Failed to verify session. Please try again.')
          return
        }
        
        // Log cookies after successful authentication
        console.log('[Login] Cookies after authentication:', document.cookie)
        
        // Wait exactly 1 second as required for cookies/session to be properly set
        console.log('[Login] Waiting 1 second for cookies to be set...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('[Login] Cookies after 1 second delay:', document.cookie)
        
        // Show success message
        toast.success('Login successful! Redirecting...')
        
        // Redirect to callback page for proper session validation as required
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
        console.error('[Login] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        toast.error(error.message)
      } else {
        console.error('[Login] Unknown error:', error)
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
              <Link href="/request-access">
                Request Access
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}