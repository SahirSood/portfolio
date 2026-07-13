# UI And UX Checklist

## Design Intent

The site should feel like a polished browser/search portfolio, not a generic resume page. Preserve the Chrome/search metaphor, colorful shortcuts, results pages, knowledge-panel style content, travel map, and playful game route unless the user asks for a redesign.

## Interaction Rules

- Public navigation should use anchors with real `href` values.
- UI actions should use buttons with working handlers.
- Do not leave visible buttons that do nothing.
- If an icon is decorative, render it as a non-interactive element.
- Icon-only controls need `aria-label`.
- Form inputs need accessible labels or `aria-label`.
- External links should use `target="_blank"` and `rel="noreferrer"` when opening a new tab.

## Browser Chrome Controls

The fake browser controls should still behave enough to avoid frustration:

- Back and forward should use browser history.
- Refresh should reload the current page.
- New tab should navigate to the home/new-tab experience.
- Search/AI controls should run a portfolio search or clearly be decorative.

## Responsive Rules

- Important biography, experience, project, and contact content must remain available on mobile.
- Avoid hover-only content for essential information.
- Keep tap targets comfortable.
- Avoid text overflowing buttons, cards, and compact browser chrome areas.
- Do not add heavy decorative backgrounds that obscure the portfolio content.

## Accessibility Pass

Before shipping UI changes, scan for:

- one main landmark in the active React app
- reasonable heading order
- descriptive link text
- focus states on links/buttons
- useful alt text
- no dead buttons
- keyboard-accessible navigation
- no interaction that requires hover only

## Engagement Improvements

Prefer improvements that help visitors reach useful content faster:

- clearer labels
- stronger first-screen identity
- useful project summaries
- more direct contact paths
- better route links from related pages
- fewer decorative controls that pretend to be features

Avoid adding more animation, novelty, or visual noise unless it improves comprehension or delight without slowing the site.
