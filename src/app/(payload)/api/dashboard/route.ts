import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the user from the request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
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

    // Check if user is organizer or admin
    if (user.role !== 'organizer' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Organizer or admin role required.' },
        { status: 403 },
      )
    }

    // Get upcoming events for the organizer's tenant
    const currentDate = new Date()
    const eventsQuery: any = {
      and: [
        { tenant: { equals: user.tenant } },
        { date: { greater_than: currentDate.toISOString() } },
      ],
    }

    // If user is organizer (not admin), only show their events
    if (user.role === 'organizer') {
      eventsQuery.and.push({ organizer: { equals: user.id } })
    }

    const events = await payload.find({
      collection: 'events',
      where: eventsQuery,
      sort: 'date',
      limit: 100, // Reasonable limit for dashboard
    })

    // Get booking statistics for each event
    const eventsWithStats = await Promise.all(
      events.docs.map(async (event: any) => {
        const bookings = await payload.find({
          collection: 'bookings',
          where: {
            and: [{ event: { equals: event.id } }, { tenant: { equals: user.tenant } }],
          },
          limit: 0, // Just get counts
        })

        const confirmedCount = await payload.find({
          collection: 'bookings',
          where: {
            and: [
              { event: { equals: event.id } },
              { status: { equals: 'confirmed' } },
              { tenant: { equals: user.tenant } },
            ],
          },
          limit: 0,
        })

        const waitlistedCount = await payload.find({
          collection: 'bookings',
          where: {
            and: [
              { event: { equals: event.id } },
              { status: { equals: 'waitlisted' } },
              { tenant: { equals: user.tenant } },
            ],
          },
          limit: 0,
        })

        const canceledCount = await payload.find({
          collection: 'bookings',
          where: {
            and: [
              { event: { equals: event.id } },
              { status: { equals: 'canceled' } },
              { tenant: { equals: user.tenant } },
            ],
          },
          limit: 0,
        })

        const percentageFilled = (confirmedCount.totalDocs / event.capacity) * 100

        return {
          id: event.id,
          title: event.title,
          date: event.date,
          capacity: event.capacity,
          confirmedCount: confirmedCount.totalDocs,
          waitlistedCount: waitlistedCount.totalDocs,
          canceledCount: canceledCount.totalDocs,
          percentageFilled: Math.round(percentageFilled * 100) / 100, // Round to 2 decimal places
        }
      }),
    )

    // Get overall summary analytics
    const totalEvents = events.totalDocs

    const allBookings = await payload.find({
      collection: 'bookings',
      where: { tenant: { equals: user.tenant } },
      limit: 0,
    })

    const totalConfirmedBookings = await payload.find({
      collection: 'bookings',
      where: {
        and: [{ tenant: { equals: user.tenant } }, { status: { equals: 'confirmed' } }],
      },
      limit: 0,
    })

    const totalWaitlistedBookings = await payload.find({
      collection: 'bookings',
      where: {
        and: [{ tenant: { equals: user.tenant } }, { status: { equals: 'waitlisted' } }],
      },
      limit: 0,
    })

    const totalCanceledBookings = await payload.find({
      collection: 'bookings',
      where: {
        and: [{ tenant: { equals: user.tenant } }, { status: { equals: 'canceled' } }],
      },
      limit: 0,
    })

    // Get recent activity (last 5 booking logs)
    const recentActivity = await payload.find({
      collection: 'booking-logs',
      where: { tenant: { equals: user.tenant } },
      sort: '-createdAt',
      limit: 5,
      depth: 2, // Include booking, event, and user details
    })

    const formattedActivity = recentActivity.docs.map((log: any) => ({
      id: log.id,
      action: log.action,
      note: log.note,
      createdAt: log.createdAt,
      user: {
        id: log.user.id,
        name: log.user.name,
        email: log.user.email,
      },
      event: {
        id: log.event.id,
        title: log.event.title,
      },
      booking: {
        id: log.booking.id,
        status: log.booking.status,
      },
    }))

    return NextResponse.json({
      success: true,
      dashboard: {
        upcomingEvents: eventsWithStats,
        summary: {
          totalEvents,
          totalConfirmedBookings: totalConfirmedBookings.totalDocs,
          totalWaitlistedBookings: totalWaitlistedBookings.totalDocs,
          totalCanceledBookings: totalCanceledBookings.totalDocs,
        },
        recentActivity: formattedActivity,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
