# Forms

**MailingForm** and **DonateForm**. Both are homepage-only. Open [`index.html`](./index.html)
for the live-rendered catalog.

---

## MailingForm — `.mail-form`

- **Card:** `background: var(--uxh-soft-beige)`, `border-radius: 24px` (→ `var(--uxh-radius-xl)`),
  `padding: 28px`, `max-width: 635px`, `min-height: 205px`, `box-sizing: border-box`.
- **Label:** `display: block; padding-left: 18px; font: 500 13px/1`, `color: var(--uxh-fg-2)`,
  `letter-spacing: 0.04em` — the 18px left padding matches the input row's own inset exactly,
  so label, input text, and fineprint all align to one vertical guide (the spec's "align to the
  same 18px inset" note).
- **Row** (`.mail-row`): white pill, `padding: 6px 6px 6px 18px`, `box-shadow: var(--uxh-shadow-sm)`,
  `border-radius: 999px`. Input: `font: 500 15px/1`, no border/outline, transparent background.
  **mobile-tweaks.css:12 forces `font-size: 16px`** on this input specifically — below 16px iOS
  zooms the whole page on focus, so this is a deliberate override of the base 15px (→
  `var(--uxh-input-font)`).
- **Button:** `padding: 12px 22px`, pill, `background: var(--uxh-fg)`, white text,
  `font: 600 14px/1`; hover → `var(--uxh-teal-night)`.
- **Below 520px** (mobile-tweaks.css:41-49): the row switches to `flex-direction: column;
  align-items: stretch`, becomes a `20px`-radius rounded rectangle instead of a pill
  (`padding: 14px`, `gap: 10px`), and the submit button goes full-width. Label/fineprint padding
  drops from 18px to 4px to match the row's new inset.
- **Acknowledgement** (`.mail-ack`): `hidden` by default, `role="status"` so its text is announced
  when the inline submit handler un-hides it — *not* a live region that watches for changes, just
  a plain status role revealed at the moment of submission.

**Selector/location:** `.mail-form` and all descendants — site.css:432-449 (base),
mobile-tweaks.css:12, :41-49 (mobile overrides). **Found in:** UX Hub Barcelona.html:429-437.

**Why it posts to a new tab:** the form's real `action` targets Brevo (`sibforms.com`) with
`method="post" target="_blank" rel="noopener"` — Brevo's endpoint doesn't support CORS for a
same-tab fetch/XHR confirmation, so the page can't know whether the POST succeeded. The
workaround is exactly what the spec calls for: the page shows its *own* `role="status"`
acknowledgement the instant the form is submitted (UX Hub Barcelona.html:572-576), regardless of
what actually happens in the new tab — an optimistic, not confirmed, success message.

**Accessibility:** `<label for="email">` is correctly associated; the required `type="email"`
input gets native browser validation. `--uxh-input-font: 16px` (mobile-tweaks.css:12) prevents
the iOS auto-zoom-on-focus behaviour that would otherwise disorient the layout after typing.

**Tokens to use:** `var(--uxh-radius-xl)`, `var(--uxh-shadow-sm)`, `var(--uxh-input-font)` (the
16px override should reference this token by name rather than a bare `16px` literal, now that
it's been named).

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
