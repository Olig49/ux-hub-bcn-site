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

- The production `/project/index.html` (the site's actual homepage — not to be
  confused with this kit's own `index.html` a few sections down) — header,
  hero, event card, speaker tags, CTA (all five partials trace back to this
  one file). It was renamed from `UX Hub Barcelona.html` partway through the
  project; every "extracted from" citation in the partial files and below
  now points at `index.html` and its current line numbers.
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
shipped page (`index.html`, line 24 — a visually hidden 0×0
`<svg>`). It is **not** a separate asset file, and it is **not repeated** per
partial. If you use `hero.html` and/or `cta.html` in a new page, paste this
once (already included at the top of `index.html`'s `<body>`, right after the
skip link):

```html
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;overflow:hidden">
  <symbol id="uxh-flower" viewBox="0 0 200 200">
    <g transform="scale(2.53165,2.5)">
      <!-- five <path> petals — copy verbatim from index.html line 24,
           or from partials/hero.html / this kit's own index.html, which both
           already inline it -->
    </g>
  </symbol>
</svg>
```

## Per-partial summary

### `header.html` — primary nav
- **Extracted from:** `index.html`, lines 32–71 (`<header class="site-header">`,
  containing `.nav-shell` > `.nav` + `.mobile-drawer`).
- **Depends on (`styles/site.css`):** `.site-header` (L26), `.nav-shell`,
  `.nav`, `.nav-brand` (L50), `.nav-links` (L56), `.nav-link` (L59),
  `.nav-cta` (L61), `.nav-burger` + `.burger-bar`, `.mobile-drawer` (L106) +
  `.mobile-drawer.open` (L114) + `.mobile-drawer-inner` + `.drawer-cta`
  (L119), `.sr-only` (L18) / `.skip` (L19). Also depends on the
  `html[data-accent="…"]` theming rule (`site.css` L12–15) — that's what
  colors `.nav-cta` / `.drawer-cta`; default (no attribute set) renders in
  Yolk.
- **Structure note:** `.mobile-drawer` is `position: absolute` against
  `.nav-shell` (which needs `position: relative`), not laid out in flow
  inside it — opening it overlays the page below the header instead of
  pushing that content down, while matching background/border/radius keeps
  bar and drawer reading as one continuous shape. See the comment block at
  the top of `header.html` itself for the full mechanism.
- **JS behavior** (copy the "Mobile drawer" block from the `<script>` at the
  bottom of `index.html`, lines 610–648): mobile-drawer open/close on
  `#nav-burger` toggling `#mobile-drawer`, `aria-expanded`/`aria-label`
  updates, a Tab/Shift+Tab focus trap while open, Escape-to-close,
  outside-pointerdown-to-close, and a body-scroll lock. This kit's own
  `index.html` includes a trimmed copy of just the drawer logic so the demo
  page is interactive; the full version (with the focus trap and Escape
  handling) is what you should actually ship.
  The header also wires `#next-event-btn` / `#next-event-btn-mobile` to open
  `#event-modal`, a dialog that is **not** part of this kit — either build
  your own modal, or repoint those buttons to a plain link (a Meetup URL, or
  an on-page anchor).
- **Adapting:** swap the logo asset/alt if using a different lockup; point
  `.nav-links` hrefs/labels at your new page's real section ids; point
  `.nav-cta` / `.drawer-cta` at your real primary action.

### `hero.html` — home hero
- **Extracted from:** `index.html`, lines 76–107 (`<section id="home" class="hero">`).
- **Depends on (`styles/site.css`):** `.hero` (L199), `.hero-grid` (L200),
  `.hero h1` + `em` + `.underline` (L203–206), `.hero p.lead` (L208),
  `.hero-actions` (L209), `.btn` (L162) / `.btn-primary` (L164) /
  `.btn-ghost` (L167), `.hero-bg-circles` (L237–240), `.collage` / `.ph` /
  `.blob` (L223–234, declared alongside the hero rules). Also
  **`styles/mobile-tweaks.css`**: the hero `h1` font-size floor and, at
  ≤700px, hiding `.collage` entirely and showing `.img-ticker` instead
  (L26–32) — **not** a "keep one photo" simplification any more, see the
  "Mobile note" at the top of `hero.html` itself for why that distinction
  matters. Needs the shared `#uxh-flower` SVG symbol (see above) for the
  background circles and collage blobs.
- **JS behavior:** none required to render. `.reveal` / `html.reveal-on
  .reveal.in` (site.css L613–614) is a progressive-enhancement scroll-fade —
  content is fully visible without it. To keep the fade, copy the
  `IntersectionObserver` IIFE from `index.html`'s
  `<script>` block (search "Reveal-on-scroll"); this kit's own `index.html`
  includes a copy.
  The primary button's `#events` anchor assumes an on-page events section —
  optional; on the live site, JS repoints it to the public Meetup events URL
  when there's no confirmed upcoming event (`applyEventState`), but the hero
  works fine as static markup without that.
- **Adapting:** swap the `h1`, `.lead` copy, and the two `.hero-actions`
  labels/links; swap the three collage photos (keep the `srcset`/`sizes`
  pattern) and their alt text.

### `event-card.html` — "next event" feature card
- **Extracted from:** `index.html`, lines 153–206
  (`<article class="event-feature" id="event-feature">`, inside
  `<section id="events">`). On the live page that section starts `hidden`
  and is only revealed once a live event is confirmed — see JS notes below;
  the card itself renders fine standalone.
- **Depends on (`styles/site.css`):** `.event-feature` + `.ef-media` /
  `.ef-body` (L281–294), `.overlay`, `.label`, `.chip` (L182) / `.chip-teal`
  (L187), `.date-stamp` (`.num`/`.mo`/`.yr`, L288–293), `.eyebrow` / `.dot`
  (L176–177), `.ef-meta` (L297–299), `.speakers` (L301) and `.speaker-tag`
  (L302–305, hover state L332–333 — see `speaker-card.html`), `.ef-actions`,
  `.btn` (L162) / `.btn-primary` (L164) / `.btn-ghost` (L167).
- **JS behavior** (all in the inline `<script>` at the bottom of
  `index.html`): every element with an id inside the card
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
- **Extracted from:** `index.html`'s inline `<script>`, function
  `renderEvent()` (search "// speakers") — this file is that JS template
  pre-rendered as plain HTML, so a new event page can be hand-authored
  without touching any JS.
- **Depends on (`styles/site.css`):** `.speakers` (L301, flex row that
  wraps), `.speaker-tag` (L302–305) and its avatar/name/role sub-parts
  (`.av`, `.nm`, `.ro`), plus the anchor-hover variant (L332–333). Also
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
- **Extracted from:** `index.html`, lines 365–405
  (`<section id="partners" class="section tight">` > `.partner-section`).
- **Depends on (`styles/site.css`):** `.section` / `.section.tight` (L272–273),
  `.wrap` (L22), `.partner-section` (dark teal card, L433–440),
  `.partner-bg-circles` (L441–444), `.partner-section .pgrid` (two-column
  layout, L436), `.eyebrow.on-dark` (L178–179) + `.dot`, `.btn` (L162) /
  `.btn-primary` (L164), `.partner-cards` (L446) / `.partner-card` (`.pn`
  number + `h3` + `p`, L457–461). Needs the shared `#uxh-flower` SVG symbol
  (see above) for the two background circles.
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
`index.html` and `sponsors.html`), rather than keeping it inside this kit's
own folder:

- Use the partials' bare paths as-is (`styles/site.css`, `assets/…`) — no
  path rewriting needed, since the new page is at the same depth as the
  shipped pages.
- Copy the `<link>`/`<meta>` block, the Google Fonts preconnect + stylesheet,
  and the `#uxh-flower` SVG symbol from the top of `index.html`
  into the new page's `<head>`/`<body>` start.
- Copy whichever JS blocks correspond to the partials you used (mobile
  drawer, reveal-on-scroll, event rendering, add-to-calendar) from the
  `<script>` at the bottom of `index.html` — each partial file
  above says exactly which behavior it needs and where to find it.
- `sponsors.html`'s own header/footer follow the same `header.html` pattern
  (worth diffing if you want to match its nav-link set exactly).
