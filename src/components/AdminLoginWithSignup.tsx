import React from 'react'
import Link from 'next/link'
import { LoginView } from '@payloadcms/next/views'

// Server Component wrapper around Payload's default login with a persistent signup button
export const AdminLoginWithSignup = () => {
  return (
    <div style={{ position: 'relative' }}>
      <LoginView />

      {/* Persistent sign up callout */}
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 12 }}>Don't have an account?</p>
          <Link
            href="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #4b5563',
              borderRadius: 6,
              background: '#374151',
              color: '#E5E7EB',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <svg
              style={{ width: 16, height: 16, marginRight: 8 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginWithSignup
