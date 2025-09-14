'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarItem {
  label: string
  href: string
  icon?: string
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn("w-64 bg-white border-r border-gray-light/20 h-full", className)}>
      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-600 hover:text-dark hover:bg-gray-50"
              )}
            >
              <div className="flex items-center space-x-3">
                {item.icon && (
                  <span className="text-lg">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}