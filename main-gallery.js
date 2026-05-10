// ===============================
// MAIN PAGE LIGHTBOX (index.html)
// CSP-safe: no inline scripts
// ===============================

const galleryPhotos = [
    { image: 'images/1.webp', caption: 'Commercial drain installation and tie-in.' },
    { image: 'images/2.webp', caption: 'Exterior waterproofing with finished grade.' },
    { image: 'images/3.webp', caption: 'Interior renovation and selective demolition.' },
    { image: 'images/4.webp', caption: 'Sewer camera inspection and diagnostics.' },
    { image: 'images/5.webp', caption: 'Basement waterproofing detail work.' },
    { image: 'images/6.webp', caption: 'Drain line replacement and reinstatement.' },
    { image: 'images/7.webp', caption: 'Foundation waterproofing at footing level.' },
    { image: 'images/8.webp', caption: 'Structural demolition and debris removal.' },
    { image: 'images/9.webp', caption: 'General construction and site finishing.' },
    { image: 'images/10.webp', caption: 'CCTV pipe inspection equipment on site.' }
];

let currentPhotoIndex = 0;
let lightboxPreviousFocus = null;

function openLightbox(photoNumber) {
    currentPhotoIndex = photoNumber - 1;

    const modal = document.getElementById('lightbox');
    const photo = galleryPhotos[currentPhotoIndex];
    if (!modal || !photo) return;

    lightboxPreviousFocus = document.activeElement;

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
        lbImg.alt = photo.caption;
    }

    const captionEl = document.getElementById('lightbox-caption');
    if (captionEl) captionEl.textContent = photo.caption;

    const currentEl = document.getElementById('lightbox-current');
    if (currentEl) currentEl.textContent = photoNumber;

    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleLightboxKeyboard);

    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
}

function closeLightbox() {
    const modal = document.getElementById('lightbox');
    if (!modal) return;

    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleLightboxKeyboard);

    if (
        lightboxPreviousFocus &&
        typeof lightboxPreviousFocus.focus === 'function'
    ) {
        lightboxPreviousFocus.focus();
    }
    lightboxPreviousFocus = null;
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
        lbImg.alt = photo.caption;
    }

    const captionEl = document.getElementById('lightbox-caption');
    if (captionEl) captionEl.textContent = photo.caption;

    const currentEl = document.getElementById('lightbox-current');
    if (currentEl) currentEl.textContent = currentPhotoIndex + 1;
}

function handleLightboxKeyboard(e) {
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
    document.querySelectorAll('.gallery-item[data-id]').forEach(item => {
        const id = parseInt(item.dataset.id, 10);
        if (!isNaN(id)) {
            item.addEventListener('click', () => openLightbox(id));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(id);
                }
            });
        }
    });

    const modal = document.getElementById('lightbox');
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeLightbox();
        });
        initLightboxTouch(modal);
    }

    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    const prevBtn = document.getElementById('lightbox-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });
    }

    const nextBtn = document.getElementById('lightbox-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
    }
});
