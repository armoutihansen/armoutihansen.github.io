// Band statistics for the hero's model-confidence panel.
//
// One pure function, imported by both render paths of `Hero.astro`:
//   - the Astro frontmatter (server-rendered initial readouts), and
//   - the client `<script>` (recomputed live as the confidence band is dragged).
//
// Keeping the arithmetic here — co-located with `hero-model.json` — is what
// guarantees the server-rendered numbers and the drag-updated numbers can never
// diverge: both consume the same `bandStats(points, hi)`.

/** A single held-out case: model probability `p` and true label `y` (0/1). */
export type HeroPoint = { p: number; y: number };

/**
 * Coverage / auto-accuracy / review split for a confidence band of width `hi`.
 *
 * The band covers the uncertain middle `(lo, hi)` with `lo = 1 - hi`; those
 * cases are routed to human review. Everything outside the band (confident
 * cases, `p <= lo || p >= hi`) is "auto-handled". Auto-accuracy is the share of
 * auto-handled cases whose hard prediction (`p >= 0.5 ? 1 : 0`) matches `y`.
 *
 * All three percentages are rounded integers in [0, 100], matching the units
 * the hero's readouts display.
 */
export type BandStats = {
  /** % of cases handled automatically (outside the review band). */
  autoPct: number;
  /** % of cases routed to human review (inside the band). Complement of autoPct before rounding. */
  reviewPct: number;
  /** % of auto-handled cases predicted correctly; 0 when nothing is auto-handled. */
  autoAcc: number;
};

export function bandStats(points: readonly HeroPoint[], hi: number): BandStats {
  const lo = 1 - hi;
  let auto = 0;
  let autoCorrect = 0;
  for (const { p, y } of points) {
    if (p > lo && p < hi) continue; // inside the review band
    auto++;
    if ((p >= 0.5 ? 1 : 0) === y) autoCorrect++;
  }
  const n = points.length;
  return {
    autoPct: n ? Math.round((100 * auto) / n) : 0,
    reviewPct: n ? Math.round((100 * (n - auto)) / n) : 0,
    autoAcc: auto ? Math.round((100 * autoCorrect) / auto) : 0
  };
}
