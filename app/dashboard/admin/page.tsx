import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return <AdminDashboard user={user} />
}