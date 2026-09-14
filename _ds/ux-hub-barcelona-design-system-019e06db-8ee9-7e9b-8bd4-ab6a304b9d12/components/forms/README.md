# Forms

**MailingForm** and **DonateForm**. Both are homepage-only. Open [`index.html`](./index.html)
for the live-rendered catalog.

---

## MailingForm — `.mail-form`

Rebuilt since the spec was first written: the Brevo list behind this form actually requires
`EMAIL`, `FIRSTNAME`, `LASTNAME`, `LINKEDIN`, `JOB_TITLE`, and a GDPR consent checkbox
(`OPT_IN`) — not just email. The form now collects all six.

- **Card:** `background: var(--uxh-soft-beige)`, `border-radius: 24px` (→ `var(--uxh-radius-xl)`),
  `padding: 28px`, `box-sizing: border-box`. (No more fixed `min-height` — content naturally
  determines height now that there are five fields instead of one.) **No `max-width` any more
  either** — it used to be capped at `460px`, a leftover from the single-email-field version, which
  left unused whitespace once the card grew to five fields tall inside its `.mailing` grid column.
  The card now fills its column the same way DonateForm's card fills its own (see below).
- **Fields** (`.mail-field`, grouped two-up for first/last name via `.mail-field-group`): each
  is a `<label>` + a `.mail-row` + an optional `.mail-error`. **Label:** `padding-left: 14px`,
  `font: 500 13px/1`, `color: var(--uxh-fg-2)`, `letter-spacing: 0.04em`.
- **Row** (`.mail-row`) — **intentionally matches DonateForm's field treatment, not a pill:**
  `border-radius: 12px` (→ `var(--uxh-radius-md)`), `border: 1px solid var(--uxh-line-strong)`,
  `padding: 0 14px`, white background, `:focus-within` → seaturtle border. Input: `padding: 13px
  0`, `font: 500 16px/1` (16px directly, not the old 15px+mobile-override split — avoids the iOS
  zoom-on-focus problem without needing a separate rule). This was a real inconsistency until it
  was fixed: the row used to be a `999px` pill with a shadow instead of a border, the only
  field-like element on the page styled that way while every other input (DonateForm's amount
  chips, and its now-removed custom-amount field — see DonateForm below) used radius-md +
  line-strong border. See "Field radius vs. button radius" below for why buttons stay pill-shaped
  while this didn't.
- **Error state** (`.mail-row.has-error` / `.mail-error`): added along with the Brevo rebuild —
  the form used to rely solely on the browser's native validation bubble, which also silently
  swallows the `submit` event before any custom JS can run. Now `novalidate` on the `<form>`
  plus `checkValidity()` in JS drive a red-outlined row + inline error message per field,
  cleared as the visitor corrects it. Same pattern applied to `.mail-optin.has-error` for the
  consent checkbox.
- **Consent** (`.mail-optin`): a real, visible, unchecked-by-default checkbox — `flex` row,
  `gap: 10px`, `padding: 0 14px`, checkbox `20×20px` with `accent-color: var(--uxh-seaturtle)`.
  Required; never pre-check or hide this to dodge Brevo's validation — that's not a bug fix,
  that's faking consent.
- **Button:** the shared `.btn.btn-dark` component (see `core/README.md`), not a bespoke
  `.mail-row button` anymore — it doesn't fit inside a multi-field row layout, so it now sits on
  its own line below all fields, `margin: 18px 14px 0` to align with the fields' left edge.
- **Acknowledgement** (`.mail-ack`): `hidden` by default, `role="status"`, un-hidden by the
  submit handler once every field passes validation — an optimistic, not confirmed, success
  message (see "Why it posts to a new tab" below).
- **Honeypot + locale:** `email_address_check` (visually hidden via `.mail-hp`, a standard
  clip-rect off-screen technique — not `display:none`, which some spam bots skip) and a hidden
  `locale=en` field, both copied verbatim from Brevo's own generated form markup.

**Selector/location:** `.mail-form` and all descendants — site.css. **Found in:** index.html
(homepage-only; sponsors.html has no mailing form).

**Parent grid** (`.mailing`): `display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px;
align-items: center;` — matches the Donate section's grid immediately above it
(`.donate { grid-template-columns: 1.05fr 0.95fr; align-items: center; }`) so both sections read
as the same layout pattern up and down the page. This used to be `align-items: start`, which
looked fine with the old one-field form but left the copy column pinned to the top once the card
grew taller than it — a real inconsistency with the section right above, not a deliberate
variation. Collapses to a single column at ≤980px, same breakpoint as `.donate`'s at ≤900px.

**Why it posts to a new tab:** the form's real `action` targets Brevo (`sibforms.com`) with
`method="post" target="_blank" rel="noopener"` — Brevo's endpoint doesn't support CORS for a
same-tab fetch/XHR confirmation, so the page can't know whether the POST succeeded server-side.
The client-side validation described above at least guarantees a well-formed submission before
that tab opens; whether Brevo itself accepts it is still unconfirmed from the page's perspective.

**Accessibility:** every input has an associated `<label for>` and `aria-describedby` pointing
at its error message; `aria-invalid` is kept in sync as each field's error state toggles.
`font-size: 16px` on every input prevents the iOS auto-zoom-on-focus behaviour that would
otherwise disorient the layout after typing.

**Field radius vs. button radius — not an inconsistency:** the brand's own rule (README.md,
"Layout, shapes, motifs") is explicit that buttons go full pill while everything else scales
from 8–28px. DonateForm already ships this exact split — `.amount` chips at `radius-md` (12px)
sitting directly above a `.btn.btn-primary.donate-submit` pill — with no reported issue, which is
why MailingForm's row was the actual outlier to fix, not evidence that pill buttons next to
non-pill fields is wrong. The pill exists specifically to make buttons read as "tap this to act,"
distinct from "type into this" — mixing the two on the same control would blur that signal, not
sharpen it.

**Tokens to use:** `var(--uxh-radius-xl)` (card), `var(--uxh-radius-md)` (rows — matches
DonateForm), `var(--uxh-line-strong)` (row border), `var(--uxh-input-font)` (16px input
font-size).

---

## DonateFacts — `.donate-facts`

The €-amount / impact-description list in `.donate-copy`, to the left of `.donate-card` on the
dark Donate panel (not part of the card or form itself).

- **Row** (`.donate-facts li`): `display: grid; grid-template-columns: 44px 1fr; align-items:
  start; gap: 16px`. **Was** `display: flex; align-items: baseline` — baseline alignment pins
  the amount to the *first line* of its description, which is invisible when every description
  is one line but leaves the amount stranded near the top on a two-line row ("snacks for 4
  tables of newcomers", "drinks for a third of the room at one meetup") with nothing next to the
  wrapped second line — a real misalignment, not just a style nit. `align-items: start` on a
  fixed-width grid column fixes it (the amount now aligns with the description block as a
  whole, and every description starts at the exact same x regardless of how many digits the
  amount has, which `min-width: 44px` on a flex item only approximated).
- **Amount** (`.df-n`): `font: 700 22px/1`, `color: var(--uxh-yolk)`.
- **Description** (`.df-l`): `font-size: 15px`, `line-height: 1.35` (tightened from the default
  ~1.5 — a two-line description reads as one compact block instead of loosely spaced, which
  matters more now that `align-items: start` makes the two-line rows visibly taller than the
  one-line row).
- **List gap:** `16px` between rows (was `12px` — bumped slightly since rows are no longer a
  uniform height once alignment stopped hiding the one-line/two-line difference).

**Selector/location:** `.donate-facts`, `.df-n`, `.df-l` — site.css, inside the `.donate-copy`
block. **Found in:** index.html only (homepage's Donate section; sponsors.html has no Donate
section).

**Tokens to use:** none currently reference a design token (`22px`/`15px`/`16px` are bare
literals) — no exact token match in the scale, left as-is rather than forcing a near-miss.

---

## DonateForm — `.donate-card`

- **Card:** `background: var(--uxh-warm-white)`, `border-radius: 20px` (→ `var(--uxh-radius-lg)`),
  `padding: 28px`, `box-shadow: var(--uxh-shadow-lg)` — on its native dark (`--uxh-teal-night`)
  panel, this card is the one light surface in the section.
- **Amount chips** (`.amount`): `flex: 1 1 60px`, `padding: 14px 0`, `border-radius: 12px` (→
  `var(--uxh-radius-md)`), `1px solid var(--uxh-line-strong)`, `font: 600 17px/1`. Active state
  (`.is-active`): seaturtle fill, white text, matching border colour. **Three chips**, `€15` /
  `€25` / `€45` — "Any amount" is deliberately *not* a fourth chip in this row (see below).
- **"Any amount"** (`.amount-any`) — a separate full-width selector on its own line below the
  three preset chips, inside the same `.amount-group` radiogroup wrapper (so it's still part of
  one accessible group, just not visually competing for space in the flex-grow row). Two things
  drove this shape, both from real usage:
  - It replaced an earlier `<input type="number">` design (`.custom-row`, now removed
    entirely) that asked the visitor to type an amount on this page *and then again* on
    Stripe's own page — Stripe Payment Links can't accept a pre-filled custom price via URL (a
    real, confirmed Stripe limitation, not a bug in this codebase), so the typed value here was
    never actually reaching checkout. Clicking `.amount-any` sets no local number at all — it
    opens Stripe's own customer-enters-amount page (`STRIPE_DONATE_ANY`) directly, so the
    amount is typed exactly once, in the right place.
  - It was tried as a fourth chip in the same row first (`flex: 1 1 60px` squeezed "Any amount"'s
    longer label into ~76px with no horizontal padding). Moved to its own row —
    `padding: 14px 20px`, `width: 100%` — specifically so the label has room to breathe rather
    than fighting three shorter labels for space.
  - `STRIPE_DONATE_ANY` is a **one-time-only** Payment Link — it has no recurring/subscription
    configuration. Selecting `.amount-any` therefore force-switches `frequency` to `'once'` and
    disables the Monthly toggle (`.freq-btn:disabled`, `opacity: 0.4`) for as long as it stays
    selected, with a short note (`#dc-any-note`) explaining why. Picking a numeric preset again
    re-enables Monthly and clears the note. This isn't cosmetic — without it, a visitor could
    select Monthly + Any amount and land on a Stripe page that silently charges once instead of
    setting up the recurring donation the UI implied.
- **Frequency** (`.freq`): pill group container, `background: var(--uxh-warm-white)`,
  `1px solid var(--uxh-line)`, `padding: 4px`, `border-radius: 999px`. Active pill
  (`.freq-btn.is-active`): `background: var(--uxh-fg)`, white text. Switching frequency snaps
  `amount` back to a valid preset only if the current numeric selection isn't offered under the
  new frequency (`'any'` is left alone — it isn't a `PRESETS` entry, so this check doesn't apply
  to it either way).
- **Both groups need, and both have:** `role="radiogroup"` on the container + `role="radio"` on
  each button + `aria-checked` kept in sync by the click handler — this is the exact ARIA pattern
  the spec calls for, correctly implemented, not just aspired to. `.amount-group` is the
  radiogroup for amount now (wrapping both `.amounts` and `.amount-any`), not `.amounts` itself.
- **Fine print** (`.dc-fine`): plain paragraph text flow (no `display: flex`) — the info button
  (`.dc-info`) is `display: inline-flex` and sits directly after the sentence with no space, so it
  wraps as part of the sentence's own line-wrapping, landing right after "payment." on whichever
  line that ends up on. This used to be `display: flex; flex-wrap: wrap; gap: 6px` on the theory
  that flex-wrap was needed to keep the button from overflowing the card — in practice that
  treated the button as a second, independent flex item, so on narrow cards where the sentence
  wrapped to two lines, the button (not fitting after the wrapped text on either line) dropped to
  its own third line, left-aligned and visually orphaned from the sentence it belongs to. Normal
  inline flow doesn't have this failure mode: an inline-level box wraps with the text around it
  same as a word would, and only overflows if it's wider than the whole container (it isn't — the
  visible glyph is a 16px circle). The tooltip (`.dc-info::after`, `data-tip` attr) is `220px`
  wide, and left-aligned instead of centred at ≤520px so it doesn't overflow a narrow viewport.
  `.dc-info` also carries a `min-width/min-height: 44px` tap-target override (mobile-tweaks.css)
  that's larger than its 16px visible circle — expected, and unrelated to this fix; it slightly
  grows the line box on whichever line the icon lands on, which reads as a bit of breathing room
  around the icon rather than a bug.

**Stripe routing:** `STRIPE_LINKS[frequency][amount]` looks up a fixed-price Payment Link for
the three numeric presets (once/monthly × €15/€25/€45 = 6 links, each a separate Stripe object);
`amount === 'any'` never matches a key in that lookup, so it falls straight through to
`STRIPE_DONATE_ANY` — the same fallback that used to catch unmappable typed values, now reached
by a deliberate choice instead of a workaround. Because `frequency` is forced to `'once'` whenever
`'any'` is selected, this fallback is in practice only ever reached with `frequency === 'once'`.

**Selector/location:** `.donate-card` and all `.amount`/`.freq`/`.dc-*` descendants — site.css.
**Found in:** index.html (markup + the chip/frequency state machine + Stripe Payment Link
routing, all in one IIFE).

**Accessibility:** both radiogroups are correctly rolled and kept in sync — verified against the
live click handlers, not assumed from markup alone. The info button (`.dc-info`) has
`aria-label="More about donations"` since its visible content is only the ⓘ glyph; its tooltip
appears on both `:hover` **and** `:focus-visible`, so keyboard users get the same fine-print
disclosure mouse users do, not just a hover-only tooltip that's invisible to them.

**Tokens to use:** `var(--uxh-radius-lg)` (card), `var(--uxh-radius-md)` (amount chips),
`var(--uxh-shadow-lg)` (already correctly referenced).
