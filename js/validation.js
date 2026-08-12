/* =====================================================================
   validation.js — reusable form validation + auth/newsletter/contact
   ===================================================================== */
(function () {
  'use strict';
  const LUXE = window.LUXE;

  const rules = {
    required: (v) => v.trim() !== '' || 'This field is required',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address',
    min: (n) => (v) => v.trim().length >= n || `Must be at least ${n} characters`,
    phone: (v) => /^[\d\s()+-]{7,}$/.test(v.trim()) || 'Enter a valid phone number',
    zip: (v) => /^[\w\s-]{3,10}$/.test(v.trim()) || 'Enter a valid postal code',
    match: (otherId, label) => (v) => v === (document.getElementById(otherId) || {}).value || `${label} do not match`,
    card: (v) => /^[\d\s]{13,19}$/.test(v.trim()) || 'Enter a valid card number',
    checked: (v, el) => el.checked || 'Please confirm to continue'
  };
  LUXE.rules = rules;

  function setError(field, msg) {
    const wrap = field.closest('.field') || field.parentElement;
    wrap.classList.toggle('has-error', !!msg);
    let e = wrap.querySelector('.error-msg');
    if (!e) { e = document.createElement('span'); e.className = 'error-msg'; wrap.appendChild(e); }
    e.textContent = msg || '';
  }

  function validateField(field) {
    const set = (field.dataset.rules || '').split('|').filter(Boolean);
    for (const r of set) {
      let fn, msg;
      if (r === 'required') fn = rules.required;
      else if (r === 'email') fn = rules.email;
      else if (r === 'phone') fn = rules.phone;
      else if (r === 'zip') fn = rules.zip;
      else if (r === 'card') fn = rules.card;
      else if (r === 'checked') fn = (v) => rules.checked(v, field);
      else if (r.startsWith('min:')) fn = rules.min(parseInt(r.split(':')[1]));
      else if (r.startsWith('match:')) { const [, id, label] = r.split(':'); fn = rules.match(id, label || 'Values'); }
      else continue;
      const res = fn(field.value, field);
      if (res !== true) { setError(field, res); return false; }
    }
    setError(field, '');
    return true;
  }

  /* Attach live + submit validation to any [data-validate] form */
  LUXE.initForms = () => {
    LUXE.$$('form[data-validate]').forEach(form => {
      const fields = LUXE.$$('[data-rules]', form);
      fields.forEach(f => {
        f.addEventListener('blur', () => validateField(f));
        f.addEventListener('input', () => { if ((f.closest('.field') || f.parentElement).classList.contains('has-error')) validateField(f); });
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let ok = true;
        fields.forEach(f => { if (!validateField(f)) ok = false; });
        if (!ok) { LUXE.toast('Please fix the highlighted fields', 'error'); return; }
        handleSubmit(form);
      });
    });

    // Password visibility toggles
    LUXE.$$('.toggle-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = `<i class="fa-regular fa-eye${show ? '-slash' : ''}"></i>`;
      });
    });
  };

  function handleSubmit(form) {
    const btn = form.querySelector('[type="submit"]');
    const type = form.dataset.validate;
    if (btn) { btn.disabled = true; const orig = btn.innerHTML; btn.innerHTML = '<span class="spinner"></span> Please wait…';
      setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; finish(type, form); }, 900);
    } else finish(type, form);
  }

  function finish(type, form) {
    if (type === 'login') {
      LUXE.toast('Welcome back! Redirecting…', 'success', 'Signed in');
      LUXE.store.set('luxe_user', { email: form.querySelector('[name="email"]').value });
      setTimeout(() => location.href = 'index.html', 1000);
    } else if (type === 'register') {
      LUXE.toast('Account created successfully!', 'success', 'Welcome to LUXE');
      LUXE.store.set('luxe_user', { email: form.querySelector('[name="email"]').value, name: (form.querySelector('[name="name"]') || {}).value });
      setTimeout(() => location.href = 'index.html', 1000);
    } else if (type === 'contact') {
      LUXE.toast('Message sent — we\'ll reply within 24h', 'success', 'Thanks!');
      form.reset();
    } else if (type === 'newsletter') {
      LUXE.toast('You\'re subscribed! Check your inbox.', 'success', 'Subscribed');
      form.reset();
    } else if (type === 'checkout') {
      LUXE.completeOrder && LUXE.completeOrder(form);
    }
  }

  /* Simple newsletter (inline, not full form) */
  LUXE.initNewsletter = () => {
    LUXE.$$('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (rules.email(input.value) === true) {
          LUXE.toast('You\'re subscribed! 🎉', 'success', 'Subscribed');
          form.reset();
        } else {
          LUXE.toast('Please enter a valid email', 'error');
        }
      });
    });
  };

})();
