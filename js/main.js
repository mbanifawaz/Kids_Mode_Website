// Kids Mode website: language toggle (English / Arabic), navigation, screenshots and small animations.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  const TITLES = {
    en: 'Kids Mode — Safe phone time for kids',
    ar: 'وضع الأطفال — وقت آمن على الهاتف لطفلك'
  };

  function setLanguage(lang) {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.dataset.lang = lang;
    $$('[data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) el.textContent = text;
    });
    $('#langLabel').textContent = lang === 'ar' ? 'English' : 'العربية';
    document.title = TITLES[lang];
    try { localStorage.setItem('kidsmode-lang', lang); } catch { /* storage blocked */ }
  }

  let saved = null;
  try { saved = localStorage.getItem('kidsmode-lang'); } catch { /* storage blocked */ }
  const initial = saved || ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en');
  if (initial === 'ar') setLanguage('ar');

  $('#langToggle').addEventListener('click', () => {
    setLanguage(document.documentElement.dataset.lang === 'ar' ? 'en' : 'ar');
  });

  /* ---------- Navbar ---------- */
  const navbar = $('#navbar');
  const toTop = $('#toTop');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    toTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const links = $('#navLinks');
  const toggle = $('#navToggle');
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstElementChild.className = open ? 'fas fa-xmark' : 'fas fa-bars';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !e.target.closest('#navLinks, #navToggle')) setMenu(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Screenshots ---------- */
  const track = $('#shotTrack');
  const step = () => (track.querySelector('.shot')?.getBoundingClientRect().width || 240) + 22;
  // In RTL the track scrolls the other way, so flip the direction of the arrows.
  const dir = () => (document.documentElement.dir === 'rtl' ? -1 : 1);
  $('#shotPrev').addEventListener('click', () => track.scrollBy({ left: -step() * dir(), behavior: 'smooth' }));
  $('#shotNext').addEventListener('click', () => track.scrollBy({ left: step() * dir(), behavior: 'smooth' }));

  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  track.addEventListener('click', e => {
    const btn = e.target.closest('button[data-full]');
    if (!btn) return;
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.closest('figure').querySelector('figcaption').textContent;
    lightbox.showModal();
  });
  $('#lbClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
