import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get the session token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify the token and get user
    const { user } = await payload.auth({ headers: { authorization: `JWT ${token}` } })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get full user data with tenant information
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 1, // Include related tenant data
    })

    // Return user information
    return NextResponse.json({
      success: true,
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        tenant: fullUser.tenant,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt,
      },
    })
  } catch (error) {
    console.error('❌ Error getting user info:', error)
    
    return NextResponse.json(
      { error: 'An error occurred while getting user information' },
      { status: 500 }
    )
  }
}
