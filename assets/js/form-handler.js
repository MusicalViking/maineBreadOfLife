/**
 * Form Handler for Bread of Life Website
 * Handles CSRF token loading and form submission feedback
 */

document.addEventListener('DOMContentLoaded', function() {
  // Load CSRF tokens for all forms
  loadCsrfTokens();
  
  // Set up form submission handlers
  setupFormHandlers();
});

/**
 * Load CSRF tokens for contact and newsletter forms
 */
function loadCsrfTokens() {
  fetch('forms/get_csrf_token.php')
    .then(response => response.json())
    .then(data => {
      // Set token for contact form
      const contactCsrfInput = document.getElementById('csrf_token');
      if (contactCsrfInput) {
        contactCsrfInput.value = data.token;
      }
      
      // Set tokens for all newsletter forms
      const newsletterCsrfInputs = document.querySelectorAll('.newsletter-csrf-token');
      newsletterCsrfInputs.forEach(input => {
        input.value = data.token;
      });
    })
    .catch(error => {
      console.error('Error loading CSRF token:', error);
    });
}

/**
 * Set up form submission handlers for all forms
 */
function setupFormHandlers() {
  // Contact form handler
  const contactForm = document.querySelector('form.php-email-form[action="forms/contact.php"]');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const messageDiv = document.getElementById('form-messages');
      
      // Store form data for later use
      const formData = new FormData(this);
      
      // Show loading indicator
      if (messageDiv) {
        messageDiv.innerHTML = '<div class="alert alert-info">Sending message, please wait...</div>';
      }
      
      // Let the form submit normally - PHP will handle it
      // We're not preventing default because we want the traditional form submission
      // This is more reliable on GoDaddy hosting than AJAX
    });
  }
  
  // Newsletter form handlers
  const newsletterForms = document.querySelectorAll('form.php-email-form[action="forms/newsletter.php"]');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const messageDiv = form.querySelector('.newsletter-message');
      
      // Show loading indicator
      if (messageDiv) {
        messageDiv.innerHTML = '<div class="alert alert-info">Processing subscription, please wait...</div>';
      }
      
      // Let the form submit normally - PHP will handle it
    });
  });
  
  // Check for success/error parameters in URL
  window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    
    if (status && message) {
      // Display message based on status
      const decodedMessage = decodeURIComponent(message);
      const alertClass = status === 'success' ? 'alert-success' : 'alert-danger';
      
      // Find the appropriate message container based on the referring form
      let messageContainer;
      if (document.referrer.includes('contact-us.html')) {
        messageContainer = document.getElementById('form-messages');
      } else {
        messageContainer = document.querySelector('.newsletter-message');
      }
      
      if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert ${alertClass}">${decodedMessage}</div>`;
        
        // Scroll to the message
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
