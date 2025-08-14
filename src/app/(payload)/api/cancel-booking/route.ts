import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
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

    // Get the booking and verify ownership/access
    const booking = await payload.findByID({
      collection: 'bookings',
      id: bookingId,
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user has permission to cancel this booking
    if (booking.tenant !== user.tenant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Attendees can only cancel their own bookings
    if (user.role === 'attendee' && booking.user !== user.id) {
      return NextResponse.json({ error: 'You can only cancel your own bookings' }, { status: 403 })
    }

    // Check if booking is already canceled
    if (booking.status === 'canceled') {
      return NextResponse.json({ error: 'Booking is already canceled' }, { status: 400 })
    }

    // Update the booking status to canceled (hooks will handle waitlist promotion and notifications)
    const updatedBooking = await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: {
        status: 'canceled',
      },
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        event: updatedBooking.event,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error canceling booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
