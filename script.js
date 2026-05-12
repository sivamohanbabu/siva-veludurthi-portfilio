document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'flex';
  });

  // Close mobile nav on link click
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      nav.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
    }
  }));

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for internal links (respect reduced motion)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (prefersReduced) target.scrollIntoView();
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Stagger nav items entrance
  if (!prefersReduced) {
    nav.querySelectorAll('a').forEach((a, i) => {
      a.classList.add('nav-appear');
      setTimeout(() => a.classList.add('show'), 90 * i);
    });
  } else {
    nav.querySelectorAll('a').forEach(a => a.classList.add('show'));
  }

  // Scroll reveal using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    // If reduced motion or no IO, just show everything
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Simple parallax on hero (subtle)
  const hero = document.querySelector('.hero-content');
  if (!prefersReduced && hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      hero.style.transform = `translateY(${scrolled * 0.03}px)`;
    }, { passive: true });
  }
});
