# UrMoments Website - AI Prompt / Design Specification

This file contains the **design requirements** for generating the UrMoments marketing website.  
The AI agent should follow these instructions when creating the HTML, CSS (Tailwind), and JS files.

---

## 🏷 Brand
- **Name:** UrMoments  
- **Tagline:** *Your moments, our promise.*  
- **Tone:** Warm, trustworthy, family-centric.  
- **Colors (Tailwind):**
  - Primary: `rose-500` / `rose-600` accents  
  - Neutrals: `slate-900 / slate-700 / slate-500`  
  - Backgrounds: `slate-50` / `white`  
- **Font:** System UI (Tailwind defaults)

---

## 🌐 Tech & Structure
- Plain **HTML + Tailwind via CDN** + minimal **vanilla JS**  
- No build tools or frameworks required  
- **Mobile-first design** (most users will browse on phones)  
- Accessible, fast, SEO-ready  

**Pages:**
- `/index.html` → Home page  
- `/services.html` → Services page  
- `/assets/` → placeholder images  

---

## 🖥 Global UI
- Sticky header with logo wordmark **UrMoments** and nav links: Home, Services, Contact  
- Mobile navigation: hamburger → slide-over menu  
- Footer:
  - Mini nav  
  - Instagram placeholder  
  - Copyright  

---

## 🏠 Home Page (`index.html`)
### Hero
- H1: “Birthday decorations made easy.”  
- Subtext: “From balloons to backdrops, we style your celebration end-to-end across London.”  
- Buttons:
  - **Get a Quote** → scroll to Contact form  
  - **View Services** → `/services.html`  

### Highlights (cards with emojis)
- Theme-ready packages  
- Set-up & clean-up included  
- On time, every time  
- Add-ons: photography, cake & more  

### Featured Gallery
- 6 images in a grid (`/assets/gallery1.jpg` … `/assets/gallery6.jpg`)  
- Tap-to-enlarge (vanilla JS lightbox)  

### Trust Blurb
- Short paragraph about family-style care and managing small events for the UK Indian diaspora  

### Contact Form
Fields:
- Full Name (text, required)  
- Email (email, required)  
- Postcode (text, required)  
- Budget (select: `<£300`, `£300-£600`, `£600-£1000`, `£1000+`)  
- Type of Event / Description (textarea, required; placeholder: “e.g., 1st birthday in Harrow, soft pastel theme…”)  
- GDPR consent checkbox (required): “I agree to be contacted about my enquiry.”  

Submit:
- POST to **Formspree** (add `TODO` for action URL)  
- Show success/failure without page reload  

---

## 📦 Services Page (`services.html`)
### Header
- H1: “Services & Packages”  
- Intro: short paragraph (“Pick a starting package; we tailor to your theme and venue.”)  

### Packages (cards)
- **Basic** - Balloon garland, backdrop stand, signage. *From £249*  
- **Premium** - Larger backdrop, themed props, table styling. *From £449*  
- **Deluxe** - Feature wall, ceiling décor, custom signage. *From £799*  
- Each card: bullet list + “Enquire” button → scroll to Contact form  

### Add-ons Section
- Photographer  
- Cake  
- Catering  
- Venue sourcing  
- Return gifts  

### Mini Gallery
- 4 images for variety  

### Contact Form
- Same as Home page  
- Shared Formspree endpoint  

---

## 📱 Mobile-First Design
- Design for **360-414px** width first  
- Touch-friendly tap targets (min 44px height)  
- Sticky “Get a Quote” button visible on mobile  
- Images with `aspect-[ratio]` utilities and `loading="lazy"`  

---

## ♿ Accessibility
- Proper `<label for>` on all inputs  
- `aria-expanded` for mobile menu/lightbox  
- Keyboard navigable  
- Alt text on all images  

---

## 🔍 SEO & Meta
- `<title>`:
  - Home: “UrMoments - Birthday Decorations in London | Your moments, our promise.”  
  - Services: “UrMoments Services - Packages & Add-ons”  
- Meta description (Home):  
  “UrMoments creates stylish, stress-free birthday decorations in London. Theme packages, set-up & clean-up, optional add-ons like photography and cake. Get a fast quote.”  
- Open Graph & Twitter meta using `/assets/og-cover.jpg`  
- JSON-LD schema: `LocalBusiness` with:
  - name: UrMoments  
  - area served: London  
  - email: hello@UrMoments.co.uk  
  - telephone: placeholder  

---

## ✨ Nice Touches
- Smooth scrolling for anchors  
- Subtle scroll-reveal animations with CSS/JS  
- Visible focus rings and interactive states  

---

## ✅ Deliverables
- `/index.html`  
- `/services.html`  
- `/assets/*` (placeholders)  
- Clear TODOs for:
  - Formspree endpoint  
  - Gallery image swaps  
  - Packages/pricing updates  

---

## 🎯 Success Criteria
- Lighthouse: good performance & accessibility  
- Fully mobile-usable (header, nav, forms, gallery)  
- Contact form works with validation and shows success/failure inline  
- Site degrades gracefully if JS is off (form still posts)
