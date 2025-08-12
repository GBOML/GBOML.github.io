// script.js
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- HERO (main image) intro ---------- */
  const prefersReduced = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------- HERO (main image) intro ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const HERO_DELAY = prefersReduced ? 100 : 800; // was ~320ms; now 800ms
    setTimeout(() => {
      requestAnimationFrame(() => hero.classList.add('is-visible'));
    }, HERO_DELAY);
  }

  /* ---------- SCROLL REVEALS ---------- */
  const reveals = document.querySelectorAll('.reveal');

  // Fallback for older browsers
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Group by nearest <section> so each section restarts the stagger
  const groups = new Map();
  reveals.forEach((el) => {
    const key = el.closest('section') || document.body;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });

  // Assign staggered transition delays (skip if element already has data-delay)
  const STEP = prefersReduced ? 0 : 60; // ms between items
  const MAX = 420; // cap total delay
  groups.forEach((list) => {
    list.forEach((el, i) => {
      if (!el.hasAttribute('data-delay')) {
        const d = Math.min(i * STEP, MAX);
        el.style.transitionDelay = `${d}ms`;
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // remove to re-animate on scroll-out/in
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
});
