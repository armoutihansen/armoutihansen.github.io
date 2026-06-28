# Reposition the identity from "Quantitative Analyst" to "Data Scientist"

## Status

Accepted (2026-06-27). Supersedes the *positioning* of ADR 0002 ("unified analyst framing
— quant / pricing / data") and ADR 0003 (§8, "'Quantitative analyst' in the broad sense");
their design/visual decisions still stand.

## Context

The site and CV were anchored on the identity **"Quantitative analyst (economics PhD)"**
(CONTEXT.md Language; hero eyebrow; CV headline). A review while reworking the CV
contradicted that framing on two grounds:

1. The "quantitative analyst" headline **overclaims** relative to the evidence — the
   profile has no markets/quant-finance signal (no derivatives, trading,
   time-series-finance, C++/kdb), so the title outruns what the work backs.
2. A **multi-source investigation** (DACH-primary, international-secondary) determined that
   "Quantitative Analyst" is **not** a sector-agnostic umbrella — it is **finance-coded by
   default**: O\*NET codes the occupation "Financial Quantitative Analysts"; Wikipedia's
   article is "Quantitative analysis (finance)"; Coursera defines quants as "financial
   analysts." Cross-sector use (insurance, analytics) exists but is the exception. **"Data
   Scientist" is the genuinely cross-sector umbrella** — and is the owner's actual AXA
   title. Nuance: it is finance-*default*, not finance-*exclusive*, and the *adjective*
   "quantitative" travels fine; it is the *noun title* that misleads.

## Decision

Lead **both the CV and the website** as **`Data Scientist · Economics PhD`** — one
consistent identity. The quantitative/econometric rigor lives in the tagline and body
(statistical & econometric modeling, ML, model validation, calibration, uncertainty
quantification), not in a finance-coded job title. Academic research (PhD, publications) is
a credibility signal, not the headline.

- **"Quantitative Researcher"** is kept as an *alternate variant* for explicitly
  research-/methods-heavy framing (the CV is one Typst source, so the headline is a one-line
  swap), not the default — in elite finance it is *also* finance-coded, and in general
  industry "Researcher" reinforces the "academic, not shipper" read.
- **"Quantitative Analyst" / "quant"** is reserved only for a genuine finance-quant target
  with re-skilling.

## Considered alternatives

- **Keep "Quantitative Analyst."** Rejected: overclaims relative to the evidence (above).
- **Lead with "Quantitative Researcher."** Rejected as the *default* for the reasons above;
  retained as a tailored variant.

## Consequences

- Changed: `src/data/profile.ts` (`title`, `summary`), `src/pages/cv.astro` and
  `src/pages/projects.astro` meta descriptions, the CV (`cv/cv.typ` eyebrow + summary), and
  CONTEXT.md (Language term + identity references). The hero eyebrow/lead update
  automatically via `profile`.
- ADRs 0002/0003 are left intact as historical record; only their positioning is superseded.
- Design terminology unaffected: the interactive "quant hero" nickname and the JetBrains-Mono
  "quant tell" are visual-system names, not identity claims, and stay.
- A future content pass should quantify impact in the experience bullets; that needs the
  owner's real figures and is out of scope here.
