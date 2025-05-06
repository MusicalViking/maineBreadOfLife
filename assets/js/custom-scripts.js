/**
 * Custom scripts for Bread of Life website
 * Created to replace inline scripts and strengthen Content Security Policy
 */

// Force scroll to top on page load
window.onload = function() {
    window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top again after DOM is loaded
    window.scrollTo(0, 0);
    // Swiper configuration handling
    const swiperConfigs = document.querySelectorAll('.swiper-config');
    swiperConfigs.forEach(config => {
        // This will be handled by the main.js initSwiper function
        // We're just ensuring the JSON is properly formatted and accessible
        try {
            JSON.parse(config.innerHTML.trim());
        } catch (e) {
            console.error('Invalid Swiper configuration JSON:', e);
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessages = document.getElementById('form-messages');
        const fileUpload = document.getElementById('file-upload');
        const fileLabel = document.getElementById('file-label');
        
        // File upload handling
        if (fileUpload && fileLabel) {
            fileUpload.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const fileNames = Array.from(this.files).map(file => file.name).join(', ');
                    fileLabel.textContent = fileNames.length > 30 ? 
                        fileNames.substring(0, 30) + '...' : 
                        fileNames;
                } else {
                    fileLabel.textContent = 'Attach Files';
                }
            });
        }
    }

    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            // Form validation can be added here
        });
    }
});

// Google Maps initialization (if needed)
function initMap() {
    // This function can be used if custom map initialization is needed
    // Currently using iframe embed which doesn't require this
}
