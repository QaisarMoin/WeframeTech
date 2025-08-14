import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Sign up - Event Management',
  description: 'Create your account to start managing events',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="signup-body">{children}</body>
    </html>
  )
}
