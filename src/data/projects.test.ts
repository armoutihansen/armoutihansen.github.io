import { describe, it, expect } from "vitest";
import { selectedWork, featuredProjects } from "./projects";

const APPLIED = "Applied analysis & modeling";
const RESEARCH = "Research & replication";
const GITHUB = "Also on GitHub";

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
