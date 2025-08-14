import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 },
      )
    }

    // Validate role - allow attendee, organizer, and admin
    if (!['attendee', 'organizer', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be attendee, organizer, or admin' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }

    // Create the user without a tenant (they can create one later)
    const newUser = await payload.create({
      collection: 'users',
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        // No tenant assigned - they will create one after login
      },
    })

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error('❌ Error during signup:', error)

    // Handle specific Payload errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'An error occurred during signup. Please try again.' },
      { status: 500 },
    )
  }
}
