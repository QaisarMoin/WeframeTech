import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const params = await context.params
    const notificationId = params.id

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    // Authenticate via session cookie
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const auth = await payload.auth({ headers: { authorization: `JWT ${token}` } })
    const user = auth.user
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    let user
    try {
      const userId = request.headers.get('x-user-id')
      if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 401 })
      }

      user = await payload.findByID({
        collection: 'users',
        id: userId,
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Get the notification and verify ownership
    const notification = await payload.findByID({
      collection: 'notifications',
      id: notificationId,
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    // Check if user has permission to mark this notification as read
    if (notification.tenant !== user.tenant || notification.user !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Mark the notification as read
    const updatedNotification = await payload.update({
      collection: 'notifications',
      id: notificationId,
      data: {
        read: true,
      },
    })

    return NextResponse.json({
      success: true,
      notification: {
        id: updatedNotification.id,
        read: updatedNotification.read,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
