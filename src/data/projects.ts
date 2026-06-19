export const projectGroups = [
  {
    title: "Applied analysis & modeling",
    intro:
      "Data work aimed at a decision and the tools that support it: pick the measure that matters, build the analysis, and state what it supports — plus the search, ranking, and tool-calling code that goes with it."
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

export const projects: Project[] = [
  {
    title: "CitiBike Demand, Risk, and Net Flow",
    primaryGroup: "Applied analysis & modeling",
    category: "Operational analysis",
    status: "Case study",
    summary:
      "Station- and trip-level analysis of demand, net flow, and collision-adjusted risk across New York's bike-share network.",
    problem: "Where does the network strain — heavy use, poor rebalancing, or higher risk per trip?",
    approach:
      "Joined trip records with collision data and built station-level measures that separate raw volume from exposure-adjusted risk.",
    result: "Three separate measures — demand, imbalance, and exposure-adjusted risk — that a single ranking would have conflated.",
    tools: ["Python", "pandas", "feature engineering", "risk analysis", "forecasting"],
    href: "/DSC/",
    embed: "https://armoutihansen.xyz/citibike-data-science/src/figures/station_risk_tiers.html",
    figureTitle: "Station-level crash risk",
    figureNote: "Each dot is a CitiBike station.",
    legend: [
      { label: "Lower", color: "#2f8f3e" },
      { label: "Medium", color: "#e8932a" },
      { label: "Higher", color: "#d23b3b" }
    ],
    imageAlt: "Interactive map of New York with CitiBike stations colored by per-trip crash risk"
  },
  {
    title: "RAG Search Engine",
    primaryGroup: "Applied analysis & modeling",
    category: "Retrieval system",
    status: "GitHub project",
    summary:
      "A hybrid movie-search engine combining lexical and semantic retrieval, reranking, image search, and RAG answers.",
    problem: "Plain search fails when a query is vague, visual, or more description than title.",
    approach:
      "Combined BM25, embeddings, reciprocal rank fusion, CLIP, reranking, and caching, with explicit checks at each retrieval stage.",
    result: "A pipeline with each retrieval stage measured separately, so ranking quality is attributable to a stage rather than the whole.",
    tools: ["Python", "RAG", "BM25", "embeddings", "CLIP", "evaluation"],
    href: "https://github.com/armoutihansen/rag-search-engine",
    embed: "/figures/rag-architecture.html",
    figureTitle: "Search pipeline",
    figureNote: "Hybrid retrieval, fused and reranked, then answered with citations.",
    imageAlt:
      "Diagram of the hybrid search pipeline: query and image inputs through BM25, embeddings and CLIP retrieval, RRF fusion, reranking, and a RAG answer"
  },
  {
    title: "Minimal Coding Agent",
    primaryGroup: "Applied analysis & modeling",
    category: "AI tooling",
    status: "GitHub project",
    summary: "A small Gemini-powered coding agent that reads files, runs scripts, and edits code through explicit tools.",
    problem: "How much can a coding agent do with only a few explicit tools and no framework?",
    approach: "Implemented file inspection, script execution, and edits behind explicit, inspectable tool calls.",
    result: "A working agent that reads, runs, and edits code in a loop — and surfaces where it needs guardrails.",
    tools: ["Python", "tool-calling", "Gemini API", "CLI"],
    href: "https://github.com/armoutihansen/build-ai-agent",
    embed: "/figures/coding-agent-trace.html",
    figureTitle: "Agent run",
    figureNote: "An example run — the agent finds a failing test and fixes it.",
    imageAlt:
      "Terminal trace of an example coding-agent run: list files, run tests, read the source, patch the bug, and re-run the tests"
  },
  {
    title: "choicekit",
    primaryGroup: "Applied analysis & modeling",
    category: "Python package",
    status: "Early-stage",
    summary: "A Python package for reusable choice-modeling workflows, in development.",
    problem: "Choice-modeling code gets hard to trust when every project restarts from a loose script.",
    approach: "Move estimation machinery into tested package code and leave project files for data and interpretation.",
    result: "Early, but aimed at a clean boundary between modeling tools and one-off analysis.",
    tools: ["Python", "choice modeling", "package design"],
    href: "https://github.com/armoutihansen/choicekit"
  },
  {
    title: "Efficiency Wages with Motivated Agents",
    primaryGroup: "Research & replication",
    category: "Replication package",
    status: "Published · GEB 2024",
    summary: "Replication data and code for a published paper on wages, motivation, and effort.",
    problem: "Do wage incentives and prosocial motivation reinforce each other, or work through separate channels?",
    approach: "Built reproducible analyses around experimental data and documented the paper's online appendix.",
    result: "A peer-reviewed empirical project with a complete replication package.",
    tools: ["Python", "Stata", "experimental data", "replication"],
    href: "https://github.com/armoutihansen/efficiency-wages",
    embed: "/figures/efficiency-wages-effort.html",
    figureTitle: "Chosen effort by wage",
    figureNote: "Mean chosen effort by offered wage, with 95% confidence bands.",
    imageAlt:
      "Interactive chart of mean chosen effort by offered wage, Prosocial versus GE treatments"
  },
  {
    title: "The Informativeness of Frequency-Report Scoring Rules",
    primaryGroup: "Research & replication",
    category: "Inference & simulation",
    status: "Manuscript + replication package",
    summary: "Manuscript, simulations, and replication code for belief elicitation from frequency reports.",
    problem: "A count report is observable; the belief behind it is not. How much does the report actually pin down?",
    approach:
      "Characterized the identified set of beliefs behind each report under three scoring rules, then checked the bounds with simulation.",
    result: "No rule dominates: which scoring rule gives the sharpest bounds depends on how concentrated the beliefs are.",
    tools: ["Python", "simulation", "pytest", "scoring rules"],
    href: "https://github.com/armoutihansen/frequency-beliefs",
    embed: "/figures/frequency-rules-winshare.html",
    figureTitle: "Sharpest-bound win share",
    controls: [
      { key: "coord_avg", label: "Average-coordinate" },
      { key: "mean_linear", label: "Linear-mean" }
    ],
    figureNote:
      "Share of cases where each scoring rule gives the sharpest belief bounds, by belief concentration α.",
    imageAlt:
      "Interactive chart of the win share of three scoring rules versus belief concentration alpha"
  },
  {
    title: "Economic Theories and Machine Learning",
    primaryGroup: "Research & replication",
    category: "Model comparison",
    status: "GitHub project",
    summary: "Code comparing economic theories against machine-learning benchmarks on behavioral data.",
    problem: "When a theory predicts behavior, how much of the predictable variation does it actually capture?",
    approach:
      "Benchmarked theory-based specifications against machine-learning models and examined the remaining predictive gap.",
    result: "Theory specifications scored on out-of-sample prediction and compared against the machine-learning benchmark.",
    tools: ["Python", "machine learning", "model evaluation"],
    href: "https://github.com/armoutihansen/econ-theories-ml"
  },
  {
    title: "Personal Knowledge System",
    primaryGroup: "Also on GitHub",
    category: "Knowledge base",
    status: "Live",
    summary: "A public notes site for ML, AI, and software-engineering references, built on Obsidian and Quartz.",
    tools: ["TypeScript", "Quartz", "Obsidian"],
    href: "https://notes.armoutihansen.xyz/"
  },
  {
    title: "Static Site Generator",
    primaryGroup: "Also on GitHub",
    category: "Software",
    status: "GitHub project",
    summary: "A small Python static-site generator that turns Markdown into templated HTML.",
    tools: ["Python", "Markdown", "unit testing"],
    href: "https://github.com/armoutihansen/static-site-generator"
  },
  {
    title: "BookBot",
    primaryGroup: "Also on GitHub",
    category: "CLI tool",
    status: "GitHub project",
    summary: "A command-line tool that analyzes books and reports word and character frequencies.",
    tools: ["Python", "text processing"],
    href: "https://github.com/armoutihansen/bookbot"
  },
  {
    title: "Asteroids",
    primaryGroup: "Also on GitHub",
    category: "Game",
    status: "GitHub project",
    summary: "An Asteroids clone in Python and Pygame — movement, shooting, collisions, and asteroid splitting.",
    tools: ["Python", "Pygame"],
    href: "https://github.com/armoutihansen/asteroids"
  },
  {
    title: "Maze Solver",
    primaryGroup: "Also on GitHub",
    category: "Algorithms",
    status: "GitHub project",
    summary: "A maze generator and visual solver using recursive backtracking and depth-first search.",
    tools: ["Python", "algorithms", "tkinter"],
    href: "https://github.com/armoutihansen/maze-solver"
  }
];

const LINK_GROUP: ProjectGroupTitle = "Also on GitHub";

// The home's Selected work grid: four featured projects, in order. With a
// column-first 2x2 grid the left column reads 01->02, the right 03->04.
const featuredTitles = [
  "RAG Search Engine",
  "CitiBike Demand, Risk, and Net Flow",
  "Economic Theories and Machine Learning",
  "The Informativeness of Frequency-Report Scoring Rules"
] as const;

// Domain invariants for single-group project data (see CONTEXT.md), enforced at
// import so every consumer and the build are protected — not just the page that
// happens to render the projects.
function assertInvariants(): void {
  const titles = projects.map((p) => p.title);
  const duplicates = titles.filter((t, i) => titles.indexOf(t) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate project titles: ${[...new Set(duplicates)].join(", ")}`);
  }
  const known = new Set<string>(projectGroups.map((g) => g.title));
  const unknown = projects.map((p) => p.primaryGroup).filter((g) => !known.has(g));
  if (unknown.length > 0) {
    throw new Error(`Unknown project groups: ${[...new Set(unknown)].join(", ")}`);
  }
  const titleSet = new Set(titles);
  const missingFeatured = featuredTitles.filter((t) => !titleSet.has(t));
  if (missingFeatured.length > 0) {
    throw new Error(`Featured titles not found in projects: ${missingFeatured.join(", ")}`);
  }
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
  return featuredTitles.map((title) => {
    const project = projects.find((p) => p.title === title);
    if (!project) throw new Error(`Featured project not found: ${title}`);
    return project;
  });
}
