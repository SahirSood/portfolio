# Sahir Sood Portfolio
https://sahirsood.com/
sahirsood.com/
https://sahirsood.com/about
https://sahirsood.com/experience

React/Vite portfolio for Sahir Sood with a browser/search-inspired UI, build-time SEO prerendering, clean public routes, structured data, sitemap, robots file, and Netlify-style routing rules.

## Start Here

Future agents and contributors should read:

- `AGENTS.md`
- `agent-docs/project-overview.md`
- `agent-docs/engineering-practices.md`
- `agent-docs/seo-and-content.md`
- `agent-docs/ui-ux-checklist.md`
- `SEO.md`

## Scripts

```sh
npm run dev
npm run lint
npm run build
npm run seo:check
npm run preview -- --host 127.0.0.1
```

`npm run build` runs Vite and then `scripts/prerender-seo.mjs`, which generates crawlable route HTML, `robots.txt`, `sitemap.xml`, and `404.html`.

## Environment Variables

- `VITE_SITE_URL`: canonical production origin.
- `VITE_GOOGLE_SITE_VERIFICATION`: optional Google Search Console token.
- `VITE_BING_SITE_VERIFICATION`: optional Bing Webmaster Tools token.

## Validation Before Deploy

Run:

```sh
npm run lint
npm run build
npm run seo:check
```

Then preview and spot-check clean routes such as `/`, `/about`, `/experience`, `/projects`, `/contact`, `/robots.txt`, `/sitemap.xml`, and an unknown URL for 404 behavior.
