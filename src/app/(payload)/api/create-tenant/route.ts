import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { tenantName, userId } = body

    // Validate required fields
    if (!tenantName || !userId) {
      return NextResponse.json({ error: 'Tenant name and user ID are required' }, { status: 400 })
    }

    // Validate tenant name
    if (tenantName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Tenant name must be at least 2 characters long' },
        { status: 400 },
      )
    }

    // Get the user to verify they exist and their role
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only organizers can create tenants
    if (user.role !== 'organizer') {
      return NextResponse.json({ error: 'Only organizers can create tenants' }, { status: 403 })
    }

    // Check if user already has a tenant
    if (user.tenant) {
      return NextResponse.json({ error: 'User already belongs to a tenant' }, { status: 409 })
    }

    // Check if tenant name already exists
    const existingTenants = await payload.find({
      collection: 'tenants',
      where: {
        name: {
          equals: tenantName.trim(),
        },
      },
      limit: 1,
    })

    if (existingTenants.docs.length > 0) {
      return NextResponse.json({ error: 'A tenant with this name already exists' }, { status: 409 })
    }

    // Create the tenant (manually enforce access by verifying the user above)
    const newTenant = await payload.create({
      collection: 'tenants',
      data: {
        name: tenantName.trim(),
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      },
      overrideAccess: true,
    })

    // Update the user to assign them to the new tenant
    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        tenant: newTenant.id,
      },
      overrideAccess: true,
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Tenant created successfully!',
      tenant: {
        id: newTenant.id,
        name: newTenant.name,
        createdAt: newTenant.createdAt,
      },
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        tenant: newTenant.id,
      },
    })
  } catch (error) {
    console.error('❌ Error creating tenant:', error)

    // Handle specific Payload errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'An error occurred while creating the tenant. Please try again.' },
      { status: 500 },
    )
  }
}
