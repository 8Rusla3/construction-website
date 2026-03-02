// Gallery data - Add more photos here as needed!
const allPhotos = [
  { image: 'images/1.webp', caption: 'Professional drain works installation.' },
  { image: 'images/2.webp', caption: 'Waterproofing project with quality finish.' },
  { image: 'images/3.webp', caption: 'Interior renovation and demolition work.' },
  { image: 'images/4.webp', caption: 'Camera inspection and diagnostic service.' },
  { image: 'images/5.webp', caption: 'Basement waterproofing solutions.' },
  { image: 'images/6.webp', caption: 'Drain system replacement and repair.' },
  { image: 'images/7.webp', caption: 'Foundation waterproofing expertise.' },
  { image: 'images/8.webp', caption: 'Professional demolition and cleanout.' },
  { image: 'images/9.webp', caption: 'Comprehensive construction services.' },
  { image: 'images/10.webp', caption: 'Advanced pipe inspection technology.' },
  { image: 'images/11.webp', caption: 'Quality workmanship on every project.' }
  // Add more photos here: { image: 'images/12.webp', caption: 'Your caption here.' }
];

let currentPhotoIndex = 0;

// Generate gallery grid
function initGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '';

  allPhotos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.addEventListener('click', () => openLightbox(index));

    const base = photo.image.replace('.webp', '');
    const thumb = base.replace('images/', 'images/thumbs/') + '-thumb.jpg';
    const imageName = base.replace('images/', '');
    const baseResponsive = `images/responsive/${imageName}`; // images/responsive/1
    const srcset = `${baseResponsive}-480.webp 480w, ${baseResponsive}-800.webp 800w, ${baseResponsive}-1200.webp 1200w`;

    item.innerHTML = `
      <picture>
        <source type="image/webp" srcset="${srcset}" sizes="(max-width:600px) 100vw, 25vw">
        <img class="gallery-image" src="${thumb}" alt="${photo.caption}" loading="lazy" decoding="async">
      </picture>
      <div class="gallery-overlay">🔍</div>
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
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  document.addEventListener('keydown', handleKeyboard);
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeyboard);
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
  // set responsive srcset - point to images/responsive/
  const imageName = photo.image.replace('images/', '').replace('.webp', '');
  const base = `images/responsive/${imageName}`;
  lbImg.srcset = `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w`;
  lbImg.sizes = '100vw';

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

document.addEventListener('DOMContentLoaded', () => {
  initGalleryGrid();

  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  const prevBtn = document.querySelector('.lightbox-nav.prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', prevImage);
  }

  const nextBtn = document.querySelector('.lightbox-nav.next');
  if (nextBtn) {
    nextBtn.addEventListener('click', nextImage);
  }
});

