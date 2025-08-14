import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'

// Helper function to create notifications
const createNotification = async (payload: any, data: {
  user: string
  booking: string
  type: string
  title: string
  message: string
  tenant: string
}) => {
  try {
    await payload.create({
      collection: 'notifications',
      data,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

// Helper function to create booking logs
const createBookingLog = async (payload: any, data: {
  booking: string
  event: string
  user: string
  action: string
  note?: string
  tenant: string
}) => {
  try {
    await payload.create({
      collection: 'booking-logs',
      data,
    })
  } catch (error) {
    console.error('Error creating booking log:', error)
  }
}

// Helper function to get confirmed bookings count for an event
const getConfirmedBookingsCount = async (payload: any, eventId: string, tenantId: string) => {
  try {
    const result = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { event: { equals: eventId } },
          { status: { equals: 'confirmed' } },
          { tenant: { equals: tenantId } }
        ]
      },
      limit: 0, // Just get the count
    })
    return result.totalDocs
  } catch (error) {
    console.error('Error getting confirmed bookings count:', error)
    return 0
  }
}

// Helper function to get event details
const getEventDetails = async (payload: any, eventId: string) => {
  try {
    const event = await payload.findByID({
      collection: 'events',
      id: eventId,
    })
    return event
  } catch (error) {
    console.error('Error getting event details:', error)
    return null
  }
}

// Helper function to get user details
const getUserDetails = async (payload: any, userId: string) => {
  try {
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })
    return user
  } catch (error) {
    console.error('Error getting user details:', error)
    return null
  }
}

// Before change hook to determine booking status
export const beforeBookingChange: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  const { payload } = req

  // Only process for create operations or status changes
  if (operation === 'create' || (operation === 'update' && originalDoc?.status !== data.status)) {
    
    if (operation === 'create') {
      // For new bookings, determine if they should be confirmed or waitlisted
      const event = await getEventDetails(payload, data.event)
      if (!event) {
        throw new Error('Event not found')
      }

      const confirmedCount = await getConfirmedBookingsCount(payload, data.event, data.tenant)
      
      if (confirmedCount < event.capacity) {
        data.status = 'confirmed'
      } else {
        data.status = 'waitlisted'
      }
    }
  }

  return data
}

// After change hook to handle notifications and logs
export const afterBookingChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  const { payload } = req

  try {
    const event = await getEventDetails(payload, doc.event)
    const user = await getUserDetails(payload, doc.user)
    
    if (!event || !user) {
      console.error('Event or user not found for booking:', doc.id)
      return doc
    }

    let notificationType = ''
    let notificationTitle = ''
    let notificationMessage = ''
    let logAction = ''
    let logNote = ''

    if (operation === 'create') {
      if (doc.status === 'confirmed') {
        notificationType = 'booking_confirmed'
        notificationTitle = 'Booking Confirmed'
        notificationMessage = `Your booking for "${event.title}" has been confirmed.`
        logAction = 'auto_confirm'
        logNote = 'Booking automatically confirmed - capacity available'
      } else if (doc.status === 'waitlisted') {
        notificationType = 'waitlisted'
        notificationTitle = 'Added to Waitlist'
        notificationMessage = `You have been added to the waitlist for "${event.title}". We'll notify you if a spot becomes available.`
        logAction = 'auto_waitlist'
        logNote = 'Booking automatically waitlisted - event at capacity'
      }
    } else if (operation === 'update' && previousDoc) {
      if (previousDoc.status !== doc.status) {
        if (doc.status === 'canceled') {
          notificationType = 'booking_canceled'
          notificationTitle = 'Booking Canceled'
          notificationMessage = `Your booking for "${event.title}" has been canceled.`
          logAction = 'cancel_confirmed'
          logNote = 'Booking canceled by user or admin'
        } else if (previousDoc.status === 'waitlisted' && doc.status === 'confirmed') {
          notificationType = 'waitlist_promoted'
          notificationTitle = 'Promoted from Waitlist'
          notificationMessage = `Great news! Your waitlisted booking for "${event.title}" has been confirmed.`
          logAction = 'promote_from_waitlist'
          logNote = 'Promoted from waitlist due to cancellation'
        }
      }
    }

    // Create notification if we have a type
    if (notificationType) {
      await createNotification(payload, {
        user: doc.user,
        booking: doc.id,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        tenant: doc.tenant,
      })
    }

    // Create booking log if we have an action
    if (logAction) {
      await createBookingLog(payload, {
        booking: doc.id,
        event: doc.event,
        user: doc.user,
        action: logAction,
        note: logNote,
        tenant: doc.tenant,
      })
    }

    // Handle waitlist promotion when a confirmed booking is canceled
    if (operation === 'update' && previousDoc?.status === 'confirmed' && doc.status === 'canceled') {
      await promoteFromWaitlist(payload, doc.event, doc.tenant)
    }

  } catch (error) {
    console.error('Error in afterBookingChange hook:', error)
  }

  return doc
}

// Helper function to promote the oldest waitlisted booking
const promoteFromWaitlist = async (payload: any, eventId: string, tenantId: string) => {
  try {
    // Find the oldest waitlisted booking for this event
    const waitlistedBookings = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { event: { equals: eventId } },
          { status: { equals: 'waitlisted' } },
          { tenant: { equals: tenantId } }
        ]
      },
      sort: 'createdAt',
      limit: 1,
    })

    if (waitlistedBookings.docs.length > 0) {
      const bookingToPromote = waitlistedBookings.docs[0]
      
      // Update the booking status to confirmed
      await payload.update({
        collection: 'bookings',
        id: bookingToPromote.id,
        data: {
          status: 'confirmed',
        },
      })
    }
  } catch (error) {
    console.error('Error promoting from waitlist:', error)
  }
}
