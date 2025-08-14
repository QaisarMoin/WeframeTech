import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    // Tenant-scoped access per role
    read: ({ req: { user } }) => {
      if (!user) return false
      // attendees see only their notifications (across events)
      if (user.role === 'attendee') return { user: { equals: user.id } }
      // organizer/admin can read all notifications in their tenant
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req: { user } }) => {
      return !!user
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'attendee') return { user: { equals: user.id } }
      return { tenant: { equals: user.tenant } }
    },
    delete: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: ({ user }) => {
        return !!user
      },
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      filterOptions: ({ user }) => {
        return !!user
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking Confirmed', value: 'booking_confirmed' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Waitlist Promoted', value: 'waitlist_promoted' },
        { label: 'Booking Canceled', value: 'booking_canceled' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
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
        // Auto-assign tenant for new notifications
        if (!data.tenant && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        return data
      },
    ],
  },
}
