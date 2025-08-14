import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import AttendeeBooking from '@/components/attendee/AttendeeBooking'

export default function BookPage() {
  return (
    <AuthWrapper>
      <AttendeeBooking />
    </AuthWrapper>
  )
}

