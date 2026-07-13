# Project Overview

## What This Is

This repository is Sahir Sood's personal portfolio. It is built as a Vite React app with a Google Chrome/search-inspired interface. The public site needs to work for humans, crawlers, link previews, and AI answer engines.

The experience is intentionally playful, but the underlying content is professional and factual: Sahir's software experience, projects, skills, education, resume-style summary, contact links, travel map, and a small Snake easter egg.

## Stack

- Vite
- React
- Tailwind CSS
- lucide-react icons
- Build-time SEO prerendering through custom Node scripts
- Netlify-style `_redirects` for production routing behavior

## Important Files

- `src/App.jsx`: primary React UI, content arrays, route rendering, browser-themed pages, games/map interactions.
- `src/seo/siteConfig.js`: canonical site config, SEO route definitions, route paths, metadata content, sitemap fields.
- `scripts/prerender-seo.mjs`: post-build static HTML generator for routes, metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and `404.html`.
- `scripts/check-seo.mjs`: generated-output validation for metadata, JSON-LD, sitemap, robots, canonicals, and required homepage content.
- `index.html`: Vite shell plus static SEO fallback markers used by the prerender script.
- `public/_redirects`: production clean-URL redirects and 404 handling.
- `SEO.md`: deployment, search-console, and SEO maintenance instructions.

## Public Routes

Indexable:

- `/`
- `/about`
- `/education`
- `/experience`
- `/experience/rbc`
- `/experience/redbrick-paved`
- `/experience/mothertongue`
- `/projects`
- `/projects/ai-trading-arena`
- `/skills`
- `/resume`
- `/contact`
- `/map`

Generated but not indexable:

- `/search`
- `/snake`
- `/404.html`

The build also writes `.html` companion files for static-server compatibility, but canonical URLs remain the clean paths.

## Route Flow

React navigation uses real `href` values and intercepts clicks for smooth client-side navigation. Do not replace public navigation with button-only state changes. If a control navigates to public content, use an anchor with a valid `href`.

`vite.config.js` uses `appType: "mpa"` so preview/static serving does not fake every unknown URL as the homepage. Unknown URLs should return 404.

## When Adding Content

Add facts once in the most appropriate source of truth and keep visible content, SEO route content, and structured data consistent. For larger new sections or routes, update:

- `src/App.jsx`
- `src/seo/siteConfig.js`
- `scripts/check-seo.mjs` only if validation requirements change
- `SEO.md` and relevant `agent-docs/` files
