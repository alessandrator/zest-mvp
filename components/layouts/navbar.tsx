import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User } from '@/types'
import { UserMenu } from './user-menu'

interface NavbarProps {
  user?: User | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="border-b border-gray-light/20 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <span className="text-dark font-display font-bold text-xl">Z</span>
            </div>
            <span className="font-display font-bold text-xl text-dark">ZEST</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/campaigns" 
              className="text-dark hover:text-primary transition-colors"
            >
              Campaigns
            </Link>
            <Link 
              href="/about" 
              className="text-dark hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-dark hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* User Menu or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/request-access">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-light/20">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/campaigns"
            className="block px-3 py-2 text-dark hover:text-primary transition-colors"
          >
            Campaigns
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-dark hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-dark hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}