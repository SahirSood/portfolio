# SEO Implementation Notes

This portfolio is a Vite React app with a themed browser-style UI. The production build now keeps the React experience, but also generates crawlable static HTML for every meaningful public route.

For broader contributor and agent workflow, read `AGENTS.md` and the files in `agent-docs/`.

## Site Configuration

Central SEO data lives in `src/seo/siteConfig.js`.

Set these environment variables in production:

- `VITE_SITE_URL`: canonical production origin. The current production build uses `https://sahirsood.netlify.app`; update this before deployment if the site moves to a custom domain.
- `VITE_GOOGLE_SITE_VERIFICATION`: optional Google Search Console verification token.
- `VITE_BING_SITE_VERIFICATION`: optional Bing Webmaster Tools verification token. This renders as `msvalidate.01`.

Do not add verification tokens unless they come from the actual webmaster tools account.
The current Google Search Console token and Netlify production origin are stored in `.env.production`; the SEO prerender and check scripts load Vite env files so the generated homepage, sitemap, robots file, and canonical URLs match the deployed site.

## Metadata Architecture

`npm run build` runs:

1. `vite build`
2. `node scripts/prerender-seo.mjs`

The prerender script reads `dist/index.html`, injects route-specific metadata, and writes static HTML files for:

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
- `/search` with `noindex,follow`
- `/snake` with `noindex,follow`
- `/404.html` with `noindex,follow`

For static-server compatibility, the build also writes companion files such as `about.html` and `experience/rbc.html`. Those files contain the same canonical tags as their clean URLs, and Netlify redirects are configured so `.html` URLs are not preferred in production.

Every indexable page gets one title, one meta description, one canonical URL, Open Graph tags, Twitter card tags, robots metadata, and JSON-LD.

The React app also updates `document.title` and the meta description during client-side navigation, but the important SEO metadata is generated at build time and exists in the HTML before JavaScript runs.

## Structured Data

The homepage includes JSON-LD using:

- `ProfilePage`
- `mainEntity`
- `Person`

The `Person` entity uses a stable ID: `${VITE_SITE_URL}/#person`.

The profile page entity uses: `${VITE_SITE_URL}/#profile-page`.

Only facts already visible in the portfolio are included: Sahir Sood's name, software developer role, public GitHub and LinkedIn URLs, email, SFU and University of Leeds education references, RBC current work reference, technical topics, and the professional headshot in `public/img/sahir-sood-professional-headshot.jpg`.

Other pages use conservative `WebPage` JSON-LD that points back to the same Person entity.

## Sitemap and Robots

`scripts/prerender-seo.mjs` creates:

- `dist/robots.txt`
- `dist/sitemap.xml`

`robots.txt` allows crawling and points to the absolute sitemap URL.

`sitemap.xml` includes only canonical indexable routes. It excludes `/search`, `/snake`, and `/404.html`.

`lastmod` values are manually maintained in `src/seo/siteConfig.js`. Update them only when the corresponding content actually changes.

## Routing and Deployment

The app now supports real paths instead of hash-only routes. Internal navigation uses normal `<a href="">` links and intercepts clicks for smooth React navigation.

`public/_redirects` is set up for Netlify-style hosting:

- `/profile` redirects to `/about`
- `/newtab` redirects to `/`
- `/experience/paved` redirects to `/experience/redbrick-paved`
- all unknown URLs return `/404.html` with HTTP 404

If deploying somewhere other than Netlify, configure equivalent behavior:

1. Serve existing static route files directly.
2. Do not rewrite every unknown URL to `/index.html` with HTTP 200.
3. Return `404.html` with HTTP 404 for unknown URLs.
4. Enforce HTTPS.
5. Keep the selected canonical host consistent with `VITE_SITE_URL`.

## Search Console Setup

1. Deploy the production build with `VITE_SITE_URL` set to the final canonical domain, currently `https://sahirsood.netlify.app`.
2. Add the domain property in Google Search Console.
3. If using meta-tag verification, set `VITE_GOOGLE_SITE_VERIFICATION` and redeploy.
4. Submit `${VITE_SITE_URL}/sitemap.xml`.
5. Use URL Inspection for `${VITE_SITE_URL}/`.
6. Request indexing for the homepage after verifying the rendered HTML.
7. Test `${VITE_SITE_URL}/` with Google's Rich Results Test and confirm the `ProfilePage` and `Person` JSON-LD parse cleanly.
8. Inspect `/about`, `/experience`, `/projects`, `/resume`, and `/contact`.
9. Monitor queries for Sahir, Sahir Sood, Sahir Sood developer, Sahir Sood portfolio, SFU, RBC, and project-related searches.
10. Update Sahir's GitHub, LinkedIn, resume, and any public profile pages so they link back to the canonical portfolio domain.

## Bing Setup

1. Add the site in Bing Webmaster Tools.
2. Import from Google Search Console or use meta-tag verification.
3. If using meta-tag verification, set `VITE_BING_SITE_VERIFICATION` and redeploy.
4. Submit `${VITE_SITE_URL}/sitemap.xml`.
5. Use Bing's URL inspection tools for the homepage and main portfolio routes.

## Testing

Run:

```sh
npm run lint
npm run build
npm run seo:check
```

After deployment, also verify:

- `view-source:${VITE_SITE_URL}/` contains Sahir Sood, the primary heading, meaningful biography, experience/project text, canonical URL, meta description, social tags, and ProfilePage/Person JSON-LD.
- `/robots.txt` returns HTTP 200.
- `/sitemap.xml` returns HTTP 200 and contains only canonical indexable routes.
- `/does-not-exist` returns HTTP 404, not a fake homepage.
- Direct refresh works on `/about`, `/experience`, `/projects`, `/projects/ai-trading-arena`, `/resume`, `/contact`, and the experience detail routes.

## Analytics

No analytics provider was added. If analytics is added later, prefer privacy-conscious tracking that does not block rendering. Useful events would be organic landing pages, search-engine referrals, project-link clicks, GitHub and LinkedIn outbound clicks, and email/contact actions.

## Ongoing Maintenance

- Keep `src/seo/siteConfig.js` and visible page content in agreement.
- When adding or featuring projects, update both the visible `PROJECTS` data in `src/App.jsx` and the relevant project/home route copy in `src/seo/siteConfig.js`.
- Do not add schema for facts, awards, roles, ratings, reviews, or metrics unless they are true and visible.
- Add project detail pages only when there is enough real case-study content: problem, role, technologies, decisions, challenges, outcome, screenshots, and links.
- Keep the portrait in `public/img/sahir-sood-professional-headshot.jpg`, the 1200 by 630 social preview in `public/img/sahir-sood-professional-headshot-social.jpg`, and the site icons in `public/img/sahir-sood-headshot-icon-*.png`.
- Update `lastmod` dates only when content materially changes.
- Re-run `npm run build` and `npm run seo:check` before deploying.
