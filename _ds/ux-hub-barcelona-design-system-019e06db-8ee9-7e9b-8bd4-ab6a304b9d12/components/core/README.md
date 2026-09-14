# Core

The four atoms every other component composes: **Button**, **Eyebrow**, **SectionHead**, **Tag**.
Open [`index.html`](./index.html) in a browser for the live-rendered catalog (loads the real
`styles/tokens.css` + `styles/site.css` + `styles/mobile-tweaks.css`).

---

## Button — `.btn`

Pill CTA. Base class + one modifier per fill.

- **Geometry:** `padding: 14px 26px` · `border-radius: 999px` (→ `var(--uxh-radius-pill)`) ·
  `font: 600 15px/1` · `gap: 10px` · `min-height: 44px` (→ `var(--uxh-tap-min)`)
- **Transition:** `filter 160ms, transform 80ms, background 160ms, color 160ms`
  (→ `var(--uxh-dur-hover)` for the 160ms legs, `var(--uxh-dur-press)` for the 80ms leg)
- **Active (all variants):** `transform: scale(0.98)`
- **Trailing arrow** (`.arrow` icon inside `.btn`): `transition: transform 200ms` (→ `var(--uxh-dur-move)`), nudges `translateX(3px)` on hover.

| Variant | Rest | Hover | Selector | Found in |
|---|---|---|---|---|
| `primary` | `var(--site-accent)` bg, `var(--site-accent-fg)` text | `filter: brightness(0.95)` | `.btn.btn-primary` | site.css:105-107 |
| `ghost` | transparent, `1px solid rgba(0,0,0,0.16)` | `rgba(42,153,160,0.08)` bg, seaturtle border+text | `.btn.btn-ghost` | site.css:108-109 |
| `dark` | `var(--uxh-fg)` bg, white text | `var(--uxh-teal-night)` bg | `.btn.btn-dark` | site.css:110-111 — **no shipped instance**; the catalog's example is synthesized from this rule alone |
| `onDark` | white bg, `var(--uxh-fg)` text | `var(--uxh-ceramic)` bg | `.btn.btn-on-dark` | site.css:112-113 |

`--site-accent` / `--site-accent-fg` are themed per page via `html[data-accent="yolk\|purple\|lime\|teal"]`
(site.css:11-15); both shipped pages set `data-accent="yolk"`.

**Accessibility:** `min-height: 44px` is enforced site-wide via the combinator rule
`.btn, .nav-cta, .join-cta, .drawer-cta, .mail-row button { min-height: 44px; }` (site.css:132) — meets
`--uxh-tap-min`. Icon-only buttons elsewhere in the system (modal close, back-to-top) rely on
`aria-label`; Button itself is always used with visible text so no extra label is needed. Focus is
the browser default outline; sponsors.html adds a page-scoped `:focus-visible` ring
(`outline: 3px solid var(--uxh-seaturtle)`, sponsors.html:27) that the homepage does not have —
worth promoting to site.css so focus styling isn't page-dependent.

**Tokens to use:** `var(--uxh-radius-pill)`, `var(--uxh-tap-min)`, `var(--uxh-dur-hover)`,
`var(--uxh-dur-press)`, `var(--uxh-dur-move)`, `var(--uxh-ease)` for the transition timing function
(currently these transitions omit an explicit easing function — they use the browser default `ease`,
not `var(--uxh-ease)`; worth aligning).

---

## Eyebrow — `.eyebrow`

Small uppercase kicker with an animated dot.

- `display: inline-flex` · `gap: 10px` · `font: 500 12px/1` · `letter-spacing: 0.14em` · uppercase ·
  color `var(--uxh-teal-night)`
- Dot: `width/height: 8px`, `border-radius: 50%`, `background: var(--uxh-seaturtle)`,
  `animation: dot-pulse 2.2s ease-in-out infinite` (scale 1→1.6, opacity 1→0.4, both at 50%)
- `.eyebrow.on-dark`: text → `var(--uxh-ceramic)`, dot → `var(--uxh-yolk)`

Selector: `.eyebrow` / `.eyebrow.on-dark` / `.eyebrow .dot` — site.css:117-121.
Found in: UX Hub Barcelona.html:146 (default), :348 and :386 (on-dark); sponsors.html:138 (default), :265 (on-dark).

**Accessibility:** the dot is purely decorative and carries no `aria-hidden` attribute in the shipped
markup — it's an empty `<span>` with no text content, so screen readers announce nothing for it, but
adding `aria-hidden="true"` explicitly would be a safer, more intentional signal. The pulsing animation
is not gated behind `prefers-reduced-motion` (unlike the marquee) — a second real gap worth fixing
alongside it.

**Tokens to use:** `var(--uxh-ease)` for the keyframe's easing (already `ease-in-out`, fine as-is);
`var(--uxh-text-on-dark)` could replace the on-dark eyebrow text color (`var(--uxh-ceramic)` is a
brand color already, so this is optional/stylistic, not a bug).

---

## SectionHead — `.section-head`

Grid: `display: grid` · `grid-template-columns: auto 1fr auto` · `gap: 28px` · `align-items: end` ·
`margin-bottom: 48px`. Collapses to a single column at **720px** (`grid-template-columns: 1fr`,
`gap: 16px`, and `.head-end { justify-self: start; }`).

- **Numeral** (`.section-number`): `font: 500 96px/1`, color `var(--site-accent)`,
  `letter-spacing: -0.04em`; `72px` at ≤720px.
- **Heading** (`.section-head h2`): `font: 700 clamp(36px, 4.6vw, 56px)/1.05`, `letter-spacing: -0.025em`,
  `max-width: 720px`, `text-wrap: balance`. Emphasis (`h2 em`) is Lora italic 500 in `var(--uxh-seaturtle)`.
- **`.head-meta`** (third grid column, optional): `color: var(--uxh-fg-2)`, `font-size: 15px`,
  `max-width: 280px` — defined in CSS (site.css:199) but **not used verbatim in either shipped page**;
  the catalog's "with head-meta" example adds one to exercise the rule.

Selector: `.section-head`, `.section-head h2`, `.section-number`, `.head-meta` — site.css:195-199.
Sponsors.html adds a page-scoped one-line variant, `h2.sp-h2-oneline` (sponsors.html:87-88): at
≥900px it forces `white-space: nowrap` and clamps `32px–56px`; below 900px it wraps and matches the
normal heading. Found in: sponsors.html:210 ("Meet our sponsors & partners").

**Gotcha called out in the spec, verified in the CSS:** `text-wrap: balance` (site.css:197) is a
`white-space` longhand. If a later rule sets `white-space: nowrap` on the same element (as the
one-line variant does above 900px), it wins over `balance` because they're the same longhand
property — order/specificity matters, not "these are independent features." This is exactly what
`.sp-h2-oneline` exploits deliberately (nowrap *replacing* balance above 900px); don't add a stray
`white-space: nowrap` to a normal, balanced `.section-head h2` expecting both to apply.

**Accessibility:** the numeral is a decorative `<span>`, not a heading level — the real heading is
the adjacent `<h2>`, so heading-order semantics stay correct even though the numeral is the visually
dominant element. No `aria-hidden` on the numeral in the shipped markup; since it duplicates no
information (it's not read as "01" needing to be skipped) this is a minor, not urgent, gap.

**Tokens to use:** none of the new radius/motion tokens apply here (no radius, no transition); the
numeral color already correctly resolves through `var(--site-accent)`.

---

## Tag — `.badge`, `.promo`, `.promo-soon`, `.pn` (+ bonus `.chip`)

Outline-only chips — solid fills are meant to be reserved for Button.

### `.badge`
`padding: 6px 12px`, pill, `font: 600 12px/1`, `letter-spacing: 0.06em`, uppercase,
`rgba(243,167,50,0.16)` fill + `1.5px solid rgba(243,167,50,0.75)` border, `var(--uxh-fg)` text.
On a dark tier (`.tier.is-teal .badge`): `rgba(255,255,255,0.16)` fill, `rgba(255,255,255,0.6)` border,
white text.
**Selector/location:** defined **page-scoped** in `sponsors.html`'s own `<style>` block
(sponsors.html:46-47), not in site.css. **Found in:** sponsors.html:168, 180, 192
("Friend" / "Supporter" / "Season partner" tier badges).

### `.promo`
`padding: 8px 14px`, pill, `font: 600 13px/1`, `min-height: 40px`, `rgba(42,153,160,0.12)` fill +
`1.5px solid var(--uxh-seaturtle)` border, `var(--uxh-teal-night)` text. Inner `<code>` sits in its
own white pill: `padding: 3px 7px`, `border-radius: 6px`, `background: var(--uxh-white)`,
`1px solid rgba(42,153,160,0.35)`.
**Selector/location:** page-scoped in sponsors.html (sponsors.html:73-74). **Found in:**
sponsors.html:246 (Uxcel, "25% off with code `UXSALON25`").

### `.promo.promo-soon`
`rgba(0,0,0,0.035)` fill, `1.5px dashed rgba(0,0,0,0.28)` border, `#5E5E5E` text.
**Selector/location:** sponsors.html:75. **Found in:** sponsors.html:221 (Uxia) and :237 (IxDF).

### `.pn` (numeral, on dark panels)
Same geometry as `.badge` on dark: `padding: 6px 12px`, pill, `rgba(255,255,255,0.16)` fill,
`1.5px solid rgba(255,255,255,0.6)` border, white text, `font: 600 12px/1`, `letter-spacing: 0.06em`,
uppercase.
**Selector/location:** `.partner-card .pn` — site.css:380. **Found in:** UX Hub Barcelona.html:361-371
(partner cards "01"/"02"/"03") and sponsors.html:275-278 ("01"–"04").
Note: a *different* `.pn` exists — `.pillar .pn` (site.css:293-294), a solid-yolk circular numeral for
an "About" pillars grid (`.about-grid .pillars`, site.css:287). **Neither `.pillar` nor `.pillars` has
any live markup in either shipped page** — the CSS rule is currently dead code; the homepage's real
About section uses `.about-stats .stat` instead (see `data/README.md`).

### Bonus: `.chip.chip-teal` (not named in the spec's Tag list)
`display: inline-flex`, `padding: 6px 12px`, pill, `font: 500 13px/1`, base `.chip` background
`var(--uxh-soft-beige)`; `.chip-teal` overrides to `background: var(--uxh-seaturtle)`, `color: #fff`
— a **solid** fill. **Selector/location:** site.css:123-129 (`.chip`, `.chip-yolk`, `.chip-lime`,
`.chip-purple`, `.chip-teal`, `.chip-outline`). **Found in:** UX Hub Barcelona.html:132, the event
status label ("Talk · free"). Only `.chip-teal` has a live instance; `.chip-yolk`, `.chip-lime`,
`.chip-purple` and `.chip-outline` are defined but unused in either page.
**Flagging, not silently fixing:** this solid teal fill directly contradicts the family's own
"outline-only, solid reserved for buttons" rule. Either treat `.chip-teal` as an intentional exception
(a status pill, conceptually closer to a badge-of-record than a filter tag) or replace it with an
outline-style tag before calling the rule consistent.

**Accessibility (all Tag variants):** none of these are interactive, so no `role`/tab-stop concerns.
Where a tag sits next to a heading it is announced as a separate text node by screen readers; the
shipped markup never relies on tag color alone to convey the state (each has an accompanying text
label — "Friend", "25% off…", "Talk · free" — so color is reinforcement, not the sole channel).

**Tokens to use:** `var(--uxh-radius-pill)` for every pill radius above; `var(--uxh-chip-on-dark)`
(`rgba(255,255,255,0.16)`) for `.badge`-on-dark and `.pn`'s fill — both currently hardcode the same
literal rgba() the token now names; `var(--uxh-border-on-dark)` is close to, but not identical to,
the `.pn`/dark-badge border (`rgba(255,255,255,0.6)` vs. the token's `rgba(255,255,255,0.12)`) — don't
conflate the two, the tag border is intentionally much stronger.
