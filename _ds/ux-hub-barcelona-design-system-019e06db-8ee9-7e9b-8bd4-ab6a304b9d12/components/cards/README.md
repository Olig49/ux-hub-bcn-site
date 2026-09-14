# Cards

One family, four surface **shapes** of `Card` (sponsor / offer / team / partner-on-dark),
plus **TierCard** and **EventFeature**, which are card-shaped but big enough to be their
own components. Open [`index.html`](./index.html) for the live-rendered catalog.

**Cross-family rule (spec, §3):** cards carry a hairline border OR `--uxh-shadow-md`,
never both. Verified against every real card below — true in every case.

---

## Card — sponsor shape — `.sponsor-card`

- **Geometry:** `background: var(--uxh-white)`, `1px solid var(--uxh-line)`, `border-radius: 20px`
  (→ `var(--uxh-radius-lg)`), `padding: 28px`, `display: flex; flex-direction: column; gap: 12px`.
- **Title** (`h4`): `font: 700 22px/1.15`, `letter-spacing: -0.02em`.
- **Body** (`p`): `font-size: 15px; line-height: 1.55; color: #6B6B6B`.
- **Footer link** (`.visit`): `font: 600 14px/1`, `min-height: 44px`, `white-space: nowrap`,
  color `var(--uxh-teal-night)`; its `svg` nudges `translate(2px,-2px)` on hover, `transition: transform 200ms`.
- **Feature variant** (`.sponsor-card.feature`): spans the full grid row (`grid-column: 1 / -1`),
  `flex-direction: row`, `background: var(--uxh-soft-beige)`, `border-color: transparent` (so it
  keeps the "border OR shadow, never both" rule by dropping the border entirely, not by adding a
  shadow). Stacks to `flex-direction: column` at ≤820px.
- **`.sp-logo-img`**: sponsor's own logo image in place of a text `.logo` chip; `height: 52px` standalone,
  or (inside `.feature`) `width: 260px`, boxed in a white `border + border-radius:16px` frame with
  `padding: 32px 28px`, full-width at ≤820px.

**Selector/location:** `.sponsor-card`, `.sponsor-card .logo/h4/p/.promo/.visit`, `.sponsor-card.feature`,
`.sp-cover`, `.sp-logo-img` — all **page-scoped** in sponsors.html's own `<style>` block
(sponsors.html:69-82, :96-98), **not in site.css**. Wrapper classes `.sp-class` / `.sp-class-label`
(sponsors.html:63-66) group cards under a heading ("Sponsor", "Educational sponsors") with a
hairline rule trailing the label.

**Found in:** sponsors.html:213-254 — Uxia (feature), Interaction Design Foundation, Uxcel.

**Tag reuse:** the `.promo` / `.promo.promo-soon` chips inside these cards are the same Tag
component documented in `core/README.md` — see that file for their exact geometry; not repeated here.

**Accessibility:** external links carry a visually-hidden `" (opens in a new tab)"` span
(`.sr-only`) alongside `target="_blank" rel="noopener"` — screen-reader users get the same warning
sighted users get from context. `.visit`'s 44px `min-height` meets `--uxh-tap-min` even though the
link's visible content is short text; the hover-only arrow nudge is decorative and doesn't gate
any information.

**Tokens to use:** `var(--uxh-radius-lg)` for the 20px radius; `var(--uxh-line)` already used
correctly; `var(--uxh-fg-2)` (`#6a6a6a`) is the AA-corrected token — the card body copy currently
hardcodes the **uncorrected** literal `#6B6B6B` instead (sponsors.html:30, :72) rather than either
the old `#777` or the new `#6a6a6a` token; worth reconciling to one value, ideally the token.

---

## Card — offer shape — `.offer-card`

- **Geometry:** `border-radius: 24px` (→ `var(--uxh-radius-xl)`), `padding: 32px`,
  `min-height: 380px`, `display: flex; flex-direction: column; gap: 18px`, `overflow: hidden`,
  `position: relative`.
- **Hover:** `transform: translateY(-4px)`, `transition: transform 240ms cubic-bezier(.2,.8,.2,1)`
  (→ `var(--uxh-dur-layout)` + `var(--uxh-ease)`).
- **Label** (`.num`): `font: 600 14px/1`, `letter-spacing: 0.12em`, `color: rgba(0,0,0,0.72)`.
- **Title** (`h3`): `font: 700 30px/1.1`, `letter-spacing: -0.025em`.
- **Body** (`p`): `font-size: 15px; line-height: 1.55; color: rgba(0,0,0,0.72)`.
- **Mark** (`.icon-blob`): `88px × 88px`, `margin-top: auto` (pinned to card bottom),
  `align-self: flex-start`. Colour follows the surface: `is-ceramic` → `var(--uxh-teal-night)`,
  `is-purple` → `oklch(0.38 0.062 233)`, `is-sand` → `oklch(0.40 0.072 179)` — each is a teal
  tuned to sit on top of its own background, not one shared colour.
- **Backgrounds:** `.is-ceramic` → `var(--uxh-ceramic)`, `.is-purple` → `var(--uxh-purple)`,
  `.is-sand` → `var(--uxh-warm-sand)`.
- **`.arrow-corner`** (defined site.css:272-274, `40px` circle, `rgba(255,255,255,0.6)` fill,
  rotates `-45deg` + fills `var(--uxh-fg)` on card hover): the rule exists but **no shipped
  instance uses it** — the three real offer-cards never include this element. Documented for
  completeness only; don't assume it's live.

**Selector/location:** `.offer-card`, `.offer-card.is-*`, `.icon-blob` — site.css:338-353.
**Found in:** index.html:218-244, "Learn / Meet / Connect" 3-up (`.offer-grid`,
`grid-template-columns: repeat(3,1fr)`, collapses to one column ≤980px).

**Accessibility:** the flower mark is `aria-hidden="true"`; card copy carries the meaning
(label + heading + paragraph), so the icon is purely decorative reinforcement, not required
for comprehension.

**Tokens to use:** `var(--uxh-radius-xl)`, `var(--uxh-dur-layout)`, `var(--uxh-ease)` for the hover
transition (currently hardcodes the cubic-bezier literal rather than the token).

---

## Card — team shape — `.team-card`

- **Geometry:** `background: var(--uxh-warm-white)`, `1px solid var(--uxh-line)`,
  `border-radius: 20px` (→ `var(--uxh-radius-lg)`), `padding: 14px`, `gap: 12px`.
  Hover: `transform: translateY(-3px)`, `transition: transform 240ms` (→ `var(--uxh-dur-layout)`,
  though the transition omits an explicit easing function, unlike the offer-card).
- **Avatar** (`.av`): `aspect-ratio: 1`, `border-radius: 16px`, one of **six** accent tints via
  modifier classes: `t-y` (yolk), `t-p` (purple), `t-l` (lime), `t-s` (warm sand), `t-tn`
  (teal-night, white text), `t-c` (ceramic). Photo sits absolutely positioned inside
  (`object-fit: cover; object-position: top center`).
- **Name** (`h3`): `font: 600 16px/1.2`, `letter-spacing: -0.01em`. **Role**: `font: 500 12px/1.3`,
  `color: var(--uxh-fg-2)`.
- **Socials:** `28px` circle in site.css, `background: var(--uxh-soft-beige)`, hover →
  `var(--uxh-seaturtle)` fill + white icon. **`mobile-tweaks.css:22` overrides this to `44px ×
  44px` unconditionally** — that rule isn't wrapped in any `@media` query, so despite the
  file's name it applies at every viewport width (mobile-tweaks.css loads after site.css on both
  pages, so 44px wins in practice everywhere, not just on small screens). The spec's "Social
  links must be 44px, not 28px" note is therefore *already satisfied* in the shipped site, just
  not inside site.css itself — the 28px in site.css is effectively dead code, superseded site-wide.
- **"Join the crew" variant** (`.team-join`): copy-only card, `background: var(--uxh-soft-beige)`,
  `border-color: transparent` (border dropped, not doubled with a shadow — same rule as the
  sponsor-card feature variant). CTA (`.join-cta`) is yolk-filled, pill, `font: 600 13px/1`,
  arrow nudges `translateX(3px)` on hover. At ≤980px this card takes the full grid row
  (`grid-column: 1 / -1`) so it stops rendering as a tall, narrow column — site.css:389.

**Selector/location:** `.team-card`, `.team-card.t-*`, `.team-card .av/.socials`, `.team-join`
— site.css:393-430. **Found in:** index.html:281-362 (six team members + join card).

**Accessibility:** each social link has an explicit `aria-label` ("Oliver on LinkedIn") since the
icon alone carries no accessible name. As noted above, the 44px enlargement applies to every
viewport, mouse and touch alike — a reasonable simplification, but worth knowing it's not
touch-only despite living in a file called mobile-tweaks.css.

**Tokens to use:** `var(--uxh-radius-lg)`, `var(--uxh-dur-layout)`, `var(--uxh-tap-min)` for the
socials (44px, already met via mobile-tweaks.css rather than a token reference).

---

## Card — partner shape (on dark) — `.partner-card`

- **Geometry:** `background: rgba(255,255,255,0.06)`, `1px solid rgba(255,255,255,0.12)`
  (→ `var(--uxh-border-on-dark)`), `border-radius: 20px` (→ `var(--uxh-radius-lg)`), `padding: 22px`.
- **Numeral** (`.pn`): pill, `padding: 6px 12px`, `rgba(255,255,255,0.16)` fill
  (→ `var(--uxh-chip-on-dark)`), `1.5px solid rgba(255,255,255,0.6)` border (**not**
  `var(--uxh-border-on-dark)` — that token is `0.12` alpha, this border is deliberately much
  stronger at `0.6`; don't conflate the two), `font: 600 12px/1`, uppercase.
- **Title** (`h3`/`h4`): `font: 600 18px/1.25`, `letter-spacing: -0.01em`, white.
- **Body** (`p`): `font-size: 14px`, `color: rgba(255,255,255,0.72)` (→ `var(--uxh-text-on-dark-muted)`).
- **Below 620px:** becomes a two-column grid per card — `grid-template-columns: auto 1fr`, numeral
  and heading share row 1 so the numeral sits inline with the heading, body copy spans both columns
  underneath (site.css:449-455). This is exactly the spec's called-out behaviour.

**Selector/location:** `.partner-card`, `.partner-card .pn` — site.css:457-461 (mobile override
:449-455). **Found in:** index.html:385-401 (3 cards, homepage "For partners" panel)
and sponsors.html:274-279 (4 cards, reused verbatim on the sponsors-page CTA, numbered 01-04).

**Accessibility:** on the dark `--uxh-teal-night` surface, body text at `rgba(255,255,255,0.72)`
and the numeral border are both deliberately boosted contrast choices for a dark background —
consistent with the spec's general on-dark accessibility corrections (see `core/README.md`'s
Tag section for the sibling `.pn` used outside this card).

**Tokens to use:** `var(--uxh-radius-lg)`, `var(--uxh-chip-on-dark)` for the numeral fill.

---

## TierCard — `.tier`

- **Geometry:** `border-radius: 24px` (→ `var(--uxh-radius-xl)`), `padding: 32px`,
  `display: flex; flex-direction: column; gap: 14px`, `min-height: 320px`.
- **Surfaces:** `is-ceramic` (Friend), `is-beige` (Supporter), `is-teal` (Season partner, white text).
- **Structure, top to bottom:** Badge (`.badge`, reuses Tag's badge geometry — see
  `core/README.md`) → heading (`h3`, `font: 700 26px/1.1`, `letter-spacing: -0.02em`) → price
  (`.price`, `font: 600 15px/1`) → checklist (`ul[role="list"]`, 18px check icons) → CTA.
- **Price colour:** `var(--uxh-teal-night)` on the light surfaces, `#F7C77E` on `is-teal`
  (→ `var(--uxh-amber-on-dark)` — the AA-corrected accessibility token from §2 of the spec:
  plain Yolk on Teal Night measures only 3.7:1, so this amber substitute is used instead, and
  the CSS already gets this right, just as a bare literal rather than the token name).
- **Checklist:** `<ul role="list">` is required because `list-style: none` strips list
  semantics in most screen readers — the shipped markup already includes this role. Icons are
  `aria-hidden="true"`, `18px × 18px`, coloured to match the price (`var(--uxh-teal-night)` /
  `#F7C77E` on teal).
- **CTAs carry equal visual weight** by design even though their fill differs
  (`btn-ghost` / `btn-primary` / `btn-on-dark`) — all three are "the same action" per the spec,
  just styled to read correctly against their own card surface. `.tier-cta` stretches full-width
  (`align-self: stretch`) and centers its label.

**Selector/location:** `.tier`, `.tier.is-*`, `.tier .badge/h3/.price/ul/li/svg/.tier-cta` — all
**page-scoped** in sponsors.html's own `<style>` block (sponsors.html:40-57), **not in site.css**.
`.sp-tiers` (sponsors.html:40-41) is the 3-up grid wrapper, one column at ≤900px.

**Found in:** sponsors.html:166-202 — Friend / Supporter / Season partner.

**Accessibility:** each `<article class="tier">` carries `aria-labelledby` pointing at its own
`h3` id, giving the tier a real accessible name distinct from "third article on the page." Focus
inside `.tier.is-teal` (dark surface) gets a page-scoped override to a yolk focus ring instead of
the seaturtle default (sponsors.html:28, `:focus-visible` at line 27) — a per-surface contrast
fix worth knowing about since it means focus-ring colour is **not** uniform across the page.

**Tokens to use:** `var(--uxh-radius-xl)`, `var(--uxh-amber-on-dark)` for the on-dark price colour.

---

## EventFeature — `.event-feature`

- **Geometry:** `display: grid; grid-template-columns: 1.05fr 0.95fr`, `border-radius: 24px`
  (→ `var(--uxh-radius-xl)`), `overflow: hidden`, `background: var(--uxh-soft-beige)`,
  `box-shadow: var(--uxh-shadow-md)` (a card that uses the shadow half of the "border OR shadow"
  rule, with no border at all). Collapses to one column at ≤880px.
- **Media side** (`.ef-media`): `min-height: 360px`, `background: var(--uxh-seaturtle)` fallback
  (shows if the image is slow/missing), image `object-fit: cover`, a bottom gradient
  `.overlay` for legibility, a status chip top-left, and a white `.date-stamp` pill bottom-left
  (`border-radius: 16px`, `padding: 12px 16px`, day number `font: 700 36px/1`, month `font: 600
  12px/1` uppercase teal-night, weekday+time `font: 500 14px/1.2`).
- **Body** (`.ef-body`): `padding: 44px` (→ 32px 24px at ≤720px), `gap: 18px`,
  `justify-content: center`. Title `font: 700 clamp(28px, 3.4vw, 40px)/1.1`, `text-wrap: balance`.
- **Speaker tags:** `.speaker-tag`, `rgba(255,255,255,0.7)` pill, `32px` avatar,
  hover → `#fff` background if the tag is a link (`event-feature a.speaker-tag`, site.css:332-333).

**Selector/location:** `.event-feature` and all `.ef-*` descendants — site.css:281-305.
**Found in:** index.html:153-206.

**Accessibility:** the status chip and date-stamp are supplementary — the real event
information (title, venue, time, price) is in visible text, not conveyed by colour or icon
alone. The three action icons in `.ef-meta` (location pin, clock, price) are decorative (no
`aria-hidden` in the shipped markup, but each sits beside its own text label, so no information
is icon-only). Content is populated at runtime from `data/events.json` by inline JS
(index.html:875-985, `renderEvent`/`applyEventState`); the markup shown in the catalog is the
as-shipped static fallback, used verbatim.

**Tokens to use:** `var(--uxh-radius-xl)`, `var(--uxh-shadow-md)` (already correctly referenced
in the source CSS).
