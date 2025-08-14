// Script to add signup button to Payload login page
(function() {
  'use strict';
  
  function addSignupButton() {
    // Check if we're on the login page
    if (!window.location.pathname.includes('/login') && !window.location.pathname.endsWith('/admin')) {
      return;
    }
    
    // Check if signup button already exists
    if (document.querySelector('.custom-signup-button')) {
      return;
    }
    
    // Find the login form submit button
    const submitButton = document.querySelector('button[type="submit"]');
    const form = document.querySelector('form');
    
    if (!submitButton || !form) {
      // Try again after a short delay
      setTimeout(addSignupButton, 500);
      return;
    }
    
    // Create signup button container
    const signupContainer = document.createElement('div');
    signupContainer.className = 'signup-button-container';
    signupContainer.innerHTML = `
      <p class="signup-text">Don't have an account?</p>
      <a href="/signup" class="signup-button custom-signup-button">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
        Create Account
      </a>
    `;
    
    // Insert the signup button after the submit button
    submitButton.parentNode.insertBefore(signupContainer, submitButton.nextSibling);
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSignupButton);
  } else {
    addSignupButton();
  }
  
  // Also run when the page changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(addSignupButton, 100);
    }
  }).observe(document, { subtree: true, childList: true });
  
})();
