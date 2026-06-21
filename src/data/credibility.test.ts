import { describe, it, expect } from "vitest";
import { journalPublications } from "./publications";
import { scholar } from "./scholar";
import { credibility, homeCredibility, researchStats } from "./credibility";

describe("homeCredibility", () => {
  const stats = homeCredibility();

  it("derives the paper count from the publications module (never drifts)", () => {
    const papers = stats.find((s) => s.label === "peer-reviewed papers");
    expect(papers?.figure).toBe(String(journalPublications().length));
  });

  it("sources its figures from the shared CV facts", () => {
    const refereed = stats.find((s) => s.label === "journals refereed for");
    const theses = stats.find((s) => s.label === "theses supervised");
    expect(refereed?.figure).toBe(String(credibility.journalsRefereed));
    expect(theses?.figure).toBe(credibility.thesesSupervised);
  });

  it("omits the citation count (that figure leads the Research page)", () => {
    expect(stats.find((s) => s.label === "citations")).toBeUndefined();
  });
});

describe("researchStats", () => {
  const stats = researchStats();

  it("derives the paper count from the publications module (never drifts)", () => {
    const papers = stats.find((s) => s.label === "peer-reviewed papers");
    expect(papers?.figure).toBe(String(journalPublications().length));
  });

  it("shows the Scholar citation count from scholar.json", () => {
    const citations = stats.find((s) => s.label === "citations");
    expect(citations?.figure).toBe(String(scholar.citations));
  });

  it("never exposes h-index or i10-index (deliberately excluded — see CONTEXT.md)", () => {
    const labels = stats.map((s) => s.label.toLowerCase()).join(" ");
    expect(labels).not.toMatch(/h-?index/);
    expect(labels).not.toMatch(/i10/);
  });

  it("every stat has a non-empty figure and label", () => {
    for (const s of stats) {
      expect(s.figure.length).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
    }
  });
});

describe("shared CV facts", () => {
  it("both strips draw the same refereeing and supervision figures", () => {
    const home = homeCredibility();
    const research = researchStats();
    const figFor = (stats: { figure: string; label: string }[], re: RegExp) =>
      stats.find((s) => re.test(s.label))?.figure;

    expect(figFor(home, /journals refereed/)).toBe(String(credibility.journalsRefereed));
    expect(figFor(research, /journals refereed/)).toBe(String(credibility.journalsRefereed));
    expect(figFor(home, /theses supervised/)).toBe(credibility.thesesSupervised);
    expect(figFor(research, /theses supervised/)).toBe(credibility.thesesSupervised);
  });
});
