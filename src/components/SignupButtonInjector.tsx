'use client'

import React, { useEffect } from 'react'

const SignupButtonInjector: React.FC = () => {
  useEffect(() => {
    function addSignupButton() {
      // Only run on login pages
      if (!window.location.pathname.includes('/admin')) return
      
      // Check if button already exists
      if (document.querySelector('.custom-signup-button')) return
      
      // Find the form
      const form = document.querySelector('form')
      if (!form) {
        setTimeout(addSignupButton, 500)
        return
      }
      
      // Create signup section
      const signupDiv = document.createElement('div')
      signupDiv.className = 'custom-signup-container'
      signupDiv.innerHTML = `
        <p class="custom-signup-text">Don't have an account?</p>
        <a href="/signup" class="custom-signup-button">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Create Account
        </a>
      `
      
      // Insert after form
      form.parentNode?.insertBefore(signupDiv, form.nextSibling)
    }
    
    // Run immediately and periodically
    addSignupButton()
    const interval = setInterval(addSignupButton, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return null // This component doesn't render anything visible
}

export default SignupButtonInjector
