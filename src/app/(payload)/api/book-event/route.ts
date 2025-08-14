import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
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

    // Verify the event exists
    const event = await payload.findByID({
      collection: 'events',
      id: eventId,
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Allow booking any event; booking will inherit event's tenant

    // Check if user already has a booking for this event
    const existingBooking = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { event: { equals: eventId } },
          { user: { equals: user.id } },
          { tenant: { equals: user.tenant } },
          { status: { not_equals: 'canceled' } },
        ],
      },
      limit: 1,
    })

    if (existingBooking.docs.length > 0) {
      return NextResponse.json(
        { error: 'You already have a booking for this event' },
        { status: 400 },
      )
    }

    // Create the booking (hooks will handle status determination and notifications)
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        event: eventId,
        user: user.id,
        // ensure booking is associated with the event's tenant
        tenant: event.tenant,
      },
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        status: booking.status,
        event: booking.event,
        createdAt: booking.createdAt,
      },
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
