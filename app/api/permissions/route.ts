import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { permissionsService } from '@/lib/services/permissions'

/**
 * Permissions API Endpoint
 * 
 * Handles user permissions, student authorization/blocking, and access control
 * 
 * Integration Notes:
 * - Replace with Express.js: app.get('/api/permissions', async (req, res) => {...})
 * - Replace with Django: @api_view(['GET', 'POST']) in views.py
 * - Implement with role-based access control (RBAC) library
 * - Add permission caching for better performance
 */

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      userId: searchParams.get('userId'),
      schoolId: searchParams.get('schoolId'),
      role: searchParams.get('role'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    const permissions = await permissionsService.getPermissions(user, filters)
    return NextResponse.json(permissions)

  } catch (error) {
    console.error('Permissions API error:', error)
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
    const permission = await permissionsService.updateUserPermission(user, body)
    
    return NextResponse.json(permission, { status: 201 })

  } catch (error) {
    console.error('Permissions POST error:', error)
    return NextResponse.json(
      { error: 'Failed to update permission' }, 
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
    const { userId, action, ...data } = body

    let result
    switch (action) {
      case 'block':
        result = await permissionsService.blockUser(user, userId, data.reason)
        break
      case 'unblock':
        result = await permissionsService.unblockUser(user, userId)
        break
      case 'authorize':
        result = await permissionsService.authorizeUser(user, userId, data.permissions)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Permissions PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update permission' }, 
      { status: 500 }
    )
  }
}