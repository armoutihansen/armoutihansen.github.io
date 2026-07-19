# Professional Record Migration Plan

## Overview

Make the website-owned Professional record the one factual source for the public site
and its downstream CV. Migrate one category at a time through strict validation, both
rendering paths, tests, and deterministic PDF verification without changing approved
visible output, apart from explicitly documented corrections to an already-stale artifact.

**Deadline:** No calendar deadline; completion is gated by evidence after every slice.

**Capacity:** One fresh implementation agent at a time. Each agent receives one issue,
finishes its verification, and stops before the next agent starts.

**Outcome tags:**

- `record-locality` — a professional fact has one canonical home.
- `adapter-depth` — Astro and Typst select, format, and render without owning facts.
- `build-integrity` — invalid data or a stale CV blocks production.
- `behavior-preservation` — the website and CV retain their approved visible content.

## Critical path

Experience tracer bullet → core identity and contact → education → teaching → skills and
languages → publications → selected work and final ownership audit.

The experience tracer bullet is the single largest risk. It establishes the schema,
validated module, structured partial dates, Typst JSON loading, verified CV command,
deterministic PDF gate, and production workflow. No later category starts until that
slice proves the seam end to end.

## Capacity check

| Slice | Budget |
| --- | ---: |
| Experience tracer bullet and build seam | 6–10 hours |
| Core identity and contact | 2–4 hours |
| Education | 2–4 hours |
| Teaching | 2–4 hours |
| Skills and spoken languages | 3–5 hours |
| Publications | 4–6 hours |
| Selected work and final audit | 5–8 hours |
| **Total** | **24–41 hours** |

The budget fits seven bounded agent sessions. The most likely slip is the first slice:
Typst path resolution, font loading, or byte comparison may behave differently in GitHub
Actions. The protection is explicit: stop after the tracer bullet if local and production
verification do not agree; do not migrate more data to compensate.

## Slice 1 — Prove the Professional record with experience

**Tags:** `record-locality`, `adapter-depth`, `build-integrity`,
`behavior-preservation`

**Outcome:** Experience facts live once in a strict website-owned JSON record and produce
the unchanged website and the source-approved CV through their separate adapters.

**Dependencies:** None.

**Budget:** 6–10 hours.

**Milestones:**

1. A strict Zod schema validates a real Professional record containing stable experience
   identifiers, organizations, roles, locations, and structured partial date spans.
2. The Astro experience adapter combines validated facts with website-only bullets and
   logos; the home and CV pages render unchanged.
3. The Typst CV selects experience entries by stable identifier, formats their dates, and
   retains its own bullets and layout without duplicating experience facts.
4. One supported CV build command validates the record, compiles with the repository as
   Typst's project root and a pinned Typst version, and checks the deterministic committed
   PDF.
5. Production installs Typst, rebuilds the CV, rejects a stale committed PDF, then builds
   Astro.

**Steps:**

1. Add Zod and create the strict Professional record module. Parse the JSON at import,
   infer its TypeScript interface, reject unknown fields and duplicate identifiers, and
   test malformed dates, duplicate identifiers, missing facts, and unknown keys. Done
   when the real record parses and each invalid fixture fails with a useful path.
2. Encode the four current experience entries with human-readable identifiers and
   year-or-month date precision. Done when the JSON contains facts only—no bullets,
   logos, formatted periods, ordering, or output switches.
3. Replace the website's duplicated experience facts with an adapter keyed by record
   identifier. Keep bullets, logos, selection, and ordering local. Done when both Astro
   pages render the same roles, organizations, locations, periods, bullets, logos, and
   order as before.
4. Replace Typst's duplicated experience facts with stable-identifier selection from the
   JSON. Keep CV bullets, ordering, date style, and layout in Typst. Done when the rebuilt
   PDF matches the explicit source-derived text and two-page render baseline. The baseline
   keeps `Qwen3.5-4B` from `cv/cv.typ` at base `ddf5d4a`; the older committed PDF's
   `Qwen3.5-VL 4B` was a stale artifact and is corrected once rather than preserved.
5. Add the supported validation-and-compile command and a stale-PDF check. Done when a
   valid record produces deterministic bytes with the pinned Typst version, the generated
   PDF matches the newly committed artifact, and a deliberately stale copy fails.
6. Update production to install Typst, run the verified CV build, and continue to Astro
   only on success. Done when the workflow syntax is valid and its local command sequence
   passes.
7. Update maintenance documentation for the new experience workflow. Done when it names
   the Professional record as the factual source and the adapters as the homes for prose
   and visual presentation.

**Success criteria:**

- Experience facts exist only in the Professional record.
- Both adapters select experience through stable identifiers.
- Website output is unchanged; the CV matches its source-derived text and two-page render
  baseline; its newly committed PDF is byte-identical to a clean rebuild.
- Invalid record data and a stale PDF fail the supported build paths.
- Tests, Astro checks, Astro build, CV verification, and whitespace checks pass.

**Stop condition:** Do not migrate another category if the interface is wider than the
facts it replaces, if either adapter must duplicate factual fields, or if local and
production PDF verification cannot use the same command.

## Slice 2 — Move core identity and contact facts

**Tags:** `record-locality`, `adapter-depth`, `behavior-preservation`

**Outcome:** Name, email, location, phone, and professional links have one factual source;
the website and CV retain their distinct headlines, summaries, link selection, and layout.

**Dependencies:** Slice 1.

**Budget:** 2–4 hours.

**Steps:**

1. Extend the strict record schema and JSON with stable contact/link identifiers and the
   complete current identity facts. Done when malformed URLs, duplicate identifiers, and
   missing required identity fields fail validation.
2. Adapt website profile data to the validated identity facts while keeping positioning,
   summaries, capabilities, and visual presentation local. Done when header, footer,
   metadata, contact links, and page copy remain unchanged.
3. Make Typst select and format its contact subset from the record while retaining its
   headline and summary. Done when the verified CV preserves its rendered layout and text.
4. Delete the duplicated factual identity/contact values and update tests. Done when a
   repository search finds no adapter-owned copy of migrated facts.

**Success criteria:** One canonical value per identity/contact fact; intentional output
subsets remain; all verification passes with no visible change.

**Stop condition:** Do not move positioning, summaries, phone visibility, or link ordering
into the record.

## Slice 3 — Move education facts

**Tags:** `record-locality`, `adapter-depth`, `behavior-preservation`

**Outcome:** Degrees, institutions, locations, distinctions, and structured date spans
come from the record; the website and CV retain their own selection and formatting.

**Dependencies:** Slice 2.

**Budget:** 2–4 hours.

**Steps:**

1. Add strict education entries, stable identifiers, and partial dates to the record.
   Done when the complete website set includes the exchange semester and validates.
2. Adapt the website education view, preserving logos, detail wording, and ordering.
   Done when its rendered content is unchanged.
3. Make Typst select its intentional three-entry subset by identifier and preserve its
   compact wording. Done when the verified PDF preserves its rendered layout and text.
4. Delete duplicated education facts and add selection/invariant tests. Done when both
   adapters fail on an unknown selected identifier.

**Success criteria:** The record is complete, the CV omission is explicit, and both
outputs pass their unchanged-output gates.

**Stop condition:** Do not force the exchange semester into the CV or move logos and
output-specific detail prose into the record.

## Slice 4 — Move teaching facts

**Tags:** `record-locality`, `adapter-depth`, `behavior-preservation`

**Outcome:** Seven canonical teaching entries and supervision facts support the complete
website view and the CV's intentional four-entry subset.

**Dependencies:** Slice 3.

**Budget:** 2–4 hours.

**Steps:**

1. Add strict teaching entries with stable identifiers, roles, and one-or-more partial
   date spans. Done when interrupted teaching periods are factual data rather than
   formatted strings.
2. Adapt the website's complete teaching view while retaining its summary and display
   wording. Done when all seven entries render unchanged.
3. Make Typst select its four entries by identifier while retaining its lead sentence,
   role phrasing, and layout. Done when the verified PDF preserves its rendered layout and
   text.
4. Delete duplicate course facts and test completeness, subset selection, and multiple
   spans. Done when invalid selected identifiers and malformed spans fail.

**Success criteria:** Seven facts live once; the two intentional subsets are explicit;
all verification passes with no visible change.

**Stop condition:** Do not equalize the number of teaching entries or centralize the two
outputs' different editorial summaries.

## Slice 5 — Move skills and spoken-language facts

**Tags:** `record-locality`, `adapter-depth`, `behavior-preservation`

**Outcome:** Skills, categories, and spoken-language proficiency live in the complete
record; each output chooses its labels, subset, and detail level.

**Dependencies:** Slice 4.

**Budget:** 3–5 hours.

**Steps:**

1. Add stable skill and language identifiers, canonical names, categories, and factual
   proficiency where known. Done when the record captures the current website inventory,
   the CV's proficiency levels, and the website-only `pixi` entry without inventing facts.
2. Adapt website skill groups while keeping group labels and display ordering local. Done
   when the CV page's skills section is unchanged.
3. Make Typst select its skills and render proficiency from the record while preserving
   CV labels and ordering. Done when the verified PDF preserves its rendered layout and
   text.
4. Delete factual duplicates and test unknown skill identifiers, duplicate category
   membership where forbidden, and intentional output subsets.

**Success criteria:** Skills and proficiency have one factual home; adapter labels and
selection remain independent; all output gates pass.

**Stop condition:** Do not infer proficiency, force identical inventories, or move
presentation group labels into the record.

## Slice 6 — Move publication facts

**Tags:** `record-locality`, `adapter-depth`, `behavior-preservation`

**Outcome:** Publication identity, structured authors, venue, year, bibliographic facts,
and factual links live once; website-only abstracts/covers and CV abbreviations remain
adapter concerns.

**Dependencies:** Slice 5.

**Budget:** 4–6 hours.

**Steps:**

1. Add stable people and publication identifiers, canonical full names, structured author
   lists, venue/year/details, type, and factual links to the record. Done when all journal
   publications, working papers, and research projects validate without preformatted
   author strings.
2. Adapt the Research module to resolve visitor-ready entries from record facts plus local
   abstracts, covers, and display semantics. Done when Research and home output remain
   unchanged and existing cover rules still pass.
3. Make Typst select the four journal publications and derive abbreviated author display
   from structured people. Done when its numbered list and the PDF's rendered layout and
   text remain unchanged.
4. Delete duplicated publication facts and replace shallow link/author checks with tests
   through the resolved Research interface. Done when both views reject broken references
   and preserve ADR-0007.

**Success criteria:** Structured authors and publication facts exist once; adapters retain
their distinct prose and visual semantics; credibility counts still derive correctly;
all verification passes.

**Stop condition:** Do not move covers, abstracts, manuscript-thumbnail semantics, or CV
author typography into the record.

## Slice 7 — Move selected-work facts and close the ownership migration

**Tags:** `record-locality`, `adapter-depth`, `build-integrity`,
`behavior-preservation`

**Outcome:** Selected-work identity and factual links/tools/status live once; the website
retains its full evidence-dossier semantics and the CV retains its compact project prose.
The repository no longer maintains professional facts in Typst arrays.

**Dependencies:** Slice 6.

**Budget:** 5–8 hours.

**Steps:**

1. Add stable selected-work identifiers and shared factual fields to the record. Done when
   all complete website entries validate, including those intentionally omitted from the
   CV.
2. Adapt the Selected work module to combine record facts with website-only grouping,
   summaries, Problem/Approach/Result prose, featured order, tools presentation, and
   illustration metadata. Done when home and Work output and all ADR-0005 invariants remain
   unchanged.
3. Make Typst select four projects by identifier and retain its derived short labels,
   summaries, tool selection, order, and layout. Done when the verified PDF preserves its
   rendered layout and text.
4. Delete duplicate project facts from Typst and the website's factual implementation;
   retain adapter-owned editorial fields. Done when a repository audit finds no migrated
   fact owned outside the record.
5. Update README maintenance instructions and run the final ownership audit. Done when a
   future editor has one documented place for each fact and one verified command for the
   downstream CV.

**Success criteria:** All agreed Professional record categories have migrated; the site
and CV preserve their approved output; the production build proves the committed PDF;
tests, Astro checks, Astro build, CV verification, and whitespace checks all pass.

**Stop condition:** Do not redesign the Selected work interface beyond what the factual
migration requires, change project curation, or alter any accepted visual/domain ADR.

## Final verification gate

The migration is complete only when:

- Every Professional record fact has one canonical JSON value.
- Both adapters select records by stable identifiers and own only selection, ordering,
  formatting, editorial prose, and visual presentation.
- Unknown fields, malformed partial dates, duplicate identifiers, and broken references
  fail validation.
- The website passes tests, Astro checks, and production build.
- The CV passes validation, Typst compilation, and deterministic committed-PDF comparison.
- Production runs the same verified CV command with the pinned Typst version before Astro.
- `CONTEXT.md`, ADR-0010, and README agree with the implemented ownership model.
