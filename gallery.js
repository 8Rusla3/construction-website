// Gallery data
const allPhotos = [
  { image: 'images/1.webp', caption: 'Commercial drain installation and tie-in.' },
  { image: 'images/2.webp', caption: 'Exterior waterproofing with finished grade.' },
  { image: 'images/3.webp', caption: 'Interior renovation and selective demolition.' },
  { image: 'images/4.webp', caption: 'Sewer camera inspection and diagnostics.' },
  { image: 'images/5.webp', caption: 'Basement waterproofing detail work.' },
  { image: 'images/6.webp', caption: 'Drain line replacement and reinstatement.' },
  { image: 'images/7.webp', caption: 'Foundation waterproofing at footing level.' },
  { image: 'images/8.webp', caption: 'Structural demolition and debris removal.' },
  { image: 'images/9.webp', caption: 'General construction and site finishing.' },
  { image: 'images/10.webp', caption: 'CCTV pipe inspection equipment on site.' },
  { image: 'images/11.webp', caption: 'Completed project—finish and cleanup.' }
];

let currentPhotoIndex = 0;
let lightboxPreviousFocus = null;

function initGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '';

  allPhotos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'Open photo: ' + photo.caption);
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    const base = photo.image.replace('.webp', '');
    const thumb = base.replace('images/', 'images/thumbs/') + '-thumb.jpg';
    const imageName = base.replace('images/', '');
    const baseResponsive = 'images/responsive/' + imageName;
    const srcset = `${baseResponsive}-480.webp 480w, ${baseResponsive}-800.webp 800w, ${baseResponsive}-1200.webp 1200w`;

    item.innerHTML = `
      <picture>
        <source type="image/webp" srcset="${srcset}" sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 220px">
        <img class="gallery-image" src="${thumb}" alt="${photo.caption.replace(/"/g, '&quot;')}" loading="lazy" decoding="async" width="400" height="845">
      </picture>
      <div class="gallery-overlay" aria-hidden="true">+</div>
      <div class="gallery-caption">${photo.caption}</div>
    `;
    grid.appendChild(item);
  });

  const totalPhotosEl = document.getElementById('totalPhotos');
  if (totalPhotosEl) {
    totalPhotosEl.textContent = allPhotos.length;
  }
}

function openLightbox(index) {
  currentPhotoIndex = index;
  updateLightbox();

  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  lightboxPreviousFocus = document.activeElement;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  document.addEventListener('keydown', handleKeyboard);

  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeyboard);

  if (
    lightboxPreviousFocus &&
    typeof lightboxPreviousFocus.focus === 'function'
  ) {
    lightboxPreviousFocus.focus();
  }
  lightboxPreviousFocus = null;
}

function nextImage() {
  currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
  updateLightbox();
}

function prevImage() {
  currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
  updateLightbox();
}

function updateLightbox() {
  const photo = allPhotos[currentPhotoIndex];
  const lbImg = document.getElementById('lightboxImage');
  if (!lbImg) return;

  lbImg.src = photo.image;

  const imageName = photo.image.replace('images/', '').replace('.webp', '');
  const base = 'images/responsive/' + imageName;
  lbImg.srcset = `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w`;
  lbImg.sizes = '100vw';
  lbImg.alt = photo.caption;

  const captionEl = document.getElementById('lightboxCaption');
  if (captionEl) captionEl.textContent = photo.caption;

  const currentEl = document.getElementById('currentPhoto');
  if (currentEl) currentEl.textContent = currentPhotoIndex + 1;
}

function handleKeyboard(e) {
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'Escape') closeLightbox();
}

function initLightboxTouch(modal) {
  if (!modal) return;
  let touchStartX = 0;
  let touchStartY = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) >= minSwipe) {
      if (diffX > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initGalleryGrid();

  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    initLightboxTouch(modal);
  }

  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  const prevBtn = document.querySelector('.lightbox-nav.prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  const nextBtn = document.querySelector('.lightbox-nav.next');
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }
});
