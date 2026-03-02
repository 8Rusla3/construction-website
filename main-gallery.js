// ============================================
// MAIN PAGE GALLERY LIGHTBOX (index.html)
// CSP-safe: no inline scripts, event listeners only
// ============================================

const galleryPhotos = [
  { image: 'images/1.webp', caption: 'Professional drain works installation.' },
  { image: 'images/2.webp', caption: 'Waterproofing project with quality finish.' },
  { image: 'images/3.webp', caption: 'Interior renovation and demolition work.' },
  { image: 'images/4.webp', caption: 'Camera inspection and diagnostic service.' },
  { image: 'images/5.webp', caption: 'Basement waterproofing solutions.' },
  { image: 'images/6.webp', caption: 'Drain system replacement and repair.' },
  { image: 'images/7.webp', caption: 'Foundation waterproofing expertise.' },
  { image: 'images/8.webp', caption: 'Professional demolition and cleanout.' },
  { image: 'images/9.webp', caption: 'Comprehensive construction services.' },
  { image: 'images/10.webp', caption: 'Advanced pipe inspection technology.' }
];

let currentPhotoIndex = 0;

function openLightbox(photoNumber) {
  currentPhotoIndex = photoNumber - 1;
  const modal = document.getElementById('lightboxModal');
  const photo = galleryPhotos[currentPhotoIndex];

  if (!modal || !photo) return;

  const lbImg = document.getElementById('lightboxImage');
  if (lbImg) {
    lbImg.src = photo.image;
    const imageName = photo.image.replace('images/', '').replace('.webp', '');
    const base = 'images/responsive/' + imageName;
    lbImg.srcset = base + '-480.webp 480w, ' + base + '-800.webp 800w, ' + base + '-1200.webp 1200w';
    lbImg.sizes = '100vw';
  }

  const captionEl = document.getElementById('lightboxCaption');
  if (captionEl) captionEl.textContent = photo.caption;

  const currentEl = document.getElementById('currentPhoto');
  if (currentEl) currentEl.textContent = photoNumber;

  try {
    window._lastFocusedElement = document.activeElement;
  } catch (e) {
    window._lastFocusedElement = null;
  }

  const mainEl = document.querySelector('main');
  if (mainEl) mainEl.setAttribute('aria-hidden', 'true');

  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn && typeof closeBtn.focus === 'function') {
    closeBtn.focus();
  } else if (modal && typeof modal.focus === 'function') {
    modal.focus();
  }

  document.addEventListener('keydown', handleLightboxKeyboard);
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';

  const mainEl = document.querySelector('main');
  if (mainEl) mainEl.removeAttribute('aria-hidden');

  modal.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', handleLightboxKeyboard);

  try {
    if (window._lastFocusedElement && typeof window._lastFocusedElement.focus === 'function') {
      window._lastFocusedElement.focus();
    }
  } catch (e) {
    // ignore
  }
}

function nextImage() {
  currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
  updateLightbox();
}

function prevImage() {
  currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  updateLightbox();
}

function updateLightbox() {
  const photo = galleryPhotos[currentPhotoIndex];
  if (!photo) return;

  const lbImg = document.getElementById('lightboxImage');
  if (lbImg) {
    lbImg.src = photo.image;
    const imageName = photo.image.replace('images/', '').replace('.webp', '');
    const base = 'images/responsive/' + imageName;
    lbImg.srcset = base + '-480.webp 480w, ' + base + '-800.webp 800w, ' + base + '-1200.webp 1200w';
    lbImg.sizes = '100vw';
  }

  const captionEl = document.getElementById('lightboxCaption');
  if (captionEl) captionEl.textContent = photo.caption;

  const currentEl = document.getElementById('currentPhoto');
  if (currentEl) currentEl.textContent = currentPhotoIndex + 1;
}

function handleLightboxKeyboard(e) {
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'Escape') closeLightbox();
}

document.addEventListener('DOMContentLoaded', function () {
  // Gallery items: use data-id to open lightbox (1-based)
  const galleryItems = document.querySelectorAll('.gallery-item[data-id]');
  galleryItems.forEach(function (item) {
    const id = item.getAttribute('data-id');
    if (!id) return;
    const num = parseInt(id, 10);
    if (isNaN(num) || num < 1 || num > galleryPhotos.length) return;
    item.addEventListener('click', function () {
      openLightbox(num);
    });
  });

  // Lightbox modal: close when clicking overlay
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeLightbox();
    });
  }

  // Lightbox close button
  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Lightbox prev/next
  const prevBtn = document.querySelector('.lightbox-nav.prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', prevImage);
  }

  const nextBtn = document.querySelector('.lightbox-nav.next');
  if (nextBtn) {
    nextBtn.addEventListener('click', nextImage);
  }
});
