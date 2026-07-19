# The CV is a Typst source living in-repo, compiled to the site's PDF download

## Status

Accepted; amended 2026-07-19.

## Context

The site serves `static/CV_JAH.pdf` as the `/cv/` download, and CONTEXT.md treats
the CV as the ground truth for every site claim. The shipped PDF was a plain,
over-generic two-page resume; the owner wants a rewritten version that is
on-brand (echoes the site's light-mode design language), visually pleasing,
ATS-survivable, and — explicitly — **easy to edit when updates arrive**, still
compiling to PDF.

The owner is a LaTeX user (writes papers in it), so LaTeX was the zero-ramp
default. But a CV is repeated-structure content (each role is
`{title, org, location, dates, bullets}`), which is exactly where LaTeX's
date-alignment and spacing macros become a recurring fight and Typst's
function-per-entry model shines: each future edit is one clean `#exp-entry(...)`
call. ATS-safety is equal (both emit real selectable text in single-column).

## Decision

The CV source is **Typst**, lives in a top-level **`cv/`** directory in this repo,
and compiles to `static/CV_JAH.pdf` — one repository, ground-truth source and
served artifact in sync, updated by recompiling. The three brand fonts
(Hanken Grotesk, JetBrains Mono, Fraunces) are vendored as `.ttf` in the project
so the build is reproducible and independent of a system font install.

Design constraints: single-column with real text (no two-column/sidebar, no
text-in-graphics, no icon-only labels — the ATS-hostile patterns).

**Visual direction (revised, supersedes the original "echo the site" brief).**
An initial attempt mirrored the website's light theme (warm ivory, three font
families — Fraunces/Hanken/JetBrains Mono — amber accents, chips, atmospheric
wash). The owner judged it busy and unprofessional ("too cramped", "mixing fonts
and sizes"). After researching popular quant CV conventions (one page or a clean
two, single font, plain over designed, no color schemes/infographics — quant
finance specifically rejects those), the design was rebuilt as a **clean minimal
CV**: a tight four-size scale (name / section / body / meta), near-black on white,
**one restrained navy accent** (subtitle + section rules), classic
reverse-chronological structure (centered masthead, two-line entries with
right-aligned dates, numbered publications, dot-separated skills).

Typography settled after two tries: a single neutral serif (Source Serif 4) read
as *generic*, so the final version uses the **website's three families in strict,
single-role discipline** — **Fraunces** for the name only, **Hanken Grotesk** for
all reading text, **JetBrains Mono** for every piece of metadata (subtitle eyebrow,
contact, dates, tags, skill values; tabular figures). This is the one way the site
and CV share DNA — same type system — without the CV copying the site's busy
layout (warm ivory, amber, chips, atmosphere), which was tried first and rejected.
All three font TTFs are vendored in `cv/fonts/`.

### 2026-07-19 amendment — the website owns the Professional record

The original decision treated the Typst CV as both the rendering source and the
ground truth for site claims. That ownership created two factual implementations:
Astro data for the primary website and Typst arrays for the downstream CV. They
already differ in teaching coverage, language proficiency, and other record details.

The **website is the primary product** and owns the complete **Professional record**
defined in `CONTEXT.md`. Its canonical representation is strict, validated JSON under
`src/data/`. Typst remains the source for CV selection, ordering, editorial prose,
layout, and PDF rendering, but reads identity, contact, experience, education,
teaching, skills, publication, and selected-work facts from the Professional record.
The CV may intentionally present a subset and may use derived short labels; it may not
override record facts.

The verified CV build validates the same record interface used by the website before
Typst runs. Production deployment rebuilds `static/CV_JAH.pdf` and fails if the
committed, byte-deterministic PDF is stale. Migration proceeds category by category,
starting with experience as a behavior-preserving tracer bullet; each category moves
both outputs and deletes its duplicate facts in one cutover.

The migration is complete across identity/contact, experience, education, teaching,
skills/languages, publications, and selected work. For selected work, the record owns the
complete 12-project website set and the union of factual project tools under stable project
and tool identifiers. Astro and Typst each select their approved tool subset and order by
identifier; the CV selects its current four projects by identifier and retains its derived
short titles, summaries, and layout. Website grouping, evidence-dossier prose, featured
order, tool presentation, and illustration metadata remain website presentation concerns.

For the experience tracer bullet, behavior preservation is measured against the
pre-migration Typst source at `ddf5d4a`, not blindly against the then-committed PDF.
That PDF was already stale: its final AXA bullet said `Qwen3.5-VL 4B`, while `cv/cv.typ`
said `Qwen3.5-4B`. The migration deliberately corrected the artifact once by rebuilding
from the current source. `cv/cv-baseline.json` now fixes the approved deterministic PDF
SHA-256, experience text, and two-page topology; the verified build also extracts the text
and raster-renders both pages so later drift cannot pass silently. The build never updates
the approved hash. An intentional content or visual change requires rendering and visually
reviewing a candidate, then explicitly updating the baseline before rebuilding the served
artifact.

## Considered alternatives

- **LaTeX.** Rejected as primary despite zero ramp: for a document re-edited for
  years, Typst's per-entry functions and automatic date alignment are a lasting
  maintainability win over hand-rolled `\hfill`/`tabular*` macros. The owner
  explicitly invited the better-tool call.
- **HTML/CSS → PDF reusing the site's CSS.** Rejected: most pixel-identical to the
  site, but means a headless-browser print pipeline bolted onto the Astro app and
  a full print stylesheet (the site is dark-first) — over-engineered for a 2-page
  document.
- **A separate repo for the CV.** Rejected: splits the source of truth from the
  site that depends on it.

## Consequences

- `typst` becomes a production build dependency because every deployment rebuilds and
  verifies the committed PDF.
- Invalid Professional record data blocks both the website and CV builds.
- The factual source moves from Typst arrays to the website-owned Professional record;
  Typst continues to own the CV's editorial and visual implementation.
- The vendored TTFs add a `cv/fonts/` directory to the repo.
