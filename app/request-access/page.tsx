'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading'
import { requestAccessSchema } from '@/lib/validations'
import { isPersonalEmailDomain, getCorporateEmailErrorMessage } from '@/lib/utils/email'
import { UserRole } from '@/types'
import { toast } from 'sonner'

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    email: '',
    role: 'student' as UserRole,
    first_name: '',
    last_name: '',
    company: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailValidationError, setEmailValidationError] = useState<string | null>(null)

  // Real-time email validation for corporate roles
  useEffect(() => {
    if (formData.email && (formData.role === 'brand' || formData.role === 'school_admin')) {
      if (isPersonalEmailDomain(formData.email)) {
        setEmailValidationError(getCorporateEmailErrorMessage(formData.role))
      } else {
        setEmailValidationError(null)
      }
    } else {
      setEmailValidationError(null)
    }
  }, [formData.email, formData.role])

  const requiresCorporateEmail = formData.role === 'brand' || formData.role === 'school_admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate input
      requestAccessSchema.parse(formData)
      
      // In a real implementation, this would send to an API endpoint
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Access request submitted successfully!')
      setSubmitted(true)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Please check your input and try again')
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center items-center space-x-2 mb-8">
            <div className="bg-primary rounded-lg p-2">
              <span className="text-dark font-display font-bold text-xl">Z</span>
            </div>
            <span className="font-display font-bold text-2xl text-dark">ZEST</span>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Request Submitted! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Thank you for your interest in joining ZEST! We&apos;ve received your access request and will review it shortly.
              </p>
              <p className="text-sm text-gray-500">
                You&apos;ll receive an email confirmation within 24-48 hours with next steps.
              </p>
              <div className="pt-4">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          Request Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our community of brands, students, and creators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Tell us about yourself</CardTitle>
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
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="John"
                    />
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
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark">
                  Email address
                  {requiresCorporateEmail && (
                    <span className="ml-1 text-xs text-gray-500">
                      (Company/institutional email required)
                    </span>
                  )}
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={
                      requiresCorporateEmail 
                        ? formData.role === 'brand' 
                          ? 'john@yourcompany.com' 
                          : 'john@yourinstitution.edu'
                        : 'john@example.com'
                    }
                    className={emailValidationError ? 'border-red-500 focus:ring-red-500' : ''}
                  />
                  {emailValidationError && (
                    <p className="mt-1 text-sm text-red-600">{emailValidationError}</p>
                  )}
                  {requiresCorporateEmail && !emailValidationError && formData.email && (
                    <p className="mt-1 text-sm text-green-600">✓ Valid corporate email</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-dark">
                  I am a
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="flex h-10 w-full rounded-lg border border-gray-light bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <option value="student">Student</option>
                    <option value="influencer">Influencer</option>
                    <option value="consumer">Consumer</option>
                    <option value="brand">Brand Representative (Requires corporate email)</option>
                    <option value="school_admin">School Administrator (Requires institutional email)</option>
                  </select>
                </div>
                {requiresCorporateEmail && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Email Requirements:</strong> {formData.role === 'brand' ? 'Company' : 'School/institutional'} representatives must use their official work email address. Personal email providers (Gmail, Yahoo, Outlook, etc.) are not allowed.
                    </p>
                  </div>
                )}
              </div>

              {(formData.role === 'brand' || formData.role === 'school_admin') && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-dark">
                    {formData.role === 'brand' ? 'Company' : 'School/Institution'}
                  </label>
                  <div className="mt-1">
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={formData.role === 'brand' ? 'Your company name' : 'Your school name'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark">
                  Tell us why you want to join ZEST
                </label>
                <div className="mt-1">
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your goals, experience, and how you plan to use ZEST..."
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !!emailValidationError}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
                {emailValidationError && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    Please fix the email address before submitting
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}