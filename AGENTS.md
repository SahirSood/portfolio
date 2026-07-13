# Agent Instructions

Start here before editing this repository.

This is Sahir Sood's React/Vite portfolio. It is a personal portfolio, SEO-sensitive public site, and playful browser/search-themed UI. Treat factual accuracy, accessibility, crawlability, and visual polish as product requirements, not optional cleanup.

## Read These Docs

Before making changes, read the relevant files in `agent-docs/`:

- `agent-docs/project-overview.md` for architecture, routes, and file ownership.
- `agent-docs/engineering-practices.md` for coding, testing, security, and change workflow.
- `agent-docs/seo-and-content.md` for metadata, structured data, crawl files, and factual-content rules.
- `agent-docs/ui-ux-checklist.md` for design and interaction expectations.
- `SEO.md` for the current SEO implementation and deployment/search-console process.

## Documentation Rule

When you change behavior, architecture, routes, SEO data, deployment behavior, scripts, UI conventions, or project structure, update the relevant docs in the same change. If no doc update is needed, be prepared to say why.

## Core Guardrails

- Do not fabricate facts about Sahir Sood, employers, education, projects, dates, metrics, awards, or profiles.
- Do not keyword-stuff, hide crawler-only text, add doorway pages, or serve deceptive bot-specific content.
- Preserve the browser/search portfolio concept unless the user explicitly asks for a redesign.
- Keep links crawlable with real `href` values when they navigate to public content.
- Keep one clear H1 per static SEO route.
- Run `npm run lint`, `npm run build`, and `npm run seo:check` after meaningful changes.
- If routes, metadata, or indexed content changes, inspect generated `dist` HTML, not only React source.

## Commit Rule

Prefer the fewest commits that still tell a clean story. Do not mix unrelated cleanup with risky feature work unless the user asks for one final squashed commit.
