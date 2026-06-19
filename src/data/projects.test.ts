import { describe, it, expect } from "vitest";
import {
  projects,
  selectedWork,
  featuredProjects,
  projectGroups,
  type Project
} from "./projects";
// Committed figure sources imported as raw strings (Vite's ?raw), so the
// embed-channel marker assertions run without Node's fs types — keeping
// `astro check` clean (no @types/node).
import choicekitFigure from "../../static/figures/choicekit-sklearn.html?raw";

const APPLIED = "Applied analysis & modeling";
const RESEARCH = "Research & replication";
const GITHUB = "Also on GitHub";

function byTitle(title: string): Project {
  const project = projects.find((p) => p.title === title);
  if (!project) throw new Error(`No project titled ${title}`);
  return project;
}

describe("project data invariants", () => {
  it("has unique titles", () => {
    const titles = projects.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("places every project under a known group", () => {
    const known = new Set<string>(projectGroups.map((g) => g.title));
    for (const p of projects) {
      expect(known.has(p.primaryGroup)).toBe(true);
    }
  });

  it("renders every featured title from the project list", () => {
    expect(featuredProjects()).toHaveLength(4);
    for (const p of featuredProjects()) {
      expect(projects.some((q) => q.title === p.title)).toBe(true);
    }
  });

  it("groups every project under exactly its primary group", () => {
    const grouped = selectedWork().flatMap((g) => g.projects);
    expect(grouped).toHaveLength(projects.length);
  });
});

describe("selectedWork display groups", () => {
  it("returns exactly the three display groups, in order", () => {
    expect(selectedWork().map((g) => g.title)).toEqual([APPLIED, RESEARCH, GITHUB]);
  });

  it("returns no empty group", () => {
    for (const group of selectedWork()) {
      expect(group.projects.length).toBeGreaterThan(0);
    }
  });

  it("flags only 'Also on GitHub' as the link group", () => {
    for (const group of selectedWork()) {
      expect(group.isLinkGroup).toBe(group.title === GITHUB);
    }
  });
});

describe("group membership and ordering", () => {
  function titlesIn(groupTitle: string): string[] {
    const group = selectedWork().find((g) => g.title === groupTitle);
    if (!group) throw new Error(`Group not found: ${groupTitle}`);
    return group.projects.map((p) => p.title);
  }

  it("places CitiBike and the three former Modeling & tools projects under the merged group", () => {
    const applied = titlesIn(APPLIED);
    expect(applied).toContain("CitiBike Demand, Risk, and Net Flow");
    expect(applied).toContain("RAG Search Engine");
    expect(applied).toContain("Minimal Coding Agent");
    expect(applied).toContain("choicekit");
  });

  it("orders the merged group with CitiBike leading", () => {
    expect(titlesIn(APPLIED)).toEqual([
      "CitiBike Demand, Risk, and Net Flow",
      "RAG Search Engine",
      "Minimal Coding Agent",
      "choicekit"
    ]);
  });

  it("orders the research group with Efficiency Wages leading", () => {
    expect(titlesIn(RESEARCH)).toEqual([
      "Efficiency Wages with Motivated Agents",
      "The Informativeness of Frequency-Report Scoring Rules",
      "Economic Theories and Machine Learning"
    ]);
  });
});

describe("featuredProjects", () => {
  it("still resolves every featured title to a real project", () => {
    expect(() => featuredProjects()).not.toThrow();
    expect(featuredProjects().length).toBeGreaterThan(0);
  });
});

describe("choicekit project entry", () => {
  const choicekit = byTitle("choicekit");

  it("is embedded with its hand-written sklearn figure", () => {
    expect(choicekit.embed).toBe("/figures/choicekit-sklearn.html");
  });

  it("carries the figure caption fields the panel renders", () => {
    expect(choicekit.figureTitle).toBeTruthy();
    expect(choicekit.figureNote).toBeTruthy();
    expect(choicekit.imageAlt).toBeTruthy();
  });

  it("communicates the scikit-learn-compatible, wide-form angle in its copy", () => {
    const copy = [
      choicekit.summary,
      choicekit.problem,
      choicekit.approach,
      choicekit.result
    ]
      .join(" ")
      .toLowerCase();
    expect(copy).toContain("scikit-learn");
    expect(copy).toContain("wide-form");
    expect(copy).toMatch(/gridsearchcv|cross-valid|pipeline/);
  });

  it("lists scikit-learn among its tools", () => {
    expect(choicekit.tools).toContain("scikit-learn");
  });

  it("stays honest about its in-development status", () => {
    const status = `${choicekit.status} ${choicekit.summary}`.toLowerCase();
    expect(status).toMatch(/development|early|progress|wip|in development/);
  });
});

describe("choicekit figure file", () => {
  const html = choicekitFigure;

  it("references the canonical embed-channel script verbatim", () => {
    expect(html).toContain('<script src="/figures/_embed.js"></script>');
  });

  it("links the shared figure palette rather than re-declaring tokens", () => {
    expect(html).toContain('href="/figures/_palette.css"');
  });

  it("recolors through the shared palette vars, not hardcoded hex", () => {
    expect(html).toContain("var(--ink)");
    expect(html).toContain("var(--amber)");
    expect(html).toContain("var(--emb-bg)");
  });

  it("reacts to the theme signal via data-theme", () => {
    expect(html).toContain("data-theme");
  });

  it("depicts the sklearn-native wide-form usage it claims", () => {
    expect(html).toContain("GridSearchCV");
    expect(html).toContain("ConditionalLogitClassifier");
  });
});
