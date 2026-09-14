# Nav

**NavBar**, its **MobileDrawer** companion, and **Footer**. Open [`index.html`](./index.html)
for the live-rendered catalog.

---

## NavBar — `.site-header` / `.nav`

- **Header wrapper:** `position: sticky; top: 14px; z-index: 50; margin: 14px 14px 0`.
- **Bar** (`.nav`): `background: rgba(255,255,255,0.82)`, `backdrop-filter: blur(16px) saturate(140%)`,
  `1px solid rgba(0,0,0,0.06)`, `border-radius: 999px` (→ `var(--uxh-radius-pill)`),
  `box-shadow: 0 8px 28px rgba(15,55,58,0.06)`, `padding: 10px 12px 10px 20px`, `gap: 18px`,
  `max-width: 1280px`.
- **Links** (`.nav-link`): `padding: 9px 16px`, pill, `font: 500 14px/1`; hover →
  `rgba(42,153,160,0.10)` bg + seaturtle text, `transition: background 160ms, color 160ms`.
  An external link (Events → Meetup) carries a small 12px arrow icon (`.ext`, opacity 0.55 →
  1 on link hover).
- **CTA** (`.nav-cta`): `padding: 11px 20px`, pill, `background: var(--site-accent)`,
  `color: var(--site-accent-fg)`, `font: 600 14px/1`; hover `filter: brightness(0.95)`, active
  `scale(0.98)`; trailing arrow nudges `translateX(3px)` on hover, same motion contract as Button
  (see `core/README.md`).
- **Burger** (`.nav-burger`): `40px` circle, hidden until ≤880px, where it swaps places with
  `.nav-links` (`display: none` on one side of the breakpoint, `inline-flex` on the other).

**Selector/location:** `.site-header`, `.nav`, `.nav-brand`, `.nav-links`, `.nav-link`,
`.nav-cta`, `.nav-burger` — site.css:25-57. **Found in:** UX Hub Barcelona.html:32-53 and
sponsors.html:104-122 (same structure, sponsors.html's CTA reads "Become a sponsor" and its
in-page links point at `UX Hub Barcelona.html#partners` etc. rather than same-page anchors).

**Accessibility:** `<nav aria-label="Primary">` names the landmark; the brand link carries
`aria-label="UX Hub Barcelona, home"` since its only visible content is a logo image whose own
`alt` text is the same string (redundant but harmless — a screen reader announces the link's
accessible name once, not twice). The CTA button uses `aria-haspopup="dialog"` +
`aria-controls="event-modal"` to describe what it opens (see `overlay/README.md` for the modal
itself). `.nav-brand`, like every other tappable element here, is floored at `min-height: 44px`
site-wide (site.css:132-133).

**Tokens to use:** `var(--uxh-radius-pill)`, `var(--uxh-dur-hover)`, `var(--uxh-dur-press)`,
`var(--uxh-dur-move)` for the CTA's transitions (currently bare literals matching those durations).

---

## MobileDrawer — `.mobile-drawer`

- **Geometry:** `position: fixed; inset: 70px 14px auto 14px`, `background: #fff`,
  `1px solid var(--uxh-line)`, `border-radius: 20px` (→ `var(--uxh-radius-lg)`), `padding: 12px`,
  `box-shadow: var(--uxh-shadow-md)`, `display: flex; flex-direction: column; gap: 4px` (only
  when `.open` — otherwise `display: none`).
- **Items:** `padding: 14px 16px`, `border-radius: 12px` (→ `var(--uxh-radius-md)`), hover
  → `var(--uxh-soft-beige)`. **`.drawer-cta`:** same row shape, `background: var(--site-accent)`,
  `font: 600 16px/1`, left-aligned.

**Selector/location:** `.mobile-drawer`, `.mobile-drawer.open`, `.mobile-drawer a`,
`.mobile-drawer .drawer-cta` — site.css:60-66. **Found in:** UX Hub Barcelona.html:55-61
(markup) + :540-570 (behaviour script) and sponsors.html:124-130 + :350-361 (a lighter version
of the same behaviour, without focus-trap or Escape handling — see the gap below).

**Behaviour, required per spec (§3 "nav/NavBar + nav/MobileDrawer"):**

| Requirement | Homepage (`UX Hub Barcelona.html`) | Sponsors page (`sponsors.html`) |
|---|---|---|
| Escape closes | ✅ (line 559) | ❌ not implemented |
| Outside pointerdown closes | ✅ (line 567-570) | ❌ not implemented |
| Tab focus containment | ✅ (lines 560-566) | ❌ not implemented |
| Focus returns to burger on close | ✅ (`burger.focus()`, line 553) | ❌ not implemented |
| `overflow:hidden` on body while open | ✅ (line 551) | ❌ not implemented |

**This is a real, verified inconsistency, not a spec gap:** the two pages share identical
drawer markup and CSS but sponsors.html's inline script (sponsors.html:350-361) only toggles
`.open`/`hidden`/`aria-expanded` on click and closes on link click — none of the keyboard/focus
requirements the spec calls for are present there. Fix by porting the homepage's fuller handler
(UX Hub Barcelona.html:540-570) into sponsors.html rather than maintaining two versions.

**Accessibility:** the burger button pairs `aria-controls="mobile-drawer"` with
`aria-expanded` kept in sync, and its `aria-label` toggles between "Open menu" / "Close menu" —
present on both pages. The drawer itself has no `role="dialog"`; that's appropriate here (unlike
the event Modal) since it's inline page navigation, not a modal overlay — but the missing focus
trap on sponsors.html means a sighted keyboard user tabbing through the open drawer there can
tab straight out into content behind it.

**Tokens to use:** `var(--uxh-radius-lg)` (drawer), `var(--uxh-radius-md)` (items),
`var(--uxh-shadow-md)`, `var(--uxh-tap-min)` (drawer links/CTA already meet 44px via the
combinator rule at site.css:133).

---

## Footer — `.site-footer`

- **Geometry:** `background: var(--uxh-teal-night)`, `color: #fff`, `padding: 96px 0 40px`,
  `margin-top: 40px`.
- **Top grid** (`.footer-top`): `1fr auto`, `gap: 60px`, stacks to one column ≤780px.
- **Brand block:** logo (`.footer-logo svg`/`img`, `220px` wide, `168px` at ≤480px), mission
  copy: lead `font: 700 18px/1.4`, body `font: 400 16px/1.5` at `rgba(255,255,255,0.82)`.
- **Nav column** (`.footer-nav`): heading `font: 700 16px/1`; links `font: 400 16px/1.3` at
  `rgba(255,255,255,0.88)`, hover → `var(--uxh-yolk)`. The current-page link gets
  `aria-current="page"` + `text-decoration: underline; text-underline-offset: 4px;
  text-decoration-color: rgba(255,255,255,0.45)` — a **non-colour affordance**, exactly what the
  spec calls for so the current page isn't marked by hover-colour alone.
- **Bottom row** (`.footer-bottom`): legal line + socials, `border-top: 1px solid
  rgba(255,255,255,0.22)`, `margin-top: 72px`, stacks ≤780px. Legal links (`.fb-link`) are
  `text-decoration: underline` by default on the homepage — **also** a non-colour affordance,
  distinct from `aria-current`'s underline (this one just says "this is a link", not "this is the
  current page").
- **Socials** (`.fb-socials a`): `34px` circle in site.css, `radius: 8px`,
  `rgba(255,255,255,0.10)` bg, hover → white bg + teal-night icon. **`mobile-tweaks.css:19`
  overrides this to `min-width/min-height: 44px` unconditionally** (not inside any `@media`
  block, so it applies at every viewport despite the file's name) — same "spec calls for 44px,
  mobile-tweaks.css already delivers it everywhere" pattern as the team-card socials in
  `cards/README.md`.

**Selector/location:** `.site-footer` and all `.footer-*`/`.fb-*` descendants — site.css:452-481.
**Found in:** UX Hub Barcelona.html:445-484; sponsors.html:286-323 (identical structure, its own
page marked current via `aria-current="page"` on the Sponsors link instead of Start).

**Page-scoped override on sponsors.html only:** `.site-footer .fb-line-1 .fb-link` there gets
`text-decoration-thickness: 1px; text-underline-offset: 4px` and a hover rule that swaps the
underline colour to `currentColor` (sponsors.html:83-84) — a small legibility tweak not present
when the footer renders on the homepage.

**Accessibility:** the footer's two non-colour affordances (`aria-current` underline vs. plain
`.fb-link` underline) mean footer links never rely on colour alone to communicate "this is a
link" or "you are here" — both call-outs from the spec are implemented, not just documented.
Each social icon link has an explicit `aria-label` ("Instagram", "LinkedIn").

**Tokens to use:** `var(--uxh-surface-panel-dark)` for the `var(--uxh-teal-night)` background
(the semantic alias didn't exist when this rule was written — swapping in the alias name doesn't
change the rendered colour, just makes the *intent* — "dark panel surface" — explicit at the call
site), `var(--uxh-text-on-dark)` / `var(--uxh-text-on-dark-muted)` for the `rgba(255,255,255,…)`
literals used throughout (0.88 and 0.72 alpha match the two new tokens exactly),
`var(--uxh-border-on-dark)` is close to (not identical to) the `rgba(255,255,255,0.22)`
footer-bottom border — that literal is stronger than the 0.12-alpha token, so don't swap it in
without checking contrast first.
