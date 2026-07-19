import { describe, expect, it } from "vitest";
import { resolveTeaching, teaching } from "./teaching";

describe("website teaching adapter", () => {
  it("preserves the approved complete teaching selection and presentation", () => {
    expect(teaching).toEqual({
      summary:
        "University lecturer and tutor in applied, behavioral, personnel, and organizational economics. Supervised 60+ bachelor's and master's theses along the way.",
      courses: [
        {
          title: "Seminar on Current Topics in Microeconomics",
          role: "Undergraduate lecturer",
          years: "2025–present"
        },
        {
          title: "Research Module on Applied Microeconomics and Management",
          role: "Graduate lecturer",
          years: "2022–2025"
        },
        {
          title: "Empirical Evaluation of Management Practices",
          role: "Graduate lecturer & tutor",
          years: "2019–2022"
        },
        {
          title: "Economics of Incentives in Organisations",
          role: "Graduate tutor",
          years: "2016, 2020–2022"
        },
        {
          title: "Behavioral Management Science",
          role: "Undergraduate lecturer & tutor",
          years: "2017–2020"
        },
        {
          title: "Strategic Human Resource Management",
          role: "Graduate tutor",
          years: "2016–2019"
        },
        {
          title: "Seminar on Human Resource Management",
          role: "Graduate lecturer",
          years: "2017–2018"
        }
      ]
    });
  });

  it("rejects an unknown selected record identifier", () => {
    expect(() => resolveTeaching([{ id: "unknown-course" }])).toThrow(
      /Unknown Professional record teaching course id: unknown-course/
    );
  });

  it("rejects duplicate selected record identifiers", () => {
    expect(() =>
      resolveTeaching([
        { id: "current-topics-microeconomics" },
        { id: "current-topics-microeconomics" }
      ])
    ).toThrow(
      /Duplicate website teaching selection id: current-topics-microeconomics/
    );
  });
});
