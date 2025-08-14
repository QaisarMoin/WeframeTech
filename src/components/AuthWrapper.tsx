'use client'

import React, { useEffect, useState } from 'react'
import TenantCreation from './TenantCreation'

interface User {
  id: string
  name: string
  email: string
  role: 'attendee' | 'organizer' | 'admin'
  tenant?: any
  createdAt: string
  updatedAt: string
}

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else if (response.status === 401) {
          // User not authenticated, redirect to login
          window.location.href = '/admin'
          return
        } else {
          setError('Failed to load user information')
        }
      } catch (err) {
        setError('Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check if user needs to create a tenant
  const needsTenant = user.role === 'organizer' && !user.tenant

  if (needsTenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-600">To get started, you need to create your organization.</p>
          </div>
          <TenantCreation
            userId={user.id}
            onTenantCreated={(tenant) => {
              // Update user state with new tenant
              setUser((prev) => (prev ? { ...prev, tenant } : null))
            }}
          />
        </div>
      </div>
    )
  }

  // User has a tenant or is an attendee, show the normal content
  return <>{children}</>
}

export default AuthWrapper
