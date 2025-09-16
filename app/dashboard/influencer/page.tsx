import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { InfluencerDashboard } from '@/components/dashboard/influencer-dashboard'

export default async function InfluencerDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Ensure only influencers can access this dashboard
  if (user.role !== 'influencer') {
    redirect('/dashboard')
  }

  return <InfluencerDashboard user={user} />
}