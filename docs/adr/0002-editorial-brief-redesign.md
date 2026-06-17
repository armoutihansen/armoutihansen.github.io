# Editorial Brief redesign for analyst job search

## Status

Accepted. Supersedes parts of [0001](0001-scholar-coder-stripped-redesign.md) — see
"Relationship to 0001" below.

## Context

A prior automated pass left the site reading as generic and AI-generated: inconsistent
chrome, a verbose hedging voice, and small per-problem CSS hacks (e.g. `font-size: 0`
brand/label swaps on mobile, a stack of max-width breakpoints patching individual
elements). The owner's goal is concrete: present as a credible candidate for
**quantitative, pricing, and data analyst** roles, with a site that looks professionally
designed, reads concisely, and works well on every device.

The "scholar-coder, strip-to-bones" direction in 0001 (no accent colour, no buttons, no
surfaces, bibliographic-only item shapes) is too austere and too academic for a
recruiter-facing analyst search, and its purity made thin copy feel thinner.

## Decision

Adopt an **Editorial Brief** design system, authored as one consistent pass.

1. **Identity.** Unified analyst framing (quant / pricing / data) with the economics PhD
   as a credibility signal. All copy rewritten short, concrete, and confident.
2. **Typography.** Three roles: Fraunces Variable (display serif) for name and headings,
   IBM Plex Sans Variable for body, JetBrains Mono Variable for labels/metadata. Newsreader
   is dropped.
3. **Palette.** Warm ivory paper, warm near-black ink, muted text tiers, and a single
   deep-teal accent used sparingly. Dark mode mirrors the hierarchy in warm charcoal.
4. **Ornamentation.** Editorial lists divided by hairline rules; tasteful outline + solid
   buttons for primary actions; one subtle offset accent frame on the portrait. No heavy
   card chrome, pill clouds, or multiple accents.
5. **Item shapes.** Work entries are typographic (index · kind · title · summary ·
   Problem/Approach/Result · tools); the repetitive GitHub social-preview thumbnails are
   removed. Research stays bibliographic with collapsed abstracts and author emphasis.
6. **Real photo.** The hero uses the professional headshot (`avatar2.webp`), not the
   pixel-art portrait.
7. **Mobile-first, no hacks.** Base styles are mobile; desktop is layered with `min-width`
   queries only. The masthead swaps full name ↔ `JAH` monogram via CSS `display` on two
   real spans (never `font-size: 0`). One coherent token + spacing system throughout.

## Relationship to 0001

Retained from 0001: compressed four-page topology (`/`, `/projects/`, `/publications/`,
`/cv/`); self-hosted variable fonts; the `[data-theme]` dark-mode toggle; collapsed
abstracts; "content has to do the work" (kept by rewriting copy, not by adding chrome).

Superseded by this ADR: the pure-achromatic "no accent colour" rule; the "no buttons / no
surfaces / strip-to-bones" constraint; the Newsreader body face; and the
small-inline-thumbnail project shape. A contributor reintroducing those should update this
ADR rather than reverting silently.

## Consequences

- A single accent and a tasteful button vocabulary now exist; use them with restraint
  (one accent, primary actions only).
- Project entries depend on well-written prose, since thumbnails are gone.
- Adding Fraunces increases font payload by one variable family; Newsreader's removal
  offsets part of it.
- The voice is now a documented constraint (CONTEXT.md → "Plain, concrete voice"); new
  copy should match it.
