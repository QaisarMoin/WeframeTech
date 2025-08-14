// Test script to add signup button to Payload login page
// Copy and paste this into the browser console on the login page

(function() {
  console.log('🔧 Adding signup button to login page...');
  
  // Check if button already exists
  if (document.querySelector('.custom-signup-button')) {
    console.log('✅ Signup button already exists');
    return;
  }
  
  // Find the form
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ Form not found');
    return;
  }
  
  console.log('📝 Form found, creating signup section...');
  
  // Create signup section
  const signupDiv = document.createElement('div');
  signupDiv.className = 'custom-signup-container';
  signupDiv.innerHTML = `
    <p class="custom-signup-text">Don't have an account?</p>
    <a href="/signup" class="custom-signup-button">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
      </svg>
      Create Account
    </a>
  `;
  
  // Insert after form
  form.parentNode.insertBefore(signupDiv, form.nextSibling);
  
  console.log('✅ Signup button added successfully!');
  
  // Test if the button is visible
  const button = document.querySelector('.custom-signup-button');
  if (button) {
    console.log('✅ Button is in DOM and should be visible');
    console.log('Button styles:', window.getComputedStyle(button));
  } else {
    console.log('❌ Button not found in DOM');
  }
})();

// Instructions:
// 1. Open the browser console (F12)
// 2. Navigate to http://localhost:3001/admin/login
// 3. Copy and paste this entire script into the console
// 4. Press Enter to execute
// 5. The signup button should appear below the login form
