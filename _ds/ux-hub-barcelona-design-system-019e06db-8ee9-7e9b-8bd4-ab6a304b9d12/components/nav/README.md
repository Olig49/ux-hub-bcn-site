# Nav

**NavBar**, its **MobileDrawer** companion, and **Footer**. Open [`index.html`](./index.html)
for the live-rendered catalog.

---

## NavBar — `.site-header` / `.nav-shell` / `.nav`

- **Header wrapper** (`.site-header`): `position: sticky; top: 14px; z-index: 50;
  margin: 14px 14px 0` — just positioning, carries no visual styling of its own.
- **Shell** (`.nav-shell`) — **the one rounded card.** `.nav` (the bar row) and `.mobile-drawer`
  (the collapsible section) are both children of `.nav-shell`, not siblings each styled as their
  own floating panel — so opening the drawer grows this one shape rather than popping a second
  card open below it. `background: rgba(255,255,255,0.82)`, `backdrop-filter: blur(16px)
  saturate(140%)`, `1px solid rgba(0,0,0,0.06)`, `box-shadow: 0 8px 28px rgba(15,55,58,0.06)`,
  `max-width: 1280px`, `overflow: hidden` (required — it's what lets the drawer's height
  actually collapse to 0, and what clips the shell to its rounded corners as it resizes).
  `border-radius: 999px` (→ `var(--uxh-radius-pill)`) at rest; `28px` while
  `.mobile-drawer.open` is present inside it (`.nav-shell:has(.mobile-drawer.open)`) — a
  999px-radius pill reads fine at bar height, but the same radius on a much taller open shell
  would just clamp to a near-circular corner on a tall box, so the corners relax to a normal
  card radius instead. Transitions on `border-radius` alone, `var(--uxh-dur-nav)
  var(--uxh-ease)` (360ms — its own token, deliberately slower than the 220ms
  `--uxh-dur-overlay` used elsewhere, e.g. the event Modal: a full-menu open/close read as
  rushed at 220ms in review, so the nav got its own, longer duration rather than everything on
  that token slowing down with it), timed to match the drawer's own height transition below.
- **Bar** (`.nav`): plain flex row inside the shell — `padding: 10px 12px 10px 20px`, `gap: 18px`.
  No background/border/radius of its own any more; that all moved to `.nav-shell` above.
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
  **Morphs into an X, doesn't just sit next to the drawer** — its icon is three absolutely
  positioned `.burger-bar` spans (not an SVG; per-bar CSS `transform`/`top` is simpler to
  animate than swapping SVG paths), styled off `[aria-expanded]` rather than a separate JS-added
  class, so the same attribute that already drives the accessible state also drives the visual
  one — no risk of the two disagreeing. Open state: bars 1 and 3 slide to the vertical centre
  (`top: 19px`) and rotate ±45°, bar 2 fades to `opacity: 0`. `transition: transform
  var(--uxh-dur-nav), opacity 240ms, top var(--uxh-dur-nav)`, all `var(--uxh-ease)` — the rotate/
  slide runs the full 360ms alongside the shell and drawer, opacity a touch faster (240ms) so
  the middle bar doesn't linger half-visible through the rotation.
- **Right-alignment gotcha:** `.nav` is a plain flex row; `.nav-links` carries the
  `margin-left: auto` that pushes everything after it (CTA, burger) to the right edge. That
  margin disappears the instant `.nav-links` is `display: none` (≤880px), which used to leave
  the burger stranded next to the brand instead of pinned right. Fixed by re-declaring
  `margin-left: auto` on whichever sibling becomes the new first-visible one at each
  breakpoint — `.nav-cta` inside the same `@media (max-width: 880px)` block, then
  `.nav-burger` inside `@media (max-width: 620px)` in mobile-tweaks.css once the CTA also
  hides. Any future "hide element X in the nav row" change needs the same check: does X carry
  the auto-margin, and if so, who inherits it once X is gone?

**Selector/location:** `.site-header`, `.nav-shell`, `.nav`, `.nav-brand`, `.nav-links`,
`.nav-link`, `.nav-cta`, `.nav-burger`, `.burger-bar` — site.css:26-70ish, mobile-tweaks.css
(620px burger fallback). **Found in:** index.html:32-73 and sponsors.html:104-133 (same
structure, sponsors.html's CTA reads "Become a sponsor" and its in-page links point at
`index.html#partners` etc. rather than same-page anchors).

**Accessibility:** `<nav aria-label="Primary">` names the landmark; the brand link carries
`aria-label="UX Hub Barcelona, home"` since its only visible content is a logo image whose own
`alt` text is the same string (redundant but harmless — a screen reader announces the link's
accessible name once, not twice). The CTA button uses `aria-haspopup="dialog"` +
`aria-controls="event-modal"` to describe what it opens (see `overlay/README.md` for the modal
itself). `.nav-brand`, like every other tappable element here, is floored at `min-height: 44px`
site-wide (site.css:145-146). The burger's icon bars are purely decorative (`aria-hidden` isn't
even needed — they're plain `<span>`s with no text content), so the button's accessible name
still comes entirely from its `aria-label`, which JS keeps in sync ("Open menu" / "Close menu").

**Tokens to use:** `var(--uxh-radius-pill)`, `var(--uxh-dur-hover)`, `var(--uxh-dur-press)`,
`var(--uxh-dur-move)` for the CTA's transitions (currently bare literals matching those durations).

**Browser support note:** the shell's radius morph uses `:has()` (`.nav-shell:has(.mobile-drawer.open)`).
Supported in every evergreen browser as of this pattern's introduction (Safari 15.4+, Chrome
105+, Firefox 121+); on anything older the shell simply keeps its pill radius while open instead
of relaxing to 28px — a cosmetic-only fallback, not a functional break, so no JS fallback was
added for it.

---

## MobileDrawer — `.mobile-drawer`

- **It's a section of `.nav-shell`, not a floating panel.** Earlier this was
  `position: fixed; inset: 70px 14px auto 14px` with its own background/border/radius/shadow —
  a second card that appeared 14px below the nav bar with a visible gap between them, out of
  step with a request for the nav to read as one component that expands, not two stacked ones.
  It's now a normal in-flow child of `.nav-shell`, directly below `.nav`, with no background/
  border/shadow of its own — it inherits the shell's.
- **Height animation** (`.mobile-drawer`): `display: grid; grid-template-rows: 0fr` (closed) →
  `1fr` (`.open`), `transition: grid-template-rows var(--uxh-dur-nav) var(--uxh-ease)`
  (360ms — see `.nav-shell` above for why this got its own, slower token instead of reusing
  `--uxh-dur-overlay`). This is the standard "CSS-only accordion" trick — a single-row, single-column grid
  can tween its row size in `fr` units from 0 to content-height smoothly, which a plain `height`
  or `max-height` transition can't do without either hardcoding a pixel value or overshooting.
  It only collapses all the way to a true `0px` because the actual content sits in a nested
  **`.mobile-drawer-inner`** wrapper with `overflow: hidden`: a grid track's automatic minimum
  size is normally content-based (so `0fr` alone would still show the content's min-content
  height), but that automatic minimum drops to `0` once the grid item's own overflow isn't
  `visible` — the `overflow: hidden` on `.mobile-drawer-inner` is what makes `0fr` actually mean
  zero, not a decoration.
- **`[hidden]` still does real removal-from-layout** once the close transition finishes
  (`.mobile-drawer[hidden] { display: none; }`, same pattern as the Modal's `.modal-overlay` —
  see `overlay/README.md`) — same JS sequencing as before, just now toggling a grid row instead
  of opacity/transform: on open, clear `hidden` first, then add `.open` on the next animation
  frame (`requestAnimationFrame`) so the browser has a frame to transition from; on close,
  remove `.open` first, then set `hidden = true` after a `setTimeout` matching the transition
  duration (360ms, kept literal in the JS rather than read from CSS — same tradeoff as the
  Modal's equivalent `setTimeout`, see `overlay/README.md`) rather than instantly.
- **Items** (inside `.mobile-drawer-inner`): `padding: 14px 16px`, `border-radius: 12px` (→
  `var(--uxh-radius-md)`), hover → `var(--uxh-soft-beige)`. **`.drawer-cta`:** sized to its own
  content (`display: inline-flex; align-self: flex-start`, not a full-width row like the plain
  links), full pill (`var(--uxh-radius-pill)`) matching the desktop `.nav-cta`, `background:
  var(--site-accent)`, `font: 600 16px/1`, and carries the same trailing-arrow markup + hover
  nudge as `.nav-cta`.

**Selector/location:** `.mobile-drawer`, `.mobile-drawer.open`, `.mobile-drawer-inner`,
`.mobile-drawer-inner a`, `.mobile-drawer-inner .drawer-cta` — site.css. **Found in:**
index.html:55-73 (markup, nested inside `.nav-shell`) + the `setDrawer()` script further down,
and sponsors.html at the equivalent locations — both pages still share the identical
`setDrawer()` implementation (it didn't need to change: it only ever toggled `hidden` and
`.open`, never touched the CSS properties those drive).

**Behaviour, required per spec (§3 "nav/NavBar + nav/MobileDrawer") — implemented identically
on both pages:**

| Requirement | Homepage | Sponsors page |
|---|---|---|
| Escape closes | ✅ | ✅ |
| Outside pointerdown closes | ✅ | ✅ |
| Tab focus containment | ✅ | ✅ |
| Focus returns to burger on close | ✅ (`burger.focus()`) | ✅ |
| `overflow:hidden` on body while open | ✅ | ✅ |
| Animated open/close (not instant) | ✅ | ✅ |

(An earlier pass found sponsors.html missing every row above except the last; it's since been
ported from the homepage's handler so both pages run one `setDrawer()` implementation.)

**Accessibility:** the burger button pairs `aria-controls="mobile-drawer"` with
`aria-expanded` kept in sync, and its `aria-label` toggles between "Open menu" / "Close menu" —
present on both pages. The drawer itself has no `role="dialog"`; that's appropriate here (unlike
the event Modal) since it's inline page navigation, not a modal overlay.

**Tokens to use:** `var(--uxh-radius-md)` (items), `var(--uxh-radius-pill)` (drawer-cta),
`var(--uxh-dur-nav)` + `var(--uxh-ease)` (open/close transition — shared with `.nav-shell`'s
radius morph and the burger's bar transforms, so all three read as one motion), `var(--uxh-tap-min)`
(drawer links/CTA already meet 44px via the combinator rule in site.css). No radius/shadow
tokens of its own any more — see `.nav-shell` above for those.

---

## Footer — `.site-footer`

- **Geometry:** `background: var(--uxh-teal-night)`, `color: #fff`, `padding: 96px 0 40px`,
  `margin-top: 40px`; reduced to `padding: 56px 0 32px` at ≤780px (the same breakpoint
  `.footer-top` already stacks to one column at) since the full desktop padding reads as
  needlessly tall once the two-column layout collapses.
- **Top grid** (`.footer-top`): `1fr auto`, `gap: 60px`, stacks to one column ≤780px, **centred**
  at that breakpoint (`text-align: center` on `.footer-top`, plus `margin: 0 auto` on
  `.footer-brand` and `.mission-body` since a max-width block doesn't centre from `text-align`
  alone, and `align-items: center` on the `.footer-nav` flex column so each link — sized to its
  own text via `width: fit-content` — centres individually rather than stretching full-width and
  left-aligning). Was left-aligned at this breakpoint; centred per a request that mobile footer
  content shouldn't read as left-aligned once it's a single stacked column.
- **Brand block:** logo (`.footer-logo svg`/`img`, `220px` wide, `168px` at ≤480px), mission
  copy: lead `font: 700 18px/1.4`, body `font: 400 16px/1.5` at `rgba(255,255,255,0.82)`.
- **Nav column** (`.footer-nav`): heading `font: 700 16px/1`; links `font: 400 16px/1.3` at
  `rgba(255,255,255,0.88)`, hover → `var(--uxh-yolk)`. The current-page link gets
  `aria-current="page"` + `text-decoration: underline; text-underline-offset: 4px;
  text-decoration-color: rgba(255,255,255,0.45)` — a **non-colour affordance**, exactly what the
  spec calls for so the current page isn't marked by hover-colour alone.
- **Bottom row** (`.footer-bottom`): legal line + socials, `border-top: 1px solid
  rgba(255,255,255,0.22)`, `margin-top: 72px`, stacks ≤780px, **centred** at that breakpoint too
  (`align-items: center; text-align: center` on `.footer-bottom`, `align-items: center` on
  `.fb-legal` so the legal line/address/ID shrink-to-fit and centre as a block instead of
  stretching full-width, `justify-content: center` on `.fb-line-1` for its own wrapped row of
  links). Legal links (`.fb-link`) are `text-decoration: underline` by default on the homepage —
  **also** a non-colour affordance, distinct from `aria-current`'s underline (this one just says
  "this is a link", not "this is the current page").
- **Socials** (`.fb-socials a`): `34px` circle in site.css, `radius: 8px`,
  `rgba(255,255,255,0.10)` bg, hover → white bg + teal-night icon. **`mobile-tweaks.css:19`
  overrides this to `min-width/min-height: 44px` unconditionally** (not inside any `@media`
  block, so it applies at every viewport despite the file's name) — same "spec calls for 44px,
  mobile-tweaks.css already delivers it everywhere" pattern as the team-card socials in
  `cards/README.md`. **Why centring here specifically mattered:** left-aligned, `.fb-socials` sat
  flush in the bottom-left corner of the footer — the same corner a third-party cookie-consent
  widget (gettermscmp.com, its blocker/widget scripts loaded in `<head>`) anchors its own
  floating settings button in. That widget is outside this codebase's control (no CSS hook is
  documented for repositioning it), so centring the icons moves them out of that corner instead —
  a layout fix that happens to resolve a real-world visual collision, not purely a style
  preference.

**Selector/location:** `.site-footer` and all `.footer-*`/`.fb-*` descendants — site.css:452-481.
**Found in:** index.html:445-484; sponsors.html:286-323 (identical structure, its own
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
