import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

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

    // Get query parameters for pagination and filtering
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const unreadOnly = url.searchParams.get('unread') === 'true'

    // Build the where clause
    const whereClause: any = {
      and: [{ user: { equals: user.id } }, { tenant: { equals: user.tenant } }],
    }

    if (unreadOnly) {
      whereClause.and.push({ read: { equals: false } })
    }

    // Get user's notifications with booking and event details
    const notifications = await payload.find({
      collection: 'notifications',
      where: whereClause,
      page,
      limit,
      sort: '-createdAt',
      depth: 3, // Include booking and event details
    })

    // Format the response
    const formattedNotifications = notifications.docs.map((notification: any) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
      booking: {
        id: notification.booking.id,
        status: notification.booking.status,
        event: {
          id: notification.booking.event.id,
          title: notification.booking.event.title,
          date: notification.booking.event.date,
        },
      },
    }))

    // Get unread count
    const unreadCount = await payload.find({
      collection: 'notifications',
      where: {
        and: [
          { user: { equals: user.id } },
          { tenant: { equals: user.tenant } },
          { read: { equals: false } },
        ],
      },
      limit: 0, // Just get the count
    })

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      unreadCount: unreadCount.totalDocs,
      pagination: {
        page: notifications.page,
        limit: notifications.limit,
        totalPages: notifications.totalPages,
        totalDocs: notifications.totalDocs,
        hasNextPage: notifications.hasNextPage,
        hasPrevPage: notifications.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching user notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
