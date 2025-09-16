'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, Star, Trophy, Target, Zap, Shield } from 'lucide-react'

// Demo badge data - will be replaced with real data from backend
const demoBadges = {
  earned: [
    {
      id: '1',
      name: 'First Submission',
      description: 'Invia la tua prima submission',
      icon: 'Trophy',
      earnedAt: '2024-01-15',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Team Player',
      description: 'Partecipa a un hackathon in team',
      icon: 'Star',
      earnedAt: '2024-01-20',
      rarity: 'common'
    },
    {
      id: '3',
      name: 'Innovation Master',
      description: 'Vinci un hackathon',
      icon: 'Award',
      earnedAt: '2023-12-30',
      rarity: 'legendary'
    },
    {
      id: '4',
      name: 'Speed Coder',
      description: 'Completa una submission in meno di 24 ore',
      icon: 'Zap',
      earnedAt: '2024-01-25',
      rarity: 'rare'
    },
    {
      id: '5',
      name: 'Consistent Contributor',
      description: 'Partecipa a 5 hackathon consecutivi',
      icon: 'Shield',
      earnedAt: '2024-01-28',
      rarity: 'epic'
    }
  ],
  available: [
    {
      id: '6',
      name: 'Mentor',
      description: 'Aiuta altri studenti in un hackathon',
      icon: 'Target',
      progress: 2,
      target: 3,
      rarity: 'rare'
    },
    {
      id: '7',
      name: 'All-Rounder',
      description: 'Partecipa a hackathon di 3 categorie diverse',
      icon: 'Star',
      progress: 2,
      target: 3,
      rarity: 'epic'
    }
  ]
}

const iconMap = {
  Trophy,
  Star,
  Award,
  Target,
  Zap,
  Shield
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-400 bg-gray-50'
    case 'rare':
      return 'border-blue-400 bg-blue-50'
    case 'epic':
      return 'border-purple-400 bg-purple-50'
    case 'legendary':
      return 'border-yellow-400 bg-yellow-50'
    default:
      return 'border-gray-400 bg-gray-50'
  }
}

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'Comune'
    case 'rare':
      return 'Raro'
    case 'epic':
      return 'Epico'
    case 'legendary':
      return 'Leggendario'
    default:
      return 'Comune'
  }
}

export function StudentBadges() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-stencil text-2xl font-bold text-black flex items-center">
          <Award className="mr-3 h-6 w-6" />
          I miei Badge
        </h3>
        <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
          Vedi tutti i badge
        </Button>
      </div>

      {/* Earned Badges */}
      <div className="mb-8">
        <h4 className="font-semibold text-lg text-black mb-4">Badge Ottenuti ({demoBadges.earned.length})</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {demoBadges.earned.map((badge) => {
            const IconComponent = iconMap[badge.icon as keyof typeof iconMap]
            return (
              <Card key={badge.id} className={`bg-white border-2 shadow-lg hover:shadow-xl transition-shadow ${getRarityColor(badge.rarity)}`}>
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <IconComponent className="h-8 w-8 mx-auto text-black" />
                  </div>
                  <h5 className="font-semibold text-black text-sm mb-1">
                    {badge.name}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">
                    {badge.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    <div className="font-medium">{getRarityText(badge.rarity)}</div>
                    <div>Ottenuto: {new Date(badge.earnedAt).toLocaleDateString('it-IT')}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Progress towards new badges */}
      <div>
        <h4 className="font-semibold text-lg text-black mb-4">Obiettivi in Corso</h4>
        <div className="space-y-4">
          {demoBadges.available.map((badge) => {
            const IconComponent = iconMap[badge.icon as keyof typeof iconMap]
            const progressPercentage = (badge.progress / badge.target) * 100
            
            return (
              <Card key={badge.id} className="bg-white border-2 border-black shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getRarityColor(badge.rarity)}`}>
                      <IconComponent className="h-6 w-6 text-black" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-black">
                          {badge.name}
                        </h5>
                        <span className="text-sm text-gray-600">
                          {getRarityText(badge.rarity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {badge.description}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-medium text-black">
                            {badge.progress}/{badge.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Backend integration comment */}
      {/* 
        TODO: Replace demo data with real API calls
        - Fetch user's badges from /api/student/badges
        - Include progress tracking for incomplete badges
        - Implement badge unlock animations
        - Add badge sharing functionality
        - Connect to achievement system in backend
        - Add notifications for new badge unlocks
      */}
    </div>
  )
}