# Guidelines

Eighteen standalone HTML foundation cards. Each is plain HTML/CSS, links
`../colors_and_type.css`, and pulls every color/size/duration value from the
live `--uxh-*` tokens — nothing hand-typed. Open `index.html` to browse them
all, or open any file directly.

| Card | Covers |
|---|---|
| `colors-primary.html` | Seaturtle, Yolk, Lime, Purple, Ceramic, Pure White — hex + usage. |
| `colors-secondary.html` | Warm White, Soft Beige, Teal Night, Warm Sand. |
| `colors-foreground-lines.html` | fg / fg-2 / fg-3, line / line-strong, amber-on-dark — includes the AA fix note (`#777` → `#6a6a6a`). |
| `colors-gradients.html` | All four gradients rendered live, with use-cases. |
| `type-display-ramp.html` | H1/H2/H3 at real size, weight, tracking, line-height. |
| `type-body-ramp.html` | Body-lg / body / small / meta. |
| `type-lora-in-use.html` | Lora italic — quote block + heading emphasis word. |
| `type-numeral-motif.html` | The big Yolk section-numeral pattern ("01", "02"…). |
| `spacing-scale.html` | space-1 through space-9 as measured bars. |
| `spacing-in-use.html` | Real gap/padding values from shipped layout (page wrap, section rhythm, section-head grid). |
| `radii.html` | sm/md/lg/xl/2xl/pill, each with the component that uses it. |
| `shadows.html` | sm/md/lg, and why `lg` is teal-tinted, not black. |
| `motion.html` | The ease curve + six duration tokens, with live hover demos (respects `prefers-reduced-motion`). |
| `breakpoints.html` | The nine documented breakpoints as a table. |
| `buttons.html` | primary / ghost / dark / onDark — real, hoverable buttons. |
| `tags.html` | badge / promo / promoSoon / numeral chip variants. |
| `cards.html` | The four card shapes, and the "hairline border OR shadow, never both" rule. |
| `accessibility-notes.html` | AA fg-2 fix, amber-on-dark, teal-on-warm-surface rule, 44px tap targets, 16px input font, `role="list"`, focus-visible, reduced-motion. |

## Decisions already settled (don't re-open)

- **Icons** stay the site's existing hand-written inline SVGs at 2.4px stroke — not Lucide. No icon card was authored since there's nothing to reference beyond that decision.
- The two bitmap-embedded logo SVGs (`logo-horizontal-seaturtle.svg`, `logo-stacked-white.svg`) are a known, unfixed export gap — not addressed by these cards.
- No slide-kit cards — the source Figma has no slide template.

## Verifying links

Every card links back to `index.html` and forward to `../colors_and_type.css`.
Both are one level up / at the same level as expected from `guidelines/`
(confirmed against the folder's real layout before writing any file).
