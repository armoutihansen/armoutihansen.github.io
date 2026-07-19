import { describe, expect, it } from "vitest";
import { parseProfessionalRecord, professionalRecord } from "./professional-record";

const validRecord = {
  experience: [
    {
      id: "axa-data-scientist",
      role: "Data Scientist",
      organization: "AXA Konzern AG",
      location: "Cologne, Germany",
      dates: { start: "2026-04", end: null }
    }
  ]
};

describe("parseProfessionalRecord", () => {
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

  it("accepts a strict experience record with a structured partial-date span", () => {
    expect(parseProfessionalRecord(validRecord)).toEqual(validRecord);
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
