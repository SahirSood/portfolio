# SEO And Content Rules

## Source Of Truth

Use `src/seo/siteConfig.js` for shared metadata, canonical routes, sitemap fields, and structured-data content. Keep it aligned with visible React content in `src/App.jsx`.

If a claim appears in metadata or JSON-LD, it should also be visible or clearly supported by visible page content.

## Factual Boundaries

Do not invent:

- job titles
- employment dates
- employers
- school details
- awards
- metrics
- user counts
- project outcomes
- locations
- social profiles
- contact details

If a fact is uncertain, either omit it or ask the user to confirm it.

## Entity Consistency

Use the spelling `Sahir Sood`.

Keep these consistent across visible content, metadata, and structured data:

- professional title
- profile image
- GitHub URL
- LinkedIn URL
- email
- SFU and University of Leeds references
- RBC, RedBrick/Paved, MotherTongue, and Kapali references
- project names and technologies

## Route Rules

Only create indexable routes when there is enough meaningful content. Do not create thin keyword pages for variations like `Sahir`, `Sood`, or repeated search phrases.

Routes that are useful to visitors but not strong search landing pages can exist with `noindex,follow`, as `/search` and `/snake` do.

## Metadata Requirements

Each indexable route needs:

- unique title
- unique description
- self-referencing canonical URL
- robots metadata
- Open Graph metadata
- Twitter card metadata
- one static H1
- relevant internal links
- sitemap inclusion

Homepage JSON-LD uses `ProfilePage` with a `Person` main entity. Other pages use conservative `WebPage` JSON-LD.

## Crawl Files

`scripts/prerender-seo.mjs` generates `robots.txt` and `sitemap.xml` during `npm run build`.

Do not manually edit generated `dist/robots.txt` or `dist/sitemap.xml`. Edit source data or scripts instead.

## Content Quality

Write naturally for people first. Good content should answer:

- Who is Sahir?
- What does he build?
- What technologies does he use?
- Where has he worked?
- What did he contribute?
- What projects has he completed?
- How can someone verify or contact him?

Avoid generic filler. It is better to have a shorter truthful section than a padded section that sounds synthetic.

## Images

- Use descriptive alt text when an image conveys meaning.
- Use empty alt text for decorative images.
- Add width and height where possible.
- Do not describe an image as Sahir unless it actually depicts Sahir.
- Future social image target: 1200 by 630 PNG or JPG.
