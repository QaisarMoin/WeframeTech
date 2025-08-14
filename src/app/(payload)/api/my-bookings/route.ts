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
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')

    // Build the where clause: attendee sees only their own bookings (across any tenant)
    const whereClause: any = { user: { equals: user.id } }

    if (status && ['confirmed', 'waitlisted', 'canceled'].includes(status)) {
      whereClause.status = { equals: status }
    }

    // Get user's bookings with event details
    const bookings = await payload.find({
      collection: 'bookings',
      where: whereClause,
      page,
      limit,
      sort: '-createdAt',
      depth: 2, // Include event details
    })

    // Format the response
    const formattedBookings = bookings.docs.map((booking: any) => ({
      id: booking.id,
      status: booking.status,
      createdAt: booking.createdAt,
      event: {
        id: booking.event.id,
        title: booking.event.title,
        description: booking.event.description,
        date: booking.event.date,
        capacity: booking.event.capacity,
      },
    }))

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      pagination: {
        page: bookings.page,
        limit: bookings.limit,
        totalPages: bookings.totalPages,
        totalDocs: bookings.totalDocs,
        hasNextPage: bookings.hasNextPage,
        hasPrevPage: bookings.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
