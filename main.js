// ============================================
// SECURITY HELPERS
// ============================================
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      sanitized[key] = typeof value === 'string' ? sanitizeInput(value) : value;
    }
  }
  return sanitized;
}

function safeLocalStorage(action, key, value = null) {
  try {
    if (action === 'set') {
      localStorage.setItem(key, value);
      return true;
    } else if (action === 'get') {
      return localStorage.getItem(key);
    }
  } catch (e) {
    return null;
  }
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navLinks.classList.toggle('visible');
      navCta.classList.toggle('visible');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('visible');
        navCta.classList.remove('visible');
      });
    });
  }
}

// ============================================
// DEBOUNCE UTILITY
// ============================================
function debounce(func, delay = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

// ============================================
// ACTIVE NAV HIGHLIGHT
// ============================================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateActiveNav = debounce(() => {
    let current = '';
    const scrollY = window.scrollY || window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 100);

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// ============================================
// FORM VALIDATION
// ============================================
function initFormValidation() {
  const forms = document.querySelectorAll('form[name]');

  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      if (submitBtn.dataset.submitted === 'true') {
        e.preventDefault();
        return;
      }

      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (!isValid) {
        e.preventDefault();
      } else {
        submitBtn.dataset.submitted = 'true';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        trackEvent('form', 'submit', form.name);
      }
    });
  });
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;

  input.classList.remove('error');
  const errorMsg = input.nextElementSibling;
  if (errorMsg && errorMsg.classList.contains('error-message')) errorMsg.remove();

  if (input.hasAttribute('required') && !value) {
    isValid = false;
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) isValid = false;
  } else if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) isValid = false;
  }

  if (!isValid) {
    input.classList.add('error');
    const errorMsg = document.createElement('span');
    errorMsg.classList.add('error-message');
    const fieldType = input.getAttribute('type') || input.tagName.toLowerCase();
    errorMsg.textContent = `Please enter a valid ${fieldType}`;
    input.parentElement.appendChild(errorMsg);
  }

  return isValid;
}

// ============================================
// PHONE NUMBER FORMATTING
// ============================================
function initPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      e.target.value = value;
    });

    input.addEventListener('contextmenu', (e) => {
      if (input.value) {
        e.preventDefault();
        copyToClipboard(input.value, 'Phone number copied!');
      }
    });
  });
}

function copyToClipboard(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      copyToClipboardFallback(text, message);
    });
  } else {
    copyToClipboardFallback(text, message);
  }
}

function copyToClipboardFallback(text, message) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (document.execCommand('copy')) showToast(message);
  } catch (err) {}
  document.body.removeChild(textarea);
}

// ============================================
// FAQ ACCORDION
// ============================================
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      item.classList.toggle('active');
      if (isActive) {
        content.style.maxHeight = '0px';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        trackEvent('faq', 'expand', header.textContent.trim());
      }
    });
  });
}

// ============================================
// LEAD MAGNET POPUP
// ============================================
function initLeadMagnetPopup() {
  const popup = document.getElementById('lead-magnet-popup');
  const closeBtn = document.getElementById('popup-close');
  const popupForm = document.getElementById('popup-form');

  if (!popup) return;

  let popupShown = safeLocalStorage('get', 'popupShown');
  let scrollTriggered = false;

  if (!popupShown) {
    setTimeout(() => showPopup(), 10000);

    window.addEventListener('scroll', () => {
      if (!scrollTriggered && window.scrollY > document.documentElement.scrollHeight * 0.5) {
        scrollTriggered = true;
        showPopup();
      }
    });
  }

  function showPopup() {
    popup.classList.add('visible');
    document.body.style.overflow = 'hidden';
    safeLocalStorage('set', 'popupShown', 'true');
    trackEvent('popup', 'show', 'lead_magnet');
  }

  function closePopup() {
    popup.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  if (popupForm) {
    popupForm.addEventListener('submit', () => {
      trackEvent('popup', 'submit', 'lead_magnet');
    });
  }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-lazy]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.lazy;
          img.removeAttribute('data-lazy');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => observer.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.lazy;
      img.removeAttribute('data-lazy');
    });
  }
}

// ============================================
// GOOGLE ANALYTICS EVENTS
// ============================================
function trackEvent(category, action, label) {
  if (typeof gtag === 'undefined') return;

  const sanitizedCategory = sanitizeInput(String(category));
  const sanitizedAction = sanitizeInput(String(action));
  const sanitizedLabel = sanitizeInput(String(label));

  if (sanitizedCategory.length > 40 || sanitizedAction.length > 40 || sanitizedLabel.length > 500) return;

  try {
    gtag('event', sanitizedAction, {
      'event_category': sanitizedCategory,
      'event_label': sanitizedLabel
    });
  } catch (e) {}
}

function initPhoneTracking() {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('engagement', 'phone_click', link.getAttribute('href'));
    });
  });
}

function initSocialTracking() {
  const socialLinks = document.querySelectorAll('a[target="_blank"]');
  socialLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('engagement', 'social_click', link.getAttribute('href'));
    });
  });
}

function initCTATracking() {
  const ctaButtons = document.querySelectorAll('.btn-primary');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();
      trackEvent('engagement', 'cta_click', text);
    });
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// ACCESSIBILITY
// ============================================
function initMotionPreferences() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      * {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

// ============================================
// APPOINTMENT DATE & TIME CONSTRAINTS
// ============================================
function initDateTimeConstraints() {
  const dateInput = document.getElementById('preferred-date');
  const timeInput = document.getElementById('preferred-time');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (timeInput) {
    timeInput.addEventListener('change', (e) => {
      const dateValue = dateInput ? dateInput.value : null;

      if (!dateValue) {
        showToast('Please select a date first');
        e.target.value = '';
        return;
      }

      const [hours] = e.target.value.split(':').map(Number);

      if (hours < 7 || hours >= 21) {
        showToast('Working hours: 7:00 AM - 9:00 PM (Monday–Sunday)');
        e.target.value = '';
      }
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMotionPreferences();
  initMobileMenu();
  initActiveNav();
  initDateTimeConstraints();
  initFormValidation();
  initPhoneFormatting();
  initAccordion();
  initLeadMagnetPopup();
  initLazyLoading();
  initPhoneTracking();
  initSocialTracking();
  initCTATracking();
});

// ============================================
// COOKIE CONSENT + ANALYTICS LOADER
// ============================================
function showCookieBanner() {
  if (localStorage.getItem('cc_consent')) return;
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;background:#0f4c81;color:#fff;padding:14px;border-radius:10px;display:flex;gap:12px;align-items:center;justify-content:space-between;z-index:100000;box-shadow:0 10px 30px rgba(0,0,0,0.15)';
  banner.innerHTML = `<div style="flex:1">We use analytics to improve the site. Accept to enable performance tracking.</div><div style="display:flex;gap:8px"><button id="cc-accept" style="background:#ff9800;border:none;padding:8px 12px;border-radius:6px;color:#fff;font-weight:700">Accept</button><button id="cc-decline" style="background:transparent;border:1px solid #fff;padding:8px 12px;border-radius:6px;color:#fff">Decline</button></div>`;
  document.body.appendChild(banner);

  document.getElementById('cc-accept').addEventListener('click', () => {
    localStorage.setItem('cc_consent', 'yes');
    loadAnalytics();
    banner.remove();
  });
  document.getElementById('cc-decline').addEventListener('click', () => {
    localStorage.setItem('cc_consent', 'no');
    banner.remove();
  });
}

function loadAnalytics() {
  const GA_ID = 'G-XXXXXXXXXX';
  if (!GA_ID || GA_ID.includes('X')) return;

  const s1 = document.createElement('script');
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s1.async = true;
  document.head.appendChild(s1);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);
}
document.addEventListener('DOMContentLoaded', () => {
  const consent = localStorage.getItem('cc_consent');
  if (consent === 'yes') loadAnalytics();
  else if (!consent) showCookieBanner();
});