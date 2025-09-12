'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/types'
import { getRoleDisplayName } from '@/lib/auth'
import { getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronDown, User as UserIcon, Settings, LogOut } from 'lucide-react'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getDashboardUrl = () => {
    switch (user.role) {
      case 'super_admin':
        return '/dashboard/admin'
      case 'brand':
        return '/dashboard/brand'
      case 'school_admin':
        return '/dashboard/school'
      case 'student':
      case 'influencer':
      case 'consumer':
        return '/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-dark text-sm font-medium overflow-hidden">
          {user.profile.avatar_url ? (
            <Image 
              src={user.profile.avatar_url} 
              alt="Avatar" 
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getInitials(user.profile.first_name, user.profile.last_name)
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {user.profile.first_name}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-light/20 rounded-lg shadow-lg z-20">
            <div className="p-4 border-b border-gray-light/20">
              <p className="font-medium text-dark">
                {user.profile.first_name} {user.profile.last_name}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                {getRoleDisplayName(user.role)}
              </p>
            </div>
            
            <div className="py-2">
              <Link
                href={getDashboardUrl()}
                className="flex items-center px-4 py-2 text-sm text-dark hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="w-4 h-4 mr-3" />
                Dashboard
              </Link>
              
              <Link
                href="/dashboard/profile"
                className="flex items-center px-4 py-2 text-sm text-dark hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Profile Settings
              </Link>
            </div>
            
            <div className="border-t border-gray-light/20 py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-dark hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}