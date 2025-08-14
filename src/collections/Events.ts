import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    // Read access
    read: ({ req: { user } }) => {
      if (!user) return false
      // Attendees can view all events to book any of them
      if (user.role === 'attendee') return true
      // Organizers/Admins: only events within their tenant
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req: { user } }) => {
      return !!user && (user.role === 'organizer' || user.role === 'admin')
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      // Organizers can update their own events; admins can update all events in their tenant
      if (user.role === 'organizer') return { organizer: { equals: user.id } }
      if (user.role === 'admin') return { tenant: { equals: user.tenant } }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'organizer') return { organizer: { equals: user.id } }
      if (user.role === 'admin') return { tenant: { equals: user.tenant } }
      return false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
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
        // Auto-assign tenant for new events
        if (!data.tenant && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        // Auto-assign organizer if not set and user is organizer
        if (!data.organizer && req.user?.role === 'organizer') {
          data.organizer = req.user.id
        }
        return data
      },
    ],
  },
}
