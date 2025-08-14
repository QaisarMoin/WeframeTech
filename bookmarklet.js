// Bookmarklet to add signup button to Payload login page
// To use: Copy this entire code, create a new bookmark, and paste it as the URL (with javascript: prefix)

javascript:(function(){
  // Load the admin enhancements script
  if (!document.querySelector('#signup-injector-script')) {
    const script = document.createElement('script');
    script.id = 'signup-injector-script';
    script.src = '/admin-enhancements.js';
    script.onload = function() {
      console.log('✅ Signup injector script loaded');
    };
    script.onerror = function() {
      console.log('❌ Failed to load signup injector script');
      // Fallback: run the script inline
      eval(`
        // Persistent signup button injection for Payload admin
        (function () {
          let isInjecting = false;
          
          function addSignupButton() {
            if (isInjecting) return;
            isInjecting = true;
            
            try {
              const isLoginPage = window.location.pathname.includes('/admin') && 
                                (window.location.pathname.includes('/login') || 
                                 document.querySelector('form input[type="password"]'));
              
              if (!isLoginPage) {
                isInjecting = false;
                return;
              }

              const existingButton = document.querySelector('.custom-signup-button');
              if (existingButton && existingButton.offsetParent !== null) {
                isInjecting = false;
                return;
              }

              if (existingButton) {
                existingButton.closest('.custom-signup-container')?.remove();
              }

              const form = document.querySelector('form');
              if (!form) {
                setTimeout(() => {
                  isInjecting = false;
                  addSignupButton();
                }, 300);
                return;
              }

              console.log('🔧 Adding signup button...');

              const signupDiv = document.createElement('div');
              signupDiv.className = 'custom-signup-container';
              signupDiv.id = 'payload-signup-injector';
              signupDiv.innerHTML = \`
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
              \`;

              const button = signupDiv.querySelector('.custom-signup-button');
              button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#4b5563';
                this.style.color = '#f9fafb';
              });
              button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#374151';
                this.style.color = '#d1d5db';
              });

              const wrapper = document.createElement('div');
              wrapper.style.marginTop = '1.5rem';
              wrapper.style.paddingTop = '1.5rem';
              wrapper.style.borderTop = '1px solid #374151';
              wrapper.appendChild(signupDiv);
              
              form.parentNode.insertBefore(wrapper, form.nextSibling);
              
              console.log('✅ Signup button added successfully!');
              
            } catch (error) {
              console.error('❌ Error adding signup button:', error);
            } finally {
              isInjecting = false;
            }
          }

          addSignupButton();
          setInterval(addSignupButton, 3000);
          
          console.log('🚀 Signup button injector initialized via bookmarklet');
        })();
      `);
    };
    document.head.appendChild(script);
  } else {
    console.log('✅ Signup injector script already loaded');
  }
})();
