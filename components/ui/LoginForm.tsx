'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading'
import { signInSchema } from '@/lib/validations'
import { toast } from 'sonner'

export function LoginForm() {
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
        console.log('[Login] Session details:', {
          userId: data.session.user.id,
          email: data.session.user.email,
          expiresAt: data.session.expires_at,
          tokenType: data.session.token_type
        })
        
        // Force session refresh to ensure server-client sync
        console.log('[Login] Refreshing session to ensure persistence...')
        const refreshResult = await supabase.auth.refreshSession()
        console.log('[Login] Session refresh result:', { 
          hasSession: !!refreshResult.data?.session,
          hasUser: !!refreshResult.data?.user,
          error: refreshResult.error?.message 
        })
        
        if (refreshResult.error) {
          console.error('[Login] Session refresh failed:', refreshResult.error)
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
        
        // Set session via API route to ensure proper cookie handling
        try {
          console.log('[Login] Setting session via API route...')
          const response = await fetch('/api/auth/set-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          })

          if (response.ok) {
            console.log('[Login] Session set via API route successfully')
          } else {
            console.warn('[Login] Failed to set session via API route, continuing anyway')
          }
        } catch (apiError) {
          console.warn('[Login] Error calling set-session API:', apiError)
          // Don't fail the login process if API call fails
        }
        
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
  )
}