# Components

Seven family directories, built from what the two shipped pages actually contain
(`index.html`, `sponsors.html`, `styles/site.css`, `styles/tokens.css`,
`styles/mobile-tweaks.css`) — see `design-system-extraction.md` §3-4 for the underlying spec.
Every `index.html` renders real, verbatim markup against the real stylesheets; every
`README.md` documents exact values, real selector locations, and accessibility notes, and calls
out anywhere the shipped site diverges from its own spec or from itself page-to-page.

Built as vanilla HTML + CSS to match the live site's actual stack — no React/JSX/`.d.ts` files,
per the top-level bundle README's instruction to match the target codebase.

| Family | Components | |
|---|---|---|
| [`core/`](./core/index.html) ([README](./core/README.md)) | Button, Eyebrow, SectionHead, Tag | The atoms every other component composes. |
| [`cards/`](./cards/index.html) ([README](./cards/README.md)) | Card (sponsor / offer / team / partner shapes), TierCard, EventFeature | One family, four surface shapes, plus two card-shaped components big enough to stand alone. |
| [`data/`](./data/index.html) ([README](./data/README.md)) | StatsStrip | A hairline-divided `<dl>` stat grid, used once (sponsors.html). |
| [`nav/`](./nav/index.html) ([README](./nav/README.md)) | NavBar, MobileDrawer, Footer | Sticky pill header, its ≤880px drawer, and the dark full-bleed footer. |
| [`forms/`](./forms/index.html) ([README](./forms/README.md)) | MailingForm, DonateForm | The two homepage-only forms — Brevo signup and Stripe donation. |
| [`overlay/`](./overlay/index.html) ([README](./overlay/README.md)) | Modal | The "Next event" picker opened from NavBar's CTA — the one component with every spec'd accessibility requirement independently verified as implemented. |
| [`utility/`](./utility/index.html) ([README](./utility/README.md)) | Marquee, BackToTop, RevealOnScroll | Cross-cutting behaviours from spec §4 ("Also worth adding"). |

## How each family is built

Each family directory has exactly two files:

- **`index.html`** — one real, working preview page per family. Every component/variant it shows
  is copied verbatim out of the shipped HTML, with plain `<h2>` labels separating each one. It
  links the real stylesheets (`../../../../styles/tokens.css`, `site.css`, `mobile-tweaks.css` —
  verified with `ls` against the resolved path, not assumed) so it renders exactly as the live
  site does. Where a component's CSS is **page-scoped** inside sponsors.html's own `<style>`
  block rather than living in site.css (TierCard, the sponsor-shaped Card, and StatsStrip are all
  like this), the relevant rules are copied verbatim into the index page's own `<style>` block
  and explicitly labelled as such — never silently promoted into site.css, since that file is
  out of scope to edit for this task.
- **`README.md`** — for every component: what it is, every variant/state with exact CSS values
  (padding, radius, font, colour, transition) copied from `design-system-extraction.md` §3-4 and
  cross-checked against the live CSS, the real selector(s) and file:line where it's implemented,
  accessibility notes, and which `var(--uxh-...)` tokens it should be using.

## Inconsistencies found while cross-checking the two shipped pages

Several were found and flagged here across earlier passes; most have since been fixed in the live
site (noted below) rather than left as permanent documentation — this list is kept current, not
historical, so re-check it against the code before trusting an entry rather than the other way
around.

**Still real, as of the latest check:**

- **`.chip-teal`** (`core/README.md`): a solid-fill tag that contradicts the Tag family's own
  "outline-only, solid reserved for buttons" rule — flagged, not silently reclassified.
- **`mobile-tweaks.css`'s unconditional rules** (`cards/`, `nav/`, `overlay/README.md`): several
  of its 44px tap-target overrides (modal close button, footer socials, team-card socials) are
  **not** wrapped in any `@media` query, so despite the file's name they apply at every viewport,
  not just small screens.
- **`--uxh-dur-entry` isn't actually referenced by the CSS it describes**: the token is `600ms`
  and now correctly matches `.reveal`'s live transition duration (an earlier version of this doc
  found them disagreeing — that's fixed), but the transition rule itself still hardcodes the
  literal `600ms` twice rather than reading `var(--uxh-dur-entry)` — the token documents the
  value without being the value's actual source.

**Resolved since an earlier pass of this doc (kept here so a future check doesn't re-flag them):**

- **MobileDrawer parity**: sponsors.html's drawer used to have none of the homepage's keyboard/
  focus contract (Escape, outside-click, Tab trap, focus return, body scroll lock) — it's since
  been ported over; both pages now share one `setDrawer()` implementation. See `nav/README.md`.
- **BackToTop reduced-motion**: the homepage's click handler used to smooth-scroll unconditionally
  while sponsors.html checked `prefers-reduced-motion` first — both now check it identically. See
  `utility/README.md`.
- **Reveal-on-scroll safety net**: sponsors.html used to lack the homepage's 1200ms safety-net
  timeout that force-reveals anything the observer missed — both pages now have it. See
  `utility/README.md`.
- **`#6B6B6B` vs. `--uxh-fg-2`**: sponsors.html's page-scoped rules for secondary text (sponsor
  card body copy, StatsStrip labels) used to hardcode the literal `#6B6B6B` instead of the shared
  token — both now correctly use `var(--uxh-fg-2)`. See `cards/README.md`, `data/README.md`.
- **`.btn-dark`**: used to have no live instance in either page (the "Everything in the spec"
  section below called this out) — the mailing-form's submit button now uses it
  (`.btn.btn-dark`, index.html). See `core/README.md`.

## Known gaps carried over from `design-system-extraction.md` §6 (out of scope here)

- `logo-horizontal-seaturtle.svg` and `logo-stacked-white.svg` used to be flagged here as
  embedding bitmaps rather than true vector paths — they don't: both are clean vector paths
  (11/10 `<path>` elements + 1 `<rect>` each, no `<image>` or base64 data), just detailed enough
  to land at ~19KB. Used verbatim in NavBar and Footer's real markup.
- The icon set is hand-written inline SVG at 2.4px stroke, not Lucide — kept as-is per the
  decisions made for this task.

## Everything in the spec that has a real, working example above

Every component named in design-system-extraction.md §3 ("Component inventory") and §4 ("Also
worth adding") has at least one live instance in the shipped pages, and every one of those
instances is reproduced in a family `index.html` here — nothing in the twelve-family + 3-utility
list had to be invented from the CSS alone. One smaller piece of markup the spec mentions only in
passing still has **no live instance** anywhere in either page, and is called out rather than
faked:

- **SectionHead's `.head-meta`** (third grid column, site.css:278) — defined in CSS but never
  populated in either page's real `.section-head` markup. `core/index.html`'s example adds one
  to exercise the rule, and is labelled as such.

**No longer true:** the Button `dark` variant (`.btn-dark`) used to have no live instance either —
an earlier pass of this doc found the rule (site.css:110-111) unused by any `<button>` or `<a>` in
either page, and `core/index.html`'s example was synthesized from the CSS alone. The mailing-form
submit button (`<button type="submit" class="btn btn-dark">`, index.html) now uses it, so
`core/index.html`'s example is a real, shipped instance, not a reconstruction — check
`core/README.md` before assuming otherwise.

## Link verification

Every `index.html`'s stylesheet and asset paths were checked with `ls` against the resolved
absolute path before being trusted (not guessed) — each family directory sits four levels below
`project/` (`_ds` → the design-system folder → `components` → `<family>`), so
`../../../../styles/site.css` and `../../../../assets/<file>` are the correct relative paths from
every family's `index.html`; confirmed working for `tokens.css`, `site.css`, `mobile-tweaks.css`
in all seven families, and for every image referenced (team photos, sponsor logos, event photos,
the horizontal and stacked-white logo SVGs).
