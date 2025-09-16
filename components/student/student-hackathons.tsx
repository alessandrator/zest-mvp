'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, Users, Clock } from 'lucide-react'

// Demo hackathon data - will be replaced with real data from backend
const demoHackathons = [
  {
    id: '1',
    title: 'Green Tech Innovation Challenge',
    description: 'Sviluppa soluzioni innovative per la sostenibilità ambientale',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    participants: 156,
    userStatus: 'participating', // participating, not_participating, completed
  },
  {
    id: '2',
    title: 'AI for Education Hackathon',
    description: 'Crea strumenti di intelligenza artificiale per migliorare l\'apprendimento',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-01-30',
    participants: 89,
    userStatus: 'participating',
  },
  {
    id: '3',
    title: 'FinTech Future 2024',
    description: 'Rivoluziona il settore finanziario con nuove tecnologie',
    status: 'upcoming',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    participants: 0,
    userStatus: 'not_participating',
  },
  {
    id: '4',
    title: 'Healthcare Innovation Lab',
    description: 'Soluzioni digitali per migliorare la salute e il benessere',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    participants: 234,
    userStatus: 'completed',
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Attivo</span>
    case 'upcoming':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">In arrivo</span>
    case 'completed':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Completato</span>
    default:
      return null
  }
}

const getActionButton = (hackathon: { userStatus: string }) => {
  switch (hackathon.userStatus) {
    case 'participating':
      return (
        <Button size="sm" className="bg-black text-white hover:bg-gray-800">
          Visualizza
        </Button>
      )
    case 'not_participating':
      return (
        <Button size="sm" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
          Partecipa
        </Button>
      )
    case 'completed':
      return (
        <Button size="sm" variant="outline" className="border-gray-400 text-gray-600">
          Risultati
        </Button>
      )
    default:
      return null
  }
}

export function StudentHackathons() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-stencil text-2xl font-bold text-black flex items-center">
          <Trophy className="mr-3 h-6 w-6" />
          I miei Hackathon
        </h3>
        <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
          Vedi tutti
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {demoHackathons.map((hackathon) => (
          <Card key={hackathon.id} className="bg-white border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-black pr-4">
                  {hackathon.title}
                </CardTitle>
                {getStatusBadge(hackathon.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                {hackathon.description}
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(hackathon.startDate).toLocaleDateString('it-IT')} - {' '}
                    {new Date(hackathon.endDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{hackathon.participants} partecipanti</span>
                </div>
                
                {hackathon.status === 'active' && (
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Scadenza: {new Date(hackathon.endDate).toLocaleDateString('it-IT')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                {getActionButton(hackathon)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backend integration comment */}
      {/* 
        TODO: Replace demo data with real API calls
        - Fetch user's hackathons from /api/student/hackathons
        - Include user participation status
        - Handle pagination for large lists
        - Add filtering by status (active, upcoming, completed)
        - Implement real-time updates for status changes
      */}
    </div>
  )
}