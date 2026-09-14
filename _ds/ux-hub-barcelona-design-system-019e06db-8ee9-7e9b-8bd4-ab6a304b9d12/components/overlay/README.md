# Overlay

One component: **Modal**. Open [`index.html`](./index.html) for the live-rendered catalog.

---

## Modal — `.modal-overlay` / `.modal-card`

- **Overlay:** `position: fixed; inset: 0; z-index: 80`, `background: rgba(15,55,58,0.55)`
  (→ `var(--uxh-overlay-scrim)`) + `backdrop-filter: blur(4px)`, `opacity: 0 → 1` on `.open`,
  `transition: opacity 220ms cubic-bezier(.2,.8,.2,1)` (→ `var(--uxh-dur-overlay)` +
  `var(--uxh-ease)`, both now named tokens matching this exact value).
- **Card:** `background: var(--uxh-warm-white)`, `border-radius: 24px` (→ `var(--uxh-radius-xl)`),
  `padding: 36px` (→ `26px 22px` at ≤540px), `max-width: 520px`, `box-shadow: var(--uxh-shadow-lg)`.
  Enters at `translateY(12px) scale(0.98)`, rests at `translateY(0) scale(1)` on `.open`,
  `transition: transform 240ms cubic-bezier(.2,.8,.2,1)` (→ `var(--uxh-dur-layout)` +
  `var(--uxh-ease)`).
- **Close button:** background-free, defined at `38px × 38px` in site.css:138, but
  **mobile-tweaks.css:17 overrides it to `44px × 44px` unconditionally** (that rule isn't wrapped
  in a media query, so it applies at every viewport width, not just mobile — the file is loaded
  after site.css on both pages, so 44px wins everywhere in practice) — meets `--uxh-tap-min`.
  Colour `var(--uxh-fg-2)` → `var(--uxh-fg)` on hover.
- **Title** (`h3`): `font: 700 30px/1.1`, `letter-spacing: -0.025em`, `padding-right: 44px` —
  reserved specifically so a long title's last line never runs under the absolutely-positioned
  close button.
- **Options** (`.modal-option`): white rows, `border-radius: 16px`, `padding: 16px`, a `48px`
  ceramic icon tile (`radius: 12px` → `var(--uxh-radius-md)`) at the left. Hover:
  `translateX(3px)` + `border-color: var(--uxh-seaturtle)` + a faint `rgba(42,153,160,0.04)` tint,
  `transition: border-color 160ms, transform 160ms, background 160ms` (→ `var(--uxh-dur-hover)`
  for all three legs). The trailing "go" circle (`.mo-go`) swaps to seaturtle-filled + white icon
  on the same hover. An optional `.mo-tag` pill ("Form", "Contact us") is hidden at ≤540px to keep
  the row from overflowing on small screens.

**Selector/location:** `.modal-overlay`, `.modal-card`, `.modal-close`, `.modal-options`,
`.modal-option`, `.mo-*` — site.css:128-156 (mobile-tweaks.css:17 for the close-button hit-target
bump). **Found in:** index.html:557-601 — three options: Next meetup (Meetup link),
Next workshop (Google Form, tagged "Form"), Next leadership circle (mailto, tagged "Contact us").
Opened from the NavBar's "Next event" CTA on both desktop and the MobileDrawer's equivalent
button — see `nav/README.md`.

**Required by spec, verified against the live script (index.html:704-740):**

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title — ✅ all present
  on the shipped `#event-modal` element.
- **Escape closes** — ✅ (line 732).
- **Tab focus trap** — ✅: the keydown handler collects every focusable, visible
  (`offsetParent !== null`) element inside the dialog on each Tab press and wraps `Shift+Tab` off
  the first back to the last, and `Tab` off the last back to the first (lines 733-739) — a
  re-computed-per-keypress trap rather than a fixed list, so it stays correct if the option list
  ever changes.
- **Focus management on open/close:** the element that had focus before opening
  (`lastFocused = document.activeElement`) is restored on close; the close button receives focus
  immediately on open (lines 709-721).
- **Click-outside-closes:** clicking the overlay itself (not the card) closes it (line 728),
  and every element with `data-close` (all three options) also closes it on click.
- **Body scroll lock:** `document.body.style.overflow = 'hidden'` while open, restored on close.

This is the one component in the whole system where every accessibility requirement named in the
spec is independently verified as actually implemented, not aspirational — worth pointing to as
the reference implementation when fixing gaps elsewhere (e.g. MobileDrawer on sponsors.html, see
`nav/README.md`).

**Accessibility, additional notes:** each option's icon tile is `aria-hidden="true"` (decorative,
the visible title/description text carries the meaning); the "go" arrow circles are likewise
`aria-hidden`. The whole option is one link/anchor, so its accessible name is the concatenation of
`.mo-title` + `.mo-desc` + (`.mo-tag` if present) — a single Tab stop per option, not three.

**Tokens to use:** `var(--uxh-overlay-scrim)` (overlay background), `var(--uxh-radius-xl)` (card),
`var(--uxh-radius-md)` (icon tile), `var(--uxh-dur-overlay)`, `var(--uxh-dur-layout)`,
`var(--uxh-ease)`, `var(--uxh-dur-hover)`, `var(--uxh-tap-min)` (close button, already met via
mobile-tweaks.css).
