'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginForm } from '@/components/ui/LoginForm'

export default function LoginPage() {

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
        <LoginForm />

        <div className="mt-6 flex items-center justify-center">
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary-600"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

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