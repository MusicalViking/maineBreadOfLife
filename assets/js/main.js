/*
 *  ======================================================================
 *  MAIN.JS | MAINE BREAD OF LIFE - FORM SUBMIT VERSION
 *  AUTHOR: ARTHUR DANIEL BELANGER JR.
 *  https://github.com/MusicalViking/maineBreadOfLife
 *  ======================================================================
 */
(function () {
	"use strict";

	// Toggle 'scrolled' class on header based on scroll position
	function toggleScrolled() {
		const header = document.querySelector('.home-header');
		if (!header) return;
		if (window.scrollY > 50) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
	}

	document.addEventListener('scroll', toggleScrolled);
	window.addEventListener('load', toggleScrolled);

	// Mobile nav toggle
	const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
	function mobileNavToggle() {
		document.body.classList.toggle('mobile-nav-active');
		mobileNavToggleBtn.classList.toggle('bi-list');
		mobileNavToggleBtn.classList.toggle('bi-x');
	}
	mobileNavToggleBtn?.addEventListener('click', mobileNavToggle);

	// Close mobile nav on link click
	document.querySelectorAll('#navmenu a').forEach(link => {
		link.addEventListener('click', () => {
			if (document.body.classList.contains('mobile-nav-active')) {
				mobileNavToggle();
			}
		});
	});

	// Toggle dropdowns in mobile nav
	document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
		toggle.addEventListener('click', function (e) {
			e.preventDefault();
			this.parentNode.classList.toggle('active');
			this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
			e.stopImmediatePropagation();
		});
	});

	// Remove preloader on load
	const preloader = document.querySelector('#preloader');
	if (preloader) {
		window.addEventListener('load', () => preloader.remove());
	}

	// Scroll-to-top button
	const scrollTop = document.querySelector('.scroll-top');
	function toggleScrollTop() {
		if (scrollTop) {
			scrollTop.classList.toggle('active', window.scrollY > 100);
		}
	}

	scrollTop?.addEventListener('click', (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	window.addEventListener('load', toggleScrollTop);
	document.addEventListener('scroll', toggleScrollTop);

	// Initialize AOS (Animate On Scroll) if loaded
	if (window.AOS) {
		window.addEventListener('load', () => {
			AOS.init({
				duration: 600,
				easing: 'ease-in-out',
				once: true,
				mirror: false
			});
		});
	}

	// Initialize GLightbox if loaded
	if (window.GLightbox) {
		const glightbox = GLightbox({
			selector: '.glightbox'
		});
	}

	// Initialize PureCounter if loaded
	if (window.PureCounter) {
		new PureCounter();
	}

	// FAQ toggle functionality
	document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
		faqItem.addEventListener('click', () => {
			faqItem.parentNode.classList.toggle('faq-active');
		});
	});

	// Initialize Swiper sliders if loaded
	if (window.Swiper) {
		function initSwiper() {
			document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
				let config = JSON.parse(swiperElement.querySelector(".swiper-config").textContent.trim());
				if (swiperElement.classList.contains("swiper-tab")) {
					// Customize this if you have special pagination needs
					new Swiper(swiperElement, config);
				} else {
					new Swiper(swiperElement, config);
				}
			});
		}
		window.addEventListener("load", initSwiper);
	}

	// Auto-generate carousel indicators for Bootstrap carousels
	document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
		const carousel = carouselIndicator.closest('.carousel');
		if (!carousel) return;

		const items = carousel.querySelectorAll('.carousel-item');
		carouselIndicator.innerHTML = ''; // clear existing
		items.forEach((item, index) => {
			const activeClass = index === 0 ? 'class="active"' : '';
			carouselIndicator.innerHTML += `<li data-bs-target="#${carousel.id}" data-bs-slide-to="${index}" ${activeClass}></li>`;
		});
	});

	// Bootstrap 5 form validation for all forms with 'needs-validation' class
	(function () {
		const forms = document.querySelectorAll('.needs-validation');
		Array.from(forms).forEach(function (form) {
			form.addEventListener('submit', function (event) {
				// Clear previous custom message if any
				const messageDiv = form.querySelector('#form-messages');
				if (messageDiv) {
					messageDiv.innerHTML = '';
				}

				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();

					// Show custom error messages for invalid fields
					Array.from(form.elements).forEach(input => {
						const errorDiv = form.querySelector(`#${input.name}-error`);
						if (errorDiv) {
							if (!input.checkValidity()) {
								errorDiv.textContent = input.validationMessage;
								errorDiv.classList.remove('visually-hidden');
								input.classList.add('is-invalid');
							} else {
								errorDiv.textContent = '';
								errorDiv.classList.add('visually-hidden');
								input.classList.remove('is-invalid');
							}
						}
					});
					return false;
				}

				// Show a sending message while the form submits
				event.preventDefault(); // Prevent actual submit for demo (remove in production)
				if (messageDiv) {
					messageDiv.innerHTML = `<div class="alert alert-info" role="alert">Sending message, please wait...</div>`;
				}

				// Submit the form for real
				form.submit();
			}, false);
		});
	})();

	// Update file upload label when files are selected
	const fileUpload = document.getElementById('file-upload');
	const fileLabel = document.querySelector('label[for="file-upload"]');
	if (fileUpload && fileLabel) {
		fileUpload.addEventListener('change', function () {
			if (this.files.length > 0) {
				const fileNames = Array.from(this.files).map(file => file.name).join(', ');
				fileLabel.textContent = fileNames.length > 30 ? fileNames.substring(0, 30) + '...' : fileNames;
			} else {
				fileLabel.textContent = 'Attach Files (PDF, DOC, JPG, etc.)';
			}
		});
	}
})();