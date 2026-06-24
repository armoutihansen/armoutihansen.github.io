# figure_theme.py owns the Plotly house style and the artifact write; the Leaflet figure stands apart by design

## Status

Accepted.

## Context

CONTEXT.md ("Figure palette") establishes `scripts/figure_theme.py` as the single
source for the figure palette and house style: `finish_figure()` builds a
generated Plotly figure (recolor, fonts, axis skeleton, `theme_block()`
injection), `theme_block()` emits the runtime recolor script, and
`write_palette_css()` emits the hand-written figures' tokens. The Plotly
generators supply only data + a `roles` map + a `div_id`.

Two gaps remained. (1) Each Plotly generator ended with its own copy-pasted
`open(OUT, "w").write(html)` + `print(...)` tail; three of the four silently
omitted `encoding="utf-8"`. (2) The CitiBike figure (`gen_citibike_fig.py`) is a
hand-written **Leaflet** map, not Plotly — it does not and cannot use
`finish_figure`/`theme_block`, which emit `Plotly.relayout` calls. An
architecture pass flagged this as "CitiBike re-implements the embed handshake"
and proposed consolidating it; that reading is wrong.

## Decision

The figure-artifact **write** is also single-sourced:
`write_figure_html(html, out_path)` in `figure_theme.py` (utf-8, uniform log
line). Every Plotly generator ends with this call.

The **Leaflet figure is a deliberate exception** and is NOT routed through
`finish_figure` / `theme_block` / `write_figure_html`. It consumes only the two
shared, cross-figure-type seams: it `<link>`s `_palette.css` (the palette) and
loads `/figures/_embed.js` (the theme-sync + ready handshake). Its own
`theme()` / `recolor()` recolors Leaflet markers and swaps the CartoDB basemap —
figure-specific work with no Plotly equivalent. Its bespoke log line (station
count) stays.

## Considered alternatives

- **Route CitiBike's write through `write_figure_html` too.** Rejected: its tail
  was already correct utf-8 with an informative station-count log; changing it
  for symmetry adds a `figure_theme` import to an otherwise Plotly-free file and
  loses information.
- **Make CitiBike use `finish_figure`/`theme_block` (the "consolidate the
  handshake" suggestion).** Rejected: those are Plotly-specific
  (`Plotly.relayout`/`restyle`). Leaflet recoloring shares no abstraction with
  them; the genuine shared concerns (palette, wire protocol) are already factored
  into `_palette.css` and `_embed.js`, which CitiBike uses.

## Consequences

- A future pass should not re-suggest folding the Leaflet figure into the Plotly
  house-style helpers, nor "fixing" its separate write/log.
- A clean `git diff` after re-running a generator remains the regression gate
  (the stable `div_id` keeps output deterministic). `write_figure_html` is
  byte-compatible with the old write on macOS — verified by regenerating all
  three Plotly figures with no resulting diff.
