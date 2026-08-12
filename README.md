# LUXE — Premium E-commerce Website

A complete, production-quality e-commerce front end built with **only HTML5, CSS3 and Vanilla JavaScript**. No React, Bootstrap, Tailwind or jQuery — the only external resources are Google Fonts and Font Awesome (icons).

Inspired by Apple / Nike / Shopify: clean, minimal, glassmorphism accents, soft shadows, smooth animations, and full dark/light theming.

## ✨ Features

- **11 pages** — Home, Shop, Product, Cart, Checkout, Wishlist, About, Contact, FAQ, Login, Register
- **Shopping cart** with quantity control, coupons, tax/shipping, and `localStorage` persistence
- **Wishlist** with move-to-cart, saved across sessions
- **Shop filters** — search, category, price range, rating, and 5 sort modes with pagination
- **Product detail** — image gallery, tabs (description / specs / reviews), qty selector, related products
- **Quick View modal** on every product card
- **Flash sale countdown timer**, **recently viewed**, **skeleton loading**, **scroll reveal**
- **Dark / light mode** toggle (respects system preference, persists choice)
- **Toast notifications**, **back-to-top**, **page loader**, **responsive hamburger menu**
- **Form validation** — login, register (with password match + visibility toggle), checkout, contact, newsletter
- **Fully responsive**, mobile-first, accessible markup, reduced-motion support
- **100% offline-capable product imagery** — images are generated as inline SVG data URIs

## 📂 Structure

```
Ecommerce/
├── index.html  shop.html  product.html  cart.html  checkout.html
├── wishlist.html  about.html  contact.html  faq.html  login.html  register.html
├── css/
│   ├── style.css        # design tokens + all components
│   ├── animations.css   # keyframes, scroll reveal, micro-interactions
│   └── responsive.css   # mobile-first breakpoints
├── js/
│   ├── utils.js         # helpers: storage, money, toast, SVG image gen
│   ├── products.js      # catalog data + card rendering + quick view
│   ├── cart.js          # cart state, coupons, totals, cart page
│   ├── wishlist.js      # wishlist state + page
│   ├── validation.js    # reusable form validation
│   ├── checkout.js      # order summary + place-order flow
│   └── app.js           # shared shell (navbar/footer/theme) + page routing
├── images/  assets/
└── README.md
```

The navbar and footer are injected by `app.js` into `#navbar-root` / `#footer-root`, keeping every page DRY. Each page declares its identity via `<body data-page="…">`, which drives the per-page logic in `app.js`.

## ▶️ Running locally

Just open `index.html` in any modern browser. For best results (and correct relative paths), serve the folder:

```bash
# Python
python -m http.server 8000
# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## 🎟️ Try these coupon codes (on the cart page)

| Code | Effect |
|------|--------|
| `LUXE10` | 10% off |
| `WELCOME15` | 15% off |
| `FREESHIP` | Free shipping |
| `SAVE50` | $50 off |

## 🎨 Customising

- **Colors / radii / spacing** — edit the CSS custom properties at the top of `css/style.css` (`:root`).
- **Products** — edit the `RAW` array in `js/products.js`.
- **Dark theme** — tweak the `[data-theme="dark"]` block in `css/style.css`.
