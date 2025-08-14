// CONSOLE COMMAND TO ADD SIGNUP BUTTON
// Copy and paste this into the browser console on the login page

// Load and execute the admin enhancements script
fetch('/admin-enhancements.js')
  .then(response => response.text())
  .then(scriptContent => {
    // Execute the script
    eval(scriptContent);
    console.log('✅ Signup button script executed successfully!');
  })
  .catch(error => {
    console.error('❌ Failed to load script:', error);
    
    // Fallback: Add button manually
    console.log('🔧 Adding signup button manually...');
    
    function addSignupButtonManually() {
      // Check if button already exists
      if (document.querySelector('.custom-signup-button')) {
        console.log('✅ Button already exists');
        return;
      }
      
      // Find the form
      const form = document.querySelector('form');
      if (!form) {
        console.log('❌ Form not found');
        return;
      }
      
      // Create signup section
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = '1.5rem';
      wrapper.style.paddingTop = '1.5rem';
      wrapper.style.borderTop = '1px solid #374151';
      
      const signupDiv = document.createElement('div');
      signupDiv.className = 'custom-signup-container';
      signupDiv.id = 'payload-signup-injector';
      signupDiv.innerHTML = `
        <p style="color: #9ca3af; font-size: 0.875rem; margin: 0.75rem 0; text-align: center;">
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
      `;
      
      // Add hover effects
      const button = signupDiv.querySelector('.custom-signup-button');
      button.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#4b5563';
        this.style.color = '#f9fafb';
      });
      button.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#374151';
        this.style.color = '#d1d5db';
      });
      
      wrapper.appendChild(signupDiv);
      form.parentNode.insertBefore(wrapper, form.nextSibling);
      
      console.log('✅ Signup button added manually!');
    }
    
    addSignupButtonManually();
  });
