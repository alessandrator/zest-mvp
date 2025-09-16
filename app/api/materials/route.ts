import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { materialsService } from '@/lib/services/materials'

/**
 * Materials API Endpoint
 * 
 * Handles student uploads, school review, and super admin approval
 * 
 * Integration Notes:
 * - Replace with Express.js: app.get('/api/materials', async (req, res) => {...})
 * - Replace with Django: @api_view(['GET', 'POST']) in views.py
 * - Add real file upload handling (multer, django-storages, etc.)
 * - Implement real database queries instead of demo data
 */

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status'),
      studentId: searchParams.get('studentId'),
      schoolId: searchParams.get('schoolId'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    const materials = await materialsService.getMaterials(user, filters)
    return NextResponse.json(materials)

  } catch (error) {
    console.error('Materials API error:', error)
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
    const material = await materialsService.createMaterial(user, body)
    
    return NextResponse.json(material, { status: 201 })

  } catch (error) {
    console.error('Materials POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create material' }, 
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

    const material = await materialsService.updateMaterial(user, id, updates)
    return NextResponse.json(material)

  } catch (error) {
    console.error('Materials PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update material' }, 
      { status: 500 }
    )
  }
}