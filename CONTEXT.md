# Site Design

The personal site of Jesper Armouti-Hansen — a quantitative scientist with a PhD in economics. The redesign in progress on the `redesign` branch reframes the site as a **scholar-coder portfolio**: legible, deliberate, anti-AI-generated.

## Language

**Scholar-coder**:
The site's target identity. A person who reads, writes, and codes — academic credibility plus working technical practice. Distinct from "designer-tinged developer portfolio" (too slick) and "pure academic page" (too narrow).
_Avoid_: Developer portfolio, academic homepage, personal blog.

**Anti-AI signal**:
A design choice that visibly diverges from defaults produced by generative tooling — e.g. card grids with soft shadows, tag pills, hero+three-pillars layouts, Inter/Geist sans body. Each redesign decision is tested against: "would an LLM default to this?" If yes, reconsider.
_Avoid_: Bespoke, custom, handcrafted.

**Aesthetic axis**:
Resolved as **hybrid**: monospace for structural elements (nav, labels, dates, code, tabular data), serif for body prose. Not full-Wickström-mono; not Inter-everywhere sans.

**Body face**:
Newsreader (serif). Used for paragraph prose, h1–h3 headings, and long-form content.
_Avoid_: Inter, Geist, system-ui (current sans), EB Garamond (too old-style for our register).

**Structural face**:
JetBrains Mono. Used for navigation, eyebrow labels, dates, code, inline metadata, and tabular content.
_Avoid_: Source Code Pro, Fira Mono, system mono.

**Ornamentation policy**:
**Strip to bones.** No card chrome (borders, shadows, rounded corners, padded surfaces), no tag pills, no button styling. The full visual vocabulary is: type, whitespace, and horizontal rules. Buttons become plain underlined text links.
_Avoid_: Cards, panels, surfaces, chrome, pills, buttons.

**Palette**:
**Warm paper, pure achromatic.** Four roles only: `bg` (warm cream), `ink` (near-black), `muted` (mid-warm-gray for secondary text), `line` (rule color for `<hr>`). No accent colors. Links use underline-only affordance. Dark mode inverts the same four roles.
_Avoid_: Accent color, brand color, primary/secondary, teal, rust.

**Page topology**:
Four pages: `/` (long-scroll home with intro, selected projects, selected publications, research blurb, teaching list, contact links), `/projects/` (full list), `/publications/` (full list with `<details>` abstracts), `/cv/` (full CV or PDF). The current `/research/`, `/teaching/`, `/contact/` pages are folded into the home.

**Hero pattern**:
Small inline avatar (≤100px) → mono eyebrow (role) → serif `h1` (name) → 1–2 paragraphs of serif intro prose → rule. No CTA buttons, no portrait panel, no "Focus" bullets.

**Global header**:
Single mono-caps row: `BRAND · NAV LINKS · [theme toggle]`. Brand is a home link rendered in JetBrains Mono small caps with letter-spacing. The header sits above a thin rule that defines the page top.

**Item shape (Project)**:
Bibliographic-style entry. Mono date/period above a serif title. One-paragraph description. Tags rendered inline as mono dot-separated text (`python · pandas · scikit-learn`), never as pills. A small thumbnail (~160–200px) sits inline to the left of the text block. No border, no shadow, no rounded corners around the thumbnail or item.

**Item shape (Publication)**:
Bibliographic-style entry. Mono year above a serif title. Authors and venue in serif body. Abstract collapsed inside `<details>`/`<summary>`. PDF/code/data links rendered as plain underlined text. **No thumbnail** — abstracts replace the visual previews used on the current site.

**Section heading pattern**:
Small mono-caps eyebrow label above a serif `h2`. The eyebrow uses JetBrains Mono uppercase with letter-spacing, sized at ~0.78rem; the `h2` follows below in Newsreader. The eyebrow's role is to surface structural orientation; the `h2` carries the section's title in the body register.

**Dark mode**:
Retained. The same four palette roles invert: warm-near-black `bg`, warm off-white `ink`, mid-warm-gray `muted`, dim warm-gray `line`. The existing `[data-theme]` mechanism (localStorage + `prefers-color-scheme`) is preserved.

## Relationships

- The **scholar-coder** identity is realized through the **aesthetic axis** (hybrid mono+serif), which in turn is instantiated by the **body face** (Newsreader) and **structural face** (JetBrains Mono).
- Every layout/component decision must pass the **anti-AI signal** test.

## Flagged ambiguities

_(none yet)_
