'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  content: ReactNode
  badge?: string | number
  disabled?: boolean
}

interface TabProps {
  tabs: TabItem[]
  defaultTab?: string
  className?: string
  onTabChange?: (tabId: string) => void
}

export function Tab({ tabs, defaultTab, className, onTabChange }: TabProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-light/20">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 text-gray-600"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTabContent}
      </div>
    </div>
  )
}