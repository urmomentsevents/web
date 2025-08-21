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
    // Full banner
    const banner = config.heroBanner || {};
    const imgEl = document.getElementById('hero-banner-img');
    if (imgEl && banner.image) imgEl.src = banner.image;
    const headline = document.getElementById('hero-headline');
    if (headline && banner.headline) headline.textContent = banner.headline;
    const subhead = document.getElementById('hero-subhead');
    if (subhead && banner.subhead) subhead.textContent = banner.subhead;
    const points = document.getElementById('hero-points');
    if (points && Array.isArray(banner.points)) {
      points.innerHTML = '';
      banner.points.forEach((p) => {
        const li = document.createElement('li');
        li.className = 'inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 backdrop-blur';
        li.textContent = p;
        points.appendChild(li);
      });
    }

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
      card.className = 'reveal revealed rounded-xl bg-white p-6 shadow ring-1 ring-slate-200 flex flex-col';
      const popularBadge = svc.popular ? '<span class="ml-2 inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-100">Most popular</span>' : '';
      const tags = Array.isArray(svc.tags) ? `<div class=\"mt-3 flex flex-wrap gap-2\">${svc.tags.map(t => `<span class=\"inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200\">${t}</span>`).join('')}</div>` : '';
      const features = Array.isArray(svc.features) ? `<ul class=\"mt-3 list-disc list-inside text-sm text-slate-700 space-y-1\">${svc.features.map(f => `<li>${f}</li>`).join('')}</ul>` : '';
      card.innerHTML = `
        <img src="${svc.image}" alt="${svc.title}" loading="lazy" class="aspect-[4/3] w-full rounded-lg object-cover ring-1 ring-slate-200"/>
        <div class="mt-4 flex items-center">
          <h3 class="text-lg font-semibold">${svc.title}</h3>
          ${popularBadge}
        </div>
        ${svc.price ? `<p class=\"mt-1 text-sm text-slate-600\">${svc.price}</p>` : ''}
        <p class="mt-2 text-sm text-slate-700">${svc.description}</p>
        ${features}
        ${tags}
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

  function renderAddOns(config) {
    const chips = document.getElementById('addons-chips');
    if (!chips || !Array.isArray(config.addOns)) return;
    chips.innerHTML = '';
    config.addOns.forEach(({ label, icon }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'select-none inline-flex items-center gap-1 px-3 py-2 rounded-full ring-1 ring-slate-200 bg-slate-50 text-slate-700 text-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500';
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = '';
      btn.innerHTML = `${icon || ''} <span>${label}</span>`;
      btn.addEventListener('click', () => {
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!pressed));
        btn.classList.toggle('bg-rose-50');
        btn.classList.toggle('text-rose-700');
        // Prefill description
        const selected = Array.from(chips.querySelectorAll('button[aria-pressed="true"] span')).map(s => s.textContent);
        const desc = document.getElementById('description');
        if (desc) {
          const base = desc.value.replace(/\n?Add-ons:.*/i, '').trim();
          const addonsLine = selected.length ? `\nAdd-ons: ${selected.join(', ')}` : '';
          desc.value = base + addonsLine;
        }
      });
      chips.appendChild(btn);
    });
  }

  function renderTestimonials(config) {
    const track = document.getElementById('testimonials-track');
    if (!track || !Array.isArray(config.testimonials)) return;
    track.innerHTML = '';
    const palettes = [
      { bg: 'from-rose-50 to-white', ring: 'ring-rose-100' },
      { bg: 'from-sky-50 to-white', ring: 'ring-sky-100' },
      { bg: 'from-amber-50 to-white', ring: 'ring-amber-100' },
      { bg: 'from-emerald-50 to-white', ring: 'ring-emerald-100' },
      { bg: 'from-slate-50 to-white', ring: 'ring-slate-200' }
    ];
    config.testimonials.forEach((t, i) => {
      const palette = palettes[i % palettes.length];
      const card = document.createElement('article');
      card.className = `snap-center min-w-[85%] sm:min-w-[45%] md:min-w-[32%] rounded-xl bg-gradient-to-b ${palette.bg} p-6 shadow-sm hover:shadow-md transition-shadow ring-1 ${palette.ring} border border-slate-200`;
      card.innerHTML = `
        <p class="text-slate-700">“${t.text}”</p>
        <div class="mt-4 text-sm text-slate-600">- ${t.name}${t.area ? `, ${t.area}` : ''}</div>`;
      track.appendChild(card);
    });

    // Auto-scroll loop unless hovered
    // Dots
    const dotsWrap = document.getElementById('testimonials-dots');
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      config.testimonials.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'h-2.5 w-2.5 rounded-full bg-slate-300 aria-selected:bg-rose-500';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          const x = Math.floor(i * (track.scrollWidth / config.testimonials.length));
          track.scrollTo({ left: x, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
      });
    }

    let autoScrollId;
    const start = () => { /* auto-scroll disabled by request */ };
    const stop = () => { if (autoScrollId) { clearInterval(autoScrollId); autoScrollId = undefined; } };

    const updateDots = () => {
      if (!dotsWrap) return;
      const total = config.testimonials.length;
      const idx = Math.round((track.scrollLeft / track.scrollWidth) * total);
      Array.from(dotsWrap.children).forEach((d, i) => d.setAttribute('aria-selected', String(i === idx)));
    };

    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', stop);
    track.addEventListener('scroll', updateDots, { passive: true });
    updateDots();

    // Desktop arrows
    const prev = document.getElementById('testimonials-prev');
    const next = document.getElementById('testimonials-next');
    if (prev && next) {
      prev.addEventListener('click', () => {
        stop();
        const pos = Math.max(0, track.scrollLeft - track.clientWidth);
        track.scrollTo({ left: pos, behavior: 'smooth' });
      });
      next.addEventListener('click', () => {
        stop();
        const max = track.scrollWidth - track.clientWidth;
        const pos = Math.min(max, track.scrollLeft + track.clientWidth);
        track.scrollTo({ left: pos, behavior: 'smooth' });
      });
    }
  }

  function renderFAQ(config) {
    const faq = document.getElementById('faq');
    if (!faq || !Array.isArray(config.faq)) return;
    faq.innerHTML = '';
    config.faq.forEach(({ q, a }, idx) => {
      const item = document.createElement('details');
      item.className = 'group';
      if (idx === 0) item.setAttribute('open', 'open');
      item.innerHTML = `
        <summary class="cursor-pointer select-none px-4 py-3 text-slate-900 font-medium outline-none focus-visible:ring-2 focus-visible:ring-rose-500">${q}</summary>
        <div class="px-4 pb-4 text-slate-700">${a}</div>`;
      faq.appendChild(item);
    });
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
      renderAddOns(config);
      renderForm(config);
      renderFooterTelMail(config);
      renderBrandText(config);
      renderTestimonials(config);
      renderFAQ(config);
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


