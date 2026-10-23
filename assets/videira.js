(() => {
  const boot = () => {
    const config = JSON.parse(document.getElementById('videira-config').textContent);
    const root = config.root.endsWith('/') ? config.root : config.root + '/';
    const drawer = document.querySelector('[data-cart-dialog]');
    const status = document.querySelector('[data-cart-status]');
    let returnFocus;
    const show = dialog => {
      if (!dialog || dialog.open) return;
      returnFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    };
    document.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('close', () => {
        if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
        if (returnFocus?.isConnected) returnFocus.focus();
      });
      dialog.addEventListener('click', event => {
        if (event.target === dialog && !dialog.matches('[data-age-gate]')) {
          const rect = dialog.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
        }
      });
    });
    let statusTimer;
    const report = message => { clearTimeout(statusTimer); status.textContent = message; statusTimer = setTimeout(() => { status.textContent = ''; }, 5000); };
    const updateCart = async () => {
      const [cartResponse, sectionResponse] = await Promise.all([
        fetch(root + 'cart.js', { headers: { Accept: 'application/json' } }),
        fetch(config.cart + '?section_id=cart-drawer-content', { headers: { Accept: 'text/html' } })
      ]);
      if (!cartResponse.ok || !sectionResponse.ok) throw new Error(config.cartError);
      const cart = await cartResponse.json();
      const html = await sectionResponse.text();
      const content = new DOMParser().parseFromString(html, 'text/html').querySelector('.shopify-section');
      if (!content) throw new Error(config.cartError);
      drawer.querySelector('[data-drawer-content]').innerHTML = content.innerHTML;
      document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = cart.item_count; el.hidden = cart.item_count === 0 && el.classList.contains('sf-cart-count'); });
    };
    document.addEventListener('click', async event => {
      const close = event.target.closest('[data-dialog-close]');
      if (close) close.closest('dialog')?.close();
      const cartLink = event.target.closest('[data-cart-open]');
      if (cartLink && drawer) {
        event.preventDefault();
        try { await updateCart(); show(drawer); }
        catch { window.location.assign(cartLink.href); }
      }
      const filter = event.target.closest('[data-filter-open]');
      if (filter) show(document.querySelector('[data-filter-dialog]'));
      const step = event.target.closest('[data-carousel-step]');
      if (step) {
        const row = step.closest('.wc-section').querySelector('.wc-viewport');
        const card = row.querySelector('.sf-wine-card');
        row.scrollBy({ left: ((card?.getBoundingClientRect().width || 225) + 18) * Number(step.dataset.carouselStep), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
      if (event.target.closest('[data-product-zoom]')) show(document.querySelector('[data-zoom-dialog]'));
      const thumbnail = event.target.closest('[data-product-image]');
      if (thumbnail) setImage(thumbnail.dataset.productImage);
    });
    document.addEventListener('submit', async event => {
      const form = event.target.closest('[data-shopify-add]');
      if (!form) return;
      event.preventDefault();
      const button = form.querySelector('[type="submit"]');
      if (button.disabled) return;
      const localStatus = form.querySelector('[data-add-status]');
      if (localStatus) localStatus.textContent = '';
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      let added = false;
      try {
        const response = await fetch(root + 'cart/add.js', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.description || config.error);
        added = true;
        report(config.added);
        if (localStatus) localStatus.textContent = config.added;
        await updateCart();
        show(drawer);
      } catch (error) {
        const message = added ? config.added + ' ' + config.cartError : error.message || config.error;
        report(message);
        if (localStatus) localStatus.textContent = message;
        if (added) window.location.assign(config.cart);
      } finally { button.disabled = false; button.removeAttribute('aria-busy'); }
    });
    const menu = document.querySelector('[data-menu-toggle]');
    const mobile = document.getElementById('vn-mobile');
    menu?.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!expanded));
      mobile.hidden = expanded;
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (menu?.getAttribute('aria-expanded') === 'true') { mobile.hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.focus(); }
      document.querySelectorAll('.vn-group details[open]').forEach(el => el.open = false);
    });
    document.addEventListener('pointerdown', event => {
      if (!event.target.closest('.vn-header')) {
        if (mobile) mobile.hidden = true;
        menu?.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.vn-group details[open]').forEach(el => el.open = false);
      }
    });
    document.querySelectorAll('[data-auto-submit]').forEach(select => select.addEventListener('change', () => select.form.requestSubmit()));
    const setImage = url => {
      document.querySelectorAll('.pd-photo-button .pd-original-photo, [data-zoom-dialog] .pd-original-photo').forEach(img => { img.src = url; img.removeAttribute('srcset'); });
    };
    const select = document.getElementById('variant-select');
    const variantData = document.querySelector('[data-product-variants]');
    if (select && variantData) {
      const variants = JSON.parse(variantData.textContent);
      select.addEventListener('change', () => {
        const variant = variants.find(item => String(item.id) === select.value);
        if (!variant) return;
        document.querySelector('[data-product-price]').textContent = variant.price;
        const compare = document.querySelector('[data-product-compare]'); compare.textContent = variant.compare; compare.hidden = !variant.on_sale;
        document.querySelector('[data-product-submit]').disabled = !variant.available;
        document.querySelector('[data-product-button-label]').textContent = variant.available ? config.add : config.soldOut;
        const qty = document.getElementById('product-quantity'); qty.min = variant.min; qty.step = variant.step; qty.value = variant.min;
        if (variant.max) qty.max = variant.max; else qty.removeAttribute('max');
        if (variant.image) setImage(variant.image);
        const url = new URL(location.href); url.searchParams.set('variant', variant.id); history.replaceState({}, '', url);
      });
    }
    const age = document.querySelector('[data-age-gate]');
    if (age) {
      let accepted = false;
      try { accepted = localStorage.getItem('videira-age-ok') === '1' || localStorage.getItem('videira-age-confirmed') === 'yes'; } catch {}
      if (!accepted && !window.Shopify?.designMode) show(age);
      age.addEventListener('cancel', event => event.preventDefault());
      age.querySelector('[data-age-confirm]').addEventListener('click', () => { try { localStorage.setItem('videira-age-ok', '1'); } catch {} age.close(); });
      age.querySelector('[data-age-deny]').addEventListener('click', () => { age.querySelector('[data-age-denied]').hidden = false; age.querySelector('.age-actions').hidden = true; });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
