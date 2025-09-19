import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { StudentDashboard } from '@/components/student/student-dashboard'

export default async function StudentDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Only allow students to access this page
  if (user.role !== 'student') {
    redirect('/dashboard')
  }

  return <StudentDashboard user={user} />
}