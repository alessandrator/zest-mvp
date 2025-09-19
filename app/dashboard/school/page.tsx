import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { SchoolAdminDashboard } from '@/components/dashboard/school-admin-dashboard'

export default async function SchoolDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'school_admin') {
    redirect('/dashboard')
  }

  return <SchoolAdminDashboard user={user} />
}