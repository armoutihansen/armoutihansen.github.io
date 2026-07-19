import { describe, expect, it } from "vitest";
import { education, resolveEducation } from "./education";

describe("website education adapter", () => {
  it("preserves the approved four-entry education selection and presentation", () => {
    expect(education).toEqual([
      {
        degree: "PhD in Economics (Dr. rer. pol.)",
        institution: "University of Cologne",
        period: "2015 – 2021",
        location: "Cologne, Germany",
        detail: "Summa cum laude. Focus on microeconomics, statistics, and econometrics.",
        logo: "/images/logos/university-of-cologne-wordmark.jpg"
      },
      {
        degree: "MSc International Economics and Public Policy",
        institution: "University of Mainz",
        period: "2012 – 2014",
        location: "Mainz, Germany",
        detail: "GPA 1.6.",
        logo: "/images/logos/university-of-mainz.svg"
      },
      {
        degree: "BA Financial Management and Services",
        institution: "Copenhagen Business Academy",
        period: "2008 – 2012",
        location: "Copenhagen, Denmark",
        detail: "",
        logo: "/images/logos/copenhagen-business-academy.png"
      },
      {
        degree: "Exchange semester",
        institution: "European University of Cyprus",
        period: "2010",
        location: "Nicosia, Cyprus",
        detail: "",
        logo: "/images/logos/european-university-of-cyprus.png"
      }
    ]);
  });

  it("rejects an unknown selected record identifier", () => {
    expect(() => resolveEducation([{ id: "unknown-education" }])).toThrow(
      /Unknown Professional record education id: unknown-education/
    );
  });
});
