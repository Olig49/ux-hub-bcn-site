# event-web — starter kit

Lift-and-reuse partials for a UX Hub Barcelona event page, cut verbatim from
the live site. **Vanilla HTML/CSS/JS** — no build step, no JSX. Reuse per the
top-level design-system README: copy the markup you need into a new page,
not `import` it.

## What's here

```
event-web/
  index.html               ← assembled example (header → hero → event card → CTA)
  partials/
    header.html             ← site nav + mobile drawer
    hero.html                ← home hero (headline, actions, photo collage)
    event-card.html          ← the "next event" feature card
    speaker-card.html        ← the speaker-tag chip(s) used inside the event card
    cta.html                 ← "let's work together" partner/sponsor section
```

Every partial file is fully self-documented: each one opens with an HTML
comment stating exactly which lines of which shipped page it was cut from,
its CSS/JS dependencies, and how to adapt it. This file is the index/summary
of that same information, plus the two things that don't fit inside a single
partial: the shared SVG sprite and the path-depth note for `index.html`.

## Source pages

- `/project/UX Hub Barcelona.html` — header, hero, event card, speaker tags,
  CTA (all five partials trace back to this one file).
- `/project/sponsors.html` — not lifted from directly for this kit, but its
  header/footer follow the same header.html pattern (see "Adapting" below)
  if you're wiring a new page into the existing site rather than building
  a fully standalone example.

## `index.html` — path depth, verified

`index.html` lives at:

```
project/_ds/ux-hub-barcelona-design-system-019e06db-8ee9-7e9b-8bd4-ab6a304b9d12/ui_kits/event-web/index.html
```

That's 4 directories below `project/` (`_ds/<id>/` → `ui_kits/` → `event-web/`).
So its stylesheet, favicon and image links go up **four** levels
(`../../../../`) to reach `project/styles/…` and `project/assets/…`, not the
`../` a page at the design-system folder's root would use. Confirmed with
`ls` against the real file locations — every link below resolves:

| Link in `index.html` | Resolves to | Exists |
|---|---|---|
| `../../../../styles/tokens.css` | `project/styles/tokens.css` | yes |
| `../../../../styles/site.css` | `project/styles/site.css` | yes |
| `../../../../styles/mobile-tweaks.css` | `project/styles/mobile-tweaks.css` | yes |
| `../../../../assets/logo-mark-seaturtle.svg` (favicon) | `project/assets/logo-mark-seaturtle.svg` | yes |
| `../../../../assets/logo-horizontal-seaturtle.svg` | `project/assets/logo-horizontal-seaturtle.svg` | yes |
| `../../../../assets/photo-meetup-{1,2,3}-{800,1400}.webp` | `project/assets/…` | yes |
| `../../../../assets/photo-meetup-4-{900,1600}.webp` | `project/assets/…` | yes |
| `../../../../sponsors.html` | `project/sponsors.html` | yes |

The individual files under `partials/` intentionally use bare, root-relative
paths (`assets/logo-…svg`, `styles/site.css`, etc.) — same convention the
live pages use — because a partial isn't meant to be opened on its own; it's
meant to be pasted into a new page that itself sits at the project root next
to `styles/` and `assets/`, at which point those bare paths are already
correct. Only `index.html`, which lives four levels deep purely as a
same-repo demo, needed the `../../../../` prefix.

## Shared inline SVG sprite

`hero.html` and `cta.html` both draw a soft flower/blob shape via
`<svg …><use href="#uxh-flower"/></svg>`. That relies on a `<symbol
id="uxh-flower">` defined once, inline, near the top of `<body>` in the
shipped page (`UX Hub Barcelona.html`, line 28 — a visually hidden 0×0
`<svg>`). It is **not** a separate asset file, and it is **not repeated** per
partial. If you use `hero.html` and/or `cta.html` in a new page, paste this
once (already included at the top of `index.html`'s `<body>`, right after the
skip link):

```html
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;overflow:hidden">
  <symbol id="uxh-flower" viewBox="0 0 200 200">
    <g transform="scale(2.53165,2.5)">
      <!-- five <path> petals — copy verbatim from UX Hub Barcelona.html line 28,
           or from partials/hero.html / index.html, which both already inline it -->
    </g>
  </symbol>
</svg>
```

## Per-partial summary

### `header.html` — primary nav
- **Extracted from:** `UX Hub Barcelona.html`, lines 31–62 (`<header class="site-header">`).
- **Depends on (`styles/site.css`):** `.site-header` (L26), `.nav`, `.nav-brand`,
  `.nav-links`, `.nav-link`, `.nav-cta` (L45), `.nav-burger`, `.mobile-drawer`
  (L60) + `.mobile-drawer.open` (L63) + `.drawer-cta` (L66), `.sr-only` /
  `.skip` (L18–20). Also depends on the `html[data-accent="…"]` theming rule
  (`site.css` L12–15) — that's what colors `.nav-cta` / `.drawer-cta`; default
  (no attribute set) renders in Yolk.
- **JS behavior** (copy from the `<script>` block at the bottom of
  `UX Hub Barcelona.html`, ~L540–570): mobile-drawer open/close on
  `#nav-burger` toggling `#mobile-drawer`, `aria-expanded`/`aria-label`
  updates, a Tab/Shift+Tab focus trap while open, Escape-to-close,
  outside-pointerdown-to-close, and a body-scroll lock. `index.html`
  includes a trimmed copy of just the drawer logic so the demo page is
  interactive; the full version (with the focus trap and Escape handling)
  is what you should actually ship.
  The header also wires `#next-event-btn` / `#next-event-btn-mobile` to open
  `#event-modal`, a dialog that is **not** part of this kit — either build
  your own modal, or repoint those buttons to a plain link (a Meetup URL, or
  an on-page anchor).
- **Adapting:** swap the logo asset/alt if using a different lockup; point
  `.nav-links` hrefs/labels at your new page's real section ids; point
  `.nav-cta` / `.drawer-cta` at your real primary action.

### `hero.html` — home hero
- **Extracted from:** `UX Hub Barcelona.html`, lines 66–98 (`<section id="home" class="hero">`).
- **Depends on (`styles/site.css`):** `.hero` (L140), `.hero-grid` (L141),
  `.hero h1` + `em` + `.underline` (L144–147), `.hero p.lead` (L149),
  `.hero-actions` (L150), `.btn` / `.btn-primary` / `.btn-ghost` (L103–108),
  `.hero-bg-circles` (L178–181), `.collage` / `.ph` / `.blob` (declared
  alongside the hero rules). Also **`styles/mobile-tweaks.css`**: the hero
  `h1` font-size floor (L8) and the "lead with one photo" collage
  simplification under 700px (L28–34). Needs the shared `#uxh-flower` SVG
  symbol (see above) for the background circles and collage blobs.
- **JS behavior:** none required to render. `.reveal` / `html.reveal-on
  .reveal.in` (site.css L496–498) is a progressive-enhancement scroll-fade —
  content is fully visible without it. To keep the fade, copy the
  `IntersectionObserver` IIFE from the end of `UX Hub Barcelona.html`'s
  `<script>` block (search "Reveal-on-scroll"); `index.html` includes a copy.
  The primary button's `#events` anchor assumes an on-page events section —
  optional; on the live site, JS repoints it to the public Meetup events URL
  when there's no confirmed upcoming event (`applyEventState`), but the hero
  works fine as static markup without that.
- **Adapting:** swap the `h1`, `.lead` copy, and the two `.hero-actions`
  labels/links; swap the three collage photos (keep the `srcset`/`sizes`
  pattern) and their alt text.

### `event-card.html` — "next event" feature card
- **Extracted from:** `UX Hub Barcelona.html`, lines 127–180
  (`<article class="event-feature" id="event-feature">`, inside
  `<section id="events">`). On the live page that section starts `hidden`
  and is only revealed once a live event is confirmed — see JS notes below;
  the card itself renders fine standalone.
- **Depends on (`styles/site.css`):** `.event-feature` + `.ef-media` /
  `.ef-body` (L202–221), `.overlay`, `.label`, `.chip` / `.chip-teal`
  (L123–128), `.date-stamp` (`.num`/`.mo`/`.yr`, L209–214), `.eyebrow` /
  `.dot` (L117–120), `.ef-meta`, `.speakers` (L222) and `.speaker-tag`
  (L223–226, hover state L253–254 — see `speaker-card.html`), `.ef-actions`,
  `.btn` / `.btn-primary` / `.btn-ghost` (L103–108).
- **JS behavior** (all in the inline `<script>` at the bottom of
  `UX Hub Barcelona.html`): every element with an id inside the card
  (`#ef-image`, `#ef-status`, `#ef-day`, `#ef-month`, `#ef-weektime`,
  `#ef-title`, `#ef-venue`, `#ef-time`, `#ef-price`, `#ef-desc`,
  `#ef-speakers`, `#ef-rsvp`) is populated at runtime by `renderEvent(ev)`
  from `data/events.json`, falling back to the `CURRENT_EVENT` object baked
  into the script if the fetch fails (search "renderEvent"). `#ef-speakers`
  is filled with the exact markup documented in `speaker-card.html`.
  `applyEventState(ev)` hides/shows the parent `<section id="events">` based
  on `isUpcoming()` — that's why the section starts `hidden` in the source.
  `#add-to-calendar` builds a client-side `.ics` file from `CURRENT_EVENT`
  and downloads it (search "Add to calendar"). **None of this JS is required
  for the card to render** — every field already has real, readable
  fallback text baked into the HTML.
- **Adapting:** replace `#ef-image` + its `srcset`, the `#ef-status` chip
  text, the date-stamp day/month/weektime, `#ef-title`, the three
  `.ef-meta` rows (venue, time, price), `#ef-desc`, the speaker tags inside
  `#ef-speakers` (see `speaker-card.html`), and the RSVP / "see all events"
  links. If you don't want the live-data behavior, just leave the ids in
  place (they're inert without the script) or strip them.

### `speaker-card.html` — speaker tag chip(s)
- **Extracted from:** `UX Hub Barcelona.html`'s inline `<script>`, function
  `renderEvent()` (search "// speakers") — this file is that JS template
  pre-rendered as plain HTML, so a new event page can be hand-authored
  without touching any JS.
- **Depends on (`styles/site.css`):** `.speakers` (L222, flex row that
  wraps), `.speaker-tag` (L223–226) and its avatar/name/role sub-parts
  (`.av`, `.nm`, `.ro`), plus the anchor-hover variant (L253–254). Also
  **`styles/tokens.css`** — `--uxh-purple`, `--uxh-yolk`, `--uxh-seaturtle`,
  `--uxh-fg` custom properties, used as **inline styles** on each `.av` span
  rather than CSS classes, exactly as the live JS generates them.
- **JS behavior:** none required — this is JS-generated markup written out
  as static HTML. The live page only needs JS because the speaker list comes
  from `data/events.json` at runtime; a hand-built page can skip that.
- **Adapting:** one `<a class="speaker-tag">` (linked, e.g. to LinkedIn) or
  `<span class="speaker-tag">` (unlinked) per speaker. Cycle the three
  accent colors in source order — purple → yolk → seaturtle — repeating
  (`i % 3`) past a third speaker; text stays `var(--uxh-fg)` except on the
  seaturtle tag (3rd, 6th, …), which flips to white (`#fff`) for contrast.
  `.av` text is the speaker's initial (first letter of their name).

### `cta.html` — "let's work together" / partners section
- **Extracted from:** `UX Hub Barcelona.html`, lines 338–379
  (`<section id="partners" class="section tight">` > `.partner-section`).
- **Depends on (`styles/site.css`):** `.section` / `.section.tight` (L193–194),
  `.wrap` (L22), `.partner-section` (dark teal card, L354–361),
  `.partner-bg-circles` (L362–365), `.pgrid` (two-column layout, L357–358),
  `.eyebrow.on-dark` (L119–120) + `.dot`, `.btn` / `.btn-primary` (L103–107),
  `.partner-cards` / `.partner-card` (`.pn` number + `h3` + `p`, L367–382).
  Needs the shared `#uxh-flower` SVG symbol (see above) for the two
  background circles.
- **JS behavior:** none. Static markup; the `reveal` class is the same
  optional progressive-enhancement fade described under `hero.html`.
- **Adapting:** this is the shipped "become a partner/sponsor" CTA. For a
  single event page, either reuse as-is (it points at a `mailto:` link and
  `sponsors.html`), or trim it to just the left column (eyebrow + `h2` + `p`
  + the two buttons) for a simpler single-button banner and drop
  `.partner-cards`/the second `.pgrid` column. Swap the eyebrow label, `h2`,
  body copy, and the two action links (the `mailto:` subject line, and the
  secondary link's `href`/label); swap or drop the three `.partner-card`
  entries (number, heading, body).

## Adapting into the live multi-page site (vs. a standalone demo)

If you're wiring a new page into `project/` itself (sitting next to
`UX Hub Barcelona.html` and `sponsors.html`), rather than keeping it inside
this kit's own folder:

- Use the partials' bare paths as-is (`styles/site.css`, `assets/…`) — no
  path rewriting needed, since the new page is at the same depth as the
  shipped pages.
- Copy the `<link>`/`<meta>` block, the Google Fonts preconnect + stylesheet,
  and the `#uxh-flower` SVG symbol from the top of `UX Hub Barcelona.html`
  into the new page's `<head>`/`<body>` start.
- Copy whichever JS blocks correspond to the partials you used (mobile
  drawer, reveal-on-scroll, event rendering, add-to-calendar) from the
  `<script>` at the bottom of `UX Hub Barcelona.html` — each partial file
  above says exactly which behavior it needs and where to find it.
- `sponsors.html`'s own header/footer follow the same `header.html` pattern
  (worth diffing if you want to match its nav-link set exactly).
