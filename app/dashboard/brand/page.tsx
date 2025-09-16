import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { BrandDashboardClient } from '@/components/dashboard/brand-dashboard-client'

export default async function BrandDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Only allow brand users to access this dashboard
  if (user.role !== 'brand') {
    redirect('/dashboard')
  }

  return <BrandDashboardClient user={user} />
}