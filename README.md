# armoutihansen.xyz

Personal website positioning Jesper Armouti-Hansen for quantitative, pricing, and data analyst roles, backed by an economics PhD.

The site is built with [Astro](https://astro.build/) and deployed as a static site through GitHub Pages to [armoutihansen.xyz](https://armoutihansen.xyz).

## Overview

The design direction is an "Editorial Brief": a refined, recruiter-facing analyst dossier on warm ivory paper with a single deep-teal accent. See `CONTEXT.md` and `docs/adr/0002-editorial-brief-redesign.md` for the design rationale and the language it uses.

Four public pages (route names in parentheses):

- `/` — positioning hero, capabilities, selected work, recent experience, research credibility, and contact.
- `/projects/` (nav: **Work**) — selected work grouped by type, plus compact technical exercises.
- `/publications/` (nav: **Research**) — journal publications, working papers, and replication packages.
- `/cv/` — experience, strengths, skills, education, languages, and a downloadable PDF.

## Tech Stack

- Astro (static output)
- TypeScript data files for structured content
- Plain CSS in `src/styles/global.css`, with self-hosted variable fonts: Fraunces (display serif), IBM Plex Sans (body), JetBrains Mono (labels)
- GitHub Pages deployment via `.github/workflows/deploy.yml`

No client-side framework is used. The only client-side JavaScript is the light/dark theme switcher.

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