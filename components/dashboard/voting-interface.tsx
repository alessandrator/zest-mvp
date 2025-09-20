'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'

interface VotingInterfaceProps {
  targetTitle: string
  onVote?: (rating: number, comment?: string) => void
  disabled?: boolean
}

export function VotingInterface({ 
  targetTitle, 
  onVote, 
  disabled = false 
}: VotingInterfaceProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmitVote = async () => {
    if (rating === 0 || !onVote) return

    setLoading(true)
    try {
      await onVote(rating, comment.trim() || undefined)
      setRating(0)
      setComment('')
    } catch (error) {
      console.error('Error submitting vote:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= (hoveredRating || rating)
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => !disabled && setRating(starValue)}
          onMouseEnter={() => !disabled && setHoveredRating(starValue)}
          onMouseLeave={() => !disabled && setHoveredRating(0)}
          disabled={disabled}
          className={`${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
          } transition-all duration-200`}
        >
          <Star
            size={32}
            className={`${
              isFilled 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } transition-colors duration-200`}
          />
        </button>
      )
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Vota: {targetTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valutazione (1-5 stelle)
          </label>
          <div className="flex gap-1 mb-2">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600">
              Hai selezionato {rating} stella{rating !== 1 ? 'e' : ''}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Commento (opzionale)
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Lascia un commento sulla tua valutazione..."
            rows={3}
            disabled={disabled}
            maxLength={500}
          />
          {comment.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 caratteri
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmitVote}
            disabled={rating === 0 || loading || disabled}
            className="flex-1"
          >
            {loading ? 'Invio...' : 'Invia Voto'}
          </Button>
          {rating > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setRating(0)
                setComment('')
              }}
              disabled={loading || disabled}
            >
              Reset
            </Button>
          )}
        </div>

        {disabled && (
          <p className="text-sm text-gray-500 text-center">
            Hai già votato per questo elemento
          </p>
        )}
      </CardContent>
    </Card>
  )
}