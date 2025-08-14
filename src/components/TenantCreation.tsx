'use client'

import React, { useState } from 'react'

interface TenantCreationProps {
  userId: string
  onTenantCreated?: (tenant: any) => void
  onCancel?: () => void
}

const TenantCreation: React.FC<TenantCreationProps> = ({ 
  userId, 
  onTenantCreated, 
  onCancel 
}) => {
  const [tenantName, setTenantName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!tenantName.trim()) {
      setError('Tenant name is required')
      setLoading(false)
      return
    }

    if (tenantName.trim().length < 2) {
      setError('Tenant name must be at least 2 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/create-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantName: tenantName.trim(),
          userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTenantName('')
        setError('')
        if (onTenantCreated) {
          onTenantCreated(data.tenant)
        }
        // Reload the page to refresh the admin panel with the new tenant context
        window.location.reload()
      } else {
        setError(data.error || 'An error occurred while creating the tenant')
      }
    } catch (_err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
          <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Organization</h2>
        <p className="text-gray-600">
          Set up your organization to start managing events and users.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name
          </label>
          <input
            id="tenantName"
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder="Enter your organization name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            This will be the name of your organization in the system.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Organization'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center">
        <div className="text-xs text-gray-500">
          <p className="mb-2">After creating your organization, you'll be able to:</p>
          <ul className="text-left space-y-1">
            <li>• Create and manage events</li>
            <li>• Invite team members</li>
            <li>• Track bookings and attendance</li>
            <li>• Generate reports</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TenantCreation
