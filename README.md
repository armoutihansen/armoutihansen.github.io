# armoutihansen.xyz

Personal website for Jesper Armouti-Hansen — a data scientist with an economics PhD.

The site is built with [Astro](https://astro.build/) and deployed as a static site through GitHub Pages to [armoutihansen.xyz](https://armoutihansen.xyz).

## Overview

The design direction is **premium-dark** (ADR 0003): a professional data-science dossier anchored on one interactive hero — warm-charcoal paper with a single amber accent, light mode retained. See `CONTEXT.md` and `docs/adr/0003-premium-dark-interactive-hero.md` for the design rationale and the language it uses.

Four public pages (route names in parentheses):

- `/` — interactive hero (model-confidence + CitiBike risk panels), capabilities, selected work, experience, research, and contact.
- `/projects/` (nav: **Work**) — selected work grouped by type, plus compact technical exercises.
- `/publications/` (nav: **Research**) — journal publications, working papers, and replication packages.
- `/cv/` — experience, strengths, skills, education, languages, and a downloadable PDF.

## Tech Stack

- Astro (static output)
- TypeScript data files for structured content
- A strict, validated Professional record in JSON for facts shared by the site and CV
- A pinned Typst toolchain for the downloadable PDF CV
- Plain CSS in `src/styles/global.css`, with self-hosted variable fonts: Hanken Grotesk (body + headings), JetBrains Mono (labels, tabular figures), Fraunces (name only)
- GitHub Pages deployment via `.github/workflows/deploy.yml`

No client-side framework is used. Client-side JavaScript is limited to the theme switcher and the interactive hero (Canvas).

## Project Structure

```text
src/
  components/        Reusable Astro components
  data/              Structured profile, project, publication, and CV data
  layouts/           Shared page layout
  pages/             Site routes
  styles/            Global CSS and theme styles

static/
  CNAME              GitHub Pages custom domain
  CV_JAH.pdf         Downloadable CV
  DSC/               Preserved CitiBike case study
  images/            Profile and site images

cv/
  cv-baseline.json   Approved CV migrated-record text and page topology
  cv.typ             CV selection, prose, formatting, and layout
  fonts/             Vendored fonts for reproducible rendering
  typst-versions.json  Canonical Typst version used locally and in production
```

Important files:

- `src/data/profile.ts`: website identity/link selection, headline, summary, and skill groups.
- `src/data/projects.ts`: website-only Selected work grouping, prose, curation, tool
  presentation, and illustration metadata, resolved against the Professional record.
- `src/data/publications.ts`: website Research presentation and resolved adapter.
- `src/data/professional-record.json`: canonical Professional record facts.
- `src/data/professional-record.ts`: strict Professional record validation.
- `src/data/github.json`: precomputed GitHub activity data (professional-link facts stay in
  the Professional record).
- `src/data/experience.ts`: website experience selection, bullets, logos, and formatting.
- `src/data/education.ts`: website education selection, detail prose, logos, and formatting.
- `src/data/teaching.ts`: website teaching selection, summary prose, and formatting.
- `cv/cv.typ`: CV selection, bullets, date formatting, and layout.
- `cv/cv-baseline.json`: expected migrated-record text and two-page render topology.
- `src/styles/global.css`: visual design, responsive layout, and light/dark themes.
- `src/pages/index.astro`: homepage composition.

## Local Development

Install dependencies:

```bash
npm install
```

CV verification also requires the Typst version in `cv/typst-versions.json` and
Poppler (`pdfinfo`, `pdftotext`, and `pdftoppm`).

Start the development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Build and commit an updated PDF after changing Professional record facts or CV prose:

```bash
npm run cv:build
```

Verify that the Professional record is valid and the committed PDF matches a
deterministic rebuild, the approved migrated-record text, and the two-page rendered layout:

```bash
npm run cv:verify
```

### Approving an intentional CV change

`npm run cv:build` never updates the approved baseline hash. After intentionally changing
CV content or layout:

1. Render a candidate with the pinned toolchain:
   `SOURCE_DATE_EPOCH=0 typst compile --root . --font-path cv/fonts cv/cv.typ /tmp/CV_JAH-candidate.pdf`.
2. Extract its text and rasterize both pages with Poppler; visually review the page PNGs.
3. Update the approved text/topology and `pdfSha256` in `cv/cv-baseline.json` explicitly.
4. Run `npm run cv:build`, `npm run cv:verify`, and the full test suite.

Changing the hash is an approval action, not a build side effect.

Preview the production build locally:

```bash
npm run preview
```

Astro telemetry is disabled in the npm scripts so local builds do not write outside the project directory.

## Deployment

The site deploys through GitHub Actions when changes are pushed to `master`.

The workflow:

1. Installs Node.js, the repository-pinned Typst version, and Poppler.
2. Runs `npm ci`.
3. Validates the Professional record, rebuilds the CV, and rejects a stale committed PDF.
4. Runs tests and Astro checks.
5. Builds the site with `npm run build`.
6. Uploads the generated `dist/` directory to GitHub Pages.

The custom domain is provided by `static/CNAME`, which is copied into the build output.

## Content Updates

Most content updates should be made in `src/data/`:

- Update shared Selected work identifiers, full titles, categories, statuses, factual URLs,
  and canonical tool names in `src/data/professional-record.json`.
- Update website-only Selected work grouping, summaries, Problem/Approach/Result prose,
  featured order, tool selection/order, and illustration metadata in `src/data/projects.ts`;
  update the CV's four-project selection, derived short titles, summaries, tool
  selection/order, or layout in `cv/cv.typ`.
- Update shared publication people, titles, structured authors, venues, years, details,
  types, and factual links in `src/data/professional-record.json`.
- Update website-only Research abstracts, covers, link labels, featured selection, or
  ordering in `src/data/publications.ts`; update the CV's independent journal selection,
  abbreviations, ordering, or layout in `cv/cv.typ`.
- Update shared name, email, location, phone, or professional-link URLs in
  `src/data/professional-record.json`.
- Update website-only identity positioning, prose, link labels, visibility, ordering, or
  skill/language presentation in `src/data/profile.ts`.
- Update shared experience facts (role, organization, location, and structured dates) in
  `src/data/professional-record.json`.
- Update website-only experience bullets, logos, selection, or ordering in
  `src/data/experience.ts`.
- Update shared education facts (degree, institution, location, distinctions, and structured
  dates) in `src/data/professional-record.json`.
- Update website-only education detail prose, logos, selection, ordering, or formatting in
  `src/data/education.ts`.
- Update shared teaching facts (course titles, levels, roles, structured date spans, and
  supervision totals) in `src/data/professional-record.json`.
- Update website-only teaching summary prose, selection, ordering, or formatting in
  `src/data/teaching.ts`.
- Update shared skill names, categories, and spoken-language proficiency in
  `src/data/professional-record.json`.
- Update website-only skill/language group labels, selection, and ordering in
  `src/data/profile.ts`; update the CV's independent selection, labels, ordering, and
  layout in `cv/cv.typ`.
- Update CV-only bullets, compact education and teaching wording, selection, ordering, date
  presentation, or layout in `cv/cv.typ`,
  then follow the explicit baseline-approval workflow above.

After any Professional record change, run `npm run cv:verify`. If the factual change is
intended to alter the CV, follow the baseline-approval workflow before rebuilding the
committed PDF.

For page-level copy, edit the relevant file in `src/pages/`.
