---
name: uxhub-barcelona-design-system
description: Use when writing or reviewing HTML/CSS for the UX HUB Barcelona website (or any UX HUB Barcelona event page, slide, poster, social post, or merch item) — brand voice, color/type/spacing tokens, and the vanilla-HTML component catalog for this brand. Triggers on "UX Hub Barcelona", "UX HUB BCN", or edits inside project/_ds/ux-hub-barcelona-design-system-*/, project/styles/, project/*.html.
---

# UX HUB Barcelona — design system skill

A design system for **UX HUB Barcelona**, a Barcelona community for UX
designers, researchers and product people. Brand personality: **curious,
welcoming, playful, insightful** — "before-sunset conversation," not
"conference keynote." Full brand voice and visual foundations are in
`README.md` in this same folder — read it first for tone-of-voice, imagery
direction, and logo rules before writing copy or choosing images.

The live site is **plain static HTML/CSS/vanilla JS** (no framework). This
design system is documentation and reusable markup for that stack — not a
component library to `import`. Lift markup, don't wire up a build step.

## Where things live

| Need | Go to |
|---|---|
| Brand voice, colors, type, logo, motion, imagery rules | `README.md` |
| CSS custom properties (the only place values should come from) | `colors_and_type.css` (import via `styles.css`) |
| Real production CSS that implements every component class | `../../styles/site.css`, `../../styles/mobile-tweaks.css` |
| Component-by-component reference (markup + variants + a11y notes) | `components/<family>/README.md` + `index.html` preview |
| Foundation swatches (colors, type ramp, spacing, radii, motion…) | `guidelines/index.html` |
| Copy-paste starter kit for a new event page | `ui_kits/event-web/` |
| Photography, logos, sponsor/team images | `../../assets/` (shared with the live site — not duplicated here) |
| Lint rule that flags raw hex/px/non-brand fonts in JS | `_adherence.oxlintrc.json` |

## Rules for any new UI in this brand

1. **Always use tokens, never raw values.** `var(--uxh-yolk)`, not `#F3A732`.
   `var(--uxh-space-5)`, not `24px`. `_adherence.oxlintrc.json` enforces this
   for JS/JSX; hold CSS to the same standard by convention.
2. **Corner radius is a signal.** `20px` (`--uxh-radius-lg`) is the brand's
   signature card/image radius. `24px` (`--uxh-radius-xl`) is for modal
   cards, event features, offer cards, mail forms, tier cards. `28px`
   (`--uxh-radius-2xl`) is reserved for full-width dark panels (partner
   section, donate — a third, `.volunteer`, is fully styled at this radius
   in site.css but has no live markup instance on either shipped page).
   Buttons are always full pill (`--uxh-radius-pill`).
3. **Cards get a hairline border OR `--uxh-shadow-md` — never both.**
4. **Fonts: Work Sans everywhere, Lora only for quotes/callouts/numerals-in-editorial-moments.**
   Never introduce a third family. Headings always carry `-0.02em` tracking.
5. **Icons are hand-written inline SVG at 2.4px stroke** (not a Lucide/icon-font
   dependency — this was a deliberate, settled choice, not an open question).
6. **Accessibility floors, non-negotiable:**
   - Every interactive element ≥ `--uxh-tap-min` (44px), even if the visual
     size looks smaller (e.g. social icons, close buttons).
   - Form inputs ≥ `--uxh-input-font` (16px) or iOS zooms on focus.
   - Secondary text uses `--uxh-fg-2` (`#6a6a6a` — AA-corrected; the old
     `#777777` fails at 4.48:1). Yolk-on-Teal-Night text/icons use
     `--uxh-amber-on-dark` instead of raw Yolk (Yolk-on-dark is only 3.7:1).
   - `<ul>`/`<ol>` with `list-style: none` needs `role="list"` back, or
     screen readers stop announcing it as a list.
   - Respect `prefers-reduced-motion` on anything that scrolls, marquees, or
     reveals-on-scroll.
7. **Motion is calm, not flashy.** `var(--uxh-ease)` = `cubic-bezier(0.2, 0.8,
   0.2, 1)`. Hover 160ms, press 80ms (`scale(0.98)`), layout 240ms, overlay
   fade 220ms, scroll-reveal 400ms. No bounce, no dramatic entrances.
8. **Breakpoints are literals, not tokens** (CSS custom properties can't be
   read inside `@media`) — see the documented list in `colors_and_type.css`.
   Match the existing ones (`980`, `900`, `880`, `820`, `780`, `720`, `700`,
   `620`, `600`, `540`, `520`, `480`) rather than inventing new breakpoints for
   a new component.

## Known gaps (don't silently "fix" these — flag instead)

- `assets/logo-horizontal-seaturtle.svg` and `assets/logo-stacked-white.svg`
  used to be flagged here as containing embedded bitmaps rather than clean
  vectors — they don't: both are plain `<path>`/`<rect>` vector geometry (no
  `<image>` or base64 data), just detailed enough to land at ~19KB, vs. ~4KB
  for the bare mark. No Figma re-export is needed after all.
- No slide-deck template exists (the source Figma file has none).

## How to add a new page/section in this brand

1. Skim `guidelines/index.html` for the relevant foundation (color, type,
   spacing) and the matching `components/<family>/README.md` for the closest
   existing component.
2. Copy the real markup from that component's `index.html` preview (it's
   extracted verbatim from the shipped pages) rather than writing new markup
   from scratch.
3. Wire the page to `../../styles/tokens.css` + `../../styles/site.css` (or,
   for a non-site deliverable like a poster, just `colors_and_type.css`).
4. Building an event page specifically? Start from `ui_kits/event-web/`
   instead of step 2 — it already composes header + hero + event card +
   speaker card + CTA.
