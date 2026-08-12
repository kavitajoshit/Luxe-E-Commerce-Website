/* =====================================================================
   wishlist.js — favourites state, persistence, rendering
   ===================================================================== */
(function () {
  'use strict';
  const LUXE = window.LUXE;
  const KEY = 'luxe_wishlist';

  const wishlist = LUXE.wishlist = {
    ids: LUXE.store.get(KEY, []),

    has(id) { return this.ids.includes(id); },
    save() { LUXE.store.set(KEY, this.ids); this.sync(); },
    sync() {
      const count = this.ids.length;
      LUXE.$$('.wish-count').forEach(el => { el.textContent = count; el.classList.toggle('hidden', count === 0); });
      document.dispatchEvent(new CustomEvent('wishlist:change'));
    },

    toggle(id, btn) {
      const p = LUXE.data.find(id); if (!p) return;
      if (this.has(id)) {
        this.ids = this.ids.filter(x => x !== id);
        LUXE.toast(`${p.name} removed from wishlist`, 'info', 'Removed');
      } else {
        this.ids.push(id);
        LUXE.toast(`${p.name} saved to wishlist`, 'success', 'Wishlisted');
      }
      this.save();
      // update all matching buttons on the page
      LUXE.$$(`.wish-btn[data-id="${id}"]`).forEach(b => {
        const on = this.has(id);
        b.classList.toggle('active', on);
        const i = b.querySelector('i');
        if (i) i.className = `fa-${on ? 'solid' : 'regular'} fa-heart`;
      });
      if (btn && btn.classList.contains('remove-from-wish')) LUXE.renderWishlistPage && LUXE.renderWishlistPage();
    }
  };

  wishlist.sync();

  /* ---- Wishlist page renderer ---------------------------------- */
  LUXE.renderWishlistPage = () => {
    const wrap = LUXE.$('#wishlist-root'); if (!wrap) return;
    const items = wishlist.ids.map(id => LUXE.data.find(id)).filter(Boolean);

    if (!items.length) {
      wrap.innerHTML = `<div class="empty-state">
        <div class="empty-illustration"><i class="fa-regular fa-heart"></i></div>
        <h3>Your wishlist is empty</h3>
        <p>Tap the heart on any product to save it here for later.</p>
        <a href="shop.html" class="btn btn-primary btn-lg"><i class="fa-solid fa-store"></i> Browse Products</a>
      </div>`;
      return;
    }

    wrap.innerHTML = `<div class="products-grid" id="wish-grid"></div>`;
    LUXE.renderProducts(LUXE.$('#wish-grid'), items);

    // Add "Move to cart" buttons overlay by replacing quick bar text
    LUXE.$$('#wish-grid .product-card').forEach(card => {
      const id = card.dataset.id;
      const bar = card.querySelector('.quick-view-bar');
      bar.innerHTML = `<div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm move-to-cart" data-id="${id}" style="flex:1"><i class="fa-solid fa-cart-plus"></i> Move to Cart</button>
        <button class="icon-btn remove-wish" data-id="${id}" aria-label="Remove"><i class="fa-solid fa-trash-can"></i></button>
      </div>`;
    });

    wrap.querySelectorAll('.move-to-cart').forEach(b => b.onclick = () => {
      LUXE.cart.add(b.dataset.id);
      wishlist.ids = wishlist.ids.filter(x => x !== b.dataset.id);
      wishlist.save();
      LUXE.renderWishlistPage();
    });
    wrap.querySelectorAll('.remove-wish').forEach(b => b.onclick = () => {
      wishlist.toggle(b.dataset.id);
      LUXE.renderWishlistPage();
    });
  };

})();
