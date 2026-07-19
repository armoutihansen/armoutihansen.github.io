import { describe, expect, it } from "vitest";
import { parseProfessionalRecord, professionalRecord } from "./professional-record";

const validRecord = {
  identity: {
    name: "Ada Example",
    email: "ada@example.test",
    location: "Example City",
    phone: "+1 555 0100",
    links: [
      { id: "portfolio", url: "https://example.test" },
      { id: "code-profile", url: "https://code.example.test/ada" }
    ]
  },
  experience: [
    {
      id: "axa-data-scientist",
      role: "Data Scientist",
      organization: "AXA Konzern AG",
      location: "Cologne, Germany",
      dates: { start: "2026-04", end: null }
    }
  ],
  education: [
    {
      id: "cologne-economics-phd",
      degree: "PhD in Economics (Dr. rer. pol.)",
      institution: "University of Cologne",
      location: "Cologne, Germany",
      distinctions: ["Summa cum laude"],
      dates: { start: "2015", end: "2021" }
    }
  ]
};

describe("parseProfessionalRecord", () => {
  it("parses the approved core identity and contact facts from the canonical record", () => {
    expect(professionalRecord.identity).toEqual({
      name: "Jesper Armouti-Hansen",
      email: "jesper@armoutihansen.xyz",
      location: "Cologne, Germany",
      phone: "+49 176 4278 7630",
      links: [
        { id: "website", url: "https://armoutihansen.xyz" },
        { id: "linkedin", url: "https://www.linkedin.com/in/jesper-a-h/" },
        { id: "github", url: "https://github.com/armoutihansen" },
        {
          id: "google-scholar",
          url: "https://scholar.google.com/citations?user=j423pO8AAAAJ&hl=en&oi=ao"
        },
        { id: "orcid", url: "https://orcid.org/0000-0001-7776-8016" }
      ]
    });
  });

  it("parses the four current experience facts from the canonical record", () => {
    expect(professionalRecord.experience).toEqual([
      {
        id: "axa-data-scientist",
        role: "Data Scientist",
        organization: "AXA Konzern AG",
        location: "Cologne, Germany",
        dates: { start: "2026-04", end: null }
      },
      {
        id: "bonn-postdoctoral-researcher",
        role: "Postdoctoral Researcher in Economics",
        organization: "University of Bonn",
        location: "Bonn, Germany",
        dates: { start: "2022-01", end: "2026-03" }
      },
      {
        id: "cologne-research-assistant",
        role: "Research Assistant in Economics",
        organization: "University of Cologne",
        location: "Cologne, Germany",
        dates: { start: "2015-12", end: "2021-12" }
      },
      {
        id: "airplus-intern",
        role: "Intern",
        organization: "AirPlus International",
        location: "Neu Isenburg, Germany",
        dates: { start: "2014-12", end: "2015-05" }
      }
    ]);
  });

  it("parses the complete four-entry education record including the exchange semester", () => {
    expect(professionalRecord.education).toEqual([
      {
        id: "cologne-economics-phd",
        degree: "PhD in Economics (Dr. rer. pol.)",
        institution: "University of Cologne",
        location: "Cologne, Germany",
        distinctions: ["Summa cum laude"],
        dates: { start: "2015", end: "2021" }
      },
      {
        id: "mainz-international-economics-msc",
        degree: "MSc International Economics and Public Policy",
        institution: "University of Mainz",
        location: "Mainz, Germany",
        distinctions: ["GPA 1.6"],
        dates: { start: "2012", end: "2014" }
      },
      {
        id: "copenhagen-financial-management-ba",
        degree: "BA Financial Management and Services",
        institution: "Copenhagen Business Academy",
        location: "Copenhagen, Denmark",
        distinctions: [],
        dates: { start: "2008", end: "2012" }
      },
      {
        id: "cyprus-exchange-semester",
        degree: "Exchange semester",
        institution: "European University of Cyprus",
        location: "Nicosia, Cyprus",
        distinctions: [],
        dates: { start: "2010", end: "2010" }
      }
    ]);
  });

  it.each(["2021-00", "2021-13", "Summer 2021", "2021-06-01"])(
    "rejects malformed education partial date %s with its record path",
    (end) => {
      const invalid = structuredClone(validRecord);
      invalid.education[0].dates.end = end;

      expect(() => parseProfessionalRecord(invalid)).toThrow(
        /YYYY or YYYY-MM.*education\[0\]\.dates\.end/s
      );
    }
  );

  it("rejects duplicate education identifiers at the duplicate path", () => {
    const duplicate = structuredClone(validRecord);
    duplicate.education.push(structuredClone(duplicate.education[0]));

    expect(() => parseProfessionalRecord(duplicate)).toThrow(
      /Duplicate education id.*education\[1\]\.id/s
    );
  });

  it("rejects missing required education facts with their path", () => {
    const missing = structuredClone(validRecord) as {
      education: Array<Record<string, unknown>>;
    };
    delete missing.education[0].institution;

    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*education\[0\]\.institution/s
    );
  });

  it("rejects unknown education fields with their path", () => {
    const unknown = structuredClone(validRecord) as {
      education: Array<Record<string, unknown>>;
    };
    unknown.education[0].logo = "/images/logos/university.svg";

    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*education\[0\]/s
    );
  });

  it("accepts a strict experience record with a structured partial-date span", () => {
    expect(parseProfessionalRecord(validRecord)).toEqual(validRecord);
  });

  it("rejects malformed professional-link URLs with their record path", () => {
    const invalid = structuredClone(validRecord);
    invalid.identity.links[0].url = "armoutihansen.xyz";

    expect(() => parseProfessionalRecord(invalid)).toThrow(
      /valid URL.*identity\.links\[0\]\.url/s
    );
  });

  it("rejects duplicate professional-link identifiers at the duplicate path", () => {
    const duplicate = structuredClone(validRecord);
    duplicate.identity.links.push({
      id: "portfolio",
      url: "https://example.com/duplicate"
    });

    expect(() => parseProfessionalRecord(duplicate)).toThrow(
      /Duplicate professional link id.*identity\.links\[2\]\.id/s
    );
  });

  it("rejects missing required identity facts with their path", () => {
    const missing = structuredClone(validRecord) as {
      identity: Record<string, unknown>;
      experience: typeof validRecord.experience;
    };
    delete missing.identity.phone;

    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*identity\.phone/s
    );
  });

  it("rejects unknown identity fields with their path", () => {
    const unknown = structuredClone(validRecord) as {
      identity: Record<string, unknown>;
      experience: typeof validRecord.experience;
    };
    unknown.identity.headline = "Data Scientist";

    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*identity/s
    );
  });

  it.each(["2026-00", "2026-13", "April 2026", "2026-04-01"])(
    "rejects malformed partial date %s with its record path",
    (start) => {
      const invalid = structuredClone(validRecord);
      invalid.experience[0].dates.start = start;

      expect(() => parseProfessionalRecord(invalid)).toThrow(
        /YYYY or YYYY-MM.*experience\[0\]\.dates\.start/s
      );
    }
  );

  it("rejects duplicate experience identifiers at the duplicate path", () => {
    const duplicate = structuredClone(validRecord);
    duplicate.experience.push(structuredClone(duplicate.experience[0]));

    expect(() => parseProfessionalRecord(duplicate)).toThrow(
      /Duplicate experience id.*experience\[1\]\.id/s
    );
  });

  it("rejects missing required experience facts with their path", () => {
    const missing = structuredClone(validRecord) as {
      experience: Array<Record<string, unknown>>;
    };
    delete missing.experience[0].organization;

    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*experience\[0\]\.organization/s
    );
  });

  it("rejects unknown fields with their path", () => {
    const unknown = structuredClone(validRecord) as {
      experience: Array<Record<string, unknown>>;
    };
    unknown.experience[0].logo = "/images/logos/axa.svg";

    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*experience\[0\]/s
    );
  });

  it("requires stable human-readable identifiers", () => {
    const invalid = structuredClone(validRecord);
    invalid.experience[0].id = "AXA role 1";

    expect(() => parseProfessionalRecord(invalid)).toThrow(
      /lowercase kebab-case.*experience\[0\]\.id/s
    );
  });
});
