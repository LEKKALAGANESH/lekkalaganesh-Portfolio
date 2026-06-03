# Lekkala Ganesh — Portfolio

A modern, dark-themed developer portfolio built with vanilla HTML, CSS, and JavaScript. Zero dependencies. Zero build step. Instant deploy.

**Live:** [lekkalaganesh.vercel.app](https://lekkalaganesh.vercel.app)

---

## Features

- **Dark glassmorphism design** — `#0a0a0f` background, cyan/purple accents, backdrop-blur cards
- **Canvas particle system** — Section-aware animated background with 7 unique movement patterns (network, breathe, matrix, rise, constellation, orbit, firefly)
- **Typewriter effect** — Cycling role titles in the hero section
- **Scroll animations** — Intersection Observer-powered fade-in reveals with staggered delays
- **Fully responsive** — Optimized breakpoints from 320px mobile to 3840px 4K displays
- **Accessible** — Semantic HTML5, ARIA labels, keyboard navigation, `prefers-reduced-motion` support
- **SEO ready** — Open Graph, Twitter Card meta tags, JSON-LD Person schema, `robots.txt`, `sitemap.xml`
- **Contact form** — Powered by Formspree (no backend required)
- **Lighthouse 95+** — Under 300KB total payload, all JS deferred

## Tech Stack

| Layer         | Technology                                               |
| ------------- | -------------------------------------------------------- |
| Markup        | HTML5 (semantic)                                         |
| Styling       | CSS3 (custom properties, grid, flexbox, backdrop-filter) |
| Interactivity | Vanilla JavaScript (ES6+)                                |
| Fonts         | Inter, JetBrains Mono (Google Fonts)                     |
| Form Backend  | Formspree                                                |
| Deployment    | Vercel / GitHub Pages                                    |

## Project Structure

```
portfolio/
├── index.html                 # Single-page application
├── css/
│   ├── style.css              # Layout, typography, dark theme, glass cards
│   ├── animations.css         # Keyframes, scroll animation classes
│   └── responsive.css         # Breakpoints: 480px → 768px → 1024px → 1440px → 1920px → 2560px
├── js/
│   ├── main.js                # Navigation, scroll observers, mobile menu
│   ├── particles.js           # Canvas particle background (section-aware)
│   └── typewriter.js          # Hero subtitle typing effect
├── assets/
│   ├── ganesh.jpeg             # Profile photo
│   └── resume/
│       └── Lekkala_Ganesh_Resume.pdf
├── robots.txt
├── sitemap.xml
├── LICENSE
└── README.md
```

## Sections

1. **Navigation** — Fixed header with blur-on-scroll, mobile hamburger menu
2. **Hero** — Animated particles, typewriter roles, CTA buttons, social links
3. **About** — Professional summary, key metrics (multiple apps, 75% VRAM reduction, 40% fewer accessibility findings, 95%+ ML accuracy)
4. **Skills** — 6 glass-morphism cards: AI/LLMOps, Platform, Product Delivery, Cloud/DevOps, Quality, Enterprise/JVM Stack
5. **Experience** — Vertical timeline with gradient line and pulse indicator for current role
6. **Projects** — 3 featured cards + 7 smaller project cards with live/GitHub links
7. **Education** — B.Tech CSE from Parul University
8. **Contact** — Email, social links, and Formspree contact form

## Getting Started

No build tools required. Just open the file or serve it:

```bash
# Option 1: Open directly
open index.html

# Option 2: Local server (Python)
python -m http.server 3000

# Option 3: Local server (Node)
npx serve .
```

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### GitHub Pages

1. Push the `portfolio/` directory to a GitHub repository
2. Go to **Settings** > **Pages**
3. Set source to the branch containing `index.html`
4. Your site will be live at `https://<username>.github.io/<repo>`

## Performance

| Metric                 | Target              |
| ---------------------- | ------------------- |
| Total size             | < 300KB             |
| Lighthouse Performance | 95+                 |
| First Contentful Paint | < 1s                |
| No JS frameworks       | 0KB bundle overhead |

## Customization

All design tokens are in CSS custom properties at the top of `css/style.css`:

```css
:root {
  --bg-primary: #0a0a0f;
  --accent-cyan: #00d4ff;
  --accent-purple: #7c3aed;
  --container-max: 1200px;
  /* ... */
}
```

Particle behavior per section can be configured in `js/particles.js` via the `PATTERNS` and `COUNTS` objects.

## License

This project is licensed under the [MIT License](LICENSE).

---

Built by [Lekkala Ganesh](https://github.com/LEKKALAGANESH)
