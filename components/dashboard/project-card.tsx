'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, ThumbsUp, ThumbsDown, FileText, Image } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row'] & {
  campaigns?: { title: string; brand_id: string }
  user_profiles?: { first_name: string; last_name: string; role: string }
}

interface ProjectCardProps {
  project: Project
  currentUserRole?: string
  showActions?: boolean
  onApprove?: (projectId: string) => void
  onReject?: (projectId: string, reason: string) => void
  onVote?: (projectId: string, value: number) => void
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const statusLabels = {
  draft: 'Bozza',
  submitted: 'Inviato',
  approved: 'Approvato',
  rejected: 'Rifiutato',
}

export function ProjectCard({ 
  project, 
  currentUserRole, 
  showActions = true,
  onApprove,
  onReject,
  onVote 
}: ProjectCardProps) {
  const canApprove = currentUserRole === 'super_admin' && project.status === 'submitted'
  const canVote = project.status === 'approved' && currentUserRole !== 'super_admin'

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {project.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Campagna: {project.campaigns?.title || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              Creatore: {project.user_profiles?.first_name} {project.user_profiles?.last_name}
            </p>
          </div>
          <Badge className={`${statusColors[project.status as keyof typeof statusColors]} border-0`}>
            {statusLabels[project.status as keyof typeof statusLabels]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* File attachments */}
        {(project.file_urls.length > 0 || project.image_urls.length > 0) && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Allegati:</p>
            <div className="flex flex-wrap gap-2">
              {project.file_urls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  <FileText size={12} />
                  File {index + 1}
                </a>
              ))}
              {project.image_urls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  <Image size={12} />
                  Img {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Rejection reason */}
        {project.status === 'rejected' && project.rejection_reason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm font-medium text-red-800 mb-1">Motivo del rifiuto:</p>
            <p className="text-sm text-red-700">{project.rejection_reason}</p>
          </div>
        )}

        {/* Submission/Approval dates */}
        <div className="text-xs text-gray-500 mb-4">
          <p>Creato: {new Date(project.created_at).toLocaleDateString('it-IT')}</p>
          {project.submitted_at && (
            <p>Inviato: {new Date(project.submitted_at).toLocaleDateString('it-IT')}</p>
          )}
          {project.approved_at && (
            <p>Approvato: {new Date(project.approved_at).toLocaleDateString('it-IT')}</p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>
                <Eye size={14} className="mr-1" />
                Visualizza
              </Link>
            </Button>

            {canApprove && onApprove && onReject && (
              <>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(project.id)}
                >
                  <ThumbsUp size={14} className="mr-1" />
                  Approva
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                  onClick={() => {
                    const reason = prompt('Inserisci il motivo del rifiuto:')
                    if (reason) onReject(project.id, reason)
                  }}
                >
                  <ThumbsDown size={14} className="mr-1" />
                  Rifiuta
                </Button>
              </>
            )}

            {canVote && onVote && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    size="sm"
                    variant="outline"
                    className="px-2 py-1 text-xs"
                    onClick={() => onVote(project.id, rating)}
                  >
                    {rating}⭐
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}