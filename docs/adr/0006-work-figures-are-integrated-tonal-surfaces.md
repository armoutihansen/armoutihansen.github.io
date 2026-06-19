# Work-page illustrations are de-framed to integrated tonal surfaces; the hero remains the single framed interactive surface

## Status

Accepted.

## Context

On the Work page (`/projects/`), every project illustration was boxed in heavy panel
chrome: each figure sat inside `.work__panel` (a `1px` border + drop shadow +
`paper-sunk` fill + radius + inset padding) *and* an inner `.work__panel-frame` that
painted its own fill + radius — a box-in-box where the outer card and the inner frame
both rendered a surface around a single figure. The result read as cramped and
template-like, working against CONTEXT.md's own ornamentation policy ("avoid heavy card
chrome — boxed, shadowed surfaces everywhere").

The figures already paint their **own** background using `--emb-bg`, which equals
`--paper-sunk` (`#ece6d7` light / `#1c1912` dark) and is deliberately distinct from the
page `--paper`. So once the CSS chrome is removed, the figure's own tint *becomes* the
single surface — no border, no shadow, no box-in-box — with the caption and note sitting
on the page background above and below it.

The prior Work-page ADR, [0005](0005-every-substantive-work-project-is-illustrated.md),
fixed grouping and the uniform illustrated rhythm but deliberately held **panel chrome
out of scope**. This ADR is the conscious follow-up that now addresses the chrome. It
does not reverse 0005 — every substantive project is still illustrated and the
figure-coverage invariant is untouched; it only changes how that illustration is framed.

## Decision

**The Work-page illustrations are de-framed into integrated tonal surfaces, scoped to
the `WorkFigure` panel only** (the co-located chrome, per
[0004](0004-global-css-is-the-design-system-module.md)).

- `.work__panel` becomes a plain layout grid (caption → figure → note): border, drop
  shadow, radius, the `paper-sunk` fill, and the inset padding are removed; the grid and
  its vertical gap rhythm stay.
- `.work__panel-frame` loses its surface — `background` and `border-radius` are removed —
  while `aspect-ratio: 16/10` (mobile `4/3`), `max-height`, `overflow:hidden`, and the
  absolutely-positioned `iframe`/`img` fill are kept, so the figure footprint and row
  rhythm are unchanged. The tonal block is a clean, sharp-cornered rectangle.
- `--emb-bg` is **unchanged** (stays `= --paper-sunk`); no figure is regenerated and the
  palette is not touched. This is a CSS-only presentation change plus docs.
- The change applies uniformly to both the `embed` (iframe) and the currently-unused
  `image` path, which share `.work__panel-frame`; `img object-fit:cover` is left as-is.

**The hero deck remains framed.** It stays the single premium interactive centrepiece —
[0003](0003-premium-dark-interactive-hero.md)'s "one interactive quant hero" — and is the
deliberate exception. **Publication covers** (`.pub__cover`) also keep their frames. The
net hierarchy is intentional: the hero is the one framed interactive moment; the Work
figures are integrated, lighter-weight supporting illustrations.

## Considered alternatives

- **Keep the panel chrome (the 0005 stance).** Rejected as a standing position: 0005 held
  chrome out of scope to ship the rhythm fix, not as a verdict that the card was right.
  Left in place, the box-in-box keeps reading as heavy card chrome, against CONTEXT's
  ornamentation policy. De-framing moves *toward* that policy, not in a new direction.
- **Full dissolve — set `--emb-bg = --paper` and regenerate both Plotly figures + the
  palette** so the figure melts entirely into the page. Rejected: higher-risk
  (figure regeneration, palette change) for no clear gain over the soft tonal surface;
  the faint sunk block already reads as integrated while staying honest to how the
  figures were authored.
- **De-frame the hero and publication covers too.** Rejected: it would erase the
  deliberate hierarchy and contradict 0003 (the hero is the single framed interactive
  centrepiece) and the scoped intent — this is a Work-page tweak, not a site-wide shift.

## Consequences

- The caption, legend, metric-toggle, and note now sit on the page background
  (`--paper`) rather than `--paper-sunk`; their contrast was checked in both themes.
- The external **CitiBike** embed's background is host-controlled and may not be
  `--emb-bg`. If it reads as broken unframed, that is an accepted external inconsistency
  (CONTEXT.md → Flagged Ambiguities), flagged rather than worked around — bringing the
  figure in-repo would remove the exception.
- This is a pure CSS/presentation change, so there is no red-green unit test; the
  `src/data/projects.test.ts` invariants and embed-asset checks stay green (no data
  touched) and the verification is visual sign-off via `scripts/screenshots.mjs`.
- A future contributor wanting to "restore" the card chrome around the Work figures, or
  to de-frame the hero/publication covers, is fighting this ADR — update it rather than
  diverge silently.
