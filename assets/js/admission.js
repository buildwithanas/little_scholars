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

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // close any other open FAQ item
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Online application form
// NOTE: this is a front-end-only demo. There is no backend yet, so submitting
// does not actually send the application anywhere. Wire this up to a real
// endpoint (or the future admin dashboard) before going live.
const applicationForm = document.getElementById('applicationForm');
const formSuccess = document.getElementById('formSuccess');

if (applicationForm) {
  applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applicationForm.reset();
    if (formSuccess) formSuccess.classList.add('show');
  });
}

/*
 * Admissions status (Important Admission Information section)
 * Currently hardcoded in the HTML as "OPEN" via the .status-badge element.
 * When the admin dashboard is built, this value should be fetched from the
 * backend instead, e.g.:
 *
 *   fetch('/api/admissions-status')
 *     .then(res => res.json())
 *     .then(data => {
 *       const badge = document.getElementById('admissionsStatus');
 *       badge.textContent = data.status; // "OPEN" or "CLOSED"
 *       badge.className = 'status-badge ' + (data.status === 'OPEN' ? 'open' : 'closed');
 *     });
 */