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

// Gentle fade-in-on-scroll for cards and sections
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

/*
 * News category filter
 * Reads every .news-card's data-category attribute and shows/hides
 * cards based on which .category-btn is active. "all" always shows
 * every card. When a category has no matching cards, the empty-state
 * message is revealed instead of an empty grid.
 */
const categoryFilter = document.getElementById('categoryFilter');
const newsCards = Array.from(document.querySelectorAll('.news-card'));
const newsEmptyState = document.getElementById('newsEmptyState');

if (categoryFilter && newsCards.length) {
  const categoryButtons = Array.from(categoryFilter.querySelectorAll('.category-btn'));

  const applyFilter = (category) => {
    let visibleCount = 0;

    newsCards.forEach(card => {
      const matches = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount++;
    });

    if (newsEmptyState) {
      newsEmptyState.classList.toggle('show', visibleCount === 0);
    }
  };

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      applyFilter(button.dataset.category);
    });
  });
}

/*
 * Newsletter signup
 * NOTE: this is a front-end-only demo. There is no backend yet, so
 * subscribing does not actually save the email anywhere. Wire this up
 * to a real mailing-list endpoint (Mailchimp, the future admin
 * dashboard, etc.) before going live.
 */
const newsletterForm = document.getElementById('newsletterForm');
const newsletterNote = document.getElementById('newsletterNote');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterForm.reset();
    if (newsletterNote) newsletterNote.classList.add('show');
  });
}

/*
 * School Announcements / Upcoming Events / Achievements
 * These sections are currently static placeholder content in the HTML.
 * Once the admin dashboard exists, they should be fetched dynamically,
 * similar to the admissions status pattern used on admission.html, e.g.:
 *
 *   fetch('/api/news?category=announcements')
 *     .then(res => res.json())
 *     .then(data => { renderAnnouncementItems(data); });
 */