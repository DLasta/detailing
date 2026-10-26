/**
 * Elite Auto Detailing - Main JavaScript
 * Vanilla JavaScript (No React, No jQuery, No backend)
 * Fully functional standalone script
 */

// Business WhatsApp configuration
const businessWhatsAppNumber = "385911234567";

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initStatsCounters();
  initScrollReveal();
  initBeforeAfterSlider();
  initGalleryAndLightbox();
  initServiceAndPackageSelection();
  initQuoteForm();
  initQuoteModal();
  initModalsAndPopups();
  initFooterYear();
});

/* ==========================================================================
   1. Sticky Navbar & Active Section Highlighting
   ========================================================================== */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta .btn');

  if (!hamburgerBtn || !mobileDrawer) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !mobileDrawer.classList.contains('is-open');
    if (isOpen) {
      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('is-open');
      document.body.classList.add('modal-open');
    } else {
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  }

  hamburgerBtn.addEventListener('click', () => toggleMenu());

  // Close when any mobile navigation link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      toggleMenu(true);
    }
  });
}

/* ==========================================================================
   3. Animated Statistics Counters
   ========================================================================== */
function initStatsCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateAllCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const statsContainer = document.querySelector('.stats-card-container');
  if (statsContainer) {
    observer.observe(statsContainer);
  }

  function animateAllCounters() {
    statItems.forEach(item => {
      const numElem = item.querySelector('.stat-number');
      if (!numElem) return;

      const target = parseFloat(numElem.getAttribute('data-target') || '0');
      const suffix = numElem.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeProgress * target);

        numElem.textContent = currentVal.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          numElem.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

/* ==========================================================================
   4. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Interactive Before / After Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-container');
  const beforeImgWrapper = document.querySelector('.comparison-image-before');
  const handle = document.querySelector('.comparison-handle');
  const tabs = document.querySelectorAll('.ba-tab-btn');
  const beforeImg = document.getElementById('ba-img-before');
  const afterImg = document.getElementById('ba-img-after');
  const labelBefore = document.getElementById('ba-label-before');
  const labelAfter = document.getElementById('ba-label-after');

  if (!container || !beforeImgWrapper || !handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    beforeImgWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Pointer / Mouse events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  // Touch events for mobile/tablet
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Direct container click
  container.addEventListener('click', (e) => {
    updateSliderPosition(e.clientX);
  });

  // Before / After Examples data
  const comparisonData = {
    paint: {
      before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      beforeLabel: 'Before: Heavy Swirls & Scratches',
      afterLabel: 'After: 2-Stage Paint Correction'
    },
    interior: {
      before: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      beforeLabel: 'Before: Dull & Stained Leather',
      afterLabel: 'After: Deep Extracted & Conditioned'
    },
    headlight: {
      before: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      beforeLabel: 'Before: Yellowed & Oxidized Lens',
      afterLabel: 'After: Crystal Clear UV Seal'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const key = tab.getAttribute('data-example');
      const data = comparisonData[key];
      if (data && beforeImg && afterImg) {
        beforeImg.src = data.before;
        afterImg.src = data.after;
        if (labelBefore) labelBefore.textContent = data.beforeLabel;
        if (labelAfter) labelAfter.textContent = data.afterLabel;

        // Reset handle to center (50%)
        beforeImgWrapper.style.width = '50%';
        handle.style.left = '50%';
      }
    });
  });
}

/* ==========================================================================
   6. Gallery Filtering & Lightbox Modal
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  // Lightbox data collection
  let currentIndex = 0;
  const visibleItems = () => Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));

  function openLightbox(index) {
    const items = visibleItems();
    if (!items.length || index < 0 || index >= items.length) return;

    currentIndex = index;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent || 'Gallery Photo';
    const category = item.querySelector('.gallery-item-category')?.textContent || '';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = category ? `${category} — ${title}` : title;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} of ${items.length}`;
    }

    lightbox.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  function showNextImage() {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  function showPrevImage() {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  // Gallery click handlers
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const items = visibleItems();
      const index = items.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);

  // Close when clicking outside image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });
}

/* ==========================================================================
   7. Service & Package Selection Pre-filling
   ========================================================================== */
function initServiceAndPackageSelection() {
  const triggerButtons = document.querySelectorAll('[data-select-service]');
  const mainServiceSelect = document.getElementById('quote-service');
  const modalServiceSelect = document.getElementById('modal-quote-service');

  function setService(serviceName) {
    if (mainServiceSelect) {
      mainServiceSelect.value = serviceName;
    }
    if (modalServiceSelect) {
      modalServiceSelect.value = serviceName;
    }
  }

  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-select-service');
      if (serviceName) {
        setService(serviceName);
      }
    });
  });
}

/* ==========================================================================
   8. Quote Form Validation & WhatsApp Generator
   ========================================================================== */
function initQuoteForm() {
  setupFormHandlers('quote-form', 'quote-status');
}

function setupFormHandlers(formId, statusContainerId) {
  const form = document.getElementById(formId);
  const statusBox = document.getElementById(statusContainerId);
  if (!form) return;

  const btnSubmitStandard = form.querySelector('.btn-submit-standard');
  const btnSubmitWhatsApp = form.querySelector('.btn-submit-whatsapp');

  // Input elements
  const inputName = form.querySelector('[name="name"]');
  const inputPhone = form.querySelector('[name="phone"]');
  const inputEmail = form.querySelector('[name="email"]');
  const inputMake = form.querySelector('[name="make"]');
  const inputModel = form.querySelector('[name="model"]');
  const inputYear = form.querySelector('[name="year"]');
  const selectService = form.querySelector('[name="service"]');
  const textareaMessage = form.querySelector('[name="message"]');

  // Clear validation styling when user types or changes value
  const requiredInputs = [inputName, inputPhone, inputMake, inputModel, selectService];
  requiredInputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const err = input.parentElement.querySelector('.form-error-msg');
      if (err) err.classList.remove('is-visible');
    });
    input.addEventListener('change', () => {
      input.classList.remove('is-invalid');
      const err = input.parentElement.querySelector('.form-error-msg');
      if (err) err.classList.remove('is-visible');
    });
  });

  // Validate required fields
  function validateForm() {
    let isValid = true;

    function checkField(elem, condition) {
      if (!elem) return true;
      const errorMsg = elem.parentElement.querySelector('.form-error-msg');
      if (!condition) {
        elem.classList.add('is-invalid');
        if (errorMsg) errorMsg.classList.add('is-visible');
        isValid = false;
        return false;
      } else {
        elem.classList.remove('is-invalid');
        if (errorMsg) errorMsg.classList.remove('is-visible');
        return true;
      }
    }

    const hasName = checkField(inputName, inputName.value.trim().length >= 2);
    const hasPhone = checkField(inputPhone, inputPhone.value.trim().length >= 6);
    const hasMake = checkField(inputMake, inputMake.value.trim().length >= 2);
    const hasModel = checkField(inputModel, inputModel.value.trim().length >= 1);
    const hasService = checkField(selectService, selectService.value.trim() !== '');

    if (!isValid) {
      // Focus on first invalid input
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }

    return isValid;
  }

  // Get current form data object
  function getFormData() {
    return {
      name: inputName ? inputName.value.trim() : '',
      phone: inputPhone ? inputPhone.value.trim() : '',
      email: inputEmail ? inputEmail.value.trim() : 'Not provided',
      make: inputMake ? inputMake.value.trim() : '',
      model: inputModel ? inputModel.value.trim() : '',
      year: inputYear ? (inputYear.value.trim() || 'Not specified') : 'Not specified',
      service: selectService ? selectService.value.trim() : '',
      message: textareaMessage ? (textareaMessage.value.trim() || 'None') : 'None'
    };
  }

  // Format WhatsApp message text
  function buildWhatsAppMessage(data) {
    return `Hello Elite Auto Detailing,

I would like to request a quote.

Customer:
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}

Vehicle:
Make: ${data.make}
Model: ${data.model}
Year: ${data.year}

Requested service:
${data.service}

Additional information:
${data.message}

Thank you!`;
  }

  // 1. Standard "Request Free Quote" Submission (Local / Frontend Only)
  if (btnSubmitStandard) {
    btnSubmitStandard.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const data = getFormData();

      if (statusBox) {
        statusBox.className = 'form-status-box is-success';
        statusBox.innerHTML = `
          <div class="form-status-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Thank you! Your quote request has been prepared.
          </div>
          <p>
            Your request summary for <strong>${escapeHtml(data.service)}</strong> on your 
            <strong>${escapeHtml(data.make)} ${escapeHtml(data.model)}</strong> is ready.
          </p>
          <p style="margin-top: 0.6rem; font-size: 0.85rem; color: #a1a1aa;">
            Note: This is a frontend demo application. For instant assistance, you can also use the 
            <strong>"Send via WhatsApp"</strong> button to open this message directly on WhatsApp.
          </p>
        `;
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 2. WhatsApp Direct Booking Submission
  if (btnSubmitWhatsApp) {
    btnSubmitWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const data = getFormData();
      const messageText = buildWhatsAppMessage(data);
      const encodedText = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/${businessWhatsAppNumber}?text=${encodedText}`;

      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank');

      if (statusBox) {
        statusBox.className = 'form-status-box is-whatsapp-ready';
        statusBox.innerHTML = `
          <div class="form-status-title" style="color: #4ade80;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Your request is ready in WhatsApp. Please press Send to complete your request.
          </div>
          <p style="font-size: 0.875rem; color: #cfd3dc; margin-top: 0.4rem;">
            A new browser tab has opened with your detailing quote request pre-filled for 
            <strong>+385 91 123 4567</strong>. Simply tap "Send" in WhatsApp to dispatch your inquiry.
          </p>
        `;
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   9. Quote Modal Dialog
   ========================================================================== */
function initQuoteModal() {
  const modalBackdrop = document.getElementById('quote-modal');
  const openButtons = document.querySelectorAll('.open-quote-modal-btn');
  const closeButton = document.getElementById('quote-modal-close');

  setupFormHandlers('modal-quote-form', 'modal-quote-status');

  function openModal(preselectedService) {
    if (!modalBackdrop) return;
    if (preselectedService) {
      const select = document.getElementById('modal-quote-service');
      if (select) select.value = preselectedService;
    }
    modalBackdrop.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-select-service');
      openModal(service);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. Privacy Policy Modal & Generic Popups
   ========================================================================== */
function initModalsAndPopups() {
  const privacyTrigger = document.getElementById('privacy-policy-link');
  const privacyModal = document.getElementById('privacy-modal');
  const privacyClose = document.getElementById('privacy-modal-close');

  if (privacyTrigger && privacyModal) {
    privacyTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      privacyModal.classList.add('is-open');
      document.body.classList.add('modal-open');
    });

    if (privacyClose) {
      privacyClose.addEventListener('click', () => {
        privacyModal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
      });
    }

    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) {
        privacyModal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
      }
    });
  }
}

/* ==========================================================================
   11. Footer Automatic Current Year
   ========================================================================== */
function initFooterYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
