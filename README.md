# 🌿 AurumForest — Luxury Travel & Expedition

> *Where the World Reveals Itself*

A luxury travel landing page with a real-Earth 3D globe, animated flight paths, an AI travel concierge, time-of-day theming, and magnetic UI. Pure HTML/CSS/JS — **no build step, no npm**.

**Live demo:** https://YOUR_USERNAME.github.io/aurumforest/

---

## Project structure

```
aurumforest/
├── index.html            # Markup only — links the CSS and JS below
├── css/
│   ├── variables.css     # Design tokens + Dawn/Dusk/Night theme overrides
│   ├── base.css          # Reset, body, scrollbar
│   ├── cursor.css        # Custom cursor
│   ├── time-badge.css    # Day/night mode badge
│   ├── navbar.css
│   ├── hero.css
│   ├── sections.css      # Shared section/heading/reveal styles
│   ├── destinations.css  # Card slider
│   ├── globe.css
│   ├── itinerary.css     # Timeline
│   ├── gallery.css       # Masonry + stats
│   ├── footer.css
│   ├── concierge.css     # AI chat panel
│   └── responsive.css    # All media queries (must load last)
├── js/
│   ├── data.js           # Destinations, itinerary, gallery content  ← edit content here
│   ├── cursor.js         # Custom cursor + cHover() helper
│   ├── golden-hour.js    # Time/geolocation theme engine
│   ├── navbar.js         # Scroll blur
│   ├── render.js         # Builds cards, timeline, gallery from data.js
│   ├── globe.js          # Three.js Earth, pins, flight arcs
│   ├── animations.js     # GSAP + ScrollTrigger
│   ├── magnetic.js       # Magnetic buttons
│   ├── concierge.js      # AI concierge (Claude API)
│   ├── interactions.js   # Search, Quick Book, newsletter, toasts
│   └── observers.js      # Scroll-reveal observers
├── legacy/react-prototype/   # Early React/Tailwind version (not used by the site)
├── README.md
├── GITHUB_GUIDE.md
└── .gitignore
```

**Load order matters.** `index.html` loads CSS as *variables → base → components → responsive*, and JS as *data → utilities (`cursor.js` defines `cHover`) → features → wiring*. If you add a file, keep that order.

## Run locally

```bash
git clone https://github.com/YOUR_USERNAME/aurumforest.git
cd aurumforest
npx serve .        # or just open index.html
```

## Where to change things

| I want to… | Edit |
|---|---|
| Change destinations, prices, gallery, itinerary | `js/data.js` |
| Change colours / Dawn-Dusk-Night palettes | `css/variables.css` |
| Change globe pins or flight origin | `GD` / `HOME` in `js/globe.js` |
| Change the AI's personality | `SYS` prompt in `js/concierge.js` |
| Change mobile layout | `css/responsive.css` |

## AI Concierge

Click the chat button and paste an Anthropic API key (`sk-ant-…`). It is stored only in your browser's `localStorage`. Because the key is entered client-side, this suits demos and portfolios; for a public production site, route requests through a small backend proxy so no key reaches the browser.

## Deploy

See [GITHUB_GUIDE.md](./GITHUB_GUIDE.md) for GitHub Pages setup.

---
*© 2026 AurumForest Ltd*
