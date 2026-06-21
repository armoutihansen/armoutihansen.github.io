# Working-paper covers are first-page manuscript thumbnails, not extracted per-paper figures

## Status

Accepted.

## Context

On the Research page (`/publications/`), journal publications carry a `cover` image — the
real cover of the journal they appeared in (`/images/journals/*`). A journal cover works as
an image precisely because it is an **authentic external artifact**: the actual cover of
*Games and Economic Behavior* signals "this cleared peer review there." It also reads at the
small cover size (72–100px) because it is a bold graphic, not text.

The working papers and research projects (the non-journal entries, `otherWork()`) had no
image, so the lower section of the page read as comparatively neglected. The request was to
give those entries imagery "in the same manner as the publications."

That cannot be satisfied literally: an unpublished paper has no journal, so there is no
cover artifact to reuse. The only image types actually available are (1) generic decorative
cards (a header bar + title + an identical fake chart on every entry) and (2) a real figure
extracted from inside each paper.

Both have already been considered. The decorative cards shipped once
(commit `1e6cb8e`, `static/images/publications/*.png`) and were stripped back out as
AI-portfolio filler — the same fake chart on every card, duplicating the bibliographic text.
Extracted per-paper figures are **deliberately rejected** in CONTEXT.md → "Page topology":
data-paper figures are heavy to recolor, and theory diagrams read poorly out of context.

This ADR settles what imagery, if any, the working papers may carry without reopening that
rejection.

## Decision

**Working-paper and research-project entries may carry a `cover` that is a screenshot of the
manuscript's first page** — hosted from the paper's PDF under `static/papers/`, rendered in
the same small cover slot as journal covers with a paper-sheet treatment (thin border +
faint shadow). The first page is the honest analog of a journal cover: a real document
artifact, and the recognized convention (SSRN, arXiv, ResearchGate all show first-page
thumbnails).

The distinction that keeps this consistent with the existing rejection: a first-page
thumbnail is a **cover** (an authentic artifact standing in for the whole document), not an
**extracted per-paper figure** (a plot or diagram lifted from inside the paper). Covers are
allowed; extracted figures remain rejected for the reasons in CONTEXT.md.

A first-page cover is only added when the manuscript is **public** (or publishable) and
linked — the image and a real "Manuscript" link travel together, so showing the page is
never a tease. All three current working papers' PDFs are hosted locally under
`static/papers/` for a uniform "Manuscript" link.

The cover is not promised to be *legible* at thumbnail size — body text collapses to a gray
rectangle regardless. It conveys **authenticity and presence** (this is a real manuscript),
not readable content. That is the accepted purpose; chasing legibility by enlarging the
image is explicitly not the goal (it would also break visual parity with the journal-cover
section and the page's "Research is a subordinate credibility section" intent).

## Considered alternatives

- **Generic decorative cards** (the `static/images/publications/*.png` filler). Rejected
  again: identical fake chart on every entry, duplicates the bibliographic text, reads as
  AI-portfolio filler. These files are deleted, not reused.
- **Extracted per-paper figures** (a real plot/diagram from each paper). Still rejected per
  CONTEXT.md: data figures are heavy to recolor to the site palette, theory diagrams read
  poorly out of context, and near-parity with the Work page fights the page's subordinate
  role. First-page covers sidestep all three — they are document artifacts, not figures.
- **Cover only the one paper with a public figure / public PDF, leave the rest blank.**
  Rejected: one image beside two blanks reads as *more* broken than uniform text-only. The
  approach is taken only because all three manuscripts can be made public at once.
- **Enlarge the working-paper image so its text is legible.** Rejected: text is unreadable
  at any thumbnail size worth using; enlarging only breaks parity with the journal-cover
  section and undercuts Research's subordinate role.

## Consequences

- Each working-paper entry gains a `cover` (first-page PNG) and a local "Manuscript" link;
  the PDFs live in `static/papers/`. *Predictive Completeness*, previously kept as a
  link-less "Work in progress" entry, now carries a manuscript link — the CONTEXT.md and
  `publications.ts` notes describing it as link-less are updated.
- `PublicationItem.astro` alt text is now type-conditional: journal entries keep
  `"{venue} journal cover"`; non-journal entries get `"First page of '{title}'"`, since
  "Working paper journal cover" would be false.
- CONTEXT.md → "Page topology" is updated: the "no per-paper figures" rule still forbids
  extracted figures, but manuscript first-page covers are now allowed on working papers.
- A first-page thumbnail is a static raster: if a draft changes materially, the screenshot
  must be regenerated from the new PDF. Acceptable for working papers; noted so a stale
  thumbnail is understood as expected maintenance, not drift.
