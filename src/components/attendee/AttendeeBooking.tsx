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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        // Only show events in the attendee's own tenant; use admin REST proxy which is tenant-scoped by access
        const res = await fetch('/api/events?sort=-date&limit=100')
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

  const bookSelected = async () => {
    if (!selectedId) {
      setError('Please select an event to book')
      return
    }
    await book(selectedId)
  }

  if (loading) return <div className="p-6">Loading events...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Events</h1>

      {/* Top-level book via dropdown */}
      <div className="mb-6 flex items-center gap-3">
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded"
          onClick={() => setPickerOpen((v) => !v)}
        >
          {pickerOpen ? 'Hide' : 'Book'}
        </button>
        {pickerOpen && (
          <>
            <select
              className="border rounded px-2 py-1"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Select an event</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} — {new Date(e.date).toLocaleString()}
                </option>
              ))}
            </select>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={bookSelected}>
              Book
            </button>
          </>
        )}
      </div>

      {events.length === 0 && <p>No events found.</p>}
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
