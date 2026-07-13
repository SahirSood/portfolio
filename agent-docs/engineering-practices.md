# Engineering Practices

## Working Style

- Read existing code before editing.
- Keep changes scoped to the user request.
- Prefer existing patterns and helpers over new abstractions.
- Use `rg` for search.
- Use `apply_patch` for manual file edits.
- Do not revert user changes unless explicitly asked.

## Validation

For meaningful changes, run:

```sh
npm run lint
npm run build
npm run seo:check
```

When routing or SEO changes, also inspect generated files in `dist`, especially:

- `dist/index.html`
- one representative route such as `dist/projects/index.html`
- `dist/robots.txt`
- `dist/sitemap.xml`
- `dist/404.html`

For route behavior, use `npm run preview -- --host 127.0.0.1` and verify clean URLs return correct route HTML while unknown URLs return 404.

## Security And Privacy

- Do not add secrets, tokens, private keys, tracking IDs, or verification codes unless the user provides them for that exact purpose.
- Keep search-console verification configurable through environment variables.
- Do not install analytics by default. If analytics is requested, prefer lightweight, privacy-conscious measurement.
- Avoid adding third-party scripts that block rendering or collect unnecessary personal data.
- Treat email and public profile links as intentionally published because they are already visible in the portfolio.

## SEO Practices

SEO work must follow Google-friendly practices:

- No keyword stuffing.
- No hidden crawler-only text.
- No doorway pages.
- No fake schema, reviews, ratings, awards, employment, education, or metrics.
- No deceptive user-agent-based rendering.
- Canonical routes must be stable and self-referencing.

## Accessibility Practices

- Use semantic HTML where practical.
- Navigation to pages should be anchors.
- Actions should be buttons.
- Decorative icons should not be focusable controls.
- Buttons and icon-only controls need accessible labels.
- Avoid hover-only access to important content.
- Keep focus states visible.

## Git Practices

- Check `git status --short --branch` before committing.
- Keep commits minimal and coherent.
- Do not include generated `dist` output unless the repository already tracks it and the user explicitly wants it.
- If the branch is already ahead of origin, pushing will also publish those existing commits. Mention that in the final summary.

## Documentation Practices

Update docs when changing:

- architecture or routing
- build scripts
- SEO metadata/structured data
- deployment requirements
- content source-of-truth conventions
- UI/UX conventions
- validation commands

If documentation would become duplicated, link to the source of truth instead of repeating everything.
