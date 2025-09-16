'use client'

import { User } from '@/types'
import { StudentHeader } from './student-header'
import { StudentHero } from './student-hero'
import { StudentHackathons } from './student-hackathons'
import { StudentSubmissions } from './student-submissions'
import { StudentBadges } from './student-badges'

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcff59' }}>
      {/* Student-specific header with navigation */}
      <StudentHeader user={user} />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero/Overview section */}
        <StudentHero user={user} />
        
        {/* I miei hackathon section */}
        <StudentHackathons />
        
        {/* Submission section */}
        <StudentSubmissions />
        
        {/* Badge section */}
        <StudentBadges />
      </div>
    </div>
  )
}