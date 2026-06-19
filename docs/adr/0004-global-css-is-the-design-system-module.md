# global.css is the design-system module; component CSS co-locates only when self-contained

## Status

Accepted.

## Context

`src/styles/global.css` holds three things: design tokens (palette, type scale,
spacing, shape), a shared **"ledger" rhythm** (the `.capabilities, .skillset,
.worklist, .publist, .timeline` grids and the shared `.capability, .skillset__row,
.work, .pub, .entry { border-top }` hairline), and the per-component rules that hang
off that rhythm (`.work__*`, `.pub__*`, `.entry__*`, …). A recurring architecture
suggestion is to migrate per-component CSS out of `global.css` into each Astro
component's scoped `<style>` for locality.

But the ledger is a *deliberate shared seam* (CONTEXT.md → "Ornamentation policy"):
even-count blocks share a two-column grid with aligned row dividers, and single- and
multi-column lists share one rhythm. `.work`, `.pub`, and `.entry` get their hairline
and grid from **shared** selectors, and `.worklist` / `.publist` / `.timeline` /
`.capabilities` are shared grids. Splitting a component's child rules (e.g. `.pub__*`)
into its scoped `<style>` would scatter that component's styling across two files —
the shared base in `global.css` and the children in the component — which is *worse*
locality, and it fragments the seam.

The exception that prompted this ADR: when `WorkFigure.astro` was extracted from
`WorkItem` (the illustration panel split), its panel chrome (`.work__panel*`,
`.work__legend*`, `.work__toggle*`, `.work__panel-frame*`, `.work__panel-note`) turned
out to be *fully self-contained* — used by exactly one component, referencing only
global tokens, and not part of the ledger rhythm.

## Decision

`global.css` is the **design-system module**: tokens, the ledger rhythm, the shared
list grids, and the per-component rules that depend on them all live there.

Component CSS is co-located into a component's scoped `<style>` **only when the
rule-set is fully self-contained** — used by exactly one component and not entangled
with the shared ledger. The first and (currently) only application is the illustration
panel, whose styles moved into `WorkFigure.astro`. Its *placement* (`.work--figure`,
the grid that positions the panel beside the entry) is WorkItem's layout concern and
stays in `global.css`; the panel owns only its interior.

Entry, publication, timeline, capability, and skills rules stay in `global.css`
because they are part of the shared ledger seam.

## Considered alternatives

- **Migrate all component CSS to scoped styles.** Rejected: fragments the ledger seam
  and scatters each component's styling across two files (shared base + scoped
  children), worsening locality rather than improving it.
- **Keep the panel CSS in global.css too.** Rejected: after the `WorkFigure` split the
  panel is fully self-contained with an obvious home; co-locating it completes the
  extraction with no ledger entanglement and no visual change (Astro scopes the
  selectors to the component's own DOM).

## Consequences

- A future architecture pass should not re-suggest a wholesale CSS migration. The bar
  for co-location is "fully self-contained, no ledger entanglement," not "this rule
  names a component."
- A contributor wanting to move, say, `.pub__*` or `.entry__*` into a component is
  fighting this ADR; update it rather than diverge silently.
- Scoped component styles still consume global tokens (`var(--…)`), which is expected
  and fine.
