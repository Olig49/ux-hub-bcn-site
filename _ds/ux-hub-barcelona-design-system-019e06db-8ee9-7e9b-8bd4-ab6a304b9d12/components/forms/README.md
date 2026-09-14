# Forms

**MailingForm** and **DonateForm**. Both are homepage-only. Open [`index.html`](./index.html)
for the live-rendered catalog.

---

## MailingForm — `.mail-form`

Rebuilt since the spec was first written: the Brevo list behind this form actually requires
`EMAIL`, `FIRSTNAME`, `LASTNAME`, `LINKEDIN`, `JOB_TITLE`, and a GDPR consent checkbox
(`OPT_IN`) — not just email. The form now collects all six.

- **Card:** `background: var(--uxh-soft-beige)`, `border-radius: 24px` (→ `var(--uxh-radius-xl)`),
  `padding: 28px`, `max-width: 460px`, `box-sizing: border-box`. (No more fixed `min-height` —
  content naturally determines height now that there are five fields instead of one.)
- **Fields** (`.mail-field`, grouped two-up for first/last name via `.mail-field-group`): each
  is a `<label>` + a `.mail-row` + an optional `.mail-error`. **Label:** `padding-left: 14px`,
  `font: 500 13px/1`, `color: var(--uxh-fg-2)`, `letter-spacing: 0.04em`.
- **Row** (`.mail-row`) — **intentionally matches DonateForm's `.custom-row` exactly, not a
  pill:** `border-radius: 12px` (→ `var(--uxh-radius-md)`), `border: 1px solid
  var(--uxh-line-strong)`, `padding: 0 14px`, white background, `:focus-within` → seaturtle
  border. Input: `padding: 13px 0`, `font: 500 16px/1` (16px directly, not the old 15px+mobile-
  override split — avoids the iOS zoom-on-focus problem without needing a separate rule). This
  was a real inconsistency until it was fixed: the row used to be a `999px` pill with a
  shadow instead of a border, the only field-like element on the page styled that way while
  every other input (DonateForm's amount chips and custom-amount field) used radius-md +
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
from 8–28px. DonateForm already ships this exact split — `.amount` chips and `.custom-row` at
`radius-md` (12px) sitting directly above a `.btn.btn-primary.donate-submit` pill — with no
reported issue, which is why MailingForm's row was the actual outlier to fix, not evidence that
pill buttons next to non-pill fields is wrong. The pill exists specifically to make buttons read
as "tap this to act," distinct from "type into this" — mixing the two on the same control would
blur that signal, not sharpen it.

**Tokens to use:** `var(--uxh-radius-xl)` (card), `var(--uxh-radius-md)` (rows — matches
DonateForm), `var(--uxh-line-strong)` (row border), `var(--uxh-input-font)` (16px input
font-size).

---

## DonateForm — `.donate-card`

- **Card:** `background: var(--uxh-warm-white)`, `border-radius: 20px` (→ `var(--uxh-radius-lg)`),
  `padding: 28px`, `box-shadow: var(--uxh-shadow-lg)` — on its native dark (`--uxh-teal-night`)
  panel, this card is the one light surface in the section.
- **Amount chips** (`.amount`): `flex: 1 1 60px`, `padding: 14px 0`, `border-radius: 12px` (→
  `var(--uxh-radius-md)`), `1px solid var(--uxh-line-strong)`, `font: 600 17px/1`. Active state
  (`.is-active`): seaturtle fill, white text, matching border colour.
- **Frequency** (`.freq`): pill group container, `background: var(--uxh-warm-white)`,
  `1px solid var(--uxh-line)`, `padding: 4px`, `border-radius: 999px`. Active pill
  (`.freq-btn.is-active`): `background: var(--uxh-fg)`, white text.
- **Both groups need, and both have:** `role="radiogroup"` on the container + `role="radio"` on
  each button + `aria-checked` kept in sync by the click handler (UX Hub Barcelona.html:659-683)
  — this is the exact ARIA pattern the spec calls for, correctly implemented, not just aspired to.
- **Custom amount:** a `<label>` wrapping a bordered row (`.custom-row`) with a fixed `€` prefix
  and a `type="number"` input; `focus-within` swaps the row border to seaturtle. Selecting a
  preset chip clears the custom field and vice versa (mutually exclusive selection, enforced in
  JS, not just CSS).
- **Fine print** (`.dc-fine`): `display: flex; align-items: flex-start; flex-wrap: wrap; gap: 6px`
  — a **wrapping flex row**, deliberately, because the inline info button (`.dc-info`) that
  follows the sentence can't itself wrap; if `.dc-fine` were `display: inline`/block text instead,
  the info button could get pushed past the card's edge on narrow cards. The tooltip
  (`.dc-info::after`, `data-tip` attr) is `220px` wide, `180px` and left-aligned instead of
  centred at ≤520px (site.css:425-431) so it doesn't overflow a narrow viewport.

**Selector/location:** `.donate-card` and all `.amount`/`.freq`/`.dc-*`/`.custom-row` descendants
— site.css:407-431. **Found in:** UX Hub Barcelona.html:396-415 (markup) + :643-716 (chip/frequency
state machine + Stripe Payment Link routing).

**Accessibility:** both radiogroups are correctly rolled and kept in sync — verified against the
live click handlers, not assumed from markup alone. The info button (`.dc-info`) has
`aria-label="More about donations"` since its visible content is only the ⓘ glyph; its tooltip
appears on both `:hover` **and** `:focus-visible`, so keyboard users get the same fine-print
disclosure mouse users do, not just a hover-only tooltip that's invisible to them.

**Tokens to use:** `var(--uxh-radius-lg)` (card), `var(--uxh-radius-md)` (amount chips),
`var(--uxh-shadow-lg)` (already correctly referenced).
