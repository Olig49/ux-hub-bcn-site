# UX HUB Barcelona — Design System

A design system for **UX HUB Barcelona** — a community for UX designers, researchers, and product people in Barcelona that hosts meetups, talks, and workshops. The brand is warm, curious, welcoming and human; less polished "conference keynote" and more "before-sunset conversation."

This system captures the brand foundations (colors, type, gradients, logo), tone, asset library, and a UI kit you can compose into event pages, slide decks, posters, social posts and merch.

## Source

The system was reverse-engineered from the **`Branding.fig`** file the team attached. Key pages:

- **`/Guidelines`** — Brand Guidelines doc (node `12:101`), Logos, Visual playground, Covers, UX Hub BCN Labs sub-brand.
- **`/Roll-up-banner`** — physical roll-up banner designs (`Rollups-designs-v3`).
- **`/Tshirts-merch`** — t-shirts, hoodies, hats, totes, socks, stickers.

If you have access to the file, the brand guidelines page is the canonical source of truth — colors, typography, voice, logo and art-direction rules all live there.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file. Brand context + content/visual fundamentals. |
| `SKILL.md` | Cross-compatible skill manifest (Claude Code-friendly). |
| `styles.css` | Design-system entry point — imports `colors_and_type.css`. Link this from a page, not the token file directly. |
| `colors_and_type.css` | Tokens + semantic element styles (`.uxh-*`). |
| `components/` | Vanilla HTML/CSS catalog of all 12 shipped component families (core, cards, data, nav, forms, overlay, utility) — real markup pulled verbatim from the live pages, plus a README per family with variants, CSS sources, and accessibility notes. |
| `guidelines/` | 18 standalone foundation cards (colors, type ramps, spacing, radii, shadows, motion, breakpoints, buttons, tags, cards, accessibility) — open `guidelines/index.html`. |
| `ui_kits/event-web/` | Event-page starter kit (header, hero, event card, speaker card, CTA) as lift-and-reuse vanilla HTML partials — not JSX, not imported. |
| Logos, photography, brand textures | Shared with the live site at `../../assets/` (not duplicated into this folder). |
| *(no slide deck shipped — figma file does not contain a slide template)* |

---

## Brand voice — content fundamentals

> "We celebrate curiosity, experimentation, and the human side of design — less polished 'conference keynote,' more intimate 'before-sunset conversation.'"

**Personality (4 words):** Curious · Welcoming · Playful · Insightful.

**Mission:** Host meaningful events and experiences that spark honest conversations about UX, product, and design.
**Promise:** Create spaces that feel warm, open, and practical — where everyone can contribute, not just listen.

### How copy is written

- **Pronouns:** First-person plural — "we host…", "we create spaces…". Address the reader as "you" — "Bring your work, not just your title."
- **Casing:** Sentence case for almost everything, including most headings. Title Case is reserved for the very biggest hero/event titles where it earns its weight.
- **Sentence rhythm:** Short, plain sentences. Then occasionally longer ones. Generous line spacing in body copy mirrors the open, breathable feeling of the events.
- **Vocabulary:** Concrete and human ("meetups, talks, workshops") over corporate ("activations, summits, content series"). No jargon. No buzzwords.
- **Tone:** Conversational, warm, encouraging. Slightly self-deprecating, never preachy. We invite, we don't lecture.
- **Emoji:** Not used. Emoji are absent from the brand guidelines and merch — the visual language relies on the logo mark and color blocks instead.
- **Punctuation:** Em-dashes for warmth, soft asides — used sparingly. Curly quotes ("smart" quotes) where typography allows.

### Sample copy in voice

- *Headline:* **"Bring your work, not just your title."**  
  *Body:* "You do not need a fancy role to join us. Whether you are a student, a career switcher, or a senior lead, your perspective matters. We care more about real stories than perfect portfolios."
- *Headline:* **"From meetups to meaningful connections."**  
  *Body:* "A single event can start a new collaboration, friendship, or career step. Say hello to the person next to you, share what you're working on, and see where the conversation leads."
- *Headline:* **"Learning that feels local and real."**  
  *Body:* "No generic buzzwords. Our speakers share practical case studies, behind-the-scenes lessons, and honest reflections from the Barcelona product scene — so you can apply what you learn the next day."

---

## Visual foundations

### Colors

**Primary** (use as content blocks, accents, CTAs):

| Name | Hex | Use |
|---|---|---|
| Seaturtle | `#2A99A0` | Primary teal — supporting shapes, icons, accent surfaces, logo "Seaturtle" variant. |
| Yolk | `#F3A732` | CTAs (pill buttons), event highlights, section numbers ("01", "02"…). |
| Lime | `#C7B85D` | Tags, secondary highlights, subtle graphic details. |
| Purple | `#D5B3F7` | Expressive moments, headers, occasional hero accents. |
| Ceramic | `#F3E7D8` | Soft warm background on slides, posts and printed materials. |
| Pure White | `#FFFFFF` | Background. |

**Secondary** (use as surfaces and depth):

| Name | Hex | Use |
|---|---|---|
| Warm White | `#F9F5EE` | Default page background — alt to pure white. |
| Soft Beige | `#E7DAC7` | Panels, cards, highlight boxes. |
| Teal Night | `#185E63` | Deep teal — used in cozy gradient + protection overlays. |
| Warm Sand | `#D9C5A3` | Warm neutral surface. |

**Foreground:** `#323232` for primary text. White on teal/teal-night surfaces.

**Gradients (4):**
- *Matcha Teal Cold* — Seaturtle → Warm White, top-to-bottom.
- *Matcha Teal Cozy* — Seaturtle → Teal Night.
- *Sunrise Cold* — Yolk → Warm White.
- *Sunset Cozy* — Yolk → Purple.

### Typography

- **Primary:** **Work Sans** — Regular, Medium, SemiBold, Bold. Used for everything: headings, body, UI, buttons.
- **Secondary serif:** **Lora** — used sparingly for quotes, callouts and editorial moments. *(The figma file references a "Lora" pairing in the type guidance even though specimens were set in Georgia/Rethink Sans — Lora is the production choice.)*
- **Letter-spacing:** Headings always carry **-2% tracking** (`letter-spacing: -0.02em`). Body is at 0%.
- **Casing:** Sentence case for headings. Limit to 2–3 weights of Work Sans (Regular, Medium, SemiBold/Bold) — don't introduce a fourth.
- **Hierarchy** (web / slides):
  - H1 hero — 60-72 px / 110-120% LH
  - H2 section — 40-48 px / 115-125% LH
  - H3 sub / card title — 28-32 px / 120-130% LH
  - Body — 16 px web, 20-24 px slides / 140-160% LH
  - Small / UI / meta — 12-14 px / 130-140% LH
- **Section numbering:** Display-size numerals (60 px) in **Yolk** sit beside section titles ("`01` Brand Strategy", "`02` Personality", etc.) — a recurring motif.

### Layout, shapes, motifs

- **Corner radius:** **`20px`** is the brand's signature radius. Cards, image containers, gradient blocks, hero panels all use it. Buttons go full pill (`999px`). Smaller chips/tags use 12-20 px.
- **The "blob" / overlapping circles:** The logo is built from four overlapping circles. Echo this in art direction: rounded blobs, overlapping circles, soft organic lines. Avoid hard geometric shapes.
- **Backgrounds:** Mostly Warm White or Ceramic. Hero panels use the Matcha Teal gradient or a flat Seaturtle block with white logo. Photography is full-bleed inside `radius:20`.
- **Cards:** Rounded `20px`, white or beige fill, `1px rgba(0,0,0,0.10)` hairline border *or* the `--uxh-shadow-md` soft shadow — never both.
- **Borders:** Hairlines at `rgba(0,0,0,0.10)` for section dividers; `rgba(0,0,0,0.30)` around color swatches.
- **Numerals as accent:** Big Yolk numerals beside section titles (see hierarchy above) are a signature mark.

### Imagery direction

- Real, candid photography of small groups: people sketching, talking, looking at screens together. Not posed corporate stock.
- Cozy, lived-in spaces: cafes, studios, coworking. Soft warm light. Subtle Barcelona cues (architecture, texture) — never tourist-postcard.
- Diverse community — mix of ages, backgrounds, styles. Natural clothing, natural expressions.
- Color treatment is warm — slight golden cast, never desaturated/cool/B&W.
- When darkening for legibility, use a `linear-gradient(rgba(15,55,58,0.32), rgba(42,153,160,0.4))` overlay (the brand's protection gradient).

### Motion & states

The figma file is static — no motion specs. The defaults below match the brand's "calm, warm, conversational" tone. Treat as a starting point, not a hard rule.

- **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (smooth ease-out). Durations: `160ms` for hover, `240ms` for layout, `400ms` for entry.
- **Hover (buttons):** `filter: brightness(0.95)` on Yolk; `background: rgba(42,153,160,0.08)` for teal text links; never neon shadows or color shifts.
- **Press:** `transform: scale(0.98)` + 80ms.
- **Page transitions:** Soft fade + small upward translate (8 px). No bouncing, no dramatic motion.

### Iconography

- **No bundled icon font.** The Figma file does not ship an icon set; icons that appear (`↑` back-to-top arrow, partnership glyphs) are unicode characters set in Work Sans.
- **Approach:** Use **Lucide** (CDN: `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/`) at **2px stroke**, rounded line-caps. This matches the geometric, friendly logo. *Flagged as substitution — please confirm.*
- **Logo as icon:** The 4-circle "hub" symbol mark (`assets/logo-mark.svg`) doubles as an avatar/favicon when monogrammed.
- **No emoji.**

### Logo

- **Three official color variants** — Black, White, and Seaturtle (teal `#2A99A0`). Use White on Seaturtle, Black on light surfaces, Seaturtle on Ceramic / Warm White.
- **Three lockups** — Horizontal (mark + "UX HUB" + "BARCELONA"), Stacked (mark above wordmark), and the bare 4-circle Mark.
- **Clearspace:** 1.6× the height of one circle on every side.
- **Don'ts:** Don't rotate, stretch, or skew. Don't recolor individual letters. Don't add outlines, shadows, or gradients.

⚠️ The lockup PNGs in the Figma binary couldn't be cleanly extracted, so the SVGs in `assets/` are reconstructions of the **mark + Work Sans wordmark**. For production, please export the originals from the Figma file (page `/Guidelines/Logos`).

---

## Font substitution note

The Figma uses **Work Sans** (primary) and references **Lora** (secondary serif) — both available on Google Fonts and loaded automatically by `colors_and_type.css`. The brand-guidelines deck itself is set in *Rethink Sans* (a layout choice for the doc, not the brand) — production communications stay on Work Sans.

If you have a paid licensed copy of Work Sans / Lora, drop the `.woff2` files into `fonts/` and add a local `@font-face` override before the Google Fonts import.

---

## How to use

1. Link `colors_and_type.css` from any HTML.
2. Wrap content in a class scope if you need slide-size type: `<body class="uxh-slides">`.
3. Reach for the tokens (`var(--uxh-yolk)`) rather than raw hex.
4. Reuse the components in `components/` and `ui_kits/event-web/` — they're plain HTML/CSS intended to be lifted (copy the markup), not imported as a package.

For brand-tone questions, re-read the *Sample copy* section above and copy the rhythm.
