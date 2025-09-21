'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
 main

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password })
    setPasswordErrors(validatePassword(password))
  }

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
        toast.success('Account created successfully! Please check your email to verify your account.')
        router.push('/login')
      } else {
        toast.error(result.error || 'Failed to create account')
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
        toast.error(error.message)
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
          Join the ZEST community to connect brands with students and influencers
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
                    First Name
                  </label>
                  <div className="mt-1">
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
copilot/fix-7bdb2f18-417e-4681-b8f8-61934555f51e
                      autoComplete="given-name"
                      required
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}

                      className={validationErrors.first_name ? 'border-red-500' : ''}
                    />
                    {validationErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.first_name}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-dark">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      autoComplete="family-name"
                      required
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    placeholder="Create a password"
                    value={formData.password}
<Input
  id="password"
  name="password"
  type="password"
  autoComplete="new-password"
  placeholder="Create a password"
  value={formData.password}
  onChange={e => {
    handleInputChange('password', e.target.value);
    handlePasswordChange(e.target.value);
  }}
  className={validationErrors.password || passwordErrors.length > 0 ? 'border-red-500' : ''}
/>
{validationErrors.password && (
  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
)}
{passwordErrors.length > 0 && (
  <div className="mt-1">
    {passwordErrors.map((error, index) => (
      <p key={index} className="text-sm text-red-600">{error}</p>
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
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="consumer">Consumer</option>
                    <option value="influencer">Influencer</option>
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
        onChange={e => handleInputChange('company', e.target.value)}
        placeholder="Enter your company or organization name"
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
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}