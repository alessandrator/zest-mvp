import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User } from '@/types'
import { UserMenu } from './layouts/user-menu'

interface HeaderProps {
  user?: User | null
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export function Header({ user, title, showBackButton = false, backHref = "/" }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-light/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section with logo and optional back button */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={backHref}>
                  ← Back
                </Link>
              </Button>
            )}
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-2">
                <span className="text-dark font-display font-bold text-xl">Z</span>
              </div>
              <span className="font-display font-bold text-xl text-dark">ZEST</span>
            </Link>
            
            {title && (
              <div className="hidden md:block">
                <span className="text-gray-400 mx-2">|</span>
                <h1 className="text-lg font-semibold text-dark">{title}</h1>
              </div>
            )}
          </div>

          {/* Right section with user menu */}
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
    </header>
  )
}