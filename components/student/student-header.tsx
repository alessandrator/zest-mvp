'use client'

import Link from 'next/link'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Trophy, 
  FileText, 
  Award, 
  User as UserIcon, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface StudentHeaderProps {
  user: User
}

export function StudentHeader({ }: StudentHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Le mie Classi', href: '/dashboard/student/classes', icon: BookOpen },
    { label: 'Miei Hackathon', href: '/dashboard/student/hackathons', icon: Trophy },
    { label: 'Submission', href: '/dashboard/student/submissions', icon: FileText },
    { label: 'Badge', href: '/dashboard/student/badges', icon: Award },
    { label: 'Profilo', href: '/dashboard/student/profile', icon: UserIcon },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard/student" className="flex items-center space-x-3">
            <div className="bg-black rounded-lg p-2">
              <span className="text-white font-stencil font-bold text-xl">Z</span>
            </div>
            <h1 className="font-stencil font-bold text-2xl text-black">
              Student Dashboard
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-black text-black hover:bg-black hover:text-white"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-black hover:text-gray-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start space-x-2 mt-4 border-black text-black hover:bg-black hover:text-white"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}