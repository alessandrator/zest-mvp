// Development preview version of student dashboard
import { StudentDashboard } from '@/components/student/student-dashboard'

// Mock user data for testing
const mockUser = {
  id: '1',
  email: 'student@example.com',
  role: 'student' as const,
  profile: {
    id: '1',
    user_id: '1',
    first_name: 'Marco',
    last_name: 'Rossi',
    avatar_url: null,
    phone: null,
    company: null,
    school_id: '1',
    bio: null,
    website: null,
    social_links: null,
    verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export default function StudentDashboardPreview() {
  return <StudentDashboard user={mockUser} />
}