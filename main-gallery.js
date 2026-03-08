// ===============================
// MAIN PAGE LIGHTBOX (index.html)
// CSP-safe: no inline scripts
// ===============================

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

// Відкрити лайтбокс
function openLightbox(photoNumber) {
    currentPhotoIndex = photoNumber - 1;

    const modal = document.getElementById('lightbox');
    const photo = galleryPhotos[currentPhotoIndex];
    if (!modal || !photo) return;

    const lbImg = document.getElementById('lightbox-image');
    if (lbImg) {
        lbImg.src = photo.image;

        const imageName = photo.image.replace('images/', '').replace('.webp', '');
        const base = 'images/responsive/' + imageName;

        lbImg.srcset =
            `${base}-480.webp 480w, ` +
            `${base}-800.webp 800w, ` +
            `${base}-1200.webp 1200w`;

        lbImg.sizes = '100vw';
    }

    const captionEl = document.getElementById('lightbox-caption');
    if (captionEl) captionEl.textContent = photo.caption;

    const currentEl = document.getElementById('lightbox-current');
    if (currentEl) currentEl.textContent = photoNumber;

    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleLightboxKeyboard);
}

// Закрити лайтбокс
function closeLightbox() {
    const modal = document.getElementById('lightbox');
    if (!modal) return;

    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleLightboxKeyboard);
}

// Наступне фото
function nextImage() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
    updateLightbox();
}

// Попереднє фото
function prevImage() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    updateLightbox();
}

// Оновити фото
function updateLightbox() {
    const photo = galleryPhotos[currentPhotoIndex];
    if (!photo) return;

    const lbImg = document.getElementById('lightbox-image');
    if (lbImg) {
        lbImg.src = photo.image;

        const imageName = photo.image.replace('images/', '').replace('.webp', '');
        const base = 'images/responsive/' + imageName;

        lbImg.srcset =
            `${base}-480.webp 480w, ` +
            `${base}-800.webp 800w, ` +
            `${base}-1200.webp 1200w`;

        lbImg.sizes = '100vw';
    }

    const captionEl = document.getElementById('lightbox-caption');
    if (captionEl) captionEl.textContent = photo.caption;

    const currentEl = document.getElementById('lightbox-current');
    if (currentEl) currentEl.textContent = currentPhotoIndex + 1;
}

// Клавіатура
function handleLightboxKeyboard(e) {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-item[data-id]').forEach(item => {
        const id = parseInt(item.dataset.id, 10);
        if (!isNaN(id)) {
            item.addEventListener('click', () => openLightbox(id));
        }
    });

    const modal = document.getElementById('lightbox');
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeLightbox();
        });
    }

    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    const prevBtn = document.getElementById('lightbox-prev');
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    const nextBtn = document.getElementById('lightbox-next');
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
});
