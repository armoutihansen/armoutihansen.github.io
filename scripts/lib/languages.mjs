// Pure language-ranking logic for the GitHub "Open source" strip.
// Extracted from gen_github_data.mjs so it can be unit-tested without hitting
// the network. The ranking metric is share of code by bytes: GitHub's per-repo
// language byte counts, aggregated across all owned repos, NOT repo counts.

// Languages GitHub classifies separately that should be folded into another
// for display. Notebook bytes are Python work; GitHub just classifies the
// .ipynb file type separately, so we add those bytes into Python.
export const LANG_ALIASES = { "Jupyter Notebook": "Python" };

// Generated/markup/build/style languages to exclude from the metric. These are
// scaffolding or build output (page markup, stylesheets, container/build
// recipes), not authored programming/analysis work, so they are removed
// entirely — they do not count toward the percentage denominator. Authored
// languages (Python, TeX, TypeScript, Stata, JavaScript, ...) are kept.
export const EXCLUDED_LANGS = ["HTML", "CSS", "SCSS", "Astro", "Shell", "Makefile", "Dockerfile"];

// Rank languages by aggregated byte weight, after folding aliased languages
// into their target and removing excluded languages. Operates on a plain
// totals map so it stays pure and trivially testable.
//
//   totals   map of { [languageName]: number } — number is aggregated bytes
//   aliases  map of { sourceLanguage: targetLanguage } folded BEFORE ranking
//   exclude  array of language names to drop entirely (after folding)
//   topN     max number of entries to return
//
// Processing order: (a) fold aliases, summing bytes; (b) drop excluded
// languages — removed entirely so they do NOT count toward the denominator;
// (c) the denominator is the sum of the remaining weights; (d) rank remaining
// by weight descending, slice topN.
//
// Returns [{ name, pct }] with pct an integer percentage (Math.round) over the
// remaining denominator. Folding happens before exclusion/ranking, so a folded
// language competes at its combined weight. A sub-0.5% language rounds to pct 0
// but is still returned when padding to topN.
export function rankLanguages(totals, options = {}) {
  const { aliases = {}, exclude = [], topN = 5 } = options;
  const excluded = new Set(exclude);
  // (a) Fold aliases, summing bytes.
  const folded = {};
  for (const [language, bytes] of Object.entries(totals)) {
    if (!language || !bytes) continue;
    const name = aliases[language] ?? language;
    folded[name] = (folded[name] || 0) + bytes;
  }
  // (b) Drop excluded languages, then (c) sum the remaining weights.
  const weights = {};
  let total = 0;
  for (const [name, bytes] of Object.entries(folded)) {
    if (excluded.has(name)) continue;
    weights[name] = bytes;
    total += bytes;
  }
  const denom = total || 1;
  // (d) Rank remaining by weight descending, slice topN.
  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, w]) => ({ name, pct: Math.round((100 * w) / denom) }));
}
