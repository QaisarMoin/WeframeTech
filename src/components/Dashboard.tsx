'use client'

import React, { useEffect, useState } from 'react'
import AuthWrapper from './AuthWrapper'

interface Event {
  id: string
  title: string
  date: string
  capacity: number
  confirmedCount: number
  waitlistedCount: number
  canceledCount: number
  percentageFilled: number
}

interface Summary {
  totalEvents: number
  totalConfirmedBookings: number
  totalWaitlistedBookings: number
  totalCanceledBookings: number
}

interface Activity {
  id: string
  action: string
  note: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  event: {
    id: string
    title: string
  }
  booking: {
    id: string
    status: string
  }
}

interface DashboardData {
  upcomingEvents: Event[]
  summary: Summary
  recentActivity: Activity[]
}

const CircularProgress: React.FC<{ percentage: number; size?: number }> = ({
  percentage,
  size = 60,
}) => {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-gray-700">
        {Math.round(percentage)}%
      </span>
    </div>
  )
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, you would get the auth token from the Payload context
        // For now, we'll simulate the API call
        const response = await fetch('/api/dashboard', {
          headers: {
            Authorization: 'Bearer token', // This would be the actual auth token
            'x-user-id': 'user-id', // This would be extracted from the auth context
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setDashboardData(data.dashboard)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">No dashboard data available</div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create_request: 'Booking Created',
      auto_waitlist: 'Added to Waitlist',
      auto_confirm: 'Booking Confirmed',
      promote_from_waitlist: 'Promoted from Waitlist',
      cancel_confirmed: 'Booking Canceled',
    }
    return labels[action] || action
  }

  return (
    <AuthWrapper>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Organizer Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.summary.totalEvents}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Confirmed Bookings</h3>
            <p className="text-3xl font-bold text-green-600">
              {dashboardData.summary.totalConfirmedBookings}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Waitlisted</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {dashboardData.summary.totalWaitlistedBookings}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Canceled</h3>
            <p className="text-3xl font-bold text-red-600">
              {dashboardData.summary.totalCanceledBookings}
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="p-6">
            {dashboardData.upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming events</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData.upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                      </div>
                      <CircularProgress percentage={event.percentageFilled} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Capacity</p>
                        <p className="font-medium">{event.capacity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Confirmed</p>
                        <p className="font-medium text-green-600">{event.confirmedCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Waitlisted</p>
                        <p className="font-medium text-yellow-600">{event.waitlistedCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {dashboardData.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {getActionLabel(activity.action)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.user.name} • {activity.event.title}
                      </p>
                      {activity.note && (
                        <p className="text-xs text-gray-500 mt-1">{activity.note}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(activity.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}

export default Dashboard
