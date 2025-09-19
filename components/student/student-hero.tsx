'use client'

import { User } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, FileText, Award, BookOpen } from 'lucide-react'

interface StudentHeroProps {
  user: User
}

// Demo data - will be replaced with real data from backend
const demoStats = {
  activeHackathons: 3,
  totalSubmissions: 12,
  earnedBadges: 5,
  activeClasses: 2
}

export function StudentHero({ user }: StudentHeroProps) {
  return (
    <div className="mb-12">
      {/* Welcome message */}
      <div className="mb-8">
        <h2 className="font-stencil text-4xl font-bold text-black mb-2">
          Ciao, {user.profile.first_name}!
        </h2>
        <p className="text-gray-700 text-lg">
          Benvenuto nella tua dashboard studente. Qui puoi gestire i tuoi hackathon, submission e badge.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hackathon Attivi
              </CardTitle>
              <Trophy className="h-5 w-5 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-stencil font-bold text-black">
              {demoStats.activeHackathons}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              In corso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Submission Totali
              </CardTitle>
              <FileText className="h-5 w-5 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-stencil font-bold text-black">
              {demoStats.totalSubmissions}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Inviate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Badge Ottenuti
              </CardTitle>
              <Award className="h-5 w-5 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-stencil font-bold text-black">
              {demoStats.earnedBadges}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Sbloccati
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Classi Attive
              </CardTitle>
              <BookOpen className="h-5 w-5 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-stencil font-bold text-black">
              {demoStats.activeClasses}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Iscrizioni
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}