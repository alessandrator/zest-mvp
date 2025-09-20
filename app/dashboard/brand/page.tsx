import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { BrandDashboard } from '@/components/dashboard/brand-dashboard'

export default async function BrandDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'brand') {
    redirect('/dashboard')
  }

  return <BrandDashboard user={user} />
}