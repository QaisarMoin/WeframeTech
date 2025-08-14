import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    console.log('🧹 Clearing database...')

    // Clear all collections in reverse dependency order
    await payload.delete({ collection: 'booking-logs', where: {} })
    await payload.delete({ collection: 'notifications', where: {} })
    await payload.delete({ collection: 'bookings', where: {} })
    await payload.delete({ collection: 'events', where: {} })
    await payload.delete({ collection: 'users', where: {} })
    await payload.delete({ collection: 'tenants', where: {} })

    console.log('✅ Database cleared successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database cleared successfully',
    })

  } catch (error) {
    console.error('❌ Error clearing database:', error)
    return NextResponse.json(
      { error: 'Failed to clear database', details: error },
      { status: 500 }
    )
  }
}
