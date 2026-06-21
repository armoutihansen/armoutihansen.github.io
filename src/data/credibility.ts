import { journalPublications } from "./publications";
import { scholar } from "./scholar";

// A single labelled credibility figure, as rendered in a stat strip.
export interface Stat {
  figure: string;
  label: string;
}

// Canonical CV credibility facts — the single source for BOTH the home page's
// research-credibility block and the Research page's stat strip, so the two can
// never drift (see CONTEXT.md -> "Relationships"). Only figures with no other
// home live here: the peer-reviewed paper count is derived from the publications
// module, and the citation count comes from the hand-maintained scholar module.
export const credibility = {
  journalsRefereed: 5,
  thesesSupervised: "60+",
  education: "PhD",
  educationDetail: "economics, summa cum laude"
} as const;

// The home page's research-credibility block: papers, doctorate, refereeing,
// supervision — no citation count (that figure leads the Research page instead).
export function homeCredibility(): Stat[] {
  return [
    { figure: String(journalPublications().length), label: "peer-reviewed papers" },
    { figure: credibility.education, label: credibility.educationDetail },
    { figure: String(credibility.journalsRefereed), label: "journals refereed for" },
    { figure: credibility.thesesSupervised, label: "theses supervised" }
  ];
}

// The Research page strip: the same CV figures plus the Scholar citation count,
// reordered to lead with output (papers, citations) before standing (refereeing,
// supervision, doctorate). DELIBERATELY no h-index / i10-index — both are
// single-digit and would undercut rather than add (see CONTEXT.md).
export function researchStats(): Stat[] {
  return [
    { figure: String(journalPublications().length), label: "peer-reviewed papers" },
    { figure: String(scholar.citations), label: "citations" },
    { figure: String(credibility.journalsRefereed), label: "journals refereed" },
    { figure: credibility.thesesSupervised, label: "theses supervised" },
    { figure: credibility.education, label: credibility.educationDetail }
  ];
}
