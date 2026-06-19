import { describe, it, expect } from "vitest";
import { lastMonths, type Contributions } from "./github-calendar";
import gh from "./github.json";

const real = gh.contributions as Contributions;

// A small synthetic calendar: 12 week columns, one month label every 4 weeks.
// Cell values encode their column so we can assert which weeks survived.
function fixture(): Contributions {
  const weeks = Array.from({ length: 12 }, (_, col) =>
    Array.from({ length: 7 }, () => col),
  );
  return {
    weeks,
    months: [
      { label: "Jan", col: 0 },
      { label: "Feb", col: 4 },
      { label: "Mar", col: 8 },
    ],
  };
}

describe("lastMonths", () => {
  it("keeps the trailing weeks from the n-th-from-last month's column", () => {
    // Trailing 2 months of the fixture: Feb (col 4) is the boundary, so weeks
    // 4..11 (8 columns) survive and start at the cell encoding column 4.
    const { weeks } = lastMonths(fixture(), 2);
    expect(weeks).toHaveLength(8);
    expect(weeks[0][0]).toBe(4);
    expect(weeks.at(-1)?.[0]).toBe(11);
  });

  it("rebases retained month-label columns to the truncated range", () => {
    const { months } = lastMonths(fixture(), 2);
    expect(months).toEqual([
      { label: "Feb", col: 0 },
      { label: "Mar", col: 4 },
    ]);
  });

  it("does not mutate the input contributions", () => {
    const input = fixture();
    const snapshot = structuredClone(input);
    const out = lastMonths(input, 2);
    // Returned arrays are copies, so editing them leaves the source intact.
    out.weeks[0][0] = -999;
    out.months[0].col = -999;
    expect(input).toEqual(snapshot);
  });

  it("returns the whole (copied) calendar when n exceeds the month count", () => {
    const input = fixture();
    const out = lastMonths(input, 99);
    expect(out.weeks).toHaveLength(input.weeks.length);
    expect(out.months).toEqual(input.months);
    expect(out.weeks).not.toBe(input.weeks);
  });

  it("trims the real 12-month calendar to its trailing 9 months", () => {
    const full = real.months.length; // 13 labels (spills into a 13th partial month)
    const out = lastMonths(real, 9);
    const startCol = real.months[full - 9].col;

    expect(out.months).toHaveLength(9);
    expect(out.weeks).toHaveLength(real.weeks.length - startCol);
    // First retained label is rebased to column 0.
    expect(out.months[0].col).toBe(0);
    expect(out.months[0].label).toBe(real.months[full - 9].label);
    // Spacing between labels is preserved after rebasing.
    expect(out.months.at(-1)?.col).toBe(real.months.at(-1)!.col - startCol);
  });
});
