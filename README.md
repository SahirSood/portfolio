# Sahir Sood Portfolio
https://sahirsood.com/
sahirsood.com/
https://sahirsood.com/about
https://sahirsood.com/experience

React/Vite portfolio for Sahir Sood with a browser/search-inspired UI, build-time SEO prerendering, clean public routes, structured data, sitemap, robots file, and Netlify-style routing rules.

## Portfolio analytics

The portfolio has its own Netlify Function and Netlify Blobs store, separate from the AI Trading Arena analytics API.

- Browser events post to `/portfolio-analytics/event`.
- Private summaries are available at `/portfolio-analytics/summary?days=30`.
- Set `PORTFOLIO_ANALYTICS_KEY` in Netlify and pass it as the `X-Portfolio-Analytics-Key` header when reading summaries.
- Optional: set `PORTFOLIO_ANALYTICS_SALT` in Netlify so visitor hashes are stable but not derived from the access key.
- LinkedIn profile/featured links should use `https://sahirsood.com/linkedin-portfolio.html`; that handoff page records `utm_source=linkedin`, `utm_medium=profile`, and `utm_campaign=portfolio_profile`, then opens the About page.

Example summary request:

```powershell
Invoke-RestMethod "https://sahirsood.com/portfolio-analytics/summary?days=30" -Headers @{ "X-Portfolio-Analytics-Key" = $env:PORTFOLIO_ANALYTICS_KEY }
```

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
