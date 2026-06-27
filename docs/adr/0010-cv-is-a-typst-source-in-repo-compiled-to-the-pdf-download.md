# The CV is a Typst source living in-repo, compiled to the site's PDF download

## Status

Accepted.

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

- `typst` becomes a build dependency for refreshing the PDF (installed via
  `brew install typst`); it is not needed for the site build itself.
- The vendored TTFs add a `cv/fonts/` directory to the repo.
