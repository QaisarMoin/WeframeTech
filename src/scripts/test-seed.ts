import dotenv from 'dotenv'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Load environment variables
dotenv.config()

const testSeed = async () => {
  console.log('🧪 Testing seed connection...')
  console.log('🔍 Environment variables:')
  console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set')
  console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? 'Set' : 'Not set')

  try {
    console.log('📦 Loading Payload config...')
    const payload = await getPayload({ config })
    console.log('✅ Payload loaded successfully')

    // Test database connection by trying to find tenants
    console.log('🔍 Testing database connection...')
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 1,
    })
    console.log(`✅ Database connected. Found ${tenants.totalDocs} tenants`)

    console.log('🎉 Test completed successfully!')
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

testSeed()
  .then(() => {
    console.log('✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
