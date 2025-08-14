// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { Events } from './collections/Events'
import { Bookings } from './collections/Bookings'
import { Notifications } from './collections/Notifications'
import { BookingLogs } from './collections/BookingLogs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    css: path.resolve(dirname, 'src/app/(payload)/custom.scss'),
    meta: {
      titleSuffix: '- Event Management',
      favicon: '/favicon.ico',
      openGraph: {
        title: 'Event Management Admin',
        description: 'Admin panel for event management system',
      },
    },
    components: {
      // Render our small CTA below the login form so it persists across re-renders
      afterLogin: ['@/components/LoginSignupLink#default'],
    },
  },
  collections: [Tenants, Users, Events, Bookings, Notifications, BookingLogs, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
