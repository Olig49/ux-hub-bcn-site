# Nav

**NavBar**, its **MobileDrawer** companion, and **Footer**. Open [`index.html`](./index.html)
for the live-rendered catalog.

---

## NavBar — `.site-header` / `.nav-shell` / `.nav`

- **Header wrapper** (`.site-header`): `position: sticky; top: 14px; z-index: 50;
  margin: 14px 14px 0` — just positioning, carries no visual styling of its own.
- **Shell** (`.nav-shell`) — the bar's own rounded card, and the positioning anchor
  `.mobile-drawer` overlays against (see MobileDrawer below for why the drawer is an absolutely
  positioned sibling now, not a child laid out in flow inside it). `position: relative`
  (required — it's `.mobile-drawer`'s `position: absolute` containing block), `background:
  #ffffff` (fully solid, no `backdrop-filter`), `1px solid rgba(0,0,0,0.06)`,
  `box-shadow: 0 8px 28px rgba(15,55,58,0.06)`, `max-width: 1280px`.
  **No translucency at all any more** — this went through 82% → 97% → 99% opacity with
  `backdrop-filter: blur(16px) saturate(140%)`, each one narrowing but not eliminating a real
  bug: `backdrop-filter` is silently unsupported/disabled on a meaningful share of Android
  Chrome configurations, which falls back to the bare `background` alone, and even 99% opaque
  still produced a visible color-tinted patch where the drawer opened over the saturated teal
  `.marquee` section (scroll so `.marquee` sits just under the sticky header, then open the
  drawer, to reproduce) — confirmed on a real device and in a desktop browser with
  `backdrop-filter` forced off. There is no opacity that's both "visibly glass" and "never
  tints" once blur isn't rendering, so this is now fully solid and `backdrop-filter` isn't
  declared at all (it would be inert dead code at 100% opacity, not a stylistic choice to
  quietly revisit — it failed against real content, not just in theory). `.mobile-drawer` below
  must keep the exact same background or the "one continuous shape" seam becomes visible again.
  `border-radius: 36px` (renders identically to a full pill — see below for why it isn't the
  usual `999px`/`var(--uxh-radius-pill)` "however round" convention here specifically) at rest;
  `28px 28px 0 0` while `.mobile-drawer.open` exists inside it
  (`.nav-shell:has(.mobile-drawer.open)`) — the shell's own height never changes (the drawer
  isn't inside its box any more), so this is purely about flattening the bottom two corners to
  line up flush with the drawer's square top edge below, not about a pill radius clamping down
  on a taller box the way it briefly did in an earlier version. The same open-state rule also
  sets `border-bottom-color: transparent` (not `border-bottom: none` — that would shift the
  border-box height by 1px): the shell's 1px border runs on all four sides at rest, and with the
  drawer's matching border having `border-top: 0`, the shell's own bottom border was the one
  remaining visible line at the seam while open — read as a header bar sitting on top of a
  separate dropdown rather than one continuous panel, once a user pointed at it directly in a
  static screenshot.
  **`border-bottom-color` needs its own `transition`, or closing looks broken.** It isn't
  covered by the `border-radius` transition below (different property), so without an explicit
  entry it just snaps — confirmed via `getComputedStyle` sampling: on close, the border popped
  back to visible at `t=2ms`, while the drawer was still 100% open (`bottomInsetPct` still `0`)
  — a border line appearing through the middle of a still-fully-open drawer, before anything
  else had visibly started to close. Fixed with the same instant-on-open/delayed-on-close
  pattern as `.mobile-drawer`'s `visibility` below: `transition: ..., border-bottom-color 0s
  var(--uxh-dur-nav)` on the base (closed-target) rule so it only reappears once the full close
  animation has actually finished, and `transition: ..., border-bottom-color 0s` (no delay) on
  the `:has(.mobile-drawer.open)` rule so it vanishes immediately on open, matching how fast the
  corner itself starts moving.
  **`border-radius` transitions on its own fast `70ms`, not the shared `360ms`
  `var(--uxh-dur-nav)` the drawer/burger use — and the `36px` resting value (not `999px`)
  matters just as much as the duration.** A real, user-reported "the corner and the drawer don't
  move as one" bug, confirmed by sampling both `.nav-shell`'s computed `border-radius` and
  `.mobile-drawer`'s computed `clip-path` every few ms through the transition: with a `999px`
  resting value, the numeric range crossed is enormous (`999→28` opening, `28→999` closing), but
  only the ~33px nearest either end is visually distinct on this ~66px-tall bar — past that, any
  radius already renders as a fully rounded cap (clamped by the box's own height), so the two
  directions behaved asymmetrically under one shared ease-out curve: closing shot past the
  visual cap almost instantly (needs <1% of the nominal range to look "done"), opening stayed
  visibly rounded far longer (needs ~99.8% of the range to cross back under the cap) — long
  enough that the drawer below was already visibly revealing content while the corner above
  still looked like a rounded pill sitting on it. `36px` keeps the identical rendered look (still
  above the ~33px half-height cap) but makes the whole range small and symmetric (`36↔28`, 8px
  either way); `70ms` is short enough that the corner now reads as fully settled at essentially
  the same instant the drawer's reveal first becomes perceptible, in both directions — verified
  by measurement, not tuned by feel.
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
  (`top: 19px`) and rotate ±45°, bar 2 fades to `opacity: 0`. `transition: transform 440ms,
  opacity 240ms, top 440ms`, all `var(--uxh-ease)`.
  **440ms is deliberate, not the shared `var(--uxh-dur-nav)` (360ms) the shell/drawer use** —
  a real, user-reported "the icon and the drawer don't move as one" bug traced to exactly this
  gap. Confirmed by sampling both properties' actual computed values every few ms through the
  transition (`getComputedStyle` on the bar's `transform` matrix and the drawer's `clip-path`):
  at matching 360ms/easing, the icon reads as visually finished (within ~2° of its target) a
  consistent ~48ms *before* the drawer reads as visually finished (within ~2% of fully
  open/closed) — small residual rotation angles near the end are imperceptible well before the
  literal target, while a sliver of still-legible list-item text is not. Both start on the same
  frame already (a separate fix, see MobileDrawer below), so this wasn't a start-time gap — it's
  that identical numeric progress doesn't read as identical *visual* progress across a rotation
  vs. a content reveal. 440ms was solved for empirically (measuring where the gap closes to 0ms),
  not chosen by feel — if the drawer's own duration/easing ever changes, re-measure rather than
  assume this stays proportional.
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
`.nav-link`, `.nav-cta`, `.nav-burger`, `.burger-bar` — site.css:26-79, mobile-tweaks.css
(620px burger fallback). **Found in:** index.html:32-71 and sponsors.html:104-140 (same
structure, sponsors.html's CTA reads "Become a sponsor" and its in-page links point at
`index.html#partners` etc. rather than same-page anchors).

**Accessibility:** `<nav aria-label="Primary">` names the landmark; the brand link carries
`aria-label="UX Hub Barcelona, home"` since its only visible content is a logo image whose own
`alt` text is the same string (redundant but harmless — a screen reader announces the link's
accessible name once, not twice). The CTA button uses `aria-haspopup="dialog"` +
`aria-controls="event-modal"` to describe what it opens (see `overlay/README.md` for the modal
itself). `.nav-brand`, like every other tappable element here, is floored at `min-height: 44px`
site-wide (site.css:191-192). The burger's icon bars are purely decorative (`aria-hidden` isn't
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

- **An absolutely positioned overlay anchored to `.nav-shell`, not a child laid out in flow
  inside it.** This has moved twice. Originally `position: fixed; inset: 70px 14px auto 14px`
  with its own background/border/radius/shadow — a second card that appeared 14px below the nav
  bar with a visible gap, which read as two stacked panels rather than one component expanding.
  That was fixed by making it a normal in-flow child of `.nav-shell`, sharing the shell's
  background/border/shadow directly — which *did* read as one seamless shape, but growing in
  flow also grew `.nav-shell`'s own box, which pushed every bit of page content below the sticky
  header down the page on every open/close. Reported as a real regression ("content behind
  should stay in place"), so it moved again: now `position: absolute;
  top: calc(100% + 1px); left: -1px; right: -1px` against `.nav-shell` (which is why the shell
  needs `position: relative` — see above), completely out of document flow, so opening/closing
  it never changes the shell's height or moves anything below the header. **The `+1px`/`-1px`
  offsets matter, not decoration**: `.nav-shell` has a 1px border, and an absolutely positioned
  child's `top:100%`/`left:0`/`right:0` resolve against the containing block's *padding* box, not
  its *border* box — plain `top:100%; left:0; right:0` (what this had at first) put the drawer
  1px inside `.nav-shell`'s real edges on every side, a literal 1px step at the seam that didn't
  show up in a desktop screenshot but was visible at real device pixel density. It keeps its own
  matching `background`/`border` (`border-top: 0` — the shell's own bottom border is the seam
  between the two, so there's no doubled border line) and `border-radius: 0 0 28px 28px` (only
  the bottom two corners — the top ones are square, flush against the shell's now-square bottom
  corners while open). The result reads as the same one continuous shape as the in-flow version
  did, just achieved by two separately positioned boxes with matching styling and a zero-gap
  seam instead of one box that grows.
- **Reveal animation** (`.mobile-drawer`): `clip-path: inset(0 0 100% 0)` (closed) →
  `inset(0 0 0% 0)` (`.open`), `transition: clip-path var(--uxh-dur-nav) var(--uxh-ease)`
  (360ms — see `.nav-shell` above for why this got its own, slower token instead of reusing
  `--uxh-dur-overlay`). This replaced an earlier `display: grid; grid-template-rows: 0fr → 1fr`
  "CSS-only accordion" trick, for two reasons: it's a pure paint/compositor animation (no layout
  recalculation every frame, unlike a grid track's actual row size changing), and it still solves
  the original problem that trick was written for — a plain `height`/`max-height` transition
  either clips a tall list short or overshoots past its real content height, while percentage-based
  `inset()` scales to whatever the content's actual height is with no guessing. The box now sits
  at its full natural content height at all times; only the visible region changes. `overflow:
  hidden` stays on both `.mobile-drawer` and `.mobile-drawer-inner` (belt-and-suspenders — the
  outer clip-path already prevents any visible overflow). `pointer-events: none` while closed
  stops this now-always-full-height box from swallowing taps on whatever page content sits behind
  it during the close transition, since — unlike the old grid-rows version — its layout box no
  longer shrinks away to nothing as it closes.
- **`.mobile-drawer-inner` fades independently of the outer clip-path, on its own faster
  timeline** — `opacity: 0` at rest, `1` while `.mobile-drawer.open`, `transition: opacity
  130ms` on the closed-target rule, `200ms` on the open one (both `var(--uxh-ease)`). Without
  this, the clip line sweeps straight through fully-opaque, legible text: closing visibly slices
  list items in half mid-letter before they disappear, which reads as abrupt no matter how well
  the outer box's own timing is tuned — a real, distinct problem confirmed to persist even after
  the burger icon, the corner radius, and the clip-path itself were all separately fixed and
  verified in sync with each other. `130ms` is fast enough that content is already invisible
  well before the clip line physically reaches most list items on close, so the box finishes
  collapsing around nothing rather than through something legible; `200ms` on open is slower (no
  delay, but a longer duration) so a letter is never shown "half-cut" at full opacity either —
  whatever's exposed materializes rather than snapping to fully readable inside a moving mask.
- **Closed state is `visibility: hidden`, not the `[hidden]` attribute (`display: none`) this
  used to have — a real, user-reported asymmetry between opening and closing traced back to
  exactly this.** A `display:none` element has no previously-rendered frame for the browser to
  transition *from*, so opening required JS to remove `hidden`, wait a `requestAnimationFrame`
  for the browser to actually paint the closed state once, *then* add `.open` — a real ~1-frame
  delay between tap and visible motion that closing never had (closing could remove `.open`
  synchronously, since the drawer was already rendered). `visibility` keeps the box
  rendered-but-invisible at all times, so both directions now start their motion on the same
  frame — verified via `getComputedStyle().clipPath` sampled every `requestAnimationFrame` after
  each click: 2 frames to first visible change, both directions, both pages. `visibility` itself
  still flips asymmetrically, but via CSS `transition-delay` now, not JS timing: instant
  (`0s` delay) on open so keyboard/AT users can reach it immediately, delayed until the full
  360ms transition finishes on close (`transition: ..., visibility 0s var(--uxh-dur-nav)`) so it
  stays hit-testable for the whole close animation. The JS is correspondingly simpler — no rAF,
  no `setTimeout`, `setDrawer` is a single synchronous class/attribute toggle in both directions,
  with an explicit `aria-hidden` set alongside `aria-expanded` rather than relying on `[hidden]`
  for the accessibility semantics.
  **`aria-expanded` on the burger button is set inside that same `requestAnimationFrame`
  callback on open, not synchronously on click.** It used to be set synchronously right after
  the if/else block (same tick as `drawer.hidden = false`), one frame *before* `.open` — since
  `aria-expanded` is what drives the burger icon's own X-morph transition (see NavBar above),
  that one-frame head start made the icon visibly finish rotating before the drawer/corners even
  began theirs, which read as the open gesture being three separate, uncoordinated motions
  rather than one. Moving `aria-expanded`'s flip-to-`true` into the same rAF callback as
  `.open` fixes it — all three (icon, corner-flattening, drawer reveal) now start on the
  identical frame. On close there's no such gap to begin with: `.open` removal and
  `aria-expanded`'s flip-to-`false` are both synchronous in the same tick, no rAF involved.
- **Items** (inside `.mobile-drawer-inner`): `padding: 14px 16px`, `border-radius: 12px` (→
  `var(--uxh-radius-md)`), hover → `var(--uxh-soft-beige)`. **`.drawer-cta`:** sized to its own
  content (`display: inline-flex; align-self: flex-start`, not a full-width row like the plain
  links), full pill (`var(--uxh-radius-pill)`) matching the desktop `.nav-cta`, `background:
  var(--site-accent)`, `font: 600 16px/1`, and carries the same trailing-arrow markup + hover
  nudge as `.nav-cta`.

**Selector/location:** `.mobile-drawer`, `.mobile-drawer.open`, `.mobile-drawer-inner`,
`.mobile-drawer-inner a`, `.mobile-drawer-inner .drawer-cta` — site.css. **Found in:**
index.html:58-69 (markup, nested inside `.nav-shell`) + the `setDrawer()` script further down,
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
  `rgba(255,255,255,0.10)` bg, hover → white bg + teal-night icon. **`mobile-tweaks.css:18`
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

**Selector/location:** `.site-footer` and all `.footer-*`/`.fb-*` descendants — site.css:551-598.
**Found in:** index.html:515-554; sponsors.html:295-332 (identical structure, its own
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
