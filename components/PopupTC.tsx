'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PopupTCProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  title?: string
  children?: ReactNode
  acceptButtonText?: string
  cancelButtonText?: string
  className?: string
}

export function PopupTC({
  isOpen,
  onClose,
  onAccept,
  title = "Terms and Conditions",
  children,
  acceptButtonText = "Accept",
  cancelButtonText = "Cancel",
  className
}: PopupTCProps) {
  if (!isOpen) return null

  const defaultTermsContent = (
    <div className="space-y-4 text-sm text-gray-600">
      <h3 className="text-lg font-semibold text-dark">ZEST Platform Terms and Conditions</h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-dark mb-1">1. Platform Usage</h4>
          <p>By using the ZEST platform, you agree to comply with all applicable laws and regulations.</p>
        </div>
        
        <div>
          <h4 className="font-medium text-dark mb-1">2. User Responsibilities</h4>
          <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
        </div>
        
        <div>
          <h4 className="font-medium text-dark mb-1">3. Content Guidelines</h4>
          <p>All content shared on the platform must be original, appropriate, and comply with community guidelines.</p>
        </div>
        
        <div>
          <h4 className="font-medium text-dark mb-1">4. Payment Terms</h4>
          <p>Campaign payments are processed according to the agreed terms between brands and creators.</p>
        </div>
        
        <div>
          <h4 className="font-medium text-dark mb-1">5. Privacy Policy</h4>
          <p>We are committed to protecting your privacy and handling your data responsibly.</p>
        </div>
        
        <div>
          <h4 className="font-medium text-dark mb-1">6. Modification of Terms</h4>
          <p>ZEST reserves the right to modify these terms at any time. Users will be notified of significant changes.</p>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 pt-4 border-t">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children || defaultTermsContent}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onAccept}
          >
            {acceptButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing TC popup state
export function useTermsAndConditions() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)

  const openTC = () => setIsOpen(true)
  const closeTC = () => setIsOpen(false)
  
  const acceptTC = () => {
    setHasAccepted(true)
    setIsOpen(false)
  }

  return {
    isOpen,
    hasAccepted,
    openTC,
    closeTC,
    acceptTC
  }
}