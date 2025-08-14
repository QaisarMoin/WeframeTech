import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // Admins and organizers can only see their own tenant
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'organizer') {
        return { id: { equals: user.tenant } }
      }
      return false
    },
    create: ({ req: { user } }) => {
      // Only organizers can create tenants
      return !!user && user.role === 'organizer'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'organizer') return { id: { equals: user.tenant } }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return { id: { equals: user.tenant } }
      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: { position: 'sidebar', readOnly: true },
      hooks: {
        beforeChange: [({ req, value }) => value ?? req.user?.id],
      },
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
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        // After creating a tenant, assign it to the current admin so they can access it
        if (operation === 'create' && req.user) {
          try {
            await req.payload.update({
              collection: 'users',
              id: req.user.id,
              data: { tenant: doc.id },
            })
          } catch (e) {
            req.payload.logger?.warn?.('Failed to update user tenant after tenant create')
          }
        }
        return doc
      },
    ],
  },
}
