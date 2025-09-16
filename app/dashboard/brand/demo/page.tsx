import { BrandDashboardClient } from '@/components/dashboard/brand-dashboard-client'

// Demo user data for testing the dashboard layout
const demoUser = {
  id: 'demo-user-id',
  email: 'brand@example.com',
  role: 'brand' as const,
  profile: {
    id: 'demo-profile-id',
    user_id: 'demo-user-id',
    first_name: 'Marco',
    last_name: 'Rossi',
    avatar_url: null,
    phone: null,
    company: 'Brand Demo SRL',
    school_id: null,
    bio: 'Marketing manager presso Brand Demo',
    website: 'https://branddemo.com',
    social_links: null,
    verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export default function BrandDashboardDemo() {
  return <BrandDashboardClient user={demoUser} />
}