/* =====================================================================
   cart.js — shopping cart state, persistence, rendering, coupons
   ===================================================================== */
(function () {
  'use strict';
  const LUXE = window.LUXE;
  const KEY = 'luxe_cart';
  const COUPON_KEY = 'luxe_coupon';

  const COUPONS = {
    'LUXE10':   { type: 'pct', value: 10, label: '10% off' },
    'WELCOME15':{ type: 'pct', value: 15, label: '15% off welcome' },
    'FREESHIP': { type: 'ship', value: 0, label: 'Free shipping' },
    'SAVE50':   { type: 'flat', value: 50, label: '$50 off' }
  };
  const TAX_RATE = 0.08;
  const SHIP_FLAT = 12;
  const FREE_SHIP_THRESHOLD = 150;

  const cart = LUXE.cart = {
    items: LUXE.store.get(KEY, []),      // [{id, qty}]
    coupon: LUXE.store.get(COUPON_KEY, null),

    save() { LUXE.store.set(KEY, this.items); this.sync(); },
    sync() {
      const count = this.count();
      LUXE.$$('.cart-count').forEach(el => {
        el.textContent = count;
        el.classList.toggle('hidden', count === 0);
      });
      document.dispatchEvent(new CustomEvent('cart:change'));
    },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },

    add(id, qty = 1) {
      const p = LUXE.data.find(id); if (!p) return;
      const existing = this.items.find(i => i.id === id);
      if (existing) existing.qty += qty; else this.items.push({ id, qty });
      this.save();
      LUXE.toast(`${p.name} added to cart`, 'success', 'Added to bag');
    },
    remove(id) {
      const p = LUXE.data.find(id);
      this.items = this.items.filter(i => i.id !== id);
      this.save();
      if (p) LUXE.toast(`${p.name} removed`, 'info', 'Removed');
    },
    setQty(id, qty) {
      const it = this.items.find(i => i.id === id); if (!it) return;
      it.qty = LUXE.clamp(qty, 1, 99);
      this.save();
    },
    clear() { this.items = []; this.coupon = null; LUXE.store.remove(COUPON_KEY); this.save(); },

    detailed() {
      return this.items.map(i => {
        const p = LUXE.data.find(i.id);
        return p ? { ...p, qty: i.qty, lineTotal: p.price * i.qty } : null;
      }).filter(Boolean);
    },

    subtotal() { return this.detailed().reduce((s, i) => s + i.lineTotal, 0); },

    applyCoupon(code) {
      code = (code || '').trim().toUpperCase();
      if (!COUPONS[code]) { LUXE.toast('Invalid coupon code', 'error'); return false; }
      this.coupon = code; LUXE.store.set(COUPON_KEY, code);
      LUXE.toast(`Coupon “${code}” applied — ${COUPONS[code].label}`, 'success', 'Coupon applied');
      this.sync(); return true;
    },
    removeCoupon() { this.coupon = null; LUXE.store.remove(COUPON_KEY); this.sync(); },

    totals() {
      const subtotal = this.subtotal();
      let discount = 0, freeShip = false;
      const c = this.coupon && COUPONS[this.coupon];
      if (c) {
        if (c.type === 'pct') discount = subtotal * c.value / 100;
        else if (c.type === 'flat') discount = Math.min(c.value, subtotal);
        else if (c.type === 'ship') freeShip = true;
      }
      const taxed = Math.max(0, subtotal - discount);
      const tax = taxed * TAX_RATE;
      let shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIP_THRESHOLD || freeShip ? 0 : SHIP_FLAT);
      const grand = taxed + tax + shipping;
      return { subtotal, discount, tax, shipping, grand, couponLabel: c ? c.label : '', freeShipThreshold: FREE_SHIP_THRESHOLD };
    }
  };

  cart.sync();

  /* ---- Cart page renderer -------------------------------------- */
  LUXE.renderCartPage = () => {
    const wrap = LUXE.$('#cart-root'); if (!wrap) return;
    const items = cart.detailed();

    if (!items.length) {
      wrap.innerHTML = `<div class="empty-state">
        <div class="empty-illustration"><i class="fa-solid fa-cart-shopping"></i></div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet. Explore our collection and find something you love.</p>
        <a href="shop.html" class="btn btn-primary btn-lg"><i class="fa-solid fa-store"></i> Start Shopping</a>
      </div>`;
      return;
    }

    const t = cart.totals();
    const rows = items.map(p => `
      <div class="cart-item" data-id="${p.id}">
        <a class="thumb" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        <div class="ci-info">
          <span class="ci-cat">${LUXE.data.catName(p.category)}</span>
          <h4>${p.name}</h4>
          <span class="price">${LUXE.money(p.price)}</span>
        </div>
        <div class="ci-controls">
          <div class="qty-selector">
            <button class="qty-dec" data-id="${p.id}" aria-label="Decrease">−</button>
            <input type="text" value="${p.qty}" readonly aria-label="Quantity">
            <button class="qty-inc" data-id="${p.id}" aria-label="Increase">+</button>
          </div>
          <span class="ci-price">${LUXE.money(p.lineTotal)}</span>
          <button class="remove-btn" data-id="${p.id}"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>`).join('');

    const couponApplied = cart.coupon ? `<div class="coupon-applied"><i class="fa-solid fa-tag"></i> ${cart.coupon} — ${t.couponLabel}
        <button class="remove-btn coupon-remove" style="margin-left:auto"><i class="fa-solid fa-xmark"></i></button></div>` : '';
    const shipNote = t.subtotal < t.freeShipThreshold && t.shipping > 0
      ? `<p style="font-size:.82rem;color:var(--color-primary);margin-top:6px"><i class="fa-solid fa-truck-fast"></i> Add ${LUXE.money(t.freeShipThreshold - t.subtotal)} more for free shipping</p>` : '';

    wrap.innerHTML = `
      <div class="cart-layout">
        <div>
          <div class="cart-items">${rows}</div>
          <div style="margin-top:24px"><a href="shop.html" class="btn btn-ghost"><i class="fa-solid fa-arrow-left"></i> Continue Shopping</a></div>
        </div>
        <aside class="summary-card">
          <h3>Order Summary</h3>
          <div class="coupon-row">
            <input class="input" id="coupon-input" placeholder="Coupon code" value="${cart.coupon || ''}">
            <button class="btn btn-dark btn-sm" id="apply-coupon">Apply</button>
          </div>
          ${couponApplied}
          <p style="font-size:.78rem;color:var(--color-text-mute);margin-bottom:10px">Try: LUXE10, WELCOME15, FREESHIP, SAVE50</p>
          <div class="summary-row"><span>Subtotal</span><span>${LUXE.money(t.subtotal)}</span></div>
          ${t.discount ? `<div class="summary-row" style="color:var(--color-success)"><span>Discount</span><span>−${LUXE.money(t.discount)}</span></div>` : ''}
          <div class="summary-row"><span>Tax (8%)</span><span>${LUXE.money(t.tax)}</span></div>
          <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : LUXE.money(t.shipping)}</span></div>
          ${shipNote}
          <div class="summary-row total"><span>Total</span><span>${LUXE.money(t.grand)}</span></div>
          <a href="checkout.html" class="btn btn-primary btn-block btn-lg" style="margin-top:16px"><i class="fa-solid fa-lock"></i> Checkout</a>
        </aside>
      </div>`;

    // Wire events
    wrap.querySelectorAll('.qty-inc').forEach(b => b.onclick = () => { const it = cart.items.find(i => i.id === b.dataset.id); cart.setQty(b.dataset.id, it.qty + 1); LUXE.renderCartPage(); });
    wrap.querySelectorAll('.qty-dec').forEach(b => b.onclick = () => { const it = cart.items.find(i => i.id === b.dataset.id); cart.setQty(b.dataset.id, it.qty - 1); LUXE.renderCartPage(); });
    wrap.querySelectorAll('.remove-btn:not(.coupon-remove)').forEach(b => b.onclick = () => { cart.remove(b.dataset.id); LUXE.renderCartPage(); });
    const apply = wrap.querySelector('#apply-coupon');
    if (apply) apply.onclick = () => { if (cart.applyCoupon(LUXE.$('#coupon-input').value)) LUXE.renderCartPage(); };
    const cr = wrap.querySelector('.coupon-remove');
    if (cr) cr.onclick = () => { cart.removeCoupon(); LUXE.renderCartPage(); };
  };

})();
