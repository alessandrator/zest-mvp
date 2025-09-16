import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { correctionsService } from '@/lib/services/corrections'

/**
 * Corrections API Endpoint
 * 
 * Handles teacher feedback, notes, and approval workflow
 * 
 * Integration Notes:
 * - Replace with Express.js: app.get('/api/corrections', async (req, res) => {...})
 * - Replace with Django: @api_view(['GET', 'POST']) in views.py
 * - Add real-time updates using WebSocket/Socket.io for instant feedback
 * - Implement rich text editor support for correction notes
 */

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      materialId: searchParams.get('materialId'),
      studentId: searchParams.get('studentId'),
      schoolId: searchParams.get('schoolId'),
      status: searchParams.get('status'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    const corrections = await correctionsService.getCorrections(user, filters)
    return NextResponse.json(corrections)

  } catch (error) {
    console.error('Corrections API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const correction = await correctionsService.createCorrection(user, body)
    
    return NextResponse.json(correction, { status: 201 })

  } catch (error) {
    console.error('Corrections POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create correction' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    const correction = await correctionsService.updateCorrection(user, id, updates)
    return NextResponse.json(correction)

  } catch (error) {
    console.error('Corrections PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update correction' }, 
      { status: 500 }
    )
  }
}