# Redesign anchors on scholar-coder identity, strips ornamentation

## Context

The pre-redesign site (commit `f5501fc`) was a multi-page portfolio with bordered + shadowed cards on every block, two accent colors (teal + rust), tag pills, three-column "feature pillar" grids on the home page, and an Inter-everywhere sans-serif palette. The brief for the redesign: "modern but minimalistic and not AI-generated," targeting an audience of developers, data scientists, and academic scientists.

The current chrome is exactly what generative tooling produces by default: card grids with soft shadows, multiple accent colors, hero + three-pillars layouts, sans-serif system fonts. Half-measures would leave that fingerprint visible.

## Decision

The redesign anchors on a **scholar-coder** identity, realized via:

1. **Hybrid typography.** Newsreader (serif) for body and headings; JetBrains Mono for navigation, eyebrow labels, dates, tags, and code. Both self-hosted.
2. **Strip-to-bones ornamentation.** No card chrome (borders, shadows, rounded corners, padded surfaces), no tag pills, no button styling. The full visual vocabulary is type, whitespace, and horizontal rules.
3. **Warm paper, pure achromatic palette.** Four roles only — `bg`, `ink`, `muted`, `line`. No accent colors. Links rely on underline-only affordance. Dark mode inverts the same four roles.
4. **Compressed page topology.** Four pages — `/`, `/projects/`, `/publications/`, `/cv/`. The current `/research/`, `/teaching/`, `/contact/` are folded into the home.
5. **Bibliographic item shape.** Projects and publications render as bib-style entries (year/period, title, prose, inline mono tags, plain text links). Projects retain a small inline thumbnail (~160–200px); publications drop thumbnails in favor of `<details>`-collapsed abstracts.

## Considered alternatives

- **Re-skin the current layout** (keep cards/grids/pills, change fonts and colors). Rejected: preserves the AI-default fingerprint we're explicitly trying to remove.
- **Full Wickström monospace** (mono everywhere, no serif). Rejected: tiring for paragraph-heavy academic content (publication abstracts, research notes); leans too pure-hacker for the academic side of the audience.
- **Clean sans-serif minimal** (closer to mattfarley.ca / dineshsenapati.com). Rejected: indistinguishable from the four inspiration sites that already occupy this territory; misses the chance to use the mono register as a developer/data-science signal.
- **Single-page site with PDF-only CV.** Rejected: 10 projects + 7 publications with abstracts make for an unwieldy scroll; deep pages aid both discoverability and link-sharing.

## Consequences

- Content has to do more work. With no card chrome, thin descriptions feel thinner. Project and publication copy needs to be deliberately written.
- A future contributor introducing a card, a tag pill, an accent color, or a CTA button is fighting this ADR. The fix is to update the ADR if the constraint genuinely needs to change, not to add the chrome back silently.
- The dark-mode toggle and `[data-theme]` mechanism in `src/layouts/BaseLayout.astro` are retained; only the palette tokens inside change.
- Removing the three folded pages (`/research/`, `/teaching/`, `/contact/`) requires preserving their content in the new home sections so no information is lost.
