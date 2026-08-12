/* =====================================================================
   products.js — catalog data + card rendering + quick view + filters
   ===================================================================== */
(function () {
  'use strict';
  const LUXE = window.LUXE;
  const { productImage } = LUXE;

  /* ---- Catalog ------------------------------------------------- */
  /* price = current price, oldPrice = pre-discount (optional) */
  const CATEGORIES = [
    { id: 'audio',      name: 'Audio',      icon: 'fa-headphones',   desc: 'Sound, perfected' },
    { id: 'wearables',  name: 'Wearables',  icon: 'fa-clock',        desc: 'Smart on the wrist' },
    { id: 'computing',  name: 'Computing',  icon: 'fa-laptop',       desc: 'Power to create' }
  ];

  const RAW = [
    ['Bose QuietComfort Wireless Headphones', 'audio', 249, 329, 4.5, 892, ['best','sale'], 18, '🎧'],
    ['Sony WF-1000XM5', 'audio', 149, 199, 5, 1240, ['best','sale'], 42, '🎵'],
    ['JBL Charge 6', 'audio', 199, 0, 4, 318, ['new'], 7, '🔊'],
    ['Sennheiser AMBEO Soundbar Mini', 'audio', 129, 179, 4.5, 205, ['sale'], 25, '📻'],
    ['Samsung Galaxy Watch Ultra LTE', 'wearables', 329, 399, 5, 640, ['best','sale'], 12, '⌚'],
    ['Fitbit Charge 6', 'wearables', 89, 119, 4, 980, ['sale'], 60, '⌚'],
    ['Casio Lineage Titanium Solar Radio Watch', 'wearables', 549, 0, 4.5, 210, ['new'], 4, '⌚'],
    ['Oura Ring 4', 'wearables', 199, 0, 4, 156, ['new'], 15, '💍'],
    ['ASUS ROG Zephyrus G14 OLED Gaming Laptop', 'computing', 1299, 1499, 4.5, 430, ['best','sale'], 9, '💻'],
    ['AULA F75 75% Wireless Mechanical Keyboard', 'computing', 129, 159, 5, 720, ['best','sale'], 33, '⌨️'],
    ['Logitech G PRO X2 SUPERSTRIKE', 'computing', 69, 89, 4.5, 512, ['sale'], 48, '🖱️'],
    ['ASUS ROG Swift OLED PG27AQWP-W', 'computing', 449, 599, 4, 288, ['sale'], 11, '🖥️'],
    ['Zephyr X Smartphone', 'mobile', 899, 999, 5, 1520, ['best','sale'], 20, '📱'],
    ['Zephyr Lite', 'mobile', 499, 0, 4, 604, ['new'], 30, '📱'],
    ['MagCharge Power Bank', 'mobile', 59, 79, 4.5, 890, ['sale'], 75, '🔋'],
    ['Prism Phone Case', 'mobile', 29, 0, 4, 340, ['new'], 120, '📲'],
    ['Aura Smart Bulb Set', 'home', 79, 99, 4.5, 410, ['sale'], 55, '💡'],
    ['Sentinel Security Cam', 'home', 149, 0, 4, 267, ['new'], 18, '📷'],
    ['Breeze Smart Thermostat', 'home', 199, 249, 5, 380, ['best','sale'], 14, '🌡️'],
    ['Hush Robot Vacuum', 'home', 399, 499, 4.5, 522, ['best','sale'], 8, '🤖'],
    ['Titan Wireless Controller', 'gaming', 79, 99, 4.5, 940, ['best','sale'], 40, '🎮'],
    ['Vortex Gaming Headset', 'gaming', 129, 169, 5, 1120, ['best','sale'], 27, '🎧'],
    ['Blaze RGB Mousepad', 'gaming', 39, 0, 4, 215, ['new'], 90, '🟪'],
    ['Arcade Stick Pro', 'gaming', 189, 0, 4.5, 132, ['new'], 6, '🕹️']
  ];

  const PRODUCTS = RAW.filter(([, category]) =>
    ['audio', 'wearables', 'computing'].includes(category)
  ).map((r, i) => {
  const [name, category, price, oldPrice, rating, reviews, badges, stock, icon] = r;
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

  // Real image paths for audio products
  const audioImageMap = {
    'Bose QuietComfort Wireless Headphones': 'images/Bose-QuietComfort-Wireless-Headphones.jpg',
    'Sony WF-1000XM5': 'images/Sony-WF-1000XM5.jpg',
    'JBL Charge 6': 'images/JBL-Charge-6.jpg',
    'Sennheiser AMBEO Soundbar Mini': 'images/Sennheiser-AMBEO-Soundbar-Mini.jpg',
     'Samsung Galaxy Watch Ultra LTE':'images/Samsung-Galaxy-Watch-Ultra.jpg',
     'Fitbit Charge 6':'images/Fitbit-Charge-6.jpg',
     'Casio Lineage Titanium Solar Radio Watch':'images/Casio-LCW-M170TD-2AJF.jpg',
     'Oura Ring 4': 'images/OURA-Ring-4.jpg',
     'ASUS ROG Zephyrus G14 OLED Gaming Laptop': 'images/ASUS-ROG-Zephyrus-G14.jpg',
     'AULA F75 75% Wireless Mechanical Keyboard': 'images/AULA-F75-75%25-Wireless-Mechanical-Keyboard.jpg',
     'Logitech G PRO X2 SUPERSTRIKE': 'images/Logitech-G-PRO-X2-SUPERSTRIKE.webp',
     'ASUS ROG Swift OLED PG27AQWP-W': 'images/PG27AQWP-W-Early-Setup.jpg'
  };

  const audioGalleryMap = {
    'Bose QuietComfort Wireless Headphones': [
      'images/Bose-QuietComfort-Wireless-Headphones.jpg',
      'images/Bose-QuietComfort-Wireless-Headphones-2.jpg',
      'images/Bose-QuietComfort-Wireless-Headphones-3.jpg',
      'images/Bose-QuietComfort-Wireless-Headphones-4.jpg',
    ],
    'Sony WF-1000XM5': [
      'images/Sony-WF-1000XM5.jpg',
      'images/Sony-WF-1000XM5-2.jpg',
      'images/Sony-WF-1000XM5-3.jpg',
      'images/Sony-WF-1000XM5-4.jpg'
    ],
    'JBL Charge 6': [
      'images/JBL-Charge-6.jpg',
      'images/JBL-Charge-6-2.jpg',
      'images/JBL-Charge-6-3.jpg',
      'images/JBL-Charge-6-4.jpg'
    ],
    'Sennheiser AMBEO Soundbar Mini': [
      'images/Sennheiser-AMBEO-Soundbar-Mini.jpg',
      'images/Sennheiser-AMBEO-Soundbar-Mini-2.jpg',
      'images/Sennheiser-AMBEO-Soundbar-Mini-3.jpg',
      'images/Sennheiser-AMBEO-Soundbar-Mini-4.jpg'
    ],
    'Samsung Galaxy Watch Ultra LTE': [
      'images/Samsung-Galaxy-Watch-Ultra.jpg',
      'images/Samsung-Galaxy-Watch-Ultra-2.jpg',
      'images/Samsung-Galaxy-Watch-Ultra-3.jpg',
      'images/Samsung-Galaxy-Watch-Ultra-4.jpg'
    ],
    'Fitbit Charge 6': [
      'images/Fitbit-Charge-6.jpg',
      'images/Fitbit-Charge-6-2.jpg',
      'images/Fitbit-Charge-6-3.jpg',
      'images/Fitbit-Charge-6-4.jpg'
    ],
    'Casio Lineage Titanium Solar Radio Watch': [
      'images/Casio-LCW-M170TD-2AJF.jpg',
      'images/Casio-LCW-M170TD-2AJF-2.webp',
      'images/Casio-LCW-M170TD-2AJF-3.jpg',
      'images/Casio-LCW-M170TD-2AJF-4.jpg'
    ],
    'Oura Ring 4': [
      'images/OURA-Ring-4.jpg',
      'images/OURA-Ring-4-2.jpg',
      'images/OURA-Ring-4-3.jpg',
      'images/OURA-Ring-4-4.jpg'
    ] ,
    'ASUS ROG Zephyrus G14 OLED Gaming Laptop': [
      'images/ASUS-ROG-Zephyrus-G14.jpg',
      'images/ASUS-ROG-Zephyrus-G14-2.jpg',
      'images/ASUS-ROG-Zephyrus-G14-3.jpg',
      'images/ASUS-ROG-Zephyrus-G14-4.jpg'
    ],
    'AULA F75 75% Wireless Mechanical Keyboard': [
      'images/AULA-F75-75%25-Wireless-Mechanical-Keyboard.jpg',
      'images/AULA-F75-75%25-Wireless-Mechanical-Keyboard-2.jpg',
      'images/AULA-F75-75%25-Wireless-Mechanical-Keyboard-3.jpg',
      'images/AULA-F75-75%25-Wireless-Mechanical-Keyboard-4.jpg'
    ],
    'Logitech G PRO X2 SUPERSTRIKE': [
      'images/Logitech-G-PRO-X2-SUPERSTRIKE.webp',
      'images/Logitech-G-PRO-X2-SUPERSTRIKE-2.jpg',
      'images/Logitech-G-PRO-X2-SUPERSTRIKE-3.jpg',
      'images/Logitech-G-PRO-X2-SUPERSTRIKE-4.jpg'
    ],
    'ASUS ROG Swift OLED PG27AQWP-W': [
      'images/PG27AQWP-W-Early-Setup.jpg',
      'images/PG27AQWP-W-Early-Setup-2.jpg',
      'images/PG27AQWP-W-Early-Setup-3.jpg',
      'images/PG27AQWP-W-Early-Setup-4.jpg'
    ]
  };

  const defaultImage = productImage(name, i, icon);
  const defaultGallery = [
    productImage(name, i, icon),
    productImage(name, i + 3, icon),
    productImage(name, i + 6, icon),
    productImage(name, i + 9, icon)
  ];

  const image = audioImageMap[name] || defaultImage;

  const gallery = audioGalleryMap[name] || defaultGallery;

  return {
    id: 'p' + (i + 1),
    name,
    category,
    price,
    oldPrice: oldPrice || 0,
    rating,
    reviews,
    badges,
    stock,
    icon,
    discount,
    createdAt: RAW.length - i,
    popularity: reviews,
    image,
    gallery,
    desc: `The ${name} blends premium materials with obsessive engineering. Every detail — from the tactile finish to the effortless performance — is crafted to elevate your everyday. Backed by our 1-year warranty and free returns.`,
    specs: {
      'Brand': 'LUXE',
      'Model': name.replace(/\s+/g, '-').toUpperCase().slice(0, 12),
      'Warranty': '1 Years',
      'In the box': 'Device, cable, quick-start guide',
      'Connectivity': category === 'audio' ? 'Bluetooth 5.3' : 'USB-C / Wi-Fi 6',
      'Weight': (150 + i * 12) + ' g'
    }
  };
});


  const catName = (id) => (CATEGORIES.find(c => c.id === id) || {}).name || id;

  LUXE.data = { PRODUCTS, CATEGORIES, catName, find: (id) => PRODUCTS.find(p => p.id === id) };

  /* ---- Product card markup ------------------------------------- */
  LUXE.productCard = (p) => {
    const inWish = LUXE.wishlist && LUXE.wishlist.has(p.id);
    const badges = (p.badges || []).map(b =>
      `<span class="p-badge ${b}">${b === 'best' ? 'Best Seller' : b}</span>`).join('');
    const stockClass = p.stock <= 10 ? 'low' : '';
    const stockLabel = p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? `Only ${p.stock} left` : 'In stock';
    const priceOld = p.oldPrice ? `<span class="price-old">${LUXE.money(p.oldPrice)}</span>` : '';
    const disc = p.discount ? `<span class="discount-tag">-${p.discount}%</span>` : '';
    return `
    <article class="product-card" data-id="${p.id}" data-reveal="scale">
      <div class="product-media">
        ${badges ? `<div class="product-badges">${badges}</div>` : ''}
        <div class="product-actions">
          <button class="icon-btn wish-btn ${inWish ? 'active' : ''}" data-id="${p.id}" aria-label="Add to wishlist" title="Wishlist">
            <i class="fa-${inWish ? 'solid' : 'regular'} fa-heart"></i>
          </button>
          <button class="icon-btn quick-btn" data-id="${p.id}" aria-label="Quick view" title="Quick view">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
        <a href="product.html?id=${p.id}" aria-label="${p.name}">
          <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
        <div class="quick-view-bar">
          <button class="btn btn-dark btn-block btn-sm add-cart-btn" data-id="${p.id}">
            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
          </button>
        </div>
      </div>
      <div class="product-body">
        <span class="product-cat">${catName(p.category)}</span>
        <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="rating"><span class="stars">${LUXE.starsHTML(p.rating)}</span> <span>${p.rating} (${p.reviews})</span></div>
        <div class="price-row">
          <span class="price">${LUXE.money(p.price)}</span>${priceOld}${disc}
        </div>
        <div class="stock-line ${stockClass}"><span class="dot"></span> ${stockLabel}</div>
      </div>
    </article>`;
  };

  LUXE.renderProducts = (container, list) => {
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-illustration"><i class="fa-solid fa-magnifying-glass"></i></div>
        <h3>No products found</h3><p>Try adjusting your filters or search terms.</p></div>`;
      return;
    }
    container.innerHTML = list.map(LUXE.productCard).join('');
    if (LUXE.observeReveal) LUXE.observeReveal(container);
  };

  // Keep a product card usable even if an image is moved or unavailable.
  document.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.classList.contains('product-image') || image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = productImage(image.alt || 'LUXE');
  }, true);

  /* ---- Skeleton cards ------------------------------------------ */
  LUXE.skeletonCards = (n = 8) => {
    let html = '';
    for (let i = 0; i < n; i++) {
      html += `<div class="skel-card"><div class="skeleton skel-img"></div>
        <div class="skel-body">
          <div class="skeleton skel-line short"></div>
          <div class="skeleton skel-line med"></div>
          <div class="skeleton skel-line"></div>
        </div></div>`;
    }
    return html;
  };

  /* ---- Quick View modal ---------------------------------------- */
  let modalEl;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'modal-overlay';
    modalEl.innerHTML = `<div class="modal" role="dialog" aria-modal="true" style="position:relative">
      <button class="icon-btn modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-body"></div></div>`;
    document.body.appendChild(modalEl);
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
    modalEl.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    return modalEl;
  }
  function closeModal() { if (modalEl) { modalEl.classList.remove('open'); document.body.style.overflow = ''; } }

  LUXE.quickView = (id) => {
    const p = LUXE.data.find(id); if (!p) return;
    LUXE.addRecentlyViewed && LUXE.addRecentlyViewed(id);
    const m = ensureModal();
    const priceOld = p.oldPrice ? `<span class="price-old">${LUXE.money(p.oldPrice)}</span>` : '';
    const disc = p.discount ? `<span class="discount-tag">-${p.discount}%</span>` : '';
    m.querySelector('.modal-body').innerHTML = `
      <div class="modal-media"><img src="${p.image}" alt="${p.name}"></div>
      <div class="modal-info">
        <span class="product-cat">${catName(p.category)}</span>
        <h2 style="margin:6px 0 10px">${p.name}</h2>
        <div class="rating" style="margin-bottom:12px"><span class="stars">${LUXE.starsHTML(p.rating)}</span> <span>${p.rating} · ${p.reviews} reviews</span></div>
        <div class="detail-price" style="margin:0 0 14px"><span class="price">${LUXE.money(p.price)}</span>${priceOld}${disc}</div>
        <p style="margin-bottom:18px">${p.desc}</p>
        <div class="stock-line ${p.stock <= 10 ? 'low' : ''}" style="margin-bottom:18px"><span class="dot"></span> ${p.stock <= 10 ? 'Only ' + p.stock + ' left' : 'In stock'}</div>
        <div class="detail-actions" style="margin:0">
          <button class="btn btn-primary add-cart-btn" data-id="${p.id}"><i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>
          <a class="btn btn-outline" href="product.html?id=${p.id}">View Details</a>
        </div>
      </div>`;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  /* ---- Recently viewed ----------------------------------------- */
  LUXE.addRecentlyViewed = (id) => {
    let rv = LUXE.store.get('luxe_recent', []);
    rv = [id, ...rv.filter(x => x !== id)].slice(0, 6);
    LUXE.store.set('luxe_recent', rv);
  };
  LUXE.getRecentlyViewed = () => LUXE.store.get('luxe_recent', []).map(id => LUXE.data.find(id)).filter(Boolean);

  /* ---- Global delegated clicks (cards work on every page) ------ */
  document.addEventListener('click', (e) => {
    const quick = e.target.closest('.quick-btn');
    if (quick) { e.preventDefault(); LUXE.quickView(quick.dataset.id); return; }
    const add = e.target.closest('.add-cart-btn');
    if (add && LUXE.cart) { e.preventDefault(); LUXE.cart.add(add.dataset.id); }
    const wish = e.target.closest('.wish-btn');
    if (wish && LUXE.wishlist) { e.preventDefault(); LUXE.wishlist.toggle(wish.dataset.id, wish); }
  });

})();
