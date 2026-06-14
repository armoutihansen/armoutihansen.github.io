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

## Visual Direction

**Aesthetic axis — "Editorial Brief"**:
A refined editorial/research brief. Warm ivory paper, near-black ink, one restrained
deep-teal accent. Calm, precise, hand-crafted; pleasing on desktop and mobile. It should
look deliberately designed, never like a default template.

**Typography**:
Three roles, used consistently.
- **Fraunces Variable** (display serif): name and headings. Characterful, high-contrast,
  optical-sized. The site's signature.
- **IBM Plex Sans Variable** (body): paragraphs and reading copy. Crisp, slightly
  technical, highly legible.
- **JetBrains Mono Variable** (labels): eyebrows, metadata, periods, tags, button text,
  link rows.

**Ornamentation policy**:
Structure through type, whitespace, and hairline rules. Lists follow a shared "ledger"
model — every item carries a top hairline and equal vertical padding, so single- and
multi-column lists stay consistent and no row strands whitespace above a divider.
Even-count blocks (capabilities) use balanced two columns; the skills block is a
label/values table. A single deep-teal accent marks labels and active states; primary
actions use tasteful outline + solid buttons; the portrait is a clean bordered photo
with a whisper of shadow.
_Avoid_: heavy card chrome (boxed, shadowed surfaces everywhere), pill/tag clouds,
multiple accent colours, decorative offset/misaligned frames, generic
hero+three-pillars layouts, and repetitive thumbnails.

**Palette**:
Warm ivory base, warm near-black ink, muted/quiet text tiers, hairline + strong rule
colours, and one deep-teal accent used sparingly for focus, labels, and primary actions.
Dark mode keeps the same hierarchy in warm charcoal + ivory + a lighter teal — same
language, inverted, not a separate design.

**Page topology** (four public pages, route names unchanged):
- `/`: positioning hero, capabilities, selected work, recent experience, research
  credibility, contact.
- `/projects/` (nav: Work): grouped selected work from single-group project data.
- `/publications/` (nav: Research): publications, working papers, replication packages.
- `/cv/`: experience, strengths, skills, education, languages, PDF download.

**Hero pattern**:
Eyebrow `Quantitative Analyst · Economics PhD`, large serif name, a lead that mirrors
his CV summary (minus the job-search line), a short career-arc line, and primary actions.
A real professional photo (clean hairline border, slight shadow), plus a neutral facts
list (location, focus, stack, languages — no "open to" row). The home research strip
shows credibility stats (peer-reviewed papers, PhD, journals refereed for), not tools.
Not a research biography.

**Item shape (Work)**:
Each project appears once, under one primary group, as an editorial entry: index, kind
(status · category), serif title, one-line summary, a Problem / Approach / Result
definition list, and a mono tools line. No GitHub social-preview thumbnails — they were
repetitive and read as AI-portfolio filler. Smaller learning builds are demoted to a
compact "Also on GitHub" link list rather than full cards, so they never dilute the
serious work.

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

## Flagged Ambiguities

- **"Predictive Completeness of Social Preference Theories"** is shown on `/publications/`
  as venue "Work in progress." Its source repo (`~/repos/pred_comp_soc_pref`, ADR 0009,
  2026-06-13) retired the journal-paper program. The owner reviewed this and chose to
  keep it as "Work in progress." Leave it as-is unless the owner says otherwise.
