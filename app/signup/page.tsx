'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading'
import { signUpSchema } from '@/lib/validations'
import { UserRole } from '@/types'
import { toast } from 'sonner'
import { ZodError } from 'zod'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as UserRole,
    first_name: '',
    last_name: '',
    company: '',
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
  setFormData({ ...formData, [field]: value })
  // Clear validation error when user starts typing
  if (validationErrors[field]) {
    setValidationErrors({ ...validationErrors, [field]: '' })
  }
}

  const validatePassword = (password: string) => {
  const errors: string[] = []
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  return errors
  }


const handlePasswordChange = (password: string) => {
  setFormData({ ...formData, password })
  setPasswordErrors(validatePassword(password))
}

  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setValidationErrors({})

    try {
      // Validate input
      const validatedData = signUpSchema.parse(formData)
      
      // Send signup request to API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (response.ok) {
        // Check if user is immediately signed in (depends on Supabase config)
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // User is signed in, redirect to callback
          toast.success('Account created successfully! Welcome to ZEST.')
          router.push('/callback')
        } else {
          // Email verification required
          toast.success('Account created successfully! Please check your email to verify your account.')
          router.push('/login')
        }
      } else {
        // Show specific error messages from the server
        let errorMessage = result.error || 'Failed to create account'
        
        // Add request ID if available for support purposes
        if (result.requestId) {
          console.error(`Signup failed with request ID: ${result.requestId}`)
          if (process.env.NODE_ENV === 'development') {
            errorMessage += ` (Request ID: ${result.requestId})`
          }
        }
        
        toast.error(errorMessage)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const path = issue.path[0] as string
          errors[path] = issue.message
        })
        setValidationErrors(errors)
        toast.error('Please fix the validation errors')
      } else if (error instanceof Error) {

        // Network or other errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again.')
        } else {
          toast.error(error.message)
        }

      } else {
        toast.error('Failed to create account. Please try again.')
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
            <span className="text-dark font-display font-bold text-xl">Z</span>
          </div>
          <span className="font-display font-bold text-2xl text-dark">ZEST</span>
        </Link>
        
        <h2 className="text-center text-3xl font-display font-bold text-dark">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-600"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign up for ZEST</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-dark">
                    First name
                  </label>
                  <div className="mt-1">
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="First name"
                      className={validationErrors.first_name ? 'border-red-500' : ''}
                    />
                    {validationErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.first_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-dark">
                    Last name
                  </label>
                  <div className="mt-1">
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Last name"
                      className={validationErrors.last_name ? 'border-red-500' : ''}
                    />
                    {validationErrors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.last_name}</p>
                    )}
                  </div>
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />

{validationErrors.email && (
  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
)}
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      handleInputChange('password', e.target.value)
                      handlePasswordChange(e.target.value)
                    }}
                    placeholder="Enter your password"
                    className={validationErrors.password ? 'border-red-500' : ''}
                  />

{validationErrors.password && (
  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
)}
{passwordErrors.length > 0 && (
  <div className="mt-2">
    {passwordErrors.map((error, index) => (
      <p key={index} className="text-sm text-red-600">
        {error}
      </p>
    ))}
  </div>
)}
<div className="mt-2 text-sm text-gray-600">
  <p>Password requirements</p>
  <ul className="list-disc list-inside text-xs mt-1">
    <li>At least 8 characters</li>
    <li>At least one uppercase letter</li>
    <li>At least one number</li>
  </ul>
</div>

                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-dark">
                  I am a...
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="influencer">Influencer</option>
                    <option value="consumer">Consumer</option>
                    <option value="brand">Brand Representative</option>
                    <option value="school_admin">School Administrator</option>
                  </select>
                  {validationErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                  )}
                </div>
              </div>

{(formData.role === 'brand' || formData.role === 'school_admin') && (
  <div>
    <label htmlFor="company" className="block text-sm font-medium text-dark">
      Company/Organization
    </label>
    <div className="mt-1">
      <Input
        id="company"
        name="company"
        type="text"
        autoComplete="organization"
        value={formData.company}
        onChange={(e) => handleInputChange('company', e.target.value)}
        placeholder="Your company or organization"
        className={validationErrors.company ? 'border-red-500' : ''}
      />
      {validationErrors.company && (
        <p className="mt-1 text-sm text-red-600">{validationErrors.company}</p>
      )}
    </div>
  </div>
)}

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || passwordErrors.length > 0}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
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
              <span className="px-2 bg-gray-50 text-gray-500">Need approval first?</span>
            </div>
          </div>

          <div className="mt-6">
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