'use client'

import { ClientAuthGuard } from '@/components/auth/client-auth-guard'

interface DashboardClientWrapperProps {
  children: React.ReactNode
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  return (
    <ClientAuthGuard>
      {children}
    </ClientAuthGuard>
  )
}