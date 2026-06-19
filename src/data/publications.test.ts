import { describe, it, expect } from "vitest";
import { profile } from "./profile";
import {
  publications,
  journalPublications,
  otherWork,
  featuredPublications,
  resolveLinks,
  checkInvariants,
  type Publication
} from "./publications";

// A minimal well-formed entry to mutate per failure-mode test, so we exercise
// checkInvariants against supplied arrays without corrupting the real data.
function validPub(overrides: Partial<Publication> = {}): Publication {
  return {
    title: "A Paper",
    authors: `${profile.name} and Someone Else`,
    venue: "Some Journal",
    year: "2024",
    details: "",
    href: "https://example.com/paper",
    type: "Publication",
    abstract: "An abstract.",
    ...overrides
  };
}

describe("journalPublications / otherWork partition", () => {
  it("together cover every publication with no omission", () => {
    const combined = journalPublications().length + otherWork().length;
    expect(combined).toBe(publications.length);
  });

  it("do not overlap (titles are disjoint)", () => {
    const journalTitles = new Set(journalPublications().map((p) => p.title));
    const otherTitles = otherWork().map((p) => p.title);
    const overlap = otherTitles.filter((t) => journalTitles.has(t));
    expect(overlap).toEqual([]);
  });

  it("journalPublications are exactly the type === 'Publication' entries, in order", () => {
    const expected = publications.filter((p) => p.type === "Publication").map((p) => p.title);
    expect(journalPublications().map((p) => p.title)).toEqual(expected);
  });

  it("otherWork is exactly the complement, in order", () => {
    const expected = publications.filter((p) => p.type !== "Publication").map((p) => p.title);
    expect(otherWork().map((p) => p.title)).toEqual(expected);
  });
});

describe("featuredPublications", () => {
  it("returns the first n journal publications in order", () => {
    const journals = journalPublications().map((p) => p.title);
    expect(featuredPublications(2).map((p) => p.title)).toEqual(journals.slice(0, 2));
    expect(featuredPublications(3).map((p) => p.title)).toEqual(journals.slice(0, 3));
  });

  it("respects n, never exceeding the available journal publications", () => {
    expect(featuredPublications(0)).toHaveLength(0);
    expect(featuredPublications(1)).toHaveLength(1);
    const all = journalPublications().length;
    expect(featuredPublications(all + 5)).toHaveLength(all);
  });

  it("draws only from journal publications", () => {
    for (const pub of featuredPublications(10)) {
      expect(pub.type).toBe("Publication");
    }
  });
});

describe("link normalisation", () => {
  it("passes through an explicit links array unchanged", () => {
    const links = [
      { label: "Paper", href: "https://example.com/p" },
      { label: "Code", href: "https://example.com/c" }
    ];
    expect(resolveLinks(validPub({ links }))).toEqual(links);
  });

  it("synthesises a single 'Link' entry from a bare href", () => {
    const pub = validPub({ links: undefined, href: "https://example.com/only" });
    expect(resolveLinks(pub)).toEqual([{ label: "Link", href: "https://example.com/only" }]);
  });

  it("resolves to an empty array when there is neither links nor href", () => {
    expect(resolveLinks(validPub({ links: undefined, href: "" }))).toEqual([]);
  });

  it("gives every rendered journal/other entry a guaranteed non-empty links array", () => {
    for (const pub of [...journalPublications(), ...otherWork()]) {
      if (pub.type === "Publication") {
        expect(pub.links.length).toBeGreaterThan(0);
      }
      // `links` is always present on the resolved shape (possibly empty for
      // link-less working papers / research projects).
      expect(Array.isArray(pub.links)).toBe(true);
    }
  });
});

describe("checkInvariants", () => {
  it("passes on the real data", () => {
    expect(() => checkInvariants(publications, profile.name)).not.toThrow();
  });

  it("throws on an unknown type", () => {
    const bad = [validPub({ type: "Preprint" as Publication["type"] })];
    expect(() => checkInvariants(bad, profile.name)).toThrow(/Unknown publication types/);
  });

  it("throws when an author string is missing the owner name", () => {
    const bad = [validPub({ authors: "Someone Else and Another Person" })];
    expect(() => checkInvariants(bad, profile.name)).toThrow(/missing owner name/);
  });

  it("throws when a journal publication resolves to zero links", () => {
    const bad = [validPub({ links: undefined, href: "" })];
    expect(() => checkInvariants(bad, profile.name)).toThrow(/zero links/);
  });

  it("allows a non-journal entry with zero links", () => {
    const ok = [validPub({ type: "Research project", links: undefined, href: "" })];
    expect(() => checkInvariants(ok, profile.name)).not.toThrow();
  });
});
