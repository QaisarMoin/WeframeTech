import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    console.log('🌱 Starting seed process...')

    // Check if data already exists
    const existingTenants = await payload.find({
      collection: 'tenants',
      limit: 1,
    })

    if (existingTenants.totalDocs > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already seeded. Clear data first if you want to re-seed.',
      })
    }

    // Create Tenants
    console.log('🏢 Creating tenants...')
    const tenant1 = await payload.create({
      collection: 'tenants',
      data: {
        name: 'TechCorp Events',
        createdAt: new Date().toISOString(),
      },
    })

    const tenant2 = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Creative Studios',
        createdAt: new Date().toISOString(),
      },
    })

    // Create Users for Tenant 1
    console.log('👥 Creating users for Tenant 1...')
    const organizer1 = await payload.create({
      collection: 'users',
      data: {
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        password: 'password123',
        role: 'organizer',
        tenant: tenant1.id,
      },
    })
    console.log('✅ Created organizer1:', organizer1.id)

    const attendee1_1 = await payload.create({
      collection: 'users',
      data: {
        name: 'Alice Johnson',
        email: 'alice.johnson@techcorp.com',
        password: 'password123',
        role: 'attendee',
        tenant: tenant1.id,
      },
    })

    const attendee1_2 = await payload.create({
      collection: 'users',
      data: {
        name: 'Bob Wilson',
        email: 'bob.wilson@techcorp.com',
        password: 'password123',
        role: 'attendee',
        tenant: tenant1.id,
      },
    })

    const attendee1_3 = await payload.create({
      collection: 'users',
      data: {
        name: 'Carol Davis',
        email: 'carol.davis@techcorp.com',
        password: 'password123',
        role: 'attendee',
        tenant: tenant1.id,
      },
    })

    // Create Users for Tenant 2
    const organizer2 = await payload.create({
      collection: 'users',
      data: {
        name: 'Sarah Brown',
        email: 'sarah.brown@creativestudios.com',
        password: 'password123',
        role: 'organizer',
        tenant: tenant2.id,
      },
    })

    const attendee2_1 = await payload.create({
      collection: 'users',
      data: {
        name: 'Mike Chen',
        email: 'mike.chen@creativestudios.com',
        password: 'password123',
        role: 'attendee',
        tenant: tenant2.id,
      },
    })

    const attendee2_2 = await payload.create({
      collection: 'users',
      data: {
        name: 'Emma Taylor',
        email: 'emma.taylor@creativestudios.com',
        password: 'password123',
        role: 'attendee',
        tenant: tenant2.id,
      },
    })

    const attendee2_3 = await payload.create({
      collection: 'users',
      data: {
        name: 'David Lee',
        email: 'david.lee@creativestudios.com',
        password: 'password123',
        role: 'attendee',
        tenant: tenant2.id,
      },
    })

    // Create Events for Tenant 1
    console.log('📅 Creating events for Tenant 1...')
    console.log('Using organizer1 ID:', organizer1.id)
    const event1_1 = await payload.create({
      collection: 'events',
      data: {
        title: 'Tech Conference 2024',
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
                    text: 'Join us for the biggest tech conference of the year! Learn about the latest trends in AI, cloud computing, and software development.',
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
        capacity: 3,
        organizer: organizer1.id,
        tenant: tenant1.id,
      },
    })

    const event1_2 = await payload.create({
      collection: 'events',
      data: {
        title: 'Team Building Workshop',
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
                    text: 'A fun and engaging team building workshop to improve collaboration and communication skills.',
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
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: 5,
        organizer: organizer1.id,
        tenant: tenant1.id,
      },
    })

    // Create Events for Tenant 2
    const event2_1 = await payload.create({
      collection: 'events',
      data: {
        title: 'Design Thinking Workshop',
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
                    text: 'Learn the principles of design thinking and how to apply them to creative problem solving.',
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
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: 2,
        organizer: organizer2.id,
        tenant: tenant2.id,
      },
    })

    const event2_2 = await payload.create({
      collection: 'events',
      data: {
        title: 'Creative Portfolio Review',
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
                    text: 'Get feedback on your creative portfolio from industry professionals.',
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
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: 4,
        organizer: organizer2.id,
        tenant: tenant2.id,
      },
    })

    console.log('🎉 Seed process completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        tenants: [tenant1.name, tenant2.name],
        users: 8,
        events: 4,
      },
    })
  } catch (error) {
    console.error('❌ Error during seed process:', error)
    return NextResponse.json({ error: 'Seed process failed', details: error }, { status: 500 })
  }
}
