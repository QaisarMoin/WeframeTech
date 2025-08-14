// Persistent signup button injection for Payload admin
;(function () {
  let isInjecting = false
  let observer = null

  function addSignupButton() {
    // Prevent multiple simultaneous injections
    if (isInjecting) return
    isInjecting = true

    try {
      // Only run on admin login pages
      const isLoginPage =
        window.location.pathname.includes('/admin') &&
        (window.location.pathname.includes('/login') ||
          document.querySelector('form input[type="password"]'))

      if (!isLoginPage) {
        isInjecting = false
        return
      }

      // Check if button already exists and is visible
      const existingButton = document.querySelector('.custom-signup-button')
      if (existingButton && existingButton.offsetParent !== null) {
        isInjecting = false
        return
      }

      // Remove any existing button first
      if (existingButton) {
        existingButton.closest('.custom-signup-container')?.remove()
      }

      // Find the form
      const form = document.querySelector('form')
      if (!form) {
        setTimeout(() => {
          isInjecting = false
          addSignupButton()
        }, 300)
        return
      }

      console.log('🔧 Adding signup button...')

      // Create signup section with unique ID to prevent duplicates
      const signupDiv = document.createElement('div')
      signupDiv.className = 'custom-signup-container'
      signupDiv.id = 'payload-signup-injector'
      signupDiv.innerHTML = `
        <p class="custom-signup-text" style="color: #9ca3af; font-size: 0.875rem; margin: 0.75rem 0; text-align: center;">
          Don't have an account?
        </p>
        <a href="/signup" class="custom-signup-button" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.75rem 1rem;
          margin-top: 1rem;
          border: 1px solid #4b5563;
          border-radius: 0.375rem;
          background-color: #374151;
          color: #d1d5db;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease-in-out;
          box-sizing: border-box;
        ">
          <svg style="width: 1rem; height: 1rem; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Create Account
        </a>
      `

      // Add hover effects
      const button = signupDiv.querySelector('.custom-signup-button')
      button.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#4b5563'
        this.style.color = '#f9fafb'
      })
      button.addEventListener('mouseleave', function () {
        this.style.backgroundColor = '#374151'
        this.style.color = '#d1d5db'
      })

      // Insert after form with a wrapper for better positioning
      const wrapper = document.createElement('div')
      wrapper.style.marginTop = '1.5rem'
      wrapper.style.paddingTop = '1.5rem'
      wrapper.style.borderTop = '1px solid #374151'
      wrapper.appendChild(signupDiv)

      form.parentNode.insertBefore(wrapper, form.nextSibling)

      console.log('✅ Signup button added successfully!')
    } catch (error) {
      console.error('❌ Error adding signup button:', error)
    } finally {
      isInjecting = false
    }
  }

  // Set up mutation observer to watch for DOM changes
  function setupObserver() {
    if (observer) observer.disconnect()

    observer = new MutationObserver((mutations) => {
      let shouldRerun = false

      mutations.forEach((mutation) => {
        // Check if nodes were added or removed
        if (mutation.type === 'childList') {
          // Check if our button was removed
          const buttonExists = document.querySelector('#payload-signup-injector')
          if (!buttonExists && window.location.pathname.includes('/admin')) {
            shouldRerun = true
          }
        }
      })

      if (shouldRerun) {
        setTimeout(addSignupButton, 100)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  // Initialize
  function init() {
    addSignupButton()
    setupObserver()
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Also run on URL changes (for SPA navigation)
  let lastUrl = location.href
  setInterval(() => {
    const url = location.href
    if (url !== lastUrl) {
      lastUrl = url
      setTimeout(addSignupButton, 200)
    }
  }, 1000)

  // Run periodically as backup
  setInterval(addSignupButton, 3000)

  console.log('🚀 Signup button injector initialized')
})()
