# armoutihansen.xyz

Personal website for Dr. Jesper Armouti-Hansen, positioned around quantitative data science, applied economics, and academic research.

The site is built with [Astro](https://astro.build/) and deployed as a static site through GitHub Pages to [armoutihansen.xyz](https://armoutihansen.xyz).

## Overview

The current version replaces the previous Hugo-based academic profile with a custom Astro site. The design keeps the research and publication profile prominent while adding a stronger quantitative data science and project portfolio layer.

Main sections:

- Home: profile summary, focus areas, selected projects, selected publications, and skills.
- Projects: applied data science, research code, GitHub projects, and selected technical work.
- Research: research areas and current agenda.
- Publications: journal publications, working papers, and ongoing research.
- CV: web CV plus downloadable PDF.
- Teaching: academic teaching and supervision.
- Contact: email and professional profiles.

## Tech Stack

- Astro
- TypeScript data files for structured content
- Plain CSS in `src/styles/global.css`
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

## Notes

- The legacy Hugo files are still present in the repository history, but the active site is Astro.
- The old CitiBike case study is preserved at `/DSC/`.
- The mobile homepage hides the profile image to keep the narrow layout clean.
