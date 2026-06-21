import { describe, it, expect } from "vitest";
import {
  projects,
  selectedWork,
  featuredProjects,
  projectGroups,
  checkInvariants,
  type Project,
  type ProjectGroupTitle
} from "./projects";
// Committed figure sources imported as raw strings (Vite's ?raw), so the
// embed-channel marker assertions run without Node's fs types — keeping
// `astro check` clean (no @types/node).
import choicekitFigure from "../../static/figures/choicekit-sklearn.html?raw";
import econFigureHtml from "../../static/figures/econ-theories-completeness.html?raw";
import efficiencyWagesFigureHtml from "../../static/figures/efficiency-wages-effort.html?raw";
// Every committed figure source under static/figures/, keyed by its served
// "/figures/<name>" path. Glob (eager) is type-clean without @types/node and
// lets the embed-asset-existence test assert a file is actually committed.
const figureFiles = import.meta.glob("../../static/figures/*.html", {
  eager: true,
  query: "?raw",
  import: "default"
}) as Record<string, string>;
const committedFigurePaths = new Set(
  Object.keys(figureFiles).map((p) => p.replace("../../static", ""))
);

const APPLIED = "Applied analysis & modeling";
const RESEARCH = "Research & replication";
const GITHUB = "Also on GitHub";

function byTitle(title: string): Project {
  const project = projects.find((p) => p.title === title);
  if (!project) throw new Error(`No project titled ${title}`);
  return project;
}

// A minimal well-formed substantive (non-link-group) entry to mutate per
// failure-mode test, so we exercise checkInvariants against supplied arrays
// without corrupting the real data.
function validProject(overrides: Partial<Project> = {}): Project {
  return {
    title: "A Project",
    primaryGroup: APPLIED,
    category: "Analysis",
    status: "Case study",
    summary: "A one-line summary.",
    tools: ["Python"],
    href: "https://example.com/project",
    embed: "/figures/example.html",
    ...overrides
  };
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

describe("Economic Theories & ML figure", () => {
  it("ships a non-empty committed figure HTML under static/figures/", () => {
    expect(econFigureHtml.length).toBeGreaterThan(0);
  });

  it("carries the embed-channel contract markers (referenced _embed.js, shared palette/theme)", () => {
    expect(econFigureHtml).toContain('src="/figures/_embed.js"');
    expect(econFigureHtml).toContain("--emb-bg");
    expect(econFigureHtml).toContain("data-theme");
  });

  it("makes the heterogeneity-richness claim, with no level-dependence language", () => {
    const html = econFigureHtml.toLowerCase();
    expect(html).not.toContain("representative agent");
    expect(html).not.toContain("evaluation level");
    expect(html).not.toContain("individual-level");
  });

  it("recolors from PAL values, with no stray hardcoded hex outside the palette", () => {
    // finish_figure paints the committed (light-theme) figure from figure_theme.py's
    // PAL["light"]: the c0 amber drives the single completeness line, ink the font.
    const PAL_C0_LIGHT = "#9a6310";
    const PAL_INK_LIGHT = "#5f594c";
    expect(econFigureHtml).toContain(`"color":"${PAL_C0_LIGHT}"`); // line/marker
    expect(econFigureHtml).toContain(`"color":"${PAL_INK_LIGHT}"`); // font

    // Every six-digit hex the figure embeds must be either a PAL value (the
    // theme_block script ships both light and dark PAL slices for the runtime
    // recolor), the shared dark-hoverlabel font chrome, or a Plotly-default
    // template colour — never a hand-transcribed colour that could drift from PAL.
    const PAL_HEX = new Set([
      // light
      "#5f594c", "#9a6310", "#6f664c", "#a8572b", "#ece6d7",
      // dark
      "#b1a98f", "#edb24e", "#9a9070", "#d98a52", "#1c1912"
    ]);
    // The dark hoverlabel font colour (HOVERLABEL in figure_theme.py — shared
    // figure chrome, deliberately not a PAL token).
    const HOVERLABEL_FONT = "#ece4d3";
    // Plotly's bundled default template ships its own palette in to_html output.
    const PLOTLY_TEMPLATE_HEX = new Set([
      "#0d0887", "#46039f", "#7201a8", "#9c179e", "#bd3786", "#d8576b", "#ed7953",
      "#fb9f3a", "#fdca26", "#f0f921", "#8e0152", "#c51b7d", "#de77ae", "#f1b6da",
      "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419",
      "#2a3f5f", "#e5ecf6", "#ebf0f8", "#c8d4e3", "#636efa", "#ef553b", "#00cc96",
      "#ab63fa", "#ffa15a", "#19d3f3", "#ff6692", "#b6e880", "#ff97ff", "#fecb52"
    ]);
    const allowed = new Set([...PAL_HEX, HOVERLABEL_FONT, ...PLOTLY_TEMPLATE_HEX]);
    const found = econFigureHtml.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
    for (const hex of found) {
      if (allowed.has(hex.toLowerCase())) continue;
      throw new Error(`stray non-PAL hex in econ figure: ${hex}`);
    }
  });
});

describe("Efficiency Wages figure", () => {
  it("ships a non-empty committed figure HTML under static/figures/", () => {
    expect(efficiencyWagesFigureHtml.length).toBeGreaterThan(0);
  });

  it("carries the embed-channel contract markers (referenced _embed.js, shared palette/theme)", () => {
    expect(efficiencyWagesFigureHtml).toContain('src="/figures/_embed.js"');
    expect(efficiencyWagesFigureHtml).toContain("--emb-bg");
    expect(efficiencyWagesFigureHtml).toContain("data-theme");
  });

  it("recolors from PAL values, with no stray hardcoded hex outside the palette", () => {
    // finish_figure paints the committed (light-theme) figure from figure_theme.py's
    // PAL["light"]: c0 amber drives the Prosocial line, c1 warm-grey the GE line.
    const PAL_C0_LIGHT = "#9a6310";
    const PAL_C1_LIGHT = "#6f664c";
    expect(efficiencyWagesFigureHtml).toContain(`"color":"${PAL_C0_LIGHT}"`); // Prosocial line/marker
    expect(efficiencyWagesFigureHtml).toContain(`"color":"${PAL_C1_LIGHT}"`); // GE line/marker

    // Every six-digit hex the figure embeds must be either a PAL value (the
    // theme_block script ships both light and dark PAL slices for the runtime
    // recolor), the shared dark-hoverlabel font chrome, or a Plotly-default
    // template colour — never a hand-transcribed colour that could drift from PAL.
    const PAL_HEX = new Set([
      // light
      "#5f594c", "#9a6310", "#6f664c", "#a8572b", "#ece6d7",
      // dark
      "#b1a98f", "#edb24e", "#9a9070", "#d98a52", "#1c1912"
    ]);
    // The dark hoverlabel font colour (HOVERLABEL in figure_theme.py — shared
    // figure chrome, deliberately not a PAL token).
    const HOVERLABEL_FONT = "#ece4d3";
    // Plotly's bundled default template ships its own palette in to_html output.
    const PLOTLY_TEMPLATE_HEX = new Set([
      "#0d0887", "#46039f", "#7201a8", "#9c179e", "#bd3786", "#d8576b", "#ed7953",
      "#fb9f3a", "#fdca26", "#f0f921", "#8e0152", "#c51b7d", "#de77ae", "#f1b6da",
      "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419",
      "#2a3f5f", "#e5ecf6", "#ebf0f8", "#c8d4e3", "#636efa", "#ef553b", "#00cc96",
      "#ab63fa", "#ffa15a", "#19d3f3", "#ff6692", "#b6e880", "#ff97ff", "#fecb52"
    ]);
    const allowed = new Set([...PAL_HEX, HOVERLABEL_FONT, ...PLOTLY_TEMPLATE_HEX]);
    const found = efficiencyWagesFigureHtml.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
    for (const hex of found) {
      if (allowed.has(hex.toLowerCase())) continue;
      throw new Error(`stray non-PAL hex in efficiency-wages figure: ${hex}`);
    }
  });
});

describe("checkInvariants", () => {
  it("passes on the real data", () => {
    expect(() => checkInvariants(projects, projectGroups)).not.toThrow();
  });

  it("throws on duplicate titles", () => {
    const bad = [validProject(), validProject()];
    expect(() => checkInvariants(bad, projectGroups)).toThrow(/Duplicate project titles/);
  });

  it("throws on an unknown group", () => {
    const bad = [validProject({ primaryGroup: "Made-up group" as ProjectGroupTitle })];
    expect(() => checkInvariants(bad, projectGroups)).toThrow(/Unknown project groups/);
  });

  it("throws when a featured title is not in the project list", () => {
    // The real featured set references real titles; an empty array drops them all.
    expect(() => checkInvariants([], projectGroups)).toThrow(/Featured titles not found/);
  });

  it("throws when a substantive (non-link-group) project has no embed or image", () => {
    const bad = realProjectsWith(validProject({ embed: undefined, image: undefined }));
    expect(() => checkInvariants(bad, projectGroups)).toThrow(/no figure \(embed or image\)/);
  });

  it("allows a substantive project illustrated by image instead of embed", () => {
    const ok = realProjectsWith(validProject({ embed: undefined, image: "/images/x.png" }));
    expect(() => checkInvariants(ok, projectGroups)).not.toThrow();
  });

  it("allows a link-group project with no embed or image", () => {
    const ok = realProjectsWith(
      validProject({ primaryGroup: GITHUB, embed: undefined, image: undefined })
    );
    expect(() => checkInvariants(ok, projectGroups)).not.toThrow();
  });
});

// Helper: append a fixture to the real projects so the featured-titles rule is
// satisfied while we isolate the figure-coverage rule under test.
function realProjectsWith(extra: Project): Project[] {
  return [...projects, { ...extra, title: `${extra.title} (fixture)` }];
}

describe("figure-embed asset existence", () => {
  it("ships a committed file under static/figures/ for every local embed", () => {
    const localEmbeds = projects
      .map((p) => p.embed)
      .filter((e): e is string => typeof e === "string" && e.startsWith("/figures/"));
    expect(localEmbeds.length).toBeGreaterThan(0);
    for (const embed of localEmbeds) {
      expect(committedFigurePaths.has(embed)).toBe(true);
    }
  });

  it("hosts every figure in-repo — no embed points at an external host", () => {
    // Every substantive figure is a committed local file; none depend on an
    // external host (the CitiBike station-risk map was the last external embed
    // and is now in-repo).
    const external = projects
      .map((p) => p.embed)
      .filter((e): e is string => typeof e === "string" && /^https?:/.test(e));
    expect(external).toEqual([]);
  });

  it("hosts the CitiBike station-risk map in-repo", () => {
    const citibike = byTitle("CitiBike Demand, Risk, and Net Flow");
    expect(citibike.embed).toBe("/figures/citibike-station-risk.html");
    expect(committedFigurePaths.has(citibike.embed!)).toBe(true);
  });
});

describe("Economic Theories & ML project entry", () => {
  const econ = byTitle("Economic Theories and Machine Learning");

  it("references the committed figure via embed", () => {
    expect(econ.embed).toBe("/figures/econ-theories-completeness.html");
  });

  it("supplies a figure title, note, and image alt", () => {
    expect(econ.figureTitle && econ.figureTitle.length).toBeTruthy();
    expect(econ.figureNote && econ.figureNote.length).toBeTruthy();
    expect(econ.imageAlt && econ.imageAlt.length).toBeTruthy();
  });

  it("keeps the figure copy free of level-dependence framing", () => {
    const copy = [econ.figureTitle, econ.figureNote, econ.imageAlt].join(" ").toLowerCase();
    expect(copy).not.toContain("representative agent");
    expect(copy).not.toContain("evaluation level");
    expect(copy).not.toContain("individual-level");
  });
});
