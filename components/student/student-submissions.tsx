'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Star, Edit, Eye } from 'lucide-react'

// Demo submission data - will be replaced with real data from backend
const demoSubmissions = [
  {
    id: '1',
    hackathonTitle: 'Green Tech Innovation Challenge',
    title: 'EcoTracker - App per il monitoraggio ambientale',
    submissionDate: '2024-01-28',
    status: 'submitted', // submitted, draft, evaluated, winner
    evaluation: {
      score: 85,
      feedback: 'Ottimo progetto con grande potenziale di impatto',
      evaluatedAt: '2024-01-30'
    },
    canEdit: false,
  },
  {
    id: '2',
    title: 'AI Learning Assistant',
    hackathonTitle: 'AI for Education Hackathon',
    submissionDate: '2024-01-25',
    status: 'evaluated',
    evaluation: {
      score: 92,
      feedback: 'Soluzione innovativa e ben implementata',
      evaluatedAt: '2024-01-27'
    },
    canEdit: false,
  },
  {
    id: '3',
    title: 'Blockchain Payment Gateway',
    hackathonTitle: 'FinTech Future 2024',
    submissionDate: null,
    status: 'draft',
    evaluation: null,
    canEdit: true,
  },
  {
    id: '4',
    title: 'Mental Health Tracker',
    hackathonTitle: 'Healthcare Innovation Lab',
    submissionDate: '2023-12-28',
    status: 'winner',
    evaluation: {
      score: 98,
      feedback: 'Progetto vincitore! Eccellente esecuzione e impatto sociale',
      evaluatedAt: '2023-12-30'
    },
    canEdit: false,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'submitted':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Inviata</span>
    case 'draft':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Bozza</span>
    case 'evaluated':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Valutata</span>
    case 'winner':
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">🏆 Vincitore</span>
    default:
      return null
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

export function StudentSubmissions() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-stencil text-2xl font-bold text-black flex items-center">
          <FileText className="mr-3 h-6 w-6" />
          Le mie Submission
        </h3>
        <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
          Nuova submission
        </Button>
      </div>

      <div className="space-y-4">
        {demoSubmissions.map((submission) => (
          <Card key={submission.id} className="bg-white border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 mb-4 lg:mb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-black text-lg mb-1">
                        {submission.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {submission.hackathonTitle}
                      </p>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3">
                    {submission.submissionDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Inviata: {new Date(submission.submissionDate).toLocaleDateString('it-IT')}</span>
                      </div>
                    )}
                    
                    {submission.evaluation && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        <span className={`font-medium ${getScoreColor(submission.evaluation.score)}`}>
                          Voto: {submission.evaluation.score}/100
                        </span>
                      </div>
                    )}
                  </div>

                  {submission.evaluation && submission.evaluation.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Feedback:</strong> {submission.evaluation.feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 lg:ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizza
                  </Button>
                  
                  {submission.canEdit && (
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifica
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backend integration comment */}
      {/* 
        TODO: Replace demo data with real API calls
        - Fetch user's submissions from /api/student/submissions
        - Include evaluation data when available
        - Handle file uploads for submission content
        - Implement real-time status updates
        - Add pagination and filtering options
        - Connect edit functionality to submission editor
      */}
    </div>
  )
}