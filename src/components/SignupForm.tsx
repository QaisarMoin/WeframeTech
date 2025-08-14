'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee' as 'attendee' | 'organizer' | 'admin',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate form
    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!formData.password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setError('')
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'attendee',
        })
      } else {
        setError(data.error || 'An error occurred during signup')
      }
    } catch (_err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-card" style={{ textAlign: 'center' }}>
          <h2 className="signup-title" style={{ color: '#10b981' }}>
            Account Created Successfully!
          </h2>
          <p className="signup-success">
            Your account has been created. You can now log in to access the admin panel.
          </p>
          <Link href="/admin" className="signup-button" style={{ display: 'inline-block' }}>
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create your account</h2>
        <p className="signup-subtitle">
          Join as an attendee to book events, or as an organizer/admin to manage them
        </p>

        <form onSubmit={handleSubmit}>
          <div className="signup-field" style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="signup-field" style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">
              Email <span className="required-asterisk">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="signup-field" style={{ marginBottom: '1rem' }}>
            <label htmlFor="role">
              Role <span className="required-asterisk">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="signup-select"
            >
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
            <p style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>
              {formData.role === 'attendee'
                ? 'Attendees can book events and view their own bookings/notifications'
                : formData.role === 'organizer'
                  ? 'Organizers can create and manage events within their organization'
                  : 'Admins have full access within their tenant'}
            </p>
          </div>

          <div className="signup-field" style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">
              New Password <span className="required-asterisk">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Enter your password"
            />
          </div>

          <div className="signup-field" style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required-asterisk">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Confirm your password"
            />
          </div>

          {error && <div className="signup-error">{error}</div>}

          <div>
            <button type="submit" disabled={loading} className="signup-button-light">
              {loading ? 'Creating Account...' : 'Create'}
            </button>
          </div>

          <div className="signup-footer">
            Already have an account? <Link href="/admin">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupForm
