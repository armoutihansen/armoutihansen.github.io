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
  ],
  teaching: {
    supervision: {
      minimumTheses: 1,
      degreeLevels: ["bachelor" as const]
    },
    courses: [
      {
        id: "example-course",
        title: "Example Course",
        level: "graduate" as const,
        roles: ["lecturer" as const],
        dateSpans: [{ start: "2020", end: "2021" }]
      }
    ]
  },
  skills: {
    categories: [{ id: "programming-language", name: "Programming language" }],
    items: [{ id: "python", name: "Python", categoryId: "programming-language" }]
  },
  spokenLanguages: [{ id: "english", name: "English", proficiency: "C2" }],
  people: [
    { id: "ada-example", fullName: "Ada Example" },
    { id: "grace-example", fullName: "Grace Example" }
  ],
  publications: [
    {
      id: "example-paper",
      title: "An Example Paper",
      authorIds: ["ada-example", "grace-example"],
      venue: "Example Journal",
      year: "2024",
      details: "12(3), pp. 1–10",
      type: "journal-publication" as const,
      links: [{ id: "paper", url: "https://example.test/paper" }]
    }
  ],
  selectedWork: [
    {
      id: "example-project",
      title: "Example Project",
      category: "Model evaluation",
      status: "Complete",
      tools: [
        { id: "python", name: "Python" },
        { id: "pytest", name: "pytest" }
      ],
      href: "https://example.test/project"
    }
  ]
};

describe("parseProfessionalRecord", () => {
  it("parses strict selected-work facts", () => {
    expect(parseProfessionalRecord(validRecord).selectedWork).toEqual(
      validRecord.selectedWork
    );
  });

  it("contains every complete website project, including CV omissions", () => {
    expect(professionalRecord.selectedWork).toHaveLength(12);
    expect(professionalRecord.selectedWork.map((project) => project.id)).toContain(
      "minimal-coding-agent"
    );
    expect(professionalRecord.selectedWork.map((project) => project.id)).toContain(
      "maze-solver"
    );
  });

  it("rejects duplicate, missing, and unknown selected-work facts", () => {
    const duplicate = structuredClone(validRecord);
    duplicate.selectedWork.push(structuredClone(duplicate.selectedWork[0]));
    expect(() => parseProfessionalRecord(duplicate)).toThrow(/Duplicate selected work id/);

    const duplicateTool = structuredClone(validRecord);
    duplicateTool.selectedWork[0].tools.push(
      structuredClone(duplicateTool.selectedWork[0].tools[0])
    );
    expect(() => parseProfessionalRecord(duplicateTool)).toThrow(
      /Duplicate selected work tool id/
    );

    const missing = structuredClone(validRecord) as {
      selectedWork: Array<Record<string, unknown>>;
    };
    delete missing.selectedWork[0].status;
    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*selectedWork\[0\]\.status/s
    );

    const unknown = structuredClone(validRecord) as {
      selectedWork: Array<Record<string, unknown>>;
    };
    unknown.selectedWork[0].summary = "Presentation prose does not belong here";
    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*selectedWork\[0\]/s
    );
  });

  it("rejects a broken selected-work publication-link reference", () => {
    const broken = structuredClone(validRecord) as {
      selectedWork: Array<{ href: unknown }>;
    };
    broken.selectedWork[0].href = {
      publicationId: "unknown-publication",
      linkId: "code"
    };
    expect(() => parseProfessionalRecord(broken)).toThrow(
      /Unknown selected work publication id: unknown-publication/
    );
  });

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

  it("parses the complete seven-entry teaching record and supervision facts", () => {
    expect(professionalRecord.teaching).toEqual({
      supervision: {
        minimumTheses: 60,
        degreeLevels: ["bachelor", "master"]
      },
      courses: [
        {
          id: "current-topics-microeconomics",
          title: "Seminar on Current Topics in Microeconomics",
          level: "undergraduate",
          roles: ["lecturer"],
          dateSpans: [{ start: "2025", end: null }]
        },
        {
          id: "applied-microeconomics-management-research-module",
          title: "Research Module on Applied Microeconomics and Management",
          level: "graduate",
          roles: ["lecturer"],
          dateSpans: [{ start: "2022", end: "2025" }]
        },
        {
          id: "empirical-evaluation-management-practices",
          title: "Empirical Evaluation of Management Practices",
          level: "graduate",
          roles: ["lecturer", "tutor"],
          dateSpans: [{ start: "2019", end: "2022" }]
        },
        {
          id: "economics-incentives-organisations",
          title: "Economics of Incentives in Organisations",
          level: "graduate",
          roles: ["tutor"],
          dateSpans: [
            { start: "2016", end: "2016" },
            { start: "2020", end: "2022" }
          ]
        },
        {
          id: "behavioral-management-science",
          title: "Behavioral Management Science",
          level: "undergraduate",
          roles: ["lecturer", "tutor"],
          dateSpans: [{ start: "2017", end: "2020" }]
        },
        {
          id: "strategic-human-resource-management",
          title: "Strategic Human Resource Management",
          level: "graduate",
          roles: ["tutor"],
          dateSpans: [{ start: "2016", end: "2019" }]
        },
        {
          id: "human-resource-management-seminar",
          title: "Seminar on Human Resource Management",
          level: "graduate",
          roles: ["lecturer"],
          dateSpans: [{ start: "2017", end: "2018" }]
        }
      ]
    });
  });

  it("captures the complete skill union and known spoken-language proficiency", () => {
    expect(professionalRecord.skills.items).toHaveLength(31);
    expect(professionalRecord.skills.items).toContainEqual({
      id: "pixi",
      name: "pixi",
      categoryId: "tool"
    });
    expect(professionalRecord.spokenLanguages).toEqual([
      { id: "english", name: "English", proficiency: "C2" },
      { id: "german", name: "German", proficiency: "C1/C2" },
      { id: "danish", name: "Danish", proficiency: "native" }
    ]);
  });

  it("parses canonical people and structured publication facts", () => {
    expect(professionalRecord.people).toContainEqual({
      id: "jesper-armouti-hansen",
      fullName: "Jesper Armouti-Hansen"
    });
    expect(professionalRecord.publications).toHaveLength(7);
    expect(professionalRecord.publications[0]).toEqual({
      id: "efficiency-wages-motivated-agents",
      title: "Efficiency Wages with Motivated Agents",
      authorIds: [
        "jesper-armouti-hansen",
        "lea-cassar",
        "anna-dereky",
        "florian-engl"
      ],
      venue: "Games and Economic Behavior",
      year: "2024",
      details: "145, pp. 66–83",
      type: "journal-publication",
      links: [
        {
          id: "paper",
          url: "https://www.sciencedirect.com/science/article/pii/S0899825624000307"
        },
        {
          id: "code",
          url: "https://github.com/armoutihansen/efficiency-wages"
        }
      ]
    });
  });

  it("rejects broken publication person references and duplicate identifiers", () => {
    const brokenPerson = structuredClone(validRecord);
    brokenPerson.publications[0].authorIds[1] = "unknown-person";
    expect(() => parseProfessionalRecord(brokenPerson)).toThrow(
      /Unknown publication author id: unknown-person.*publications\[0\]\.authorIds\[1\]/s
    );

    const duplicatePerson = structuredClone(validRecord);
    duplicatePerson.people.push(structuredClone(duplicatePerson.people[0]));
    expect(() => parseProfessionalRecord(duplicatePerson)).toThrow(/Duplicate person id/);

    const duplicatePublication = structuredClone(validRecord);
    duplicatePublication.publications.push(
      structuredClone(duplicatePublication.publications[0])
    );
    expect(() => parseProfessionalRecord(duplicatePublication)).toThrow(
      /Duplicate publication id/
    );
  });

  it("rejects missing and unknown publication facts", () => {
    const missing = structuredClone(validRecord) as {
      publications: Array<Record<string, unknown>>;
    };
    delete missing.publications[0].venue;
    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*publications\[0\]\.venue/s
    );

    const unknown = structuredClone(validRecord) as {
      publications: Array<Record<string, unknown>>;
    };
    unknown.publications[0].authors = "Ada Example and Grace Example";
    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*publications\[0\]/s
    );
  });

  it("rejects duplicate structured authors and factual links", () => {
    const duplicateAuthor = structuredClone(validRecord);
    duplicateAuthor.publications[0].authorIds[1] = "ada-example";
    expect(() => parseProfessionalRecord(duplicateAuthor)).toThrow(
      /Duplicate publication author id: ada-example/
    );

    const duplicateLink = structuredClone(validRecord);
    duplicateLink.publications[0].links.push(
      structuredClone(duplicateLink.publications[0].links[0])
    );
    expect(() => parseProfessionalRecord(duplicateLink)).toThrow(
      /Duplicate publication link id: paper/
    );
  });

  it("rejects malformed publication links", () => {
    const invalid = structuredClone(validRecord);
    invalid.publications[0].links[0].url = "example.test/paper";
    expect(() => parseProfessionalRecord(invalid)).toThrow(
      /publications\[0\]\.links\[0\]\.url/s
    );
  });

  it("rejects a skill that references an unknown category", () => {
    const invalid = structuredClone(validRecord);
    invalid.skills.items[0].categoryId = "unknown-category";

    expect(() => parseProfessionalRecord(invalid)).toThrow(
      /Unknown skill category id: unknown-category.*skills\.items\[0\]\.categoryId/s
    );
  });

  it("rejects duplicate skill, category, and spoken-language identifiers", () => {
    const duplicateSkill = structuredClone(validRecord);
    duplicateSkill.skills.items.push(structuredClone(duplicateSkill.skills.items[0]));
    expect(() => parseProfessionalRecord(duplicateSkill)).toThrow(
      /Duplicate skill id.*skills\.items\[1\]\.id/s
    );

    const duplicateCategory = structuredClone(validRecord);
    duplicateCategory.skills.categories.push(
      structuredClone(duplicateCategory.skills.categories[0])
    );
    expect(() => parseProfessionalRecord(duplicateCategory)).toThrow(
      /Duplicate skill category id.*skills\.categories\[1\]\.id/s
    );

    const duplicateLanguage = structuredClone(validRecord);
    duplicateLanguage.spokenLanguages.push(
      structuredClone(duplicateLanguage.spokenLanguages[0])
    );
    expect(() => parseProfessionalRecord(duplicateLanguage)).toThrow(
      /Duplicate spoken language id.*spokenLanguages\[1\]\.id/s
    );
  });

  it("rejects missing and unknown skill or language facts", () => {
    const missing = structuredClone(validRecord) as {
      skills: { items: Array<Record<string, unknown>> };
    };
    delete missing.skills.items[0].name;
    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*skills\.items\[0\]\.name/s
    );

    const unknown = structuredClone(validRecord) as {
      spokenLanguages: Array<Record<string, unknown>>;
    };
    unknown.spokenLanguages[0].display = "English (C2)";
    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*spokenLanguages\[0\]/s
    );
  });

  it("rejects overlapping teaching date spans at the later span path", () => {
    const overlapping = structuredClone(validRecord);
    overlapping.teaching.courses[0].dateSpans = [
      { start: "2018", end: "2020" },
      { start: "2020", end: "2022" }
    ];

    expect(() => parseProfessionalRecord(overlapping)).toThrow(
      /overlaps an earlier teaching date span.*teaching\.courses\[0\]\.dateSpans\[1\]/s
    );
  });

  it("rejects a teaching date span that ends before it starts", () => {
    const reversed = structuredClone(validRecord);
    reversed.teaching.courses[0].dateSpans = [{ start: "2022", end: "2021" }];

    expect(() => parseProfessionalRecord(reversed)).toThrow(
      /must not end before it starts.*teaching\.courses\[0\]\.dateSpans\[0\]\.end/s
    );
  });

  it.each(["2021-00", "2021-13", "Spring 2021", "2021-06-01"])(
    "rejects malformed teaching partial date %s with its record path",
    (start) => {
      const invalid = structuredClone(validRecord);
      invalid.teaching.courses[0].dateSpans[0].start = start;

      expect(() => parseProfessionalRecord(invalid)).toThrow(
        /YYYY or YYYY-MM.*teaching\.courses\[0\]\.dateSpans\[0\]\.start/s
      );
    }
  );

  it("rejects a teaching course without a date span", () => {
    const missing = structuredClone(validRecord);
    missing.teaching.courses[0].dateSpans = [];

    expect(() => parseProfessionalRecord(missing)).toThrow(
      /Too small.*teaching\.courses\[0\]\.dateSpans/s
    );
  });

  it("rejects duplicate teaching course identifiers at the duplicate path", () => {
    const duplicate = structuredClone(validRecord);
    duplicate.teaching.courses.push(structuredClone(duplicate.teaching.courses[0]));

    expect(() => parseProfessionalRecord(duplicate)).toThrow(
      /Duplicate teaching course id.*teaching\.courses\[1\]\.id/s
    );
  });

  it("rejects missing required teaching facts with their path", () => {
    const missing = structuredClone(validRecord) as {
      teaching: { courses: Array<Record<string, unknown>> };
    };
    delete missing.teaching.courses[0].title;

    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected string.*teaching\.courses\[0\]\.title/s
    );
  });

  it("rejects unknown teaching fields with their path", () => {
    const unknown = structuredClone(validRecord) as {
      teaching: { courses: Array<Record<string, unknown>> };
    };
    unknown.teaching.courses[0].years = "2020–2021";

    expect(() => parseProfessionalRecord(unknown)).toThrow(
      /Unrecognized key.*teaching\.courses\[0\]/s
    );
  });

  it("rejects missing supervision facts with their path", () => {
    const missing = structuredClone(validRecord) as {
      teaching: { supervision: Record<string, unknown> };
    };
    delete missing.teaching.supervision.minimumTheses;

    expect(() => parseProfessionalRecord(missing)).toThrow(
      /expected number.*teaching\.supervision\.minimumTheses/s
    );
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
