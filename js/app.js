/* =====================================================================
   app.js — shared shell (navbar, footer, theme, reveal, loader) +
            per-page routing (home, shop, product, about, contact, faq)
   ===================================================================== */
(function () {
  'use strict';
  const LUXE = window.LUXE;
  const { $, $$ } = LUXE;

  /* ================================================================
     1. Shared navbar + footer injection (keeps every page DRY)
     ================================================================ */
  const NAV_ITEMS = [
    ['index.html', 'Home'], ['shop.html', 'Shop'], ['about.html', 'About'],
    ['contact.html', 'Contact'], ['faq.html', 'FAQ']
  ];
  const page = document.body.dataset.page || '';
  const current = location.pathname.split('/').pop() || 'index.html';

  function buildNavbar() {
    const host = $('#navbar-root'); if (!host) return;
    const links = NAV_ITEMS.map(([href, label]) =>
      `<a href="${href}" class="${href === current ? 'active' : ''}">${label}</a>`).join('');
    host.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="container nav-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark"><i class="fa-solid fa-gem"></i></span>
          <span class="brand-text">LUXE</span>
        </a>
        <div class="nav-links">${links}</div>
        <div class="nav-actions">
          <button class="icon-btn theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
            <i class="fa-solid fa-moon"></i><i class="fa-solid fa-sun"></i>
          </button>
          <a class="icon-btn nav-desktop-only" href="login.html" aria-label="Account" title="Account"><i class="fa-regular fa-user"></i></a>
          <a class="icon-btn" href="wishlist.html" aria-label="Wishlist" title="Wishlist">
            <i class="fa-regular fa-heart"></i><span class="badge wish-count hidden">0</span>
          </a>
          <a class="icon-btn" href="cart.html" aria-label="Cart" title="Cart">
            <i class="fa-solid fa-bag-shopping"></i><span class="badge cart-count hidden">0</span>
          </a>
          <button class="icon-btn hamburger" id="hamburger" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </nav>
    <div class="nav-backdrop" id="nav-backdrop"></div>
    <aside class="mobile-drawer" id="mobile-drawer">
      <div class="drawer-head">
        <a class="brand" href="index.html"><span class="brand-mark"><i class="fa-solid fa-gem"></i></span> LUXE</a>
        <button class="icon-btn" id="drawer-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      ${NAV_ITEMS.map(([h, l]) => `<a href="${h}" class="${h === current ? 'active' : ''}">${l}</a>`).join('')}
      <a href="wishlist.html">Wishlist</a>
      <a href="cart.html">Cart</a>
      <a href="login.html">Sign In</a>
    </aside>`;
  }

  function buildFooter() {
    const host = $('#footer-root'); if (!host) return;
    const cols = [
      ['Shop', [['shop.html', 'All Products'], ['shop.html?cat=audio', 'Audio'], ['shop.html?cat=wearables', 'Wearables'], ['shop.html?cat=computing', 'Computing']]],
      ['Company', [['about.html', 'About Us'], ['contact.html', 'Contact'], ['faq.html', 'FAQ'], ['#', 'Careers']]],
      ['Support', [['contact.html', 'Help Center'], ['#', 'Shipping'], ['#', 'Returns'], ['#', 'Warranty']]]
    ];
    host.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col footer-brand">
            <a class="brand" href="index.html"><span class="brand-mark"><i class="fa-solid fa-gem"></i></span> LUXE</a>
            <p>Premium tech & lifestyle products, designed to elevate the everyday. Free shipping over $150, 1-year warranty on everything.</p>
            <div class="footer-social">
              <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            </div>
          </div>
          ${cols.map(([title, links]) => `<div class="footer-col"><h4>${title}</h4><ul>${links.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>`).join('')}
        </div>
        <div class="footer-bottom">
          <span>© ${2026} LUXE Store. Crafted with care. All rights reserved.</span>
          <div class="footer-pay">
            <i class="fa-brands fa-cc-visa"></i><i class="fa-brands fa-cc-mastercard"></i>
            <i class="fa-brands fa-cc-paypal"></i><i class="fa-brands fa-cc-apple-pay"></i><i class="fa-brands fa-cc-amex"></i>
          </div>
        </div>
      </div>
    </footer>`;
  }

  /* ================================================================
     2. Theme (dark / light) with persistence
     ================================================================ */
  function initTheme() {
    const saved = LUXE.store.get('luxe_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('#theme-toggle');
    if (btn) btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      LUXE.store.set('luxe_theme', next);
    });
  }

  /* ================================================================
     3. Mobile drawer + sticky navbar
     ================================================================ */
  function initNav() {
    const drawer = $('#mobile-drawer'), backdrop = $('#nav-backdrop');
    const open = () => { drawer.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { drawer.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; };
    $('#hamburger') && $('#hamburger').addEventListener('click', open);
    $('#drawer-close') && $('#drawer-close').addEventListener('click', close);
    backdrop && backdrop.addEventListener('click', close);
    $$('#mobile-drawer a').forEach(a => a.addEventListener('click', close));

    const nav = $('#navbar');
    const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ================================================================
     4. Back-to-top + page loader
     ================================================================ */
  function initChrome() {
    const btt = document.createElement('button');
    btt.className = 'back-to-top'; btt.setAttribute('aria-label', 'Back to top');
    btt.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btt);
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400), { passive: true });

    window.addEventListener('load', () => {
      const loader = $('#page-loader');
      if (loader) setTimeout(() => loader.classList.add('done'), 350);
    });
  }

  /* ================================================================
     5. Scroll reveal (IntersectionObserver)
     ================================================================ */
  let revealObserver;
  LUXE.observeReveal = (ctx = document) => {
    if (!('IntersectionObserver' in window)) { $$('[data-reveal]', ctx).forEach(el => el.classList.add('revealed')); return; }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('revealed'); revealObserver.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('[data-reveal]', ctx).forEach((el, i) => {
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', (i % 6));
      revealObserver.observe(el);
    });
  };

  /* ================================================================
     6. Button ripple micro-interaction
     ================================================================ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const r = document.createElement('span'); r.className = 'ripple';
    const rect = btn.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(r); setTimeout(() => r.remove(), 600);
  });

  /* ================================================================
     7. Countdown timer (flash sale) — persists an end time
     ================================================================ */
  LUXE.initCountdown = (el) => {
    if (!el) return;
    let end = LUXE.store.get('luxe_flash_end');
    const now = Date.now();
    if (!end || end < now) { end = now + 12 * 3600 * 1000; LUXE.store.set('luxe_flash_end', end); }
    const units = el.querySelectorAll('.unit strong');
    const tick = () => {
      let diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3.6e6); diff -= h * 3.6e6;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1000);
      const pad = (n) => String(n).padStart(2, '0');
      if (units[0]) units[0].textContent = pad(Math.floor(h / 24));
      if (units[1]) units[1].textContent = pad(h % 24);
      if (units[2]) units[2].textContent = pad(m);
      if (units[3]) units[3].textContent = pad(s);
    };
    tick(); setInterval(tick, 1000);
  };

  /* ================================================================
     8. Accordion + Tabs (generic)
     ================================================================ */
  function initAccordions() {
    $$('.acc-head').forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.acc-item');
        const content = item.querySelector('.acc-content');
        const isOpen = item.classList.contains('open');
        // close siblings in same accordion
        const acc = item.closest('.accordion');
        if (acc) $$('.acc-item', acc).forEach(i => { i.classList.remove('open'); i.querySelector('.acc-content').style.maxHeight = null; });
        if (!isOpen) { item.classList.add('open'); content.style.maxHeight = content.scrollHeight + 'px'; }
      });
    });
  }
  LUXE.initTabs = (root = document) => {
    $$('.tab-nav', root).forEach(nav => {
      nav.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-tab]'); if (!btn) return;
        const panelId = btn.dataset.tab;
        $$('button[data-tab]', nav).forEach(b => b.classList.toggle('active', b === btn));
        const container = nav.closest('.tabs');
        $$('.tab-panel', container).forEach(p => p.classList.toggle('active', p.id === panelId));
      });
    });
  };

  /* ================================================================
     9. HOME PAGE
     ================================================================ */
  function initHome() {
    const P = LUXE.data.PRODUCTS;
    const categoryImages = {
      audio: 'images/JBL-Charge-6.jpg',
      wearables: 'images/OURA-Ring-4.jpg',
      computing: 'images/ASUS-ROG-Zephyrus-G14.jpg'
    };
    const homeProducts = P.filter(p => p.name !== 'AULA F75 75% Wireless Mechanical Keyboard');
    const keyboard = P.find(p => p.name === 'AULA F75 75% Wireless Mechanical Keyboard');
    const newArrivals = [keyboard, ...homeProducts.filter(p => p.badges.includes('new'))].filter(Boolean).slice(0, 4);
    LUXE.renderProducts($('#featured-grid'), homeProducts.filter(p => p.badges.includes('best')).slice(0, 8));
    LUXE.renderProducts($('#new-grid'), newArrivals);
    LUXE.renderProducts($('#best-grid'), [...homeProducts].sort((a, b) => b.popularity - a.popularity).slice(0, 4));
    LUXE.renderProducts($('#flash-grid'), homeProducts.filter(p => p.discount >= 15).slice(0, 4));

    // Categories
    const catWrap = $('#category-grid');
    if (catWrap) {
      catWrap.innerHTML = LUXE.data.CATEGORIES.slice(0, 5).map(c => `
        <a class="category-card" href="shop.html?cat=${c.id}" data-reveal="scale">
          <img class="category-image" src="${categoryImages[c.id] || ''}" alt="${c.name} products">
          <div><h3><i class="fa-solid ${c.icon}"></i> ${c.name}</h3><span>${c.desc}</span></div>
        </a>`).join('');
      LUXE.observeReveal(catWrap);
    }
    LUXE.initCountdown($('#countdown'));
  }

  /* ================================================================
     10. SHOP PAGE — filter / sort / search / paginate
     ================================================================ */
  function initShop() {
    const grid = $('#shop-grid'); if (!grid) return;
    const P = LUXE.data.PRODUCTS;
    const state = { search: '', cats: new Set(), maxPrice: 1500, minRating: 0, sort: 'popular', page: 1, perPage: 9 };

    const preCat = LUXE.param('cat');
    if (preCat) state.cats.add(preCat);

    // Build category filter options
    const catBox = $('#filter-cats');
    if (catBox) catBox.innerHTML = LUXE.data.CATEGORIES.map(c => {
      const n = P.filter(p => p.category === c.id).length;
      return `<label class="filter-option"><input type="checkbox" value="${c.id}" ${state.cats.has(c.id) ? 'checked' : ''}> ${c.name} <span class="count">${n}</span></label>`;
    }).join('');

    function apply() {
      let list = P.filter(p => {
        if (state.search && !(`${p.name} ${LUXE.data.catName(p.category)}`.toLowerCase().includes(state.search))) return false;
        if (state.cats.size && !state.cats.has(p.category)) return false;
        if (p.price > state.maxPrice) return false;
        if (p.rating < state.minRating) return false;
        return true;
      });
      const sorters = {
        popular: (a, b) => b.popularity - a.popularity,
        newest: (a, b) => b.createdAt - a.createdAt,
        'price-low': (a, b) => a.price - b.price,
        'price-high': (a, b) => b.price - a.price,
        rating: (a, b) => b.rating - a.rating
      };
      list.sort(sorters[state.sort] || sorters.popular);

      const total = list.length;
      const pages = Math.max(1, Math.ceil(total / state.perPage));
      state.page = LUXE.clamp(state.page, 1, pages);
      const start = (state.page - 1) * state.perPage;
      const pageItems = list.slice(start, start + state.perPage);

      // skeleton flash for perceived performance
      grid.innerHTML = LUXE.skeletonCards(6);
      setTimeout(() => LUXE.renderProducts(grid, pageItems), 180);

      const rc = $('#result-count'); if (rc) rc.textContent = `${total} product${total !== 1 ? 's' : ''}`;
      renderPagination(pages);
    }

    function renderPagination(pages) {
      const pag = $('#pagination'); if (!pag) return;
      if (pages <= 1) { pag.innerHTML = ''; return; }
      let html = `<button data-pg="prev" ${state.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
      for (let i = 1; i <= pages; i++) html += `<button data-pg="${i}" class="${i === state.page ? 'active' : ''}">${i}</button>`;
      html += `<button data-pg="next" ${state.page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
      pag.innerHTML = html;
      $$('button', pag).forEach(b => b.onclick = () => {
        if (b.dataset.pg === 'prev') state.page--;
        else if (b.dataset.pg === 'next') state.page++;
        else state.page = +b.dataset.pg;
        apply(); window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
      });
    }

    // Events
    const search = $('#shop-search-input');
    if (search) { if (state.search) search.value = state.search; search.addEventListener('input', LUXE.debounce(() => { state.search = search.value.toLowerCase().trim(); state.page = 1; apply(); }, 250)); }
    if (catBox) catBox.addEventListener('change', (e) => { const v = e.target.value; if (e.target.checked) state.cats.add(v); else state.cats.delete(v); state.page = 1; apply(); });

    const priceRange = $('#price-range'), priceLabel = $('#price-label');
    if (priceRange) priceRange.addEventListener('input', () => { state.maxPrice = +priceRange.value; if (priceLabel) priceLabel.textContent = LUXE.money(state.maxPrice); state.page = 1; apply(); });

    $$('input[name="rating-filter"]').forEach(r => r.addEventListener('change', () => { state.minRating = +r.value; state.page = 1; apply(); }));
    const sortSel = $('#sort-select'); if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(); });

    // Mobile filter slide-over
    const sidebar = $('#filter-sidebar'), fBackdrop = $('#filter-backdrop'), fToggle = $('#filter-toggle');
    if (fToggle) fToggle.addEventListener('click', () => { sidebar.classList.add('open'); fBackdrop.classList.add('open'); });
    if (fBackdrop) fBackdrop.addEventListener('click', () => { sidebar.classList.remove('open'); fBackdrop.classList.remove('open'); });
    const fClose = $('#filter-close'); if (fClose) fClose.addEventListener('click', () => { sidebar.classList.remove('open'); fBackdrop.classList.remove('open'); });

    apply();
  }

  /* ================================================================
     11. PRODUCT DETAIL PAGE
     ================================================================ */
  function initProduct() {
    const root = $('#product-root'); if (!root) return;
    const id = LUXE.param('id') || 'p1';
    const p = LUXE.data.find(id);
    if (!p) { root.innerHTML = '<div class="empty-state"><h3>Product not found</h3><a class="btn btn-primary" href="shop.html">Back to Shop</a></div>'; return; }

    LUXE.addRecentlyViewed(id);
    document.title = `${p.name} — LUXE`;
    const bc = $('#product-breadcrumb'); if (bc) bc.innerHTML =
      `<a href="index.html">Home</a><span class="sep">/</span><a href="shop.html?cat=${p.category}">${LUXE.data.catName(p.category)}</a><span class="sep">/</span><span>${p.name}</span>`;

    const priceOld = p.oldPrice ? `<span class="price-old">${LUXE.money(p.oldPrice)}</span>` : '';
    const disc = p.discount ? `<span class="discount-tag">Save ${p.discount}%</span>` : '';
    const inWish = LUXE.wishlist.has(p.id);

    root.innerHTML = `
      <div class="product-detail">
        <div class="gallery">
          <div class="gallery-main"><img id="gallery-main-img" src="${p.gallery[0]}" alt="${p.name}"></div>
          <div class="gallery-thumbs">${p.gallery.map((g, i) => `<button class="${i === 0 ? 'active' : ''}" data-src="${g}"><img src="${g}" alt="View ${i + 1}"></button>`).join('')}</div>
        </div>
        <div class="detail-info">
          <span class="product-cat">${LUXE.data.catName(p.category)}</span>
          <h1>${p.name}</h1>
          <div class="rating"><span class="stars">${LUXE.starsHTML(p.rating)}</span> <span>${p.rating} · ${p.reviews} reviews</span></div>
          <div class="detail-price"><span class="price">${LUXE.money(p.price)}</span>${priceOld}${disc}</div>
          <p class="detail-desc">${p.desc}</p>
          <div class="stock-line ${p.stock <= 10 ? 'low' : ''}"><span class="dot"></span> ${p.stock <= 10 ? 'Hurry — only ' + p.stock + ' left in stock' : 'In stock & ready to ship'}</div>
          <div class="detail-actions">
            <div class="qty-selector">
              <button id="qty-dec" aria-label="Decrease">−</button>
              <input id="qty-input" type="text" value="1" readonly>
              <button id="qty-inc" aria-label="Increase">+</button>
            </div>
            <button class="btn btn-primary btn-lg" id="detail-add"><i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>
            <button class="btn btn-dark btn-lg" id="detail-buy"><i class="fa-solid fa-bolt"></i> Buy Now</button>
            <button class="icon-btn wish-btn ${inWish ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist"><i class="fa-${inWish ? 'solid' : 'regular'} fa-heart"></i></button>
          </div>
          <div class="detail-meta">
            <span><i class="fa-solid fa-truck-fast"></i> <strong>Free shipping</strong> on orders over $150</span>
            <span><i class="fa-solid fa-rotate-left"></i> <strong>30-day</strong> free returns</span>
            <span><i class="fa-solid fa-shield-halved"></i> <strong>1-year</strong> warranty included</span>
          </div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-nav">
          <button data-tab="tab-desc" class="active">Description</button>
          <button data-tab="tab-specs">Specifications</button>
          <button data-tab="tab-reviews">Reviews (${p.reviews})</button>
        </div>
        <div id="tab-desc" class="tab-panel active">
          <p style="max-width:760px">${p.desc}</p>
          <p style="max-width:760px;margin-top:14px">Engineered in-house and tested against the toughest standards, the ${p.name} is built to last. Whether you're at home, at work, or on the move, it delivers consistent, premium performance you can rely on every day.</p>
        </div>
        <div id="tab-specs" class="tab-panel">
          <table class="spec-table">${Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
        </div>
        <div id="tab-reviews" class="tab-panel">${reviewsHTML(p)}</div>
      </div>

      <section class="section-sm">
        <div class="section-head" style="text-align:left;margin-left:0"><h2>Related Products</h2></div>
        <div class="products-grid" id="related-grid"></div>
      </section>`;

    // Gallery thumbs
    root.querySelectorAll('.gallery-thumbs button').forEach(b => b.addEventListener('click', () => {
      root.querySelectorAll('.gallery-thumbs button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      $('#gallery-main-img').src = b.dataset.src;
    }));

    // Qty
    const qtyInput = $('#qty-input');
    $('#qty-inc').onclick = () => qtyInput.value = LUXE.clamp(+qtyInput.value + 1, 1, 99);
    $('#qty-dec').onclick = () => qtyInput.value = LUXE.clamp(+qtyInput.value - 1, 1, 99);
    $('#detail-add').onclick = () => LUXE.cart.add(p.id, +qtyInput.value);
    $('#detail-buy').onclick = () => { LUXE.cart.add(p.id, +qtyInput.value); setTimeout(() => location.href = 'checkout.html', 500); };

    LUXE.initTabs(root);
    LUXE.renderProducts($('#related-grid'), LUXE.data.PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4));
    LUXE.observeReveal(root);
  }

  function reviewsHTML(p) {
    const names = ['Sarah M.', 'James T.', 'Priya K.', 'Diego R.', 'Emma L.'];
    const bodies = [
      'Absolutely love it. Exceeded my expectations and the build quality is superb.',
      'Great value for the price. Shipping was fast and packaging felt premium.',
      'Been using it daily for a month — flawless. Would buy again in a heartbeat.',
      'Solid product. Does exactly what it promises. Highly recommend.',
      'The design is gorgeous and it works beautifully. Five stars from me.'
    ];
    let html = `<div style="display:flex;gap:24px;align-items:center;margin-bottom:24px;flex-wrap:wrap">
      <div style="text-align:center"><div style="font-size:3rem;font-weight:800;font-family:var(--font-display)">${p.rating}</div>
      <div class="stars" style="font-size:1.1rem">${LUXE.starsHTML(p.rating)}</div>
      <div style="font-size:.85rem;color:var(--color-text-mute)">${p.reviews} reviews</div></div></div>`;
    for (let i = 0; i < 3; i++) {
      const r = Math.min(5, Math.round(p.rating) - (i % 2));
      html += `<div class="review-item">
        <div class="review-head"><strong>${names[i]}</strong><span class="date">${['2 days', '1 week', '3 weeks'][i]} ago</span></div>
        <div class="stars">${LUXE.starsHTML(r)}</div>
        <p style="margin-top:6px">${bodies[i]}</p></div>`;
    }
    return html;
  }

  /* ================================================================
     12. Recently viewed strip (home + product pages)
     ================================================================ */
  function initRecentlyViewed() {
    const wrap = $('#recent-grid'); if (!wrap) return;
    const items = LUXE.getRecentlyViewed();
    const section = wrap.closest('section');
    if (!items.length) { if (section) section.classList.add('hidden'); return; }
    LUXE.renderProducts(wrap, items);
  }

  /* ================================================================
     13. About page stat counters
     ================================================================ */
  function initCounters() {
    const boxes = $$('[data-count]'); if (!boxes.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          LUXE.countUp(en.target, +en.target.dataset.count, { suffix: en.target.dataset.suffix || '' });
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    boxes.forEach(b => io.observe(b));
  }

  /* ================================================================
     14. Boot
     ================================================================ */
  function boot() {
    buildNavbar();
    buildFooter();
    initTheme();
    initNav();
    initChrome();
    initAccordions();
    LUXE.initForms && LUXE.initForms();
    LUXE.initNewsletter && LUXE.initNewsletter();
    LUXE.initTabs();

    // Page routing
    if (page === 'home') initHome();
    if (page === 'shop') initShop();
    if (page === 'product') initProduct();
    if (page === 'cart') LUXE.renderCartPage();
    if (page === 'wishlist') LUXE.renderWishlistPage();
    if (page === 'checkout') LUXE.initCheckout();
    initRecentlyViewed();
    initCounters();

    LUXE.observeReveal(document);
    // sync badges after data ready
    LUXE.cart.sync(); LUXE.wishlist.sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
