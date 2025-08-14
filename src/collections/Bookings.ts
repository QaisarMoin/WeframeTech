import type { CollectionConfig } from 'payload'
import { beforeBookingChange, afterBookingChange } from '../hooks/bookingHooks'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'id',
    hidden: ({ user }) => user?.role === 'attendee',
  },
  access: {
    // Tenant-scoped access per role
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'attendee') return { user: { equals: user.id } }
      // organizer/admin can read all bookings in their tenant
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req: { user } }) => {
      return !!user // allow creation; hooks enforce tenant/user
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'attendee') return { user: { equals: user.id } }
      return { tenant: { equals: user.tenant } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return { tenant: { equals: user.tenant } }
    },
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: false,
      defaultValue: 'confirmed',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Canceled', value: 'canceled' },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (!value) {
              siblingData.createdAt = new Date()
            }
            return siblingData.createdAt
          },
        ],
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Auto-assign tenant for new bookings
        if (!data.tenant && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        // Auto-assign user for new bookings if not set
        if (!data.user && req.user?.id) {
          data.user = req.user.id
        }
        return data
      },
      beforeBookingChange,
    ],
    afterChange: [afterBookingChange],
  },
}
