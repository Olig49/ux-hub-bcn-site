# Utility

Four cross-cutting behaviours: the three from design-system-extraction.md §4 ("Also worth
adding") — **Marquee**, **BackToTop**, **Reveal-on-scroll** — plus **ImageTicker**, added later
and specific to the homepage's mobile hero. Open [`index.html`](./index.html) for the
live-rendered catalog.

---

## Marquee — `.marquee`

- **Band:** `background: var(--uxh-seaturtle)`, white text, `padding: 18px 0`, hairline top/bottom
  borders (`rgba(255,255,255,0.12)`), `overflow: hidden`.
- **Track** (`.marquee-track`): `display: flex; gap: 56px; white-space: nowrap`,
  `animation: marquee 22s linear infinite` (nudged down from an original 28s for a slightly
  livelier pace). The keyframe (`@keyframes marquee`) only translates
  from `0` to `-50%` — this works because the **markup itself duplicates every item once**
  (12 spans = 6 unique items × 2), so at the `-50%` mark the track has scrolled exactly one full
  set of unique items and the loop point is seamless. This is a markup-level trick, not something
  the CSS alone accomplishes — removing the duplicate spans would break the loop. The same
  `@keyframes marquee` is reused by ImageTicker below, just with a different duration/gap.
- **Item** (`.marquee-item`): `font: 500 18px/1`, `letter-spacing: -0.01em`; alternating items
  lead with a yolk-coloured `✦` (`.star`); each item ends in a Lora-italic `·` (`em`) in ceramic.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce) { .marquee-track,
  .img-ticker-track { animation: none; } }` — mobile-tweaks.css. This is the **only** animation
  family in the system gated by `prefers-reduced-motion` at the CSS level (contrast with the
  Eyebrow dot-pulse, which isn't — see `core/README.md`).
- **Paused off-screen:** an `IntersectionObserver` in index.html (near the reveal-on-scroll
  setup) toggles `.is-paused` on `.marquee` (and separately on `.img-ticker`, see below)
  whenever the element isn't intersecting the viewport; `.marquee.is-paused .marquee-track {
  animation-play-state: paused; }` stops the loop while it's scrolled past. Both an infinite
  `linear` animation and battery on a phone are finite resources — there's no reason to keep
  spending the second on motion nobody can see. Purely a performance measure: while the strip
  is actually in view, nothing about its behaviour changes.

**Selector/location:** `.marquee`, `.marquee-track`, `.marquee-item`, `@keyframes marquee` —
site.css; the `IntersectionObserver` — index.html, in an IIFE right after reveal-on-scroll.
**Found in:** index.html only — sponsors.html has no marquee.

**Accessibility:** the whole strip is `aria-hidden="true"` — it's treated as decorative ambient
copy repeating things already said elsewhere on the page (free, drinks included, etc.), not as
unique content a screen reader user would need. This is the correct call *given* the content is
purely repetitive; it would not be correct if the marquee were the only place some fact appeared.

**Tokens to use:** `var(--uxh-dur-entry)` doesn't apply here (marquee has its own explicit 22s
duration, unrelated to the 400ms entry-animation token); no radius/shadow involved.

---

## ImageTicker — `.img-ticker` (mobile-only, homepage only)

Not from the original spec — added later to solve a specific problem: the hero's overlapping
three-photo collage collapses to a single static lead photo below 700px (`.collage .p2, .p3`
hidden), which silently dropped two of the three photos on mobile. First pass duplicated the
lead photo (kept it large above *and* repeated it inside the ticker); the current version
removes that duplication — **on mobile the whole `.collage` is `display: none`** and the ticker
is the only hero visual, scrolling through all three photos instead of showing one twice.

- **Band:** `overflow: hidden`, edge-fade via `mask-image: linear-gradient(to right,
  transparent, #000 28px, #000 calc(100% - 28px), transparent)` (plus the `-webkit-` prefix) —
  this is what gives items a soft fade in/out at the container edges instead of a hard clip.
  `padding: 4px 0 32px` (bottom was `20px`, bumped for more air before the text Marquee directly
  below it — two full-width strips scrolling back-to-back with no gap between them read as one
  continuous "movement zone" rather than two distinct moments).
- **Track** (`.img-ticker-track`): same `@keyframes marquee` as the text Marquee above, `gap:
  14px`, `animation: marquee 32s linear infinite reverse`. Markup duplicates all three photos
  once (6 `<img>`s = 3 unique × 2) for the same seamless-loop reason as the text marquee.
  **`reverse`** is the only difference from the text Marquee's use of the same keyframe — the
  text scrolls left, the photos scroll right, so the two strips don't read as everything on the
  page drifting the same direction. `animation-direction: reverse` plays the same `0%→-50%`
  keyframe backwards (starts at `-50%`, animates toward `0%`, loops back to `-50%`) rather than
  needing a second, mirrored keyframe — the loop point is seamless for the same reason the
  forward version is: `-50%` and `0%` are visually identical positions once the content is
  duplicated, so where in that cycle playback starts doesn't matter.
- **Cards:** `220×160px`, `object-fit: cover`, `border-radius: var(--uxh-radius-lg)`,
  `box-shadow: var(--uxh-shadow-sm)` — sized deliberately larger than a typical logo/chip ticker
  since these are the hero's primary photography, not a secondary decorative strip.
- **Visibility:** `display: none` by default, `display: block` only at `≤700px` (the same
  breakpoint that hides the collage) — mobile-tweaks.css. Desktop is untouched; the collage still
  renders exactly as before there.
- **Paused off-screen:** same `IntersectionObserver` as the text Marquee above (it observes both
  `.marquee` and `.img-ticker` in one pass), toggling `.is-paused` → `animation-play-state:
  paused` on `.img-ticker-track` whenever `.img-ticker` isn't intersecting the viewport.

**Selector/location:** `.img-ticker`, `.img-ticker-track` — site.css; breakpoint + collage
hand-off — mobile-tweaks.css. **Found in:** index.html only, between the hero section and the
text Marquee. Not present on sponsors.html (no hero collage there to replace).

**Accessibility:** `aria-hidden="true"` on the container, `alt=""` on every image — same
reasoning as the text Marquee: this is a duplicate/decorative echo of photography whose real,
accessible alt text lives once (on the collage's images, on desktop). It's never the *only*
place these photos appear with real alt text.

**Tokens to use:** `var(--uxh-radius-lg)`, `var(--uxh-shadow-sm)`.

---

## BackToTop — `.to-top`

- **Geometry:** `position: fixed; right: 24px; bottom: 24px; z-index: 60`, `48px` circle,
  `background: var(--uxh-fg)`, white icon, `box-shadow: var(--uxh-shadow-lg)`. Shrinks to `44px`
  at ≤600px (site.css:492) — still meets `--uxh-tap-min` at the smallest size.
- **Show/hide:** `opacity: 0; visibility: hidden; transform: translateY(10px)` at rest, `.show`
  → `opacity: 1; visibility: visible; transform: none`. `transition: opacity 240ms
  cubic-bezier(.2,.8,.2,1), transform 240ms cubic-bezier(.2,.8,.2,1), background 160ms` (→
  `var(--uxh-dur-layout)` for the first two legs, `var(--uxh-dur-hover)` for the background leg).
  `.show` is toggled by a scroll listener once `window.scrollY > 600`.
- **Position, deliberately bottom-right:** the spec calls out that bottom-left is reserved for
  the third-party cookie-consent widget (GetTerms CMP, loaded via `<script>` in both pages'
  `<head>`) — putting BackToTop on the right avoids the two fixed-position widgets ever
  overlapping in the same corner.

**Selector/location:** `.to-top`, `.to-top.show` — site.css:486-492. **Found in:**
index.html (markup near the end of `<body>`, behaviour in the inline `<script>` block) and
sponsors.html at the equivalent locations.

**Reduced motion — now consistent on both pages:** both click handlers check
`matchMedia('(prefers-reduced-motion: reduce)')` before scrolling and use
`behavior: reduceMotion ? 'auto' : 'smooth'` — an instant jump instead of an animated scroll
when the visitor has asked for less motion, same as the marquee and reveal-on-scroll already
did. (An earlier version of this page documented a real inconsistency here — the homepage's
handler used to smooth-scroll unconditionally — since fixed; kept as a note here only in case
it regresses, not because it's still true.)

**Accessibility:** `aria-label="Back to top"` gives the icon-only button its accessible name.
The visibility toggle uses both `opacity`/`visibility` (not `display`), so the button is never
mid-transition-invisible-but-still-tabbable in a confusing way — `visibility: hidden` removes it
from the tab order while hidden, unlike `opacity` alone would.

**Tokens to use:** `var(--uxh-dur-layout)`, `var(--uxh-dur-hover)`, `var(--uxh-ease)`,
`var(--uxh-shadow-lg)`, `var(--uxh-tap-min)` (44px floor, already met).

---

## Reveal-on-scroll — `.reveal`

- **Base rule (always applied, JS or not):** `.reveal { opacity: 1; transform: none; }` — content
  is visible by default, full stop. This is the safety net: print, PDF export, JS-disabled, and
  reduced-motion visitors all just see the content, with zero extra logic needed to unhide it.
- **Opt-in animated state:** only when `document.documentElement` gets `.reveal-on` (added by JS,
  only if both `IntersectionObserver` exists **and** `prefers-reduced-motion: no-preference`
  matches) does the hidden→shown transition activate: `html.reveal-on .reveal { opacity: 0;
  transform: translateY(16px); transition: opacity 600ms cubic-bezier(.2,.8,.2,1), transform
  600ms cubic-bezier(.2,.8,.2,1); }`, and `html.reveal-on .reveal.in { opacity: 1; transform:
  translateY(0); }`.

  **Note the discrepancy between the CSS and the spec's documented token:** the spec (§2) names
  `--uxh-dur-entry: 400ms` for this exact purpose, but the actual CSS rule uses a `600ms`
  duration (site.css:497-498) — the token and the shipped value disagree. Either the token should
  read 600ms or the CSS should be changed to 400ms; don't assume the token is already wired in.

- **Observer config:** `threshold: 0, rootMargin: '0px 0px -8% 0px'` — `threshold: 0` so a
  section taller than the viewport still triggers as soon as any part enters; the `-8%` bottom
  margin means an element must cross 8% short of the very bottom of the viewport before counting
  as "intersecting," giving a small pre-emptive trigger margin rather than firing the instant one
  pixel is visible at the very edge.
- **Safety net inside the JS itself, on both pages:** 1200ms after load, anything still lacking
  `.in` whose bounding rect top is already within the viewport gets `.in` forced on
  (index.html:763-767; sponsors.html:353-357, identical logic) — guards against an observer that
  never fires for some reason leaving real content permanently invisible. (An earlier version of
  this doc claimed sponsors.html omitted this safety net — it doesn't; both pages match.)

**Selector/location:** `.reveal`, `html.reveal-on .reveal`, `html.reveal-on .reveal.in` —
site.css:613-614. **Behaviour:** index.html:751-768; sponsors.html:348-358 (same logic,
including the safety net). **Found in:** applied to nearly every top-level section block across both
pages — hero copy/visual, section heads, event-feature, offer cards, about media/copy, team
cards, partner-section, donate, mailing form, and (sponsors.html) sp-hero, tiers, sponsor cards,
the CTA panel.

**Accessibility:** this is the progressive-enhancement pattern the spec explicitly asks for —
content is never gated behind JS or motion being available, only *decorated* by an entrance
animation when both are present. Respecting `prefers-reduced-motion: no-preference` as a
precondition (rather than only gating the CSS transition) means reduced-motion users never even
get the `.reveal-on` class added, so they see fully-settled content from the first paint with no
flash of hidden-then-shown.

**Tokens to use:** `var(--uxh-dur-entry)` — but fix the token/CSS mismatch (400ms vs. 600ms,
see above) before wiring it in, so the token names the value that's actually shipped.
