'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  autoClose?: boolean
  duration?: number
  onClose?: () => void
  className?: string
}

const notificationStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const iconMap = {
  success: '✅',
  error: '❌', 
  warning: '⚠️',
  info: 'ℹ️'
}

export function Notification({
  type,
  title,
  message,
  autoClose = true,
  duration = 5000,
  onClose,
  className
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      "relative p-4 border rounded-lg",
      notificationStyles[type],
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{iconMap[type]}</span>
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          <p className={cn(
            "text-sm",
            title ? "mt-1" : ""
          )}>
            {message}
          </p>
        </div>
        
        <div className="ml-auto pl-3">
          <button
            onClick={handleClose}
            className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Notification provider/container for managing multiple notifications
interface NotificationItem extends NotificationProps {
  id: string
}

interface NotificationContainerProps {
  notifications: NotificationItem[]
  onRemove: (id: string) => void
  className?: string
}

export function NotificationContainer({ 
  notifications, 
  onRemove, 
  className 
}: NotificationContainerProps) {
  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full",
      className
    )}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  )
}