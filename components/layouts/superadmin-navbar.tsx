import Link from 'next/link'
import { User } from '@/types'
import { UserMenu } from './user-menu'
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Megaphone, 
  UserCheck, 
  CreditCard,
  Shield
} from 'lucide-react'

interface SuperadminNavbarProps {
  user: User
}

/**
 * Superadmin Navigation Bar
 * 
 * Specialized navigation for super admin users with access to all platform sections.
 * Includes ZEST branding and role-specific menu items.
 * 
 * Backend Integration Points:
 * - User authentication state
 * - Role-based navigation visibility
 * - Logout functionality
 */
export function SuperadminNavbar({ user }: SuperadminNavbarProps) {
  const menuItems = [
    { href: '/dashboard/admin/users', label: 'Utenti', icon: Users },
    { href: '/dashboard/admin/brands', label: 'Brand', icon: Building2 },
    { href: '/dashboard/admin/schools', label: 'Scuole', icon: GraduationCap },
    { href: '/dashboard/admin/campaigns', label: 'Campagne', icon: Megaphone },
    { href: '/dashboard/admin/influencers', label: 'Influencer', icon: UserCheck },
    { href: '/dashboard/admin/payments', label: 'Pagamenti', icon: CreditCard },
    { href: '/dashboard/admin/anonymization', label: 'Anonimizzazione', icon: Shield },
  ]

  return (
    <nav className="border-b-2 border-zest-black bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/dashboard/admin" className="flex items-center space-x-3">
            <div className="bg-zest-bg rounded-lg p-3 border-2 border-zest-black">
              <span className="text-zest-black font-stencil font-bold text-2xl">Z</span>
            </div>
            <div>
              <span className="font-stencil font-bold text-2xl text-zest-black">ZEST</span>
              <div className="text-sm text-gray-600 font-medium">Superadmin Dashboard</div>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-zest-black hover:bg-zest-bg hover:border border-zest-black transition-all duration-200"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-zest-black">
                {user.profile.first_name} {user.profile.last_name}
              </div>
              <div className="text-xs text-gray-600">Super Administrator</div>
            </div>
            <UserMenu user={user} />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden border-t border-gray-200 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center space-y-1 p-3 rounded-md text-xs font-medium text-zest-black hover:bg-zest-bg hover:border border-zest-black transition-all duration-200"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}