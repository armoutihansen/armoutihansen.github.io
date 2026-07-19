import { describe, expect, it } from "vitest";
import { profile, resolveProfileLinks } from "./profile";

describe("website identity adapter", () => {
  it("preserves the approved website identity and professional-link presentation", () => {
    expect({
      name: profile.name,
      email: profile.email,
      location: profile.location,
      title: profile.title,
      summary: profile.summary,
      tagline: profile.tagline,
      links: profile.links
    }).toEqual({
      name: "Jesper Armouti-Hansen",
      email: "jesper@armoutihansen.xyz",
      location: "Cologne, Germany",
      title: "Data Scientist · Economics PhD",
      summary:
        "Data scientist with an economics PhD and a decade of applied data work. I build statistical and machine-learning models on structured data, and assess when their output is reliable enough to act on.",
      tagline:
        "A decade in academic economics, now a data scientist at AXA — applying statistical and machine-learning methods and checking where their output is reliable enough to act on.",
      links: [
        {
          id: "linkedin",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/jesper-a-h/"
        },
        {
          id: "github",
          label: "GitHub",
          href: "https://github.com/armoutihansen"
        },
        {
          id: "google-scholar",
          label: "Google Scholar",
          href: "https://scholar.google.com/citations?user=j423pO8AAAAJ&hl=en&oi=ao"
        },
        {
          id: "orcid",
          label: "ORCID",
          href: "https://orcid.org/0000-0001-7776-8016"
        }
      ]
    });
  });

  it("rejects an unknown selected professional-link identifier", () => {
    expect(() =>
      resolveProfileLinks([{ id: "unknown-profile", label: "Unknown" }])
    ).toThrow(/Unknown Professional record link id: unknown-profile/);
  });
});
