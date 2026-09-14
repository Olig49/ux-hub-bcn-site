# Data

One component: **StatsStrip**. Open [`index.html`](./index.html) for the live-rendered catalog.

---

## StatsStrip — `.sp-stats`

A `<dl>` styled as a hairline-divided stat grid.

- **The divider trick:** `background: var(--uxh-line)` on the grid itself, `gap: 2px` between
  cells, and each cell (`.sp-stats > div`) painted `background: var(--uxh-white)` — the 2px of
  visible grid background between white cells *reads* as a 2px divider line without a single
  `border` property anywhere. The whole grid then gets `border: 1px solid var(--uxh-line)`,
  `border-radius: 18px`, `overflow: hidden` so the outer edge is a clean hairline frame with
  square-cut internal dividers.
- **Grid:** `display: grid; grid-template-columns: repeat(3, 1fr)`; one column at ≤720px.
- **Cell:** `display: flex; flex-direction: column; gap: 8px; padding: 26px 28px`.
- **`dt`:** `font: 500 13px/1.2`, `letter-spacing: 0.04em`, uppercase, `color: var(--uxh-fg-2)`.
- **`dd`:** `font: 500 34px/1`, **Lora** (`var(--uxh-font-serif)`), `color: var(--uxh-teal-night)`,
  `display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap` (so a `dd` plus its
  `.sp-stat-sub` label can wrap onto a second line at narrow widths instead of overflowing).
  Drops to 30px at ≤720px.
- **`.sp-stat-sub`:** the smaller trailing label inside a `dd` ("from 310 ratings", "every
  meetup, always") — `font: 400 14px/1.3`, `color: var(--uxh-fg-2)`.

**Selector/location:** `.sp-stats`, `.sp-stats > div`, `.sp-stats dt/dd`, `.sp-stat-sub` — all
**page-scoped** in sponsors.html's own `<style>` block (sponsors.html:90-95). **Not in site.css
at all** — StatsStrip exists exactly once, on the sponsors page, and was never promoted to the
shared stylesheet. If a second page needs a stats strip, these rules should move to site.css
first rather than being copy-pasted into a third `<style>` block.

**Found in:** sponsors.html:171-172 — "Members on Meetup" (2,816), "Group rating" (4.7, from 310
ratings) — plus a third stat, "Cost to attend" (Free, every meetup, always), directly below.

**Accessibility:** using a real `<dl>`/`<dt>`/`<dd>` triplet (rather than three generic `<div>`s)
gives each stat a genuine term/definition relationship that assistive tech can announce as such,
with no extra `role` needed — a case where reaching for the semantic HTML element already solves
the accessibility question. `dt` and `.sp-stat-sub` used to hardcode the uncorrected literal
`#6B6B6B` instead of `var(--uxh-fg-2)` (the same issue `cards/README.md` used to flag for
`.sponsor-card p`) — both have since been fixed to use the token.

**Live data note:** the 2,816 members figure and the 4.7 rating are the last-known-good values
baked into the HTML as a fallback. Inline JS re-fetches `data/events.json` on page load and
overwrites `#stat-members`, `#stat-rating` and `#stat-rating-sub` if the fetch succeeds
(sponsors.html:407-412) — the same daily-refreshed data source the homepage's EventFeature and
About-section member count use (see `cards/README.md`'s EventFeature entry).

**Tokens to use:** `var(--uxh-line)` is already used correctly for both the divider background and
the outer border; `var(--uxh-fg-2)` is now correctly used for `dt` and `.sp-stat-sub` too. No
radius token exists for `18px` — it sits between `var(--uxh-radius-lg)` (20px) and
`var(--uxh-radius-md)` (12px) as its own one-off value; not worth adding a new token for a single
18px instance.
