(function() {
  /**
   * Central app bootstrap: fetch config.json and render dynamic content
   */
  async function loadConfig() {
    const url = `config.json?v=${Date.now()}`; // cache-bust to avoid 304 issues
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load config.json (status ${res.status})`);
    return res.json();
  }

  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el && typeof text === 'string') el.textContent = text;
  }

  function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.setAttribute(attr, value);
  }

  function setHref(selector, href) {
    const el = document.querySelector(selector);
    if (el && href) el.setAttribute('href', href);
  }

  function renderSEO(seo) {
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    const ensure = (name, attr, value) => {
      let el = document.querySelector(`${name}`);
      if (!el) {
        el = document.createElement('meta');
        const [tag, key, keyValue] = name.replace(/([\[\]="])/g, ' ').trim().split(/\s+/);
        if (tag === 'meta' && key && keyValue) {
          el.setAttribute(key, keyValue);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (seo.description) ensure('meta[name="description"]', 'content', seo.description);
    if (seo.keywords) ensure('meta[name="keywords"]', 'content', seo.keywords);
    if (seo.image) {
      ensure('meta[property="og:image"]', 'content', seo.image);
      ensure('meta[name="twitter:image"]', 'content', seo.image);
    }
    if (seo.url) ensure('meta[property="og:url"]', 'content', seo.url);
    if (seo.title) {
      ensure('meta[property="og:title"]', 'content', seo.title);
      ensure('meta[name="twitter:title"]', 'content', seo.title);
    }
    if (seo.description) {
      ensure('meta[property="og:description"]', 'content', seo.description);
      ensure('meta[name="twitter:description"]', 'content', seo.description);
    }
  }

  function renderHeaderFooter(config) {
    setText('[data-brand-name]', config.brandName);
    setText('[data-tagline]', config.tagline);

    // Footer contact
    setHref('#email-link', `mailto:${config.email}`);
    setHref('#phone-link', `tel:${config.phone}`);
    setText('#address-text', config.address);

    // Social links
    if (config.socialLinks) {
      if (config.socialLinks.instagram) setHref('#instagram-link', config.socialLinks.instagram);
      if (config.socialLinks.facebook) setHref('#facebook-link', config.socialLinks.facebook);
      if (config.socialLinks.whatsapp) setHref('#whatsapp-link', config.socialLinks.whatsapp);
    }
  }

  function renderHero(config) {
    // Gallery for home and mini-gallery for services from heroImages
    const homeGallery = document.getElementById('gallery-list');
    if (homeGallery && Array.isArray(config.heroImages)) {
      homeGallery.innerHTML = '';
      config.heroImages.slice(0, 6).forEach((src, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <button class="group block w-full" data-lightbox-trigger aria-controls="lightbox" aria-expanded="false">
            <img src="${src}" alt="Decor sample ${idx + 1}" loading="lazy" class="aspect-[4/3] w-full rounded-lg object-cover shadow-sm ring-1 ring-slate-200 group-hover:opacity-95" />
          </button>`;
        homeGallery.appendChild(li);
      });
    }

    const miniGallery = document.getElementById('mini-gallery-list');
    if (miniGallery && Array.isArray(config.heroImages)) {
      miniGallery.innerHTML = '';
      config.heroImages.slice(0, 4).forEach((src, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <button class="group block w-full" data-lightbox-trigger aria-controls="lightbox" aria-expanded="false">
            <img src="${src}" alt="Decor inspiration ${idx + 1}" loading="lazy" class="aspect-[4/3] w-full rounded-lg object-cover shadow-sm ring-1 ring-slate-200 group-hover:opacity-95" />
          </button>`;
        miniGallery.appendChild(li);
      });
    }
  }

  function renderServices(config) {
    const container = document.getElementById('services-list');
    if (!container || !Array.isArray(config.services)) return;
    container.innerHTML = '';
    config.services.forEach((svc) => {
      const card = document.createElement('article');
      // Mark as revealed so dynamically inserted cards are visible without relying on the page's IntersectionObserver
      card.className = 'reveal revealed rounded-lg bg-white p-6 shadow ring-1 ring-slate-200 flex flex-col';
      card.innerHTML = `
        <img src="${svc.image}" alt="${svc.title}" loading="lazy" class="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-slate-200"/>
        <h3 class="mt-4 text-lg font-semibold">${svc.title}</h3>
        ${svc.price ? `<p class=\"mt-1 text-sm text-slate-600\">${svc.price}</p>` : ''}
        <p class="mt-2 text-sm text-slate-700">${svc.description}</p>
        <div class="mt-6">
          <a href="#contact" class="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">Enquire</a>
        </div>`;
      container.appendChild(card);
    });
  }

  function renderForm(config) {
    const placeholders = (config.contactForm && config.contactForm.placeholders) || {};
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const postcode = document.getElementById('postcode');
    const description = document.getElementById('description');
    if (fullName && placeholders.fullName) fullName.placeholder = placeholders.fullName;
    if (email && placeholders.email) email.placeholder = placeholders.email;
    if (postcode && placeholders.postcode) postcode.placeholder = placeholders.postcode;
    if (description && placeholders.description) description.placeholder = placeholders.description;

    const consent = document.querySelector('label[for="consent"]');
    if (consent && config.contactForm && config.contactForm.consentText) consent.textContent = config.contactForm.consentText;

    const actionForms = document.querySelectorAll('form[data-formspree]');
    if (config.contactForm && config.contactForm.action) {
      actionForms.forEach((f) => f.setAttribute('action', config.contactForm.action));
    }

    const budgetSelects = document.querySelectorAll('select#budget');
    if (config.contactForm && Array.isArray(config.contactForm.budgetOptions)) {
      budgetSelects.forEach((sel) => {
        sel.innerHTML = '';
        config.contactForm.budgetOptions.forEach((opt) => {
          const o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          sel.appendChild(o);
        });
      });
    }
  }

  function renderFooterTelMail(config) {
    const tel = document.querySelectorAll('[data-tel]');
    tel.forEach((a) => a.setAttribute('href', `tel:${config.phone}`));
    const mail = document.querySelectorAll('[data-mail]');
    mail.forEach((a) => a.setAttribute('href', `mailto:${config.email}`));
  }

  function renderBrandText(config) {
    document.querySelectorAll('[data-brand-name]').forEach((el) => el.textContent = config.brandName);
    document.querySelectorAll('[data-tagline]').forEach((el) => el.textContent = config.tagline);
  }

  async function bootstrap() {
    try {
      const config = await loadConfig();
      // Apply environment overrides (local env.js or injected by CI)
      if (typeof window !== 'undefined' && window.__ENV__) {
        const env = window.__ENV__;
        if (env.FORMSPREE_ACTION_URL) {
          config.contactForm = config.contactForm || {};
          config.contactForm.action = env.FORMSPREE_ACTION_URL;
        }
        if (env.SITE_URL) {
          config.seo = config.seo || {};
          config.seo.url = env.SITE_URL;
        }
      }
      // Fallback if seo.url still empty
      if (!config.seo || !config.seo.url) {
        config.seo = config.seo || {};
        try { config.seo.url = window.location.origin + '/'; } catch (e) {}
      }
      renderSEO(config.seo);
      renderHeaderFooter(config);
      renderHero(config);
      renderServices(config);
      renderForm(config);
      renderFooterTelMail(config);
      renderBrandText(config);
    } catch (err) {
      console.error(err);
    }
  }

  // Defer until DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


