import { describe, expect, it } from "vitest";
import { professionalRecord } from "./professional-record";
import {
  featuredPublications,
  journalPublications,
  otherWork,
  publicationPresentation,
  publications,
  resolveResearch,
  selectPublications
} from "./publications";

describe("resolved Research interface", () => {
  it("combines canonical facts with website-owned presentation without output drift", () => {
    expect(publications).toHaveLength(7);
    expect(publications[0]).toMatchObject({
      id: "efficiency-wages-motivated-agents",
      title: "Efficiency Wages with Motivated Agents",
      authors: "Jesper Armouti-Hansen, Lea Cassar, Anna Dereky, and Florian Engl",
      venue: "Games and Economic Behavior",
      year: "2024",
      details: "145, pp. 66–83",
      href: "https://www.sciencedirect.com/science/article/pii/S0899825624000307",
      links: [
        {
          label: "Paper",
          href: "https://www.sciencedirect.com/science/article/pii/S0899825624000307"
        },
        {
          label: "Code",
          href: "https://github.com/armoutihansen/efficiency-wages"
        }
      ],
      type: "Publication",
      cover: "/images/journals/games-economic-behavior.gif"
    });
  });

  it("preserves ADR-0007 first-page covers paired with manuscript links", () => {
    for (const publication of otherWork()) {
      expect(publication.cover).toMatch(/^\/images\/publications\//);
      expect(publication.links).toContainEqual(
        expect.objectContaining({ label: "Manuscript", href: expect.stringMatching(/^\/papers\//) })
      );
      expect(publication.abstract.length).toBeGreaterThan(0);
    }
  });

  it("partitions all resolved entries and derives the journal count", () => {
    expect(journalPublications()).toHaveLength(4);
    expect(otherWork()).toHaveLength(3);
    expect(journalPublications().length + otherWork().length).toBe(publications.length);
  });

  it("rejects presentation entries that reference an unknown publication", () => {
    const broken = structuredClone(publicationPresentation);
    broken[0].id = "unknown-publication";
    expect(() => resolveResearch(professionalRecord, broken)).toThrow(
      /Unknown Research presentation publication id: unknown-publication/
    );
  });

  it("rejects missing presentation coverage and unknown factual-link selections", () => {
    expect(() =>
      resolveResearch(professionalRecord, publicationPresentation.slice(1))
    ).toThrow(/Missing Research presentation publication id: efficiency-wages-motivated-agents/);

    const brokenLink = structuredClone(publicationPresentation);
    brokenLink[0].links[0].id = "unknown-link";
    expect(() => resolveResearch(professionalRecord, brokenLink)).toThrow(
      /Unknown publication link id "unknown-link".*efficiency-wages-motivated-agents/
    );
  });
});

describe("stable publication selections", () => {
  it("resolves the local featured set in its declared order", () => {
    expect(featuredPublications(2).map((publication) => publication.id)).toEqual([
      "efficiency-wages-motivated-agents",
      "managing-anticipation-reference-dependent-choice"
    ]);
  });

  it("rejects unknown and duplicate publication selections", () => {
    expect(() => selectPublications(["unknown-publication"])).toThrow(
      /Unknown publication selection id: unknown-publication/
    );
    expect(() =>
      selectPublications([
        "efficiency-wages-motivated-agents",
        "efficiency-wages-motivated-agents"
      ])
    ).toThrow(/Duplicate publication selection id: efficiency-wages-motivated-agents/);
  });
});
