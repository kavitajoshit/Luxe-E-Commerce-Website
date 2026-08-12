/* =====================================================================
   checkout.js — order summary render + place order flow
   ===================================================================== */
(function () {
  'use strict';
  const LUXE = window.LUXE;

  LUXE.renderCheckout = () => {
    const wrap = LUXE.$('#checkout-summary'); if (!wrap) return;
    const items = LUXE.cart.detailed();

    if (!items.length) {
      const page = LUXE.$('#checkout-root');
      if (page) page.innerHTML = `<div class="empty-state">
        <div class="empty-illustration"><i class="fa-solid fa-cart-shopping"></i></div>
        <h3>Nothing to check out</h3><p>Your cart is empty. Add items before placing an order.</p>
        <a href="shop.html" class="btn btn-primary btn-lg">Go to Shop</a></div>`;
      return;
    }

    const t = LUXE.cart.totals();
    const rows = items.map(p => `
      <div class="summary-row" style="align-items:center">
        <span style="display:flex;align-items:center;gap:10px">
          <img src="${p.image}" alt="" style="width:44px;height:44px;border-radius:10px;object-fit:cover">
          <span>${p.name} <strong style="color:var(--color-text-mute)">×${p.qty}</strong></span>
        </span>
        <span>${LUXE.money(p.lineTotal)}</span>
      </div>`).join('');

    wrap.innerHTML = `
      <h3>Order Summary</h3>
      <div style="margin-block:12px">${rows}</div>
      <hr class="divider" style="margin-block:12px">
      <div class="summary-row"><span>Subtotal</span><span>${LUXE.money(t.subtotal)}</span></div>
      ${t.discount ? `<div class="summary-row" style="color:var(--color-success)"><span>Discount</span><span>−${LUXE.money(t.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Tax</span><span>${LUXE.money(t.tax)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : LUXE.money(t.shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${LUXE.money(t.grand)}</span></div>`;
  };

  /* Called by validation.js after a valid checkout form submit */
  LUXE.completeOrder = () => {
    const orderId = 'LX-' + Math.floor(100000 + LUXE.cart.count() * 7919 + LUXE.cart.subtotal()).toString().slice(0, 6);
    const total = LUXE.money(LUXE.cart.totals().grand);
    LUXE.cart.clear();
    const root = LUXE.$('#checkout-root');
    if (root) {
      root.innerHTML = `<div class="empty-state">
        <div class="empty-illustration" style="background:var(--color-primary-soft)"><i class="fa-solid fa-circle-check" style="color:var(--color-success)"></i></div>
        <h3>Order placed successfully!</h3>
        <p>Thank you for shopping with LUXE. Your order <strong>#${orderId}</strong> totalling <strong>${total}</strong> is confirmed. A receipt has been sent to your email.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="shop.html" class="btn btn-primary btn-lg">Continue Shopping</a>
          <a href="index.html" class="btn btn-outline btn-lg">Back Home</a>
        </div>
      </div>`;
    }
    LUXE.toast('Order confirmed! 🎉', 'success', 'Thank you');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Payment method selector interaction */
  LUXE.initCheckout = () => {
    LUXE.renderCheckout();
    LUXE.$$('.pay-method').forEach(m => {
      m.addEventListener('click', () => {
        LUXE.$$('.pay-method').forEach(x => x.classList.remove('active'));
        m.classList.add('active');
        const radio = m.querySelector('input'); if (radio) radio.checked = true;
        const cardFields = LUXE.$('#card-fields');
        if (cardFields) cardFields.classList.toggle('hidden', m.dataset.method !== 'card');
      });
    });
  };

})();
