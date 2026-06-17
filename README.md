# armoutihansen.xyz

Personal website for Jesper Armouti-Hansen — a quantitative analyst with an economics PhD.

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
```

Important files:

- `src/data/profile.ts`: name, headline, summary, social links, and skill groups.
- `src/data/projects.ts`: project cards shown on the homepage and Projects page.
- `src/data/publications.ts`: publications, working papers, and research projects.
- `src/data/experience.ts`: CV experience entries.
- `src/styles/global.css`: visual design, responsive layout, and light/dark themes.
- `src/pages/index.astro`: homepage composition.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Astro telemetry is disabled in the npm scripts so local builds do not write outside the project directory.

## Deployment

The site deploys through GitHub Actions when changes are pushed to `master`.

The workflow:

1. Installs Node.js.
2. Runs `npm ci`.
3. Builds the site with `npm run build`.
4. Uploads the generated `dist/` directory to GitHub Pages.

The custom domain is provided by `static/CNAME`, which is copied into the build output.

## Content Updates

Most content updates should be made in `src/data/`:

- Add or edit projects in `src/data/projects.ts`.
- Add or edit publications in `src/data/publications.ts`.
- Update profile links or skills in `src/data/profile.ts`.
- Update CV entries in `src/data/experience.ts`.

For page-level copy, edit the relevant file in `src/pages/`.