'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/file-upload'
import { User } from '@/types'
import { Database } from '@/types/supabase'

type Campaign = Database['public']['Tables']['campaigns']['Row']

interface CreateProjectFormProps {
  user: User
}

export function CreateProjectForm({ user }: CreateProjectFormProps) {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrls, setFileUrls] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAcceptedCampaigns = useCallback(async () => {
    try {
      // Get campaigns that the user has accepted
      const response = await fetch(`/api/campaign-acceptances?user_id=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const acceptedCampaignIds = data.acceptances?.map((acc: { campaign_id: string }) => acc.campaign_id) || []
        
        if (acceptedCampaignIds.length > 0) {
          // Fetch campaign details
          const campaignPromises = acceptedCampaignIds.map((id: string) =>
            fetch(`/api/campaigns/${id}`).then(res => res.json())
          )
          const campaignResponses = await Promise.all(campaignPromises)
          setCampaigns(campaignResponses.map(res => res.campaign).filter(Boolean))
        }
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setError('Errore nel caricamento delle campagne')
    }
  }, [user.id])

  useEffect(() => {
    fetchAcceptedCampaigns()
  }, [fetchAcceptedCampaigns])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCampaign || !title || !description) {
      setError('Tutti i campi obbligatori devono essere compilati')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: selectedCampaign,
          title,
          description,
          file_urls: fileUrls,
          image_urls: imageUrls,
        }),
      })

      if (response.ok) {
        router.push('/dashboard/student')
      } else {
        const error = await response.json()
        setError(error.error || 'Errore nella creazione del progetto')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      setError('Errore nella creazione del progetto')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!selectedCampaign || !title) {
      setError('Seleziona una campagna e inserisci un titolo per salvare la bozza')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: selectedCampaign,
          title,
          description,
          file_urls: fileUrls,
          image_urls: imageUrls,
        }),
      })

      if (response.ok) {
        router.push('/dashboard/student')
      } else {
        const error = await response.json()
        setError(error.error || 'Errore nel salvataggio della bozza')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      setError('Errore nel salvataggio della bozza')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (urls: string[]) => {
    setFileUrls(prev => [...prev, ...urls])
  }

  const handleImageUpload = (urls: string[]) => {
    setImageUrls(prev => [...prev, ...urls])
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nessuna campagna accettata
          </h3>
          <p className="text-gray-600 mb-4">
            Devi prima accettare una campagna per poter creare un progetto
          </p>
          <Button onClick={() => router.push('/dashboard/student')}>
            Torna alla Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Progetto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-1">
              Campagna *
            </label>
            <select
              id="campaign"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Seleziona una campagna</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titolo Progetto *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Inserisci il titolo del progetto"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione *
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi il tuo progetto, le idee, i materiali utilizzati e come risponde al brief della campagna"
              rows={6}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File e Immagini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Immagini Progetto</h4>
            <FileUpload
              bucket="project-files"
              folder={`${user.id}/${selectedCampaign || 'draft'}`}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxFiles={10}
              onUpload={handleImageUpload}
              onError={(error) => setError(error)}
              accept="image/*"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Documenti Aggiuntivi</h4>
            <FileUpload
              bucket="project-files"
              folder={`${user.id}/${selectedCampaign || 'draft'}`}
              allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              maxFiles={5}
              onUpload={handleFileUpload}
              onError={(error) => setError(error)}
              accept=".pdf,.doc,.docx"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Invio in corso...' : 'Invia Progetto'}
        </Button>
        <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={loading}>
          Salva Bozza
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/dashboard/student')}
        >
          Annulla
        </Button>
      </div>
    </form>
  )
}