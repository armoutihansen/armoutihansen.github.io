# armoutihansen.xyz

Personal website for Jesper Armouti-Hansen — a data scientist with an economics PhD.

The site is built with [Astro](https://astro.build/) and deployed as a static site through GitHub Pages to [armoutihansen.xyz](https://armoutihansen.xyz).

## Overview

The design direction is **premium-dark** (ADR 0003): a quant-analyst portfolio anchored on one interactive hero — warm-charcoal paper with a single amber accent, light mode retained. See `CONTEXT.md` and `docs/adr/0003-premium-dark-interactive-hero.md` for the design rationale and the language it uses.

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
  cv-baseline.json   Approved CV experience text and page topology
  cv.typ             CV selection, prose, formatting, and layout
  fonts/             Vendored fonts for reproducible rendering
  typst-versions.json  Canonical Typst version used locally and in production
```

Important files:

- `src/data/profile.ts`: name, headline, summary, social links, and skill groups.
- `src/data/projects.ts`: project cards shown on the homepage and Projects page.
- `src/data/publications.ts`: publications, working papers, and research projects.
- `src/data/professional-record.json`: canonical Professional record facts.
- `src/data/professional-record.ts`: strict Professional record validation.
- `src/data/experience.ts`: website experience selection, bullets, logos, and formatting.
- `cv/cv.typ`: CV selection, bullets, date formatting, and layout.
- `cv/cv-baseline.json`: expected experience text and two-page render topology.
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
deterministic rebuild, the approved experience text, and the two-page rendered layout:

```bash
npm run cv:verify
```

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

- Add or edit projects in `src/data/projects.ts`.
- Add or edit publications in `src/data/publications.ts`.
- Update profile links or skills in `src/data/profile.ts`.
- Update shared experience facts (role, organization, location, and structured dates) in
  `src/data/professional-record.json`.
- Update website-only experience bullets, logos, selection, or ordering in
  `src/data/experience.ts`.
- Update CV-only bullets, selection, ordering, date presentation, or layout in `cv/cv.typ`,
  update `cv/cv-baseline.json` only when the approved text or page topology intentionally
  changes, then run `npm run cv:build`.

For page-level copy, edit the relevant file in `src/pages/`.
