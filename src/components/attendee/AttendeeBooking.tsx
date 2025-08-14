'use client'

import React, { useEffect, useState } from 'react'

interface EventItem {
  id: string
  title: string
  date: string
  capacity: number
}

export default function AttendeeBooking() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        // Only show events in the attendee's own tenant; use admin REST proxy which is tenant-scoped by access
        const res = await fetch(
          '/api/events?where[date][greater_than]=' +
            encodeURIComponent(new Date().toISOString()) +
            '&sort=date&limit=50',
        )
        if (!res.ok) throw new Error('Failed to load events')
        const data = await res.json()
        setEvents(data.docs || [])
      } catch (e: any) {
        setError(e.message || 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const book = async (eventId: string) => {
    try {
      setError(null)
      const res = await fetch('/api/book-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to book')
      alert(`Booking ${data.booking.status}`)
    } catch (e: any) {
      setError(e.message || 'Failed to book event')
    }
  }

  if (loading) return <div className="p-6">Loading events...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Events</h1>
      {events.length === 0 && <p>No upcoming events.</p>}
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-gray-500">{new Date(e.date).toLocaleString()}</div>
            </div>
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded"
              onClick={() => book(e.id)}
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
