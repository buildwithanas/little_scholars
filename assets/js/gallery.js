// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer copyright year
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// Gentle fade-in-on-scroll
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

/* ============================================
   GALLERY FILTERING
   ============================================ */
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryEmpty = document.getElementById('galleryEmpty');
const galleryGrid = document.getElementById('galleryGrid');

function applyFilter(category) {
  let visibleCount = 0;

  galleryItems.forEach(item => {
    const matches = category === 'all' || item.dataset.category === category;
    item.classList.toggle('is-hidden', !matches);
    if (matches) visibleCount++;
  });

  if (galleryEmpty) {
    galleryEmpty.classList.toggle('show', visibleCount === 0);
  }

  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.category));
});

// Buttons elsewhere on the page (e.g. "View All Photos") that should jump to
// the gallery grid and pre-select a filter.
document.querySelectorAll('[data-filter-jump]').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.filterJump;
    applyFilter(category);
    if (galleryGrid) galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================
   LIGHTBOX
   ============================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

// Only ever navigate among the images currently visible under the active filter.
function getVisibleItems() {
  return Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));
}

function openLightbox(item) {
  const visible = getVisibleItems();
  currentIndex = visible.indexOf(item);
  showLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxImage() {
  const visible = getVisibleItems();
  if (visible.length === 0) return;

  if (currentIndex < 0) currentIndex = visible.length - 1;
  if (currentIndex >= visible.length) currentIndex = 0;

  const item = visible[currentIndex];
  const img = item.querySelector('img');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = item.dataset.caption || '';
  lightboxCategory.textContent = item.dataset.category || '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => { currentIndex--; showLightboxImage(); });
if (lightboxNext) lightboxNext.addEventListener('click', () => { currentIndex++; showLightboxImage(); });

// Click on the dark backdrop (outside the image) also closes it
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Keyboard controls: Left = previous, Right = next, Escape = close
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { currentIndex--; showLightboxImage(); }
  if (e.key === 'ArrowRight') { currentIndex++; showLightboxImage(); }
});