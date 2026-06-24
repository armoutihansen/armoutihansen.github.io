# Hero panel data derivation lives in a tested src/data function; the component is view-only

## Status

Accepted.

## Context

The hero deck's two interactive panels (ADR 0003) each need numbers derived from
committed data: Panel 1's coverage / auto-accuracy / review split from
`hero-model.json`, and Panel 2's time-of-day peaks and peak÷low multipliers from
`scripts/data/citibike_tod_risk.json`.

Panel 1's arithmetic was already a pure function — `bandStats()` in
`src/data/hero-model.ts` — shared by the server-rendered readouts and the client
drag handler so the two paths can't diverge, with a test surface in
`hero-model.test.ts`.

Panel 2's equivalent derivation (peak-finding, multipliers, readout formatting)
had instead been written inline in `Hero.astro`'s frontmatter, tangled with the
SVG bar geometry. It had no test surface: the figure's headline claim — total
crash severity peaks midday, per-trip risk peaks at night ≈3.7× (CONTEXT.md
"Hero pattern") — could silently break with nothing failing.

## Decision

A hero panel's **data story** is a pure function in `src/data/hero-model.ts`
(`bandStats`, `todPanel`), tested through its interface. The **`.astro` component
is view-only**: it calls the function and lays out the result.

The split line is **data vs. geometry**. `todPanel(bins)` returns the readouts,
the peak-risk index, and the max-hazard / max-risk normalisers; the SVG
coordinate math (paddings, slot/bar positions, per-bar fractions) stays in
`Hero.astro` because it is view geometry, not a claim about the data.

## Considered alternatives

- **Leave Panel 2's derivation in the component frontmatter.** Rejected: no test
  surface for the figure's headline numbers, and the server path also re-emits
  the readouts as JSON for the client toggle, so a divergence would be invisible.
  `bandStats` already set the pattern.
- **Also extract the SVG geometry into `src/data`.** Rejected: the geometry is
  pure presentation with no claim to test; moving it would relocate view code
  away from its template. The seam is the data, not "all the `const`s."

## Consequences

- A future architecture pass should not re-suggest pulling the bar geometry into
  `src/data`, nor re-inlining the derivation back into the component.
- New hero panels follow the same split: derivation + test in `hero-model.ts`,
  geometry + rendering in the component.
