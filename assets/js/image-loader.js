/**
 * Image Loading Enhancement Script
 * Ensures all images load properly without requiring page refresh
 * For Bread of Life Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // milliseconds
    const LAZY_LOADING = true;
    
    // Track all images on the page
    const allImages = document.querySelectorAll('img');
    const imageStatus = new Map();
    
    // Initialize image tracking
    allImages.forEach(img => {
        // Skip images that are already loaded
        if (img.complete && img.naturalHeight !== 0) {
            return;
        }
        
        // Track this image
        imageStatus.set(img, {
            src: img.src,
            retries: 0,
            loading: false
        });
        
        // Set up event listeners
        img.addEventListener('load', () => handleImageLoaded(img));
        img.addEventListener('error', () => handleImageError(img));
        
        // Apply lazy loading if enabled and not already set
        if (LAZY_LOADING && !img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Handle successful image load
    function handleImageLoaded(img) {
        if (imageStatus.has(img)) {
            imageStatus.delete(img);
        }
    }
    
    // Handle image loading error
    function handleImageError(img) {
        if (!imageStatus.has(img)) return;
        
        const status = imageStatus.get(img);
        
        // Check if we should retry
        if (status.retries < MAX_RETRIES) {
            status.retries++;
            status.loading = false;
            
            // Schedule retry with exponential backoff
            setTimeout(() => {
                if (imageStatus.has(img)) {
                    console.log(`Retrying image load (${status.retries}/${MAX_RETRIES}): ${img.src}`);
                    
                    // Force browser to retry by appending a cache-busting parameter
                    const cacheBuster = `?retry=${Date.now()}`;
                    const originalSrc = status.src.split('?')[0]; // Remove any existing query params
                    
                    img.src = originalSrc + cacheBuster;
                    status.loading = true;
                }
            }, RETRY_DELAY * status.retries);
        } else {
            console.warn(`Failed to load image after ${MAX_RETRIES} retries: ${img.src}`);
            
            // Optional: Show a placeholder or error indicator
            // img.src = 'assets/img/image-placeholder.webp';
        }
    }
    
    // Check for any images that might not have triggered load/error events
    window.addEventListener('load', function() {
        // Give a small delay to allow normal loading to complete
        setTimeout(() => {
            imageStatus.forEach((status, img) => {
                if (!img.complete && status.retries === 0 && !status.loading) {
                    console.log(`Force retrying image that didn't trigger events: ${img.src}`);
                    handleImageError(img);
                }
            });
        }, 2000);
    });
});
