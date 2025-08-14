import type { CollectionConfig } from 'payload'

export const BookingLogs: CollectionConfig = {
  slug: 'booking-logs',
  admin: {
    useAsTitle: 'action',
  },
  access: {
    // Only organizers and admins can view booking logs
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'organizer') {
        return { tenant: { equals: user.tenant } }
      }
      return false
    },
    create: ({ req: { user } }) => {
      return !!user && (user.role === 'admin' || user.role === 'organizer')
    },
    update: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      return !!user && user.role === 'admin'
    },
  },
  fields: [
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
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      filterOptions: ({ user }) => {
        return !!user
      },
    },
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
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create Request', value: 'create_request' },
        { label: 'Auto Waitlist', value: 'auto_waitlist' },
        { label: 'Auto Confirm', value: 'auto_confirm' },
        { label: 'Promote from Waitlist', value: 'promote_from_waitlist' },
        { label: 'Cancel Confirmed', value: 'cancel_confirmed' },
      ],
    },
    {
      name: 'note',
      type: 'text',
      required: false,
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
        // Auto-assign tenant for new booking logs
        if (!data.tenant && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        return data
      },
    ],
  },
}
