import { describe, it, expect } from "vitest";
import { bandStats, todPanel, type HeroPoint, type TodBin } from "./hero-model";
import model from "./hero-model.json";
import tod from "../../scripts/data/citibike_tod_risk.json";

const realPoints = model.points as HeroPoint[];

// A small synthetic set with hand-computable band stats at hi = 0.75 (lo = 0.25,
// review band = the open interval (0.25, 0.75)).
//   p=0.10,y=0 -> auto (p<=lo), pred 0, correct
//   p=0.90,y=1 -> auto (p>=hi), pred 1, correct
//   p=0.80,y=0 -> auto (p>=hi), pred 1, WRONG
//   p=0.50,y=1 -> review (inside band)
//   p=0.30,y=0 -> review (inside band)
// => auto = 3, autoCorrect = 2, n = 5
//    autoPct = round(100*3/5) = 60
//    reviewPct = round(100*2/5) = 40
//    autoAcc = round(100*2/3) = 67
const synthetic: HeroPoint[] = [
  { p: 0.1, y: 0 },
  { p: 0.9, y: 1 },
  { p: 0.8, y: 0 },
  { p: 0.5, y: 1 },
  { p: 0.3, y: 0 }
];

describe("bandStats", () => {
  it("matches a hand-computed fixture on a small synthetic set", () => {
    expect(bandStats(synthetic, 0.75)).toEqual({
      autoPct: 60,
      reviewPct: 40,
      autoAcc: 67
    });
  });

  it("keeps accuracy within valid percent bounds [0, 100]", () => {
    for (let hi = 0.5; hi <= 1.0001; hi += 0.01) {
      const s = bandStats(realPoints, hi);
      expect(s.autoAcc).toBeGreaterThanOrEqual(0);
      expect(s.autoAcc).toBeLessThanOrEqual(100);
      expect(s.autoPct).toBeGreaterThanOrEqual(0);
      expect(s.autoPct).toBeLessThanOrEqual(100);
      expect(s.reviewPct).toBeGreaterThanOrEqual(0);
      expect(s.reviewPct).toBeLessThanOrEqual(100);
    }
  });

  it("coverage is monotonic in the threshold: widening the band (higher hi) never increases auto-handled share", () => {
    // The review band is (1-hi, hi). Increasing hi strictly grows that interval,
    // so the auto-handled share is non-increasing and the review share is
    // non-decreasing in hi. We compare the raw counts (pre-rounding) to avoid
    // rounding noise: count auto-handled points directly.
    const autoCount = (hi: number) =>
      realPoints.filter(({ p }) => !(p > 1 - hi && p < hi)).length;

    let prevAuto = Infinity;
    for (let hi = 0.5; hi <= 1.0001; hi += 0.01) {
      const auto = autoCount(hi);
      expect(auto).toBeLessThanOrEqual(prevAuto);
      prevAuto = auto;
    }
  });

  it("handles the hi = 1 endpoint: the band is (0, 1), so nothing is auto-handled", () => {
    // Every real point has 0 < p < 1, so all fall strictly inside (0, 1).
    const s = bandStats(realPoints, 1);
    expect(s.autoPct).toBe(0);
    expect(s.reviewPct).toBe(100);
    expect(s.autoAcc).toBe(0); // no auto-handled cases -> defined as 0
  });

  it("handles the hi = 0 endpoint: lo = 1, band is empty, so every point is auto-handled", () => {
    // With hi = 0, lo = 1; the guard `p > 1 && p < 0` is never true, so all
    // points are auto-handled.
    const s = bandStats(synthetic, 0);
    expect(s.autoPct).toBe(100);
    expect(s.reviewPct).toBe(0);
    // synthetic auto-correctness at hi=0: preds vs y for all 5 points
    //   0.1->0==0 ok, 0.9->1==1 ok, 0.8->1!=0 no, 0.5->1==1 ok, 0.3->0==0 ok
    //   => 4/5 correct = 80
    expect(s.autoAcc).toBe(80);
  });

  it("returns zeros for an empty point set without dividing by zero", () => {
    expect(bandStats([], 0.75)).toEqual({ autoPct: 0, reviewPct: 0, autoAcc: 0 });
  });
});

describe("todPanel", () => {
  // Hand-built bins where severity and per-trip risk peak in DIFFERENT slots —
  // the exposure normalization that is the whole point of Panel 2.
  //   A: H=10 E=100  R=0.10   B: H=40 E=200  R=0.20   C: H=20 E=20  R=1.00
  // sev peak = B (H=40), H spread 40/10 = 4.0×
  // risk peak = C (R=1.00), R spread 1.00/0.10 = 10.0×
  const flip: TodBin[] = [
    { key: "a", label: "A", H: 10, E: 100, R: 0.1 },
    { key: "b", label: "B", H: 40, E: 200, R: 0.2 },
    { key: "c", label: "C", H: 20, E: 20, R: 1.0 }
  ];

  it("picks each metric's own peak and spread from a hand-computed fixture", () => {
    const p = todPanel(flip);
    expect(p.sev).toEqual({ peak: "B", mult: "4.0×", exp: "0.0M" });
    expect(p.risk).toEqual({ peak: "C", mult: "10.0×", exp: "0.0M" });
    expect(p.peakSevI).toBe(1);
    expect(p.peakRiskI).toBe(2);
    expect(p.maxH).toBe(40);
    expect(p.maxR).toBe(1.0);
  });

  it("carries the real CitiBike headline: severity peaks midday, per-trip risk peaks at night ~3.7×", () => {
    const p = todPanel(tod.bins as TodBin[]);
    expect(p.sev.peak).toBe("Midday");
    expect(p.risk.peak).toBe("Night");
    expect(p.risk.mult).toBe("3.7×");
  });
});
