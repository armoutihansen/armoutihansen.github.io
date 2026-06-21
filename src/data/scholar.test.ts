import { describe, it, expect } from "vitest";
import scholarData from "./scholar.json";
import { checkScholar, scholar, asOfLabel } from "./scholar";

describe("checkScholar", () => {
  it("passes on the real scholar.json", () => {
    expect(() => checkScholar(scholarData)).not.toThrow();
  });

  it("rejects a non-object", () => {
    expect(() => checkScholar(null)).toThrow(/must be an object/);
    expect(() => checkScholar(42)).toThrow(/must be an object/);
  });

  it("rejects a non-integer or negative citation count", () => {
    expect(() => checkScholar({ citations: 1.5, asOf: "2026-06" })).toThrow(/non-negative integer/);
    expect(() => checkScholar({ citations: -1, asOf: "2026-06" })).toThrow(/non-negative integer/);
    expect(() => checkScholar({ citations: "80", asOf: "2026-06" })).toThrow(/non-negative integer/);
  });

  it("rejects a malformed asOf", () => {
    expect(() => checkScholar({ citations: 80, asOf: "2026" })).toThrow(/YYYY-MM/);
    expect(() => checkScholar({ citations: 80, asOf: "2026-13" })).toThrow(/YYYY-MM/);
    expect(() => checkScholar({ citations: 80, asOf: "June 2026" })).toThrow(/YYYY-MM/);
  });
});

describe("asOfLabel", () => {
  it("formats YYYY-MM as 'Month YYYY'", () => {
    expect(asOfLabel("2026-06")).toBe("June 2026");
    expect(asOfLabel("2024-01")).toBe("January 2024");
  });

  it("defaults to the real scholar asOf", () => {
    expect(asOfLabel()).toBe(asOfLabel(scholar.asOf));
  });
});
