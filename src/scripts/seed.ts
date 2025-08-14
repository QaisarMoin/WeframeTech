import dotenv from 'dotenv'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Load environment variables
dotenv.config()

const seed = async () => {
  console.log('🌱 Starting seed process...')
  console.log('📦 Loading Payload config...')

  const payload = await getPayload({ config })
  console.log('✅ Payload loaded successfully')

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await payload.delete({ collection: 'booking-logs', where: {} })
    await payload.delete({ collection: 'notifications', where: {} })
    await payload.delete({ collection: 'bookings', where: {} })
    await payload.delete({ collection: 'events', where: {} })
    await payload.delete({ collection: 'users', where: {} })
    await payload.delete({ collection: 'tenants', where: {} })

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

    console.log(`✅ Created tenants: ${tenant1.name}, ${tenant2.name}`)

    // Create Users for Tenant 1 (TechCorp Events)
    console.log('👥 Creating users for TechCorp Events...')

    // Organizer for Tenant 1
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

    // Attendees for Tenant 1
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

    // Create Users for Tenant 2 (Creative Studios)
    console.log('👥 Creating users for Creative Studios...')

    // Organizer for Tenant 2
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

    // Attendees for Tenant 2
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

    console.log('✅ Created users for both tenants')

    // Create Events for Tenant 1
    console.log('📅 Creating events for TechCorp Events...')

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
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
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
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        capacity: 5,
        organizer: organizer1.id,
        tenant: tenant1.id,
      },
    })

    // Create Events for Tenant 2
    console.log('📅 Creating events for Creative Studios...')

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
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
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
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
        capacity: 4,
        organizer: organizer2.id,
        tenant: tenant2.id,
      },
    })

    console.log('✅ Created events for both tenants')

    console.log('🎟️ Creating sample bookings...')

    // Create bookings for Tenant 1 events (this will trigger the hooks)
    // Tech Conference - fill to capacity and create waitlist
    await payload.create({
      collection: 'bookings',
      data: {
        event: event1_1.id,
        user: attendee1_1.id,
        tenant: tenant1.id,
        status: 'confirmed',
      },
    })

    await payload.create({
      collection: 'bookings',
      data: {
        event: event1_1.id,
        user: attendee1_2.id,
        tenant: tenant1.id,
        status: 'confirmed',
      },
    })

    await payload.create({
      collection: 'bookings',
      data: {
        event: event1_1.id,
        user: attendee1_3.id,
        tenant: tenant1.id,
        status: 'confirmed',
      },
    })

    // This should be waitlisted (capacity is 3)
    await payload.create({
      collection: 'bookings',
      data: {
        event: event1_1.id,
        user: organizer1.id, // Organizer booking their own event
        tenant: tenant1.id,
        status: 'confirmed',
      },
    })

    // Team Building Workshop - partial bookings
    await payload.create({
      collection: 'bookings',
      data: {
        event: event1_2.id,
        user: attendee1_1.id,
        tenant: tenant1.id,
        status: 'confirmed',
      },
    })

    await payload.create({
      collection: 'bookings',
      data: {
        event: event1_2.id,
        user: attendee1_2.id,
        tenant: tenant1.id,
        status: 'confirmed',
      },
    })

    // Create bookings for Tenant 2 events
    // Design Thinking Workshop - fill to capacity
    await payload.create({
      collection: 'bookings',
      data: {
        event: event2_1.id,
        user: attendee2_1.id,
        tenant: tenant2.id,
        status: 'confirmed',
      },
    })

    await payload.create({
      collection: 'bookings',
      data: {
        event: event2_1.id,
        user: attendee2_2.id,
        tenant: tenant2.id,
        status: 'confirmed',
      },
    })

    // This should be waitlisted (capacity is 2)
    await payload.create({
      collection: 'bookings',
      data: {
        event: event2_1.id,
        user: attendee2_3.id,
        tenant: tenant2.id,
        status: 'confirmed',
      },
    })

    // Creative Portfolio Review - one booking
    await payload.create({
      collection: 'bookings',
      data: {
        event: event2_2.id,
        user: attendee2_1.id,
        tenant: tenant2.id,
        status: 'confirmed',
      },
    })

    console.log('✅ Created sample bookings with automatic status assignment')

    console.log('🎉 Seed process completed successfully!')
    console.log('\n📋 Demo Credentials:')
    console.log('\nTenant 1 (TechCorp Events):')
    console.log('  Organizer: john.smith@techcorp.com / password123')
    console.log(
      '  Attendees: alice.johnson@techcorp.com, bob.wilson@techcorp.com, carol.davis@techcorp.com / password123',
    )
    console.log('\nTenant 2 (Creative Studios):')
    console.log('  Organizer: sarah.brown@creativestudios.com / password123')
    console.log(
      '  Attendees: mike.chen@creativestudios.com, emma.taylor@creativestudios.com, david.lee@creativestudios.com / password123',
    )
  } catch (error) {
    console.error('❌ Error during seed process:', error)
    throw error
  }
}

export default seed

// Run the seed if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error)
      process.exit(1)
    })
}
