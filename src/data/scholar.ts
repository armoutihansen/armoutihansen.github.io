import scholarData from "./scholar.json";
import { profileLink } from "./profile";

// The Research page's one non-generated figure: the Google Scholar citation
// count. `scholar.json` is maintained BY HAND from the public Scholar profile
// (no scraping — it is against Scholar's terms), so the displayed number stays
// consistent with the profile a visitor clicks through to. Refresh = read the
// number off Scholar and edit `scholar.json`'s `citations` + `asOf`. See
// CONTEXT.md -> "Page topology" / data-provenance.

export interface Scholar {
  /** Total citations, all-time, as shown on the Google Scholar profile. */
  citations: number;
  /** The month the count was last read, "YYYY-MM". */
  asOf: string;
}

// Shape guard for scholar.json, checkable against any value so the failure modes
// can be unit-tested without corrupting the real data. Run at import below.
export function checkScholar(data: unknown): asserts data is Scholar {
  if (typeof data !== "object" || data === null) {
    throw new Error("scholar.json must be an object");
  }
  const { citations, asOf } = data as Record<string, unknown>;
  if (typeof citations !== "number" || !Number.isInteger(citations) || citations < 0) {
    throw new Error(`scholar.citations must be a non-negative integer; got ${String(citations)}`);
  }
  if (typeof asOf !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(asOf)) {
    throw new Error(`scholar.asOf must be "YYYY-MM"; got ${String(asOf)}`);
  }
}

checkScholar(scholarData);
export const scholar: Scholar = scholarData;

// The public Google Scholar profile, sourced from the single profile link list
// rather than re-typed here.
export const scholarUrl: string = profileLink("google-scholar").href;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// "2026-06" -> "June 2026" for the strip's provenance note.
export function asOfLabel(asOf: string = scholar.asOf): string {
  const [year, month] = asOf.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}
