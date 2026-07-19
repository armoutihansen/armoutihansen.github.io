import { professionalRecord, type ProfessionalRecord } from "./professional-record";

export const projectGroups = [
  {
    title: "Applied analysis & modeling",
    intro:
      "Data work aimed at a decision: choosing the right measure, building the analysis, and being clear about what it does and doesn't support — plus the search, ranking, and tool-calling code that goes with it."
  },
  {
    title: "Research & replication",
    intro:
      "Research code: published replication packages and methods work in economics, tested and reproducible."
  },
  {
    title: "Also on GitHub",
    intro: "Smaller builds from learning new tools — a notes site, a static-site generator, and a few games and CLIs."
  }
] as const;

export type ProjectGroup = (typeof projectGroups)[number];
export type ProjectGroupTitle = ProjectGroup["title"];

export interface Project {
  id: string;
  title: string;
  primaryGroup: ProjectGroupTitle;
  category: string;
  status: string;
  summary: string;
  problem?: string;
  approach?: string;
  result?: string;
  tools: string[];
  href: string;
  embed?: string;
  image?: string;
  imageAlt?: string;
  figureTitle?: string;
  figureNote?: string;
  legend?: { label: string; color: string }[];
  controls?: { key: string; label: string }[];
}

export interface ProjectPresentation {
  id: string;
  primaryGroup: ProjectGroupTitle;
  summary: string;
  toolIds: string[];
  problem?: string;
  approach?: string;
  result?: string;
  embed?: string;
  image?: string;
  imageAlt?: string;
  figureTitle?: string;
  figureNote?: string;
  legend?: { label: string; color: string }[];
  controls?: { key: string; label: string }[];
}

export function resolveSelectedWork(
  record: Pick<ProfessionalRecord, "selectedWork" | "publications">,
  presentation: ProjectPresentation[]
): Project[] {
  const factsById = new Map(record.selectedWork.map((fact) => [fact.id, fact]));
  const presentationIds = new Set<string>();
  const resolved = presentation.map((local) => {
    if (presentationIds.has(local.id)) {
      throw new Error(`Duplicate Selected work presentation id: ${local.id}`);
    }
    presentationIds.add(local.id);
    const fact = factsById.get(local.id);
    if (!fact) throw new Error(`Unknown Selected work presentation id: ${local.id}`);
    const titleFact = fact.title;
    const title =
      typeof titleFact === "string"
        ? titleFact
        : record.publications.find(
            (publication) => publication.id === titleFact.publicationId
          )!.title;
    const hrefFact = fact.href;
    const href =
      typeof hrefFact === "string"
        ? hrefFact
        : record.publications
            .find((publication) => publication.id === hrefFact.publicationId)!
            .links.find((link) => link.id === hrefFact.linkId)!.url;
    const toolsById = new Map(fact.tools.map((tool) => [tool.id, tool.name]));
    const selectedToolIds = new Set<string>();
    const tools = local.toolIds.map((id) => {
      if (selectedToolIds.has(id)) {
        throw new Error(`Duplicate Selected work tool selection id "${id}" for ${fact.id}`);
      }
      selectedToolIds.add(id);
      const name = toolsById.get(id);
      if (!name) throw new Error(`Unknown Selected work tool id "${id}" for ${fact.id}`);
      return name;
    });
    const { toolIds: _toolIds, ...editorial } = local;
    return { ...fact, title, href, tools, ...editorial };
  });
  for (const fact of record.selectedWork) {
    if (!presentationIds.has(fact.id)) {
      throw new Error(`Missing Selected work presentation id: ${fact.id}`);
    }
  }
  return resolved;
}

export const projectPresentation: ProjectPresentation[] = [
  {
    id: "citibike-demand-risk-net-flow",
    primaryGroup: "Applied analysis & modeling",
    toolIds: ["python", "pandas", "feature-engineering", "risk-analysis", "prediction"],
    summary:
      "Station- and trip-level analysis of demand, net flow, and collision-adjusted risk across New York's bike-share network.",
    problem: "What can CitiBike trip data and NYPD crash records, together, tell an operator and an insurer?",
    approach:
      "Three analyses on 2023–2025 trips: demand and usage patterns; a per-trip crash-risk measure by station and time (NYPD crashes over trip exposure, empirical-Bayes smoothed); and a net-flow imbalance classifier for rebalancing.",
    result: "An interpretable per-trip risk measure an insurer could use as a rating input, demand patterns showing seasonality and per-station stagnation, and stable net-flow patterns a classifier predicts to guide rebalancing.",
    embed: "/figures/citibike-station-risk.html",
    figureTitle: "Station-level crash risk",
    figureNote: "Each dot is a station; amber flags the highest exposure-adjusted per-trip risk.",
    legend: [
      { label: "Lower", color: "#8a8370" },
      { label: "Higher", color: "#edb24e" }
    ],
    imageAlt: "Map of New York with 2,567 CitiBike stations as dots, the highest exposure-adjusted per-trip crash-risk stations in amber"
  },
  {
    id: "rag-search-engine",
    primaryGroup: "Applied analysis & modeling",
    toolIds: ["python", "rag", "bm25", "embeddings", "clip", "evaluation"],
    summary:
      "A hybrid movie-search engine combining lexical and semantic retrieval, reranking, image search, and RAG answers.",
    problem: "Plain search fails when a query is vague, visual, or more description than title.",
    approach:
      "Combined BM25, embeddings, reciprocal rank fusion, CLIP, reranking, and caching, with a debug trace through the pipeline.",
    result: "An evaluated pipeline: RRF search scored on precision, recall, and F1 against a golden set, with a debug mode that traces a query through each stage.",
    embed: "/figures/rag-architecture.html",
    figureTitle: "Search pipeline",
    figureNote: "Hybrid retrieval, fused and reranked, then answered with citations.",
    imageAlt:
      "Diagram of the hybrid search pipeline: query and image inputs through BM25, embeddings and CLIP retrieval, RRF fusion, reranking, and a RAG answer"
  },
  {
    id: "minimal-coding-agent",
    primaryGroup: "Applied analysis & modeling",
    toolIds: ["python", "tool-calling", "gemini-api", "cli"],
    summary: "A small Gemini-powered coding agent that reads files, runs scripts, and edits code through explicit tools.",
    problem: "How much can a coding agent do with only a few explicit tools and no framework?",
    approach: "Implemented file inspection, script execution, and edits behind explicit, inspectable tool calls.",
    result: "A working agent that reads, runs, and edits code in a loop, with every tool call explicit.",
    embed: "/figures/coding-agent-trace.html",
    figureTitle: "Agent run",
    figureNote: "An example run — the agent finds a failing test and fixes it.",
    imageAlt:
      "Terminal trace of an example coding-agent run: list files, run tests, read the source, patch the bug, and re-run the tests"
  },
  {
    id: "choicekit",
    primaryGroup: "Applied analysis & modeling",
    toolIds: ["python", "scikit-learn", "discrete-choice", "conditional-logit"],
    summary:
      "A scikit-learn-compatible package for discrete choice modeling on wide-form data, in development.",
    problem:
      "Discrete-choice packages expect long-form data and their own fit loops, so they sit outside scikit-learn's cross-validation, pipelines, and tuning.",
    approach:
      "Estimators inherit from scikit-learn's BaseEstimator and read wide-form X, y — one row per choice situation, {alt}_{feature} columns — so they drop straight into GridSearchCV, cross-validation, and pipelines.",
    result:
      "Intended interface: a ConditionalLogitClassifier you tune with GridSearchCV like any sklearn model. Early-stage and not yet released.",
    embed: "/figures/choicekit-sklearn.html",
    figureTitle: "sklearn-native usage",
    figureNote:
      "Intended interface: a choicekit estimator tuned with GridSearchCV on wide-form X, y — one row per choice situation.",
    imageAlt:
      "Code panel: a wide-form choice table feeding a choicekit ConditionalLogitClassifier passed to scikit-learn's GridSearchCV and fit on X, y"
  },
  {
    id: "efficiency-wages-motivated-agents",
    primaryGroup: "Research & replication",
    toolIds: ["python", "stata", "experimental-data", "replication"],
    summary: "Replication data and code for a published paper on wages, motivation, and effort.",
    problem: "Do wage incentives and prosocial motivation reinforce each other, or work through separate channels?",
    approach: "Built reproducible analyses around experimental data and documented the paper's online appendix.",
    result: "A peer-reviewed empirical project with a complete replication package.",
    embed: "/figures/efficiency-wages-effort.html",
    figureTitle: "Chosen effort by wage",
    figureNote: "Mean chosen effort by offered wage, with 95% confidence bands.",
    imageAlt:
      "Interactive chart of mean chosen effort by offered wage, Prosocial versus GE treatments"
  },
  {
    id: "informativeness-frequency-report-scoring-rules",
    primaryGroup: "Research & replication",
    toolIds: ["python", "simulation", "pytest", "scoring-rules"],
    summary: "Manuscript, simulations, and replication code for belief elicitation from frequency reports.",
    problem: "A count report is observable; the belief behind it is not. How much does the report actually pin down?",
    approach:
      "Characterized the identified set of beliefs behind each report under three scoring rules, then checked the bounds with simulation.",
    result: "No rule dominates: squared-distance gives the sharpest bounds when beliefs concentrate on a few categories, frequency-guessing when they're spread out, and Manhattan distance rarely wins but holds up across regimes.",
    embed: "/figures/frequency-rules-winshare.html",
    figureTitle: "Sharpest-bound win share",
    controls: [
      { key: "coord_avg", label: "Avg. probability" },
      { key: "mean_linear", label: "Belief mean" }
    ],
    figureNote:
      "Share of cases where each scoring rule gives the sharpest belief bounds, by belief concentration α.",
    imageAlt:
      "Interactive chart of the win share of three scoring rules versus belief concentration alpha"
  },
  {
    id: "economic-theories-machine-learning",
    primaryGroup: "Research & replication",
    toolIds: ["python", "machine-learning", "model-evaluation"],
    summary: "Code comparing economic theories against machine-learning benchmarks on behavioral data.",
    problem: "When a theory predicts behavior, how much of the predictable variation does it actually capture?",
    approach:
      "Benchmarked theory-based specifications against machine-learning models and examined the remaining predictive gap.",
    result: "Theory specifications scored on out-of-sample prediction and compared against the machine-learning benchmark.",
    embed: "/figures/econ-theories-completeness.html",
    figureTitle: "Completeness by model heterogeneity",
    figureNote:
      "Completeness climbs as the model captures more individual heterogeneity — a single type is far from enough, and even a handful of latent types don't exhaust it.",
    imageAlt:
      "Line chart of completeness rising from about 38% to 92% as the model moves from a single agent through more latent types to the full heterogeneity structure"
  },
  {
    id: "personal-knowledge-system",
    primaryGroup: "Also on GitHub",
    toolIds: ["typescript", "quartz", "obsidian"],
    summary: "A public notes site for ML, AI, and software-engineering references, built on Obsidian and Quartz.",
  },
  {
    id: "static-site-generator",
    primaryGroup: "Also on GitHub",
    toolIds: ["python", "markdown", "unit-testing"],
    summary: "A small Python static-site generator that turns Markdown into templated HTML.",
  },
  {
    id: "bookbot",
    primaryGroup: "Also on GitHub",
    toolIds: ["python", "text-processing"],
    summary: "A command-line tool that analyzes books and reports word and character frequencies.",
  },
  {
    id: "asteroids",
    primaryGroup: "Also on GitHub",
    toolIds: ["python", "pygame"],
    summary: "An Asteroids clone in Python and Pygame — movement, shooting, collisions, and asteroid splitting.",
  },
  {
    id: "maze-solver",
    primaryGroup: "Also on GitHub",
    toolIds: ["python", "algorithms", "tkinter"],
    summary: "A maze generator and visual solver using recursive backtracking and depth-first search.",
  }
];

export const projects = resolveSelectedWork(professionalRecord, projectPresentation);

const LINK_GROUP: ProjectGroupTitle = "Also on GitHub";

// The home's Selected work grid: four featured projects, in order. With a
// column-first 2x2 grid the left column reads 01->02, the right 03->04.
const featuredIds = [
  "rag-search-engine",
  "citibike-demand-risk-net-flow",
  "economic-theories-machine-learning",
  "informativeness-frequency-report-scoring-rules"
] as const;

// Domain invariants for single-group project data (see CONTEXT.md), checkable
// against any arrays so the failure modes can be unit-tested without corrupting
// the real data. Mirrors the `checkInvariants` shape in publications.ts. The
// import-time `assertInvariants()` runs this on the live data.
export function checkInvariants(
  projectList: Project[],
  groups: readonly ProjectGroup[]
): void {
  const titles = projectList.map((p) => p.title);
  const duplicates = titles.filter((t, i) => titles.indexOf(t) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate project titles: ${[...new Set(duplicates)].join(", ")}`);
  }
  const known = new Set<string>(groups.map((g) => g.title));
  const unknown = projectList.map((p) => p.primaryGroup).filter((g) => !known.has(g));
  if (unknown.length > 0) {
    throw new Error(`Unknown project groups: ${[...new Set(unknown)].join(", ")}`);
  }
  const idSet = new Set(projectList.map((project) => project.id));
  const missingFeatured = featuredIds.filter((id) => !idSet.has(id));
  if (missingFeatured.length > 0) {
    throw new Error(`Featured project ids not found: ${missingFeatured.join(", ")}`);
  }
  // Every substantive project (any group other than the "Also on GitHub" link
  // group) is illustrated: it must carry an `embed` or `image`. Link-group
  // entries render as a compact link list, so they legitimately have neither.
  // See ADR 0005 — a figureless substantive project is demoted to the link
  // group rather than rendered text-only.
  const unillustrated = projectList
    .filter((p) => p.primaryGroup !== LINK_GROUP && !p.embed && !p.image)
    .map((p) => p.title);
  if (unillustrated.length > 0) {
    throw new Error(
      `Substantive projects with no figure (embed or image): ${unillustrated.join(", ")}`
    );
  }
}

// Enforced at import so every consumer and the build are protected — not just
// the page that happens to render the projects.
function assertInvariants(): void {
  checkInvariants(projects, projectGroups);
}
assertInvariants();

function headingId(title: string): string {
  return `work-${title.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`;
}

export interface DisplayGroup {
  title: string;
  intro: string;
  headingId: string;
  isLinkGroup: boolean;
  projects: Project[];
}

// Grouped-for-display view: every non-empty group, each project under its one
// primary group, with the slug and link-group flag the Work page renders.
export function selectedWork(): DisplayGroup[] {
  return projectGroups
    .map((group) => ({
      title: group.title,
      intro: group.intro,
      headingId: headingId(group.title),
      isLinkGroup: group.title === LINK_GROUP,
      projects: projects.filter((p) => p.primaryGroup === group.title)
    }))
    .filter((group) => group.projects.length > 0);
}

// The home's ordered featured set.
export function featuredProjects(): Project[] {
  return selectProjects([...featuredIds]);
}

export function selectProjects(ids: string[], source: Project[] = projects): Project[] {
  const byId = new Map(source.map((project) => [project.id, project]));
  const seen = new Set<string>();
  return ids.map((id) => {
    if (seen.has(id)) throw new Error(`Duplicate project selection id: ${id}`);
    seen.add(id);
    const project = byId.get(id);
    if (!project) throw new Error(`Unknown project selection id: ${id}`);
    return project;
  });
}
