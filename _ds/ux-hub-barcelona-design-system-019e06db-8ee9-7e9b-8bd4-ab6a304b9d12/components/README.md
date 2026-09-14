# Components

Seven family directories, built from what the two shipped pages actually contain
(`UX Hub Barcelona.html`, `sponsors.html`, `styles/site.css`, `styles/tokens.css`,
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

## Real inconsistencies found while cross-checking the two shipped pages

These are flagged in the relevant family's README, not silently fixed (the source files are
read-only for this task):

- **MobileDrawer** (`nav/README.md`): the homepage's drawer has a full keyboard/focus contract
  (Escape, outside-click, Tab trap, focus return, body scroll lock); sponsors.html's identical
  markup has none of that — just open/close toggling.
- **BackToTop** (`utility/README.md`): sponsors.html's click handler checks
  `prefers-reduced-motion` before smooth-scrolling; the homepage's does not.
- **Reveal-on-scroll** (`utility/README.md`): the homepage has a 1200ms safety-net timeout that
  force-reveals anything the observer missed; sponsors.html has no equivalent.
- **Reveal-on-scroll duration token** (`utility/README.md`): the spec names
  `--uxh-dur-entry: 400ms`, but the shipped CSS transition is actually `600ms` — the token and
  the live value disagree.
- **`#6B6B6B` vs. `--uxh-fg-2`** (`cards/README.md`, `data/README.md`): several page-scoped rules
  in sponsors.html hardcode `#6B6B6B` for secondary text — neither the original `#777` token value
  nor its `#6a6a6a` AA-corrected replacement, a third, uncoordinated literal.
- **`.chip-teal`** (`core/README.md`): a solid-fill tag that contradicts the Tag family's own
  "outline-only, solid reserved for buttons" rule — flagged, not silently reclassified.
- **`mobile-tweaks.css`'s unconditional rules** (`cards/`, `nav/`, `overlay/README.md`): several
  of its 44px tap-target overrides (modal close button, footer socials, team-card socials) are
  **not** wrapped in any `@media` query, so despite the file's name they apply at every viewport,
  not just small screens.

## Known gaps carried over from `design-system-extraction.md` §6 (out of scope here)

- `logo-horizontal-seaturtle.svg` and `logo-stacked-white.svg` embed bitmaps rather than true
  vector paths (~19KB each) — used verbatim in NavBar and Footer's real markup regardless; not
  touched by this catalog.
- The icon set is hand-written inline SVG at 2.4px stroke, not Lucide — kept as-is per the
  decisions made for this task.

## Everything in the spec that has a real, working example above

Every component named in design-system-extraction.md §3 ("Component inventory") and §4 ("Also
worth adding") has at least one live instance in the shipped pages, and every one of those
instances is reproduced in a family `index.html` here — nothing in the twelve-family + 3-utility
list had to be invented from the CSS alone. Two smaller pieces of markup the spec mentions only
in passing turned out to have **no live instance** anywhere in either page, and are called out
rather than faked:

- **Button `dark` variant** (`.btn-dark`) — the rule exists in site.css:110-111, but no `<button>`
  or `<a>` in either shipped page carries the class. `core/index.html`'s example is synthesized
  directly from the CSS rule alone, and is labelled as such.
- **SectionHead's `.head-meta`** (third grid column, site.css:199) — defined in CSS but never
  populated in either page's real `.section-head` markup. `core/index.html`'s example adds one
  to exercise the rule, and is labelled as such.

## Link verification

Every `index.html`'s stylesheet and asset paths were checked with `ls` against the resolved
absolute path before being trusted (not guessed) — each family directory sits four levels below
`project/` (`_ds` → the design-system folder → `components` → `<family>`), so
`../../../../styles/site.css` and `../../../../assets/<file>` are the correct relative paths from
every family's `index.html`; confirmed working for `tokens.css`, `site.css`, `mobile-tweaks.css`
in all seven families, and for every image referenced (team photos, sponsor logos, event photos,
the horizontal and stacked-white logo SVGs).
