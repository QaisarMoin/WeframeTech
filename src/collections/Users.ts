import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => user?.role === 'attendee',
  },
  auth: true,
  access: {
    // Tenant-scoped user access
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'attendee') {
        return { id: { equals: user.id } }
      }
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req: { user } }) => {
      // Logged-in users can create users only within their tenant context (hooks can inherit)
      return !!user
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'attendee') {
        return { id: { equals: user.id } }
      }
      return { tenant: { equals: user.tenant } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' ? { tenant: { equals: user.tenant } } : false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'attendee',
      options: [
        { label: 'Attendee', value: 'attendee' },
        { label: 'Organizer', value: 'organizer' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false, // Made optional to allow signup without tenant
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Auto-assign tenant for new users if not set and user is logged in
        // Only auto-assign for attendees or if the logged-in user has a tenant
        if (!data.tenant && req.user?.tenant) {
          // For attendees, always inherit the tenant from the logged-in user
          if (data.role === 'attendee') {
            data.tenant = req.user.tenant
          }
          // For organizers and admins, only inherit if they don't explicitly want to create their own
          else if (req.user.role === 'admin' || req.user.role === 'organizer') {
            // Allow them to create users without tenant (they can assign later)
            // Only auto-assign if they're creating within their own tenant context
            if (req.context?.inheritTenant !== false) {
              data.tenant = req.user.tenant
            }
          }
        }
        return data
      },
    ],
  },
}
