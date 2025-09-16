import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { notificationsService } from '@/lib/services/notifications'

/**
 * Notifications API Endpoint
 * 
 * Handles real-time notifications between all dashboard roles
 * 
 * Integration Notes:
 * - Replace with Express.js: app.get('/api/notifications', async (req, res) => {...})
 * - Replace with Django: @api_view(['GET', 'POST']) in views.py
 * - Add WebSocket support for real-time notifications (Socket.io, Django Channels)
 * - Implement push notifications for mobile apps
 * - Add email notification system for important updates
 */

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      read: searchParams.get('read') === 'true' ? true : searchParams.get('read') === 'false' ? false : undefined,
      type: searchParams.get('type'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    const notifications = await notificationsService.getNotifications(user, filters)
    return NextResponse.json(notifications)

  } catch (error) {
    console.error('Notifications API error:', error)
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
    const notification = await notificationsService.createNotification(user, body)
    
    return NextResponse.json(notification, { status: 201 })

  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' }, 
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
    const { id, action, ...updates } = body

    let result
    switch (action) {
      case 'markRead':
        result = await notificationsService.markAsRead(user, id)
        break
      case 'markAllRead':
        result = await notificationsService.markAllAsRead(user)
        break
      default:
        result = await notificationsService.updateNotification(user, id, updates)
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Notifications PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' }, 
      { status: 500 }
    )
  }
}