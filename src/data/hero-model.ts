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

// --- Hero Panel 2: CitiBike time-of-day crash risk ---------------------------
// The same discipline as bandStats: the panel's *data story* is one pure
// function, co-located with its source bins (scripts/data/citibike_tod_risk.json),
// so the server-rendered readouts and the client metric-toggle can't diverge.
// Hero.astro keeps only the SVG bar geometry; everything derived from the data
// lives here, where it has a test surface.

/** One time-of-day bin: hazard `H` (crash severity), exposure `E` (trips), risk `R = H/E`. */
export type TodBin = { key: string; label: string; H: number; E: number; R: number };

/** A readout column for one metric view: peak bin label, peak÷low spread, peak exposure. */
export type TodReadout = { peak: string; mult: string; exp: string };

export type TodPanel = {
  /** Readouts for the total-severity view (peaks midday). */
  sev: TodReadout;
  /** Readouts for the per-trip-risk view (peaks at night). */
  risk: TodReadout;
  /** Index of the peak-severity bin — the bar flagged in the severity view. */
  peakSevI: number;
  /** Index of the peak-risk bin — the bar the panel flags. */
  peakRiskI: number;
  /** Max hazard / max risk — the normalisers the bar heights scale against. */
  maxH: number;
  maxR: number;
};

const fmtM = (n: number) => (n / 1e6).toFixed(1) + "M";
const argmax = <T>(xs: readonly T[], f: (x: T) => number) =>
  xs.reduce((m, x, i) => (f(x) > f(xs[m]) ? i : m), 0);

/**
 * The exposure-normalization story carried in numbers (CONTEXT.md "Hero
 * pattern"): total crash severity peaks midday, but per-trip risk (severity ÷
 * exposure) peaks at night — the peak label flips between the two views, and each
 * view's peak÷low multiplier quantifies the spread.
 */
export function todPanel(bins: readonly TodBin[]): TodPanel {
  const maxH = Math.max(...bins.map((b) => b.H));
  const minH = Math.min(...bins.map((b) => b.H));
  const maxR = Math.max(...bins.map((b) => b.R));
  const minR = Math.min(...bins.map((b) => b.R));
  const peakSevI = argmax(bins, (b) => b.H);
  const peakRiskI = argmax(bins, (b) => b.R);
  return {
    sev: { peak: bins[peakSevI].label, mult: (maxH / minH).toFixed(1) + "×", exp: fmtM(bins[peakSevI].E) },
    risk: { peak: bins[peakRiskI].label, mult: (maxR / minR).toFixed(1) + "×", exp: fmtM(bins[peakRiskI].E) },
    peakSevI,
    peakRiskI,
    maxH,
    maxR
  };
}
