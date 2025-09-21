import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'

export default async function StudentDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (!['student', 'influencer'].includes(user.role)) {
    redirect('/dashboard')
  }

  return <StudentDashboard user={user} />
}