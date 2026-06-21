# Site Design

The personal site of Jesper Armouti-Hansen. The design and copy are **re-anchored on
his CV**: a quantitative analyst with an economics PhD, currently a data scientist at
AXA, whose demonstrated work is model evaluation, statistical/econometric modeling, and
machine learning on structured data. Data analysis is a secondary strength. "Pricing" is
not used as a label, skill, or claim.

**No job-search signals on the public site.** He is currently employed (AXA) and does
not want the site to read as actively looking. So: no "open to / seeking roles" lines,
no "interested in moving toward …" aspiration, no contact copy about open positions.
Market- and risk-modeling is his actual target direction, but it is kept OFF the public
page — the site presents a neutral professional showcase (work, research, credentials),
and the targeting is conveyed in applications, not here. Do not re-add such signals.

The site is job-search oriented in purpose, but reads as a neutral dossier. It should help recruiters, hiring managers, and
analytics leads quickly read his analytical judgment, modeling ability, programming
practice, and research credibility, and find a contact path.

## Language

**Quantitative analyst (economics PhD)**:
The target identity, mirrored from his CV summary. He works on model evaluation,
statistical and econometric modeling, and machine learning on structured data, and is
moving toward quantitative modeling in a market and risk context. Academic research is a
credibility signal, not the headline.
_Avoid_: claiming pricing/market/risk modeling as done work (it is the stated
direction); scholar-coder; pure academic homepage; generic "data scientist" portfolio.

**Evidence dossier**:
The page model. The site reads like a concise professional dossier: positioning,
capabilities, selected work, experience, research credibility, CV, contact. Scan first,
inspect second.
_Avoid_: marketing landing page, decorative portfolio grid, exhaustive academic archive.

**Analyst signal**:
Each important block makes at least one professional signal visible: problem framing,
data handling, model choice, evaluation, uncertainty, or stakeholder communication.
_Avoid_: tool lists without judgment, duplicate projects across groups, learning
exercises competing with serious applied work.

**Plain, concrete voice**:
Copy is short, specific, and confident. No throat-clearing, no buzzword stacks, no
"I turn X into Y" filler, no AI-flavoured hedging.
_Avoid_: verbose abstractions, triplet-list padding, vague nouns ("decision support",
"operational interpretation") used as a substitute for a concrete claim.

**Figure embed channel**:
The contract between the Work page and the interactive illustration iframes it hosts.
One canonical definition per side: the embed half in `static/figures/_embed.js`
(referenced verbatim by every figure — `<script src="/figures/_embed.js">`), the host
half in `src/scripts/figure-embed-host.ts` (bundled into `/projects/`). Wire protocol:
a figure posts `emb-ready` on load; the page broadcasts `emb-theme` (light/dark, synced
to the host) and `emb-metric` (a caption toggle, re-dispatched to the figure as the DOM
event `emb:metric`). Figures react to `data-theme` and `emb:metric` with their own
palette/data code; the channel carries no figure-specific logic. The two Plotly figures
are emitted by `scripts/gen_*_fig.py`, which reference the same shared script.
_Avoid_: re-inlining the handshake into individual figures, the generators, or the page
(the drift this consolidated); putting figure-specific data or palette logic in the
channel.

**Figure palette**:
The warm-charcoal + amber tokens every figure recolors with — a concern of its own,
distinct from the embed channel (the channel only carries the theme *signal*; the colours
are not its business). One canonical source: `scripts/figure_theme.py` holds the values as
Python data. Three mechanisms read from it so the values are defined exactly once.
`finish_figure(fig, *, roles, x_title, y_title, div_id)` builds a generated Plotly figure
in the house style: the generator supplies only its data, trace *structure*, one `roles`
map (`[idx, kind, role]`), and a stable `div_id`, and `finish_figure` does the rest — the
build-time recolor (line/marker for `line`, fillcolor at 0.14 alpha for `band`), the shared
font/transparent backgrounds/hoverlabel/axis-colour skeleton, and the `theme_block(roles)`
injection. The `div_id` makes regeneration deterministic (plotly otherwise stamps a random
id on the plot `<div>` per run), so a clean `git diff` after re-running a generator is the
regression gate. The same `roles` map drives the runtime recolor: `theme_block(ROLES)` emits the `<style>` +
recolor `<script>` that re-paints the plot per host theme. So both build-time and runtime
colours come from `PAL` keyed by one map. Third, `write_palette_css()` emits
`static/figures/_palette.css`, which the hand-written figures `<link>` and reference as
`var(--ink)`/`var(--amber)`/… instead of re-declaring the tokens. Three delivery
mechanisms, one set of values. Adding a generated figure needs only its `roles`; a palette
change is edited in `figure_theme.py` and re-emitted (re-run the generators and the module).
_Avoid_: transcribing hex/rgba values into a generator, a figure, or the CSS by hand
(the drift this consolidated); re-implementing the house-style scaffolding in a generator
instead of `finish_figure`; folding the palette into the embed channel.

## Visual Direction

**Aesthetic axis — "Premium dark, one interactive quant hero"** (see ADR 0003):
A premium, modern, dark-first showcase. Warm-charcoal paper, off-white ink, one restrained
amber accent. The page must read as _rigorous, modern, builds things_ to a quantitative-
analyst hiring lead — never as a front-end-designer showreel. It looks deliberately
designed, never like a default template. Light mode is retained but secondary.

**Typography**:
Three roles, used consistently.
- **Hanken Grotesk Variable** (body + headings): paragraphs, h1–h3, reading copy. Modern,
  technical, legible — deliberately not Inter.
- **JetBrains Mono Variable** (the "quant tell"): eyebrows, metadata, periods, tags, button
  text, link rows, hero readouts — and **every number is set in tabular figures**.
- **Fraunces Variable** (the one serif moment): the name only. Nothing else uses it.

**Ornamentation policy**:
Structure through type, whitespace, and hairline rules. Lists follow a shared "ledger"
model — every item carries a top hairline and equal vertical padding, so single- and
multi-column lists stay consistent and no row strands whitespace above a divider.
Even-count blocks (capabilities) use a two-column grid with aligned row dividers; the skills block is a
label/values table. A single amber accent marks labels and active states; primary
actions use tasteful outline + solid buttons. The home opens on the interactive hero deck
(below), not a portrait.
_Avoid_: heavy card chrome (boxed, shadowed surfaces everywhere), pill/tag clouds,
multiple accent colours, decorative offset/misaligned frames, generic
hero+three-pillars layouts, and repetitive thumbnails.

**Palette**:
Dark-first: warm-charcoal base, off-white ink, muted/quiet text tiers, hairline + strong
rule colours, and one **amber** accent used sparingly for focus, labels, primary actions,
and the hero's signal elements. Light mode (warm ivory + near-black ink + a deeper amber)
keeps the same hierarchy, inverted — same language, secondary, not a separate design.

**Page topology** (four public pages, route names unchanged):
- `/`: positioning hero, capabilities, selected work, recent experience, research
  credibility, contact.
- `/projects/` (nav: Work): an open-source footprint strip (precomputed from the GitHub
  API → `src/data/github.json`), then grouped selected work from single-group project data.
- `/publications/` (nav: Research): publications, working papers, replication packages.
- `/cv/`: experience, strengths, skills, education, languages, PDF download.

**Hero pattern**:
Eyebrow `Quantitative Analyst · Economics PhD`, large serif name (Fraunces), a lead that
mirrors his CV summary (minus the job-search line), a mono fact line, and primary actions —
paired with the **interactive hero deck**: a two-panel, tab/scroll switcher carrying
(1) _model confidence → decision_ (a real logistic-regression classifier with a draggable
confidence band, coverage vs. accuracy) and (2) _risk per trip → time of day_ (the real
CitiBike finding). Both are genuine analyses of his, drawn from committed static data — no
runtime model, no portrait. The home research strip shows credibility stats, not tools.

**Item shape (Work)**:
Each project appears once, under one primary group, as an editorial entry: index, kind
(status · category), grotesque title, one-line summary, a Problem / Approach / Result
definition list, and a mono tools line. No GitHub social-preview thumbnails — they were
repetitive and read as AI-portfolio filler. Smaller learning builds are demoted to a
compact "Also on GitHub" link list rather than full cards, so they never dilute the
serious work. On the home, the four featured projects use a **compact** variant of this
entry — index, kind, title, summary, tools, no Problem/Approach/Result — laid out as a
two-column (2×2) grid in the capabilities rhythm (column-first fill, aligned row
dividers); the full Problem/Approach/Result form is reserved for `/projects/`, the
inspect layer. On `/projects/`, each project's illustration is an **integrated tonal
surface** — the figure's own `--emb-bg` tint rendered edge-to-edge with a small corner
radius, no border/shadow/card fill — top-aligned so its caption row sits level with the
project's meta row, with its caption and note on the page background; only the interactive
hero deck keeps a frame (ADR 0006). Publication covers keep theirs.

**Item shape (Research)**:
Compact bibliographic entries: mono `year · venue`, serif title, authors with Jesper's
name emphasized, optional detail line, explicit links, and a collapsed abstract.

**Mobile standard**:
Mobile is the base layer; desktop is layered on with `min-width` queries only. No
per-pixel hacks: the masthead swaps the full name for a `JAH` monogram via CSS `display`
(both present in the DOM, never `font-size: 0`), long titles wrap cleanly, lists stack
predictably, and tap targets stay comfortable.

## Relationships

- The **quantitative-analyst (economics PhD)** identity determines content hierarchy.
- The **evidence dossier** model determines page structure and component shape.
- The **analyst signal** test determines which projects are featured and how they're written.
- The **plain, concrete voice** governs all copy. Ground truth for every claim is his
  CV (`static/CV_JAH.pdf`), research, and GitHub; his writing voice is sampled from his
  own repos (`~/repos/frequency-beliefs`, `~/repos/efficiency-wages`). No claim should
  exceed those sources.
- Single-group project data prevents duplicate project rendering across the work page.
  The **Selected work** module (`src/data/projects.ts`) owns the project list, the group
  taxonomy, the ordered featured set, and the invariants — enforced at import via
  `assertInvariants()`, which calls the exported, fixture-testable
  `checkInvariants(projects, groups)` (mirroring the publications module). The rules:
  unique titles, all groups known, every featured title exists, and **figure coverage** —
  every substantive project (any group other than the "Also on GitHub" link group) must
  carry an `embed` or `image`, so the uniform side-by-side illustrated rhythm holds at the
  data layer. A figureless substantive project is demoted to "Also on GitHub" rather than
  rendered text-only (see ADR 0005). Any consumer and the build are protected. Pages read
  `selectedWork()` and `featuredProjects()` rather than re-deriving grouping or hardcoding
  which projects are featured.
- The hero's two analyses and the Work page's open-source strip run on **committed,
  precomputed data** (`scripts/gen_hero_data.py` → `hero-model.json`;
  `scripts/gen_github_data.mjs` → `github.json`) — no model or API call at build or request
  time. Refresh by re-running the scripts. See ADR 0003.

## Flagged Ambiguities

- **"Predictive Completeness of Social Preference Theories"** is shown on `/publications/`
  as venue "Work in progress." Its source repo (`~/repos/pred_comp_soc_pref`, ADR 0009,
  2026-06-13) retired the journal-paper program. The owner reviewed this and chose to
  keep it as "Work in progress." Leave it as-is unless the owner says otherwise.
- **All Work figures are now in-repo.** CitiBike's figure was previously an external `embed`
  URL; it is now the committed local map `static/figures/citibike-station-risk.html`,
  generated by `scripts/gen_citibike_fig.py` from the committed real data
  `scripts/data/citibike_station_risk.json` (2,567 stations, per-trip crash-risk tiers).
  It is an interactive Leaflet map (pan / zoom / popups) on a theme-matched minimal CartoDB
  basemap; stations recede in `--ink` and the highest-risk stations flag in `--amber`,
  recoloured live with the site theme via the embed channel's `data-theme`. Leaflet and the
  basemap tiles load from a CDN at runtime (like the figures' web font); the `embed` itself
  is a local `/figures/*.html` file, and a test asserts no `embed` points at an external host.
