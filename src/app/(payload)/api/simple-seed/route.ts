import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    console.log('🌱 Starting simple seed process...')

    // Create one tenant
    console.log('🏢 Creating tenant...')
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: `Test Company ${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    })
    console.log('✅ Created tenant:', tenant.id)

    // Create one organizer
    console.log('👤 Creating organizer...')
    const organizer = await payload.create({
      collection: 'users',
      data: {
        name: 'Test Organizer',
        email: `organizer${Date.now()}@test.com`,
        password: 'password123',
        role: 'organizer',
        tenant: tenant.id,
      },
    })
    console.log('✅ Created organizer:', organizer.id)

    // Create one attendee
    console.log('👤 Creating attendee...')
    const attendee = await payload.create({
      collection: 'users',
      data: {
        name: 'Test Attendee',
        email: `attendee${Date.now()}@test.com`,
        password: 'password123',
        role: 'attendee',
        tenant: tenant.id,
      },
    })
    console.log('✅ Created attendee:', attendee.id)

    // Create one event
    console.log('📅 Creating event...')
    console.log('Using organizer ID:', organizer.id, 'tenant ID:', tenant.id)

    const event = await payload.create({
      collection: 'events',
      data: {
        title: 'Test Event',
        description: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'This is a test event.',
                    type: 'text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        },
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: 2,
        organizer: organizer.id,
        tenant: tenant.id,
      },
    })
    console.log('✅ Created event:', event.id)

    // Create one booking
    console.log('🎟️ Creating booking...')
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        event: event.id,
        user: attendee.id,
        tenant: tenant.id,
        status: 'confirmed',
      },
    })
    console.log('✅ Created booking:', booking.id)

    console.log('🎉 Simple seed completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Simple seed completed successfully',
      data: {
        tenant: tenant.id,
        organizer: organizer.id,
        attendee: attendee.id,
        event: event.id,
        booking: booking.id,
      },
    })
  } catch (error) {
    console.error('❌ Error during simple seed:', error)
    return NextResponse.json({ error: 'Simple seed failed', details: error }, { status: 500 })
  }
}
