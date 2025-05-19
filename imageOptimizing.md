# To use this:

# Generate your images in multiple sizes and formats:
   WebP: 400w, 800w, 1000w
   AVIF: 400w, 600w
   Fallback JPG: 1000w

# Replace your-image with your actual image name in the paths.
# The browser will:
   Use AVIF for smaller screens (<1000px) if supported
   Use WebP for larger screens (≥1000px)
   Fall back to JPG if neither format is supported
   Lazy load images for better performance
   The JavaScript adds appropriate classes to the HTML element, which you can use for additional styling or feature detection.
   This implementation follows modern web performance best practices while maintaining compatibility across browsers. The images will be loaded responsively based on viewport size and browser capabilities.

<div class="optimized-images">
  <picture>
    <!-- AVIF for modern browsers (smaller size) -->
    <source 
      srcset="
        assets/images/your-image-400.avif 400w,
        assets/images/your-image-600.avif 600w
      " 
      type="image/avif"
      media="(max-width: 999px)"
      sizes="(max-width: 600px) 100vw, 600px"
    >
    <!-- WebP fallback (larger size) -->
    <source 
      srcset="
        assets/images/your-image-400.webp 400w,
        assets/images/your-image-800.webp 800w,
        assets/images/your-image-1000.webp 1000w
      " 
      type="image/webp"
      media="(min-width: 1000px)"
      sizes="(max-width: 1000px) 100vw, 1000px"
    >
    <!-- Original/fallback image -->
    <img 
      src="assets/images/your-image-1000.jpg" 
      alt="Description of the image"
      loading="lazy"
      class="optimized-image"
    >
  </picture>
</div>

---
Element.classList.add(supported ? 'avif' : 'no-avif');
});
});

---
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Check for AVIF support
  const avifSupported = (function() {
    const img = new Image();
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEQAABAAEAAAABAAAAJgAAGkEAAEAAAAAAAAc2kuZGF0YQ==';
    return new Promise(resolve => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  })();

  // Add appropriate class based on format support
  avifSupported.then(supported => {
    document.documentElement.classList.add(supported ? 'avif' : 'no-avif');
  });
});
</script>

------------------------------------------
<style>
/* Optimized Images Container */
.optimized-images {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.optimized-image {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease;
}

/* Loading state */
.optimized-image[loading="lazy"] {
  opacity: 0;
  will-change: opacity;
}

.optimized-image.loaded {
  opacity: 1;
}

/* Add this if you want to show a loading indicator */
.optimized-images::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.optimized-image.loaded + .optimized-images::before {
  opacity: 0;
  pointer-events: none;
}
</style>