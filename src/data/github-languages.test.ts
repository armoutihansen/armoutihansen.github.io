import { describe, it, expect } from "vitest";
// The ranking logic lives in a plain .mjs module so the generator script and
// this test share one source of truth. Vitest imports .mjs directly.
import { LANG_ALIASES, EXCLUDED_LANGS, rankLanguages } from "../../scripts/lib/languages.mjs";

describe("LANG_ALIASES", () => {
  it("folds Jupyter Notebook into Python", () => {
    expect(LANG_ALIASES["Jupyter Notebook"]).toBe("Python");
  });
});

describe("EXCLUDED_LANGS", () => {
  it("denies generated/markup/build/style languages", () => {
    expect(EXCLUDED_LANGS).toEqual(["HTML", "CSS", "SCSS", "Astro", "Shell", "Makefile", "Dockerfile"]);
  });

  it("keeps authored programming/analysis languages", () => {
    for (const lang of ["Python", "TeX", "TypeScript", "Stata", "JavaScript"]) {
      expect(EXCLUDED_LANGS).not.toContain(lang);
    }
  });
});

describe("rankLanguages — excluding scaffolding languages", () => {
  it("drops excluded languages entirely so they do not dilute the denominator", () => {
    // HTML would be 60% of raw bytes, but it is scaffolding: removing it leaves
    // Python(300)/Go(100) summing to 100%, not diluted to 30/10 by the HTML.
    const totals = { HTML: 600, Python: 300, Go: 100 };
    const ranked = rankLanguages(totals, { exclude: EXCLUDED_LANGS, topN: 5 });
    expect(ranked.map((l) => l.name)).toEqual(["Python", "Go"]);
    expect(ranked.find((l) => l.name === "Python")?.pct).toBe(75); // 300 of 400
    expect(ranked.find((l) => l.name === "Go")?.pct).toBe(25); // 100 of 400
    expect(ranked.reduce((s, l) => s + l.pct, 0)).toBe(100);
  });

  it("folds aliases BEFORE applying the exclusion", () => {
    // Jupyter folds into Python first; HTML is then excluded, so Python holds
    // all 500 authored bytes and reads 100%.
    const totals = { HTML: 1000, Python: 300, "Jupyter Notebook": 200 };
    const ranked = rankLanguages(totals, {
      aliases: LANG_ALIASES,
      exclude: EXCLUDED_LANGS,
      topN: 5,
    });
    expect(ranked.map((l) => l.name)).toEqual(["Python"]);
    expect(ranked[0].pct).toBe(100);
  });

  it("keeps a sub-0.5% authored language, rounding its pct to 0, when padding to topN", () => {
    // Stata is well under half a percent of the authored bytes, so it rounds to
    // 0 — but pad-to-5 still surfaces it as the fifth authored language.
    const totals = {
      HTML: 5000, // excluded scaffolding, ignored
      Python: 9000,
      TeX: 700,
      TypeScript: 290,
      JavaScript: 9,
      Stata: 1, // 1 of 10000 -> 0.01% -> rounds to 0
    };
    const ranked = rankLanguages(totals, { exclude: EXCLUDED_LANGS, topN: 5 });
    expect(ranked.map((l) => l.name)).toEqual(["Python", "TeX", "TypeScript", "JavaScript", "Stata"]);
    expect(ranked.find((l) => l.name === "Stata")?.pct).toBe(0);
  });
});

describe("rankLanguages — folding before ranking", () => {
  it("merges an aliased language into its target with summed weight", () => {
    const totals = { Python: 300, "Jupyter Notebook": 200 };
    const ranked = rankLanguages(totals, { aliases: LANG_ALIASES, topN: 5 });
    const names = ranked.map((l) => l.name);
    expect(names).toContain("Python");
    expect(names).not.toContain("Jupyter Notebook");
    // All 500 bytes are Python after folding.
    expect(ranked.find((l) => l.name === "Python")?.pct).toBe(100);
  });

  it("folds before ranking so the combined weight sets the order", () => {
    // Apart, neither Python (200) nor Jupyter (200) outweighs Go (300); folded
    // (400) they do.
    const totals = { Go: 300, Python: 200, "Jupyter Notebook": 200 };

    const unfolded = rankLanguages(totals, { topN: 5 });
    expect(unfolded[0].name).toBe("Go"); // Go leads on raw bytes

    const ranked = rankLanguages(totals, { aliases: LANG_ALIASES, topN: 5 });
    expect(ranked[0].name).toBe("Python"); // folded Python (400) now leads Go (300)
    expect(ranked[0].pct).toBe(57); // 400 of 700
  });
});

describe("rankLanguages — top-N ordering and limit", () => {
  it("returns at most topN entries", () => {
    const totals = { A: 6, B: 5, C: 4, D: 3, E: 2, F: 1 };
    const ranked = rankLanguages(totals, { topN: 3 });
    expect(ranked).toHaveLength(3);
  });

  it("orders entries by weight descending", () => {
    const totals = { Small: 1, Big: 5, Mid: 3 };
    const ranked = rankLanguages(totals, { topN: 5 });
    expect(ranked.map((l) => l.name)).toEqual(["Big", "Mid", "Small"]);
  });

  it("ignores languages with zero bytes", () => {
    const totals = { Python: 100, Empty: 0, Go: 100 };
    const ranked = rankLanguages(totals, { topN: 5 });
    expect(ranked.map((l) => l.name)).toEqual(["Python", "Go"]);
    // Zero-byte language is excluded from the denominator: each of 2 is 50%.
    expect(ranked.every((l) => l.pct === 50)).toBe(true);
  });
});

describe("rankLanguages — integer percentages over the full denominator", () => {
  it("rounds pct over every language's bytes, not just the top-N", () => {
    // 700 bytes total; topN=2 drops C from the output but not the denominator.
    const totals = { A: 400, B: 200, C: 100 };
    const ranked = rankLanguages(totals, { topN: 2 });
    expect(ranked.map((l) => l.name)).toEqual(["A", "B"]);
    expect(ranked[0].pct).toBe(Math.round((100 * 400) / 700)); // 57
    expect(ranked[1].pct).toBe(Math.round((100 * 200) / 700)); // 29
  });

  it("yields integer percentages", () => {
    const totals = { A: 1, B: 1, C: 1 };
    const ranked = rankLanguages(totals, { topN: 3 });
    for (const l of ranked) expect(Number.isInteger(l.pct)).toBe(true);
  });
});

describe("rankLanguages — folding can change which languages make the top-N", () => {
  it("surfaces the next-ranked language when a fold frees a slot", () => {
    // Without folding the top-3 by bytes would be Python(300), Jupyter(200),
    // HTML(200), leaving Go(100) out. Folding Jupyter into Python frees a slot,
    // so Go surfaces.
    const totals = { Python: 300, "Jupyter Notebook": 200, HTML: 200, Go: 100 };

    const unfolded = rankLanguages(totals, { topN: 3 }).map((l) => l.name);
    expect(unfolded).not.toContain("Go");

    const folded = rankLanguages(totals, { aliases: LANG_ALIASES, topN: 3 }).map((l) => l.name);
    expect(folded).toContain("Go");
    expect(folded).not.toContain("Jupyter Notebook");
  });
});
