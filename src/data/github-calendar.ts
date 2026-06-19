// Pure helpers for truncating the GitHub contribution calendar.
//
// The calendar arrives from the data layer as week columns (each a 7-element,
// Sunday-first array, with `null` padding outside the tracked range) plus a
// list of month labels whose `col` is an index into those week columns. The
// desktop strip shows only the trailing months; mobile keeps the full year.
// Truncation lives here as a pure function so both the component and a vitest
// test share one source of truth — see github-calendar.test.ts.

export type Week = (number | null)[];

export interface MonthLabel {
  label: string;
  col: number;
}

export interface Contributions {
  weeks: Week[];
  months: MonthLabel[];
  [extra: string]: unknown;
}

export interface TruncatedCalendar {
  weeks: Week[];
  months: MonthLabel[];
}

/**
 * Return the trailing `n` months of the calendar.
 *
 * The boundary is the first week column of the (n-th-from-last) month label:
 * weeks from that column onward are kept, and each retained month label's `col`
 * is rebased to be relative to the truncated week range so labels still sit
 * above the right columns. The input is never mutated (the full set is still
 * used for the mobile calendar).
 *
 * If the calendar has `n` or fewer month labels the whole calendar is returned
 * (deep-copied so callers can't reach back into the source).
 */
export function lastMonths(contributions: Contributions, n: number): TruncatedCalendar {
  const { weeks, months } = contributions;

  if (n >= months.length) {
    return {
      weeks: weeks.map((week) => [...week]),
      months: months.map((m) => ({ label: m.label, col: m.col })),
    };
  }

  const kept = months.slice(months.length - n);
  const startCol = kept[0].col;

  return {
    weeks: weeks.slice(startCol).map((week) => [...week]),
    months: kept.map((m) => ({ label: m.label, col: m.col - startCol })),
  };
}
