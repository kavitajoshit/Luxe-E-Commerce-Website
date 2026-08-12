/* =====================================================================
   utils.js — shared helpers (storage, money, toast, dom, image gen)
   Exposed on window.LUXE namespace so every page/module can use them.
   ===================================================================== */
(function () {
  'use strict';

  const LUXE = window.LUXE = window.LUXE || {};

  /* ---- DOM shortcuts ------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  LUXE.$ = $; LUXE.$$ = $$;

  /* ---- Number / money ------------------------------------------ */
  LUXE.money = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  LUXE.clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  /* ---- LocalStorage (safe) ------------------------------------- */
  LUXE.store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },
    remove(key) { try { localStorage.removeItem(key); } catch (e) {} }
  };

  /* ---- Debounce ------------------------------------------------ */
  LUXE.debounce = (fn, wait = 250) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), wait); };
  };

  /* ---- Star rating markup -------------------------------------- */
  LUXE.starsHTML = (rating) => {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) html += '<i class="fa-solid fa-star"></i>';
      else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
      else html += '<i class="fa-regular fa-star"></i>';
    }
    return html;
  };

  /* ---- Offline SVG product image generator --------------------- */
  /* Produces a deterministic gradient card with the product initials,
     so the site is fully self-contained (no external image requests). */
  const PALETTES = [
    ['#5b3df5', '#8b5cf6'], ['#ff5c8a', '#ffb347'], ['#16b364', '#43c6ac'],
    ['#f5a623', '#ff5c8a'], ['#4324d6', '#16b364'], ['#0ea5e9', '#6366f1'],
    ['#ef4444', '#f59e0b'], ['#14b8a6', '#3b82f6']
  ];
  LUXE.productImage = (name, seed = 0, icon = '') => {
    const pal = PALETTES[Math.abs(seed) % PALETTES.length];
    const initials = (name || 'LX').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const label = icon || initials;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/>
        </linearGradient>
        <radialGradient id="s" cx="30%" cy="25%" r="75%">
          <stop offset="0" stop-color="rgba(255,255,255,.45)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <rect width="600" height="600" fill="url(#s)"/>
      <circle cx="480" cy="120" r="90" fill="rgba(255,255,255,.12)"/>
      <circle cx="120" cy="500" r="130" fill="rgba(255,255,255,.08)"/>
      <text x="50%" y="52%" font-family="Poppins,Inter,sans-serif" font-size="180" font-weight="700"
        fill="rgba(255,255,255,.92)" text-anchor="middle" dominant-baseline="middle">${label}</text>
      <text x="50%" y="78%" font-family="Inter,sans-serif" font-size="30" letter-spacing="6"
        fill="rgba(255,255,255,.65)" text-anchor="middle">LUXE</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  };

  /* Avatar generator for testimonials / team */
  LUXE.avatarInitials = (name) => (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  /* ---- Toast notifications ------------------------------------- */
  let toastWrap;
  LUXE.toast = (message, type = 'success', title) => {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'toast-container';
      toastWrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastWrap);
    }
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
    const titles = { success: 'Success', error: 'Oops!', info: 'Heads up' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.setAttribute('role', 'status');
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i>
      <div class="toast-text"><strong>${title || titles[type]}</strong><span>${message}</span></div>`;
    toastWrap.appendChild(el);
    setTimeout(() => {
      el.classList.add('hide');
      el.addEventListener('animationend', () => el.remove());
    }, 3200);
  };

  /* ---- Count-up animation for stats ---------------------------- */
  LUXE.countUp = (el, target, opts = {}) => {
    const dur = opts.duration || 1600;
    const suffix = opts.suffix || '';
    const start = performance.now();
    const step = (now) => {
      const p = LUXE.clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };

  /* ---- Query string helper ------------------------------------- */
  LUXE.param = (key) => new URLSearchParams(location.search).get(key);

})();
