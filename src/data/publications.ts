import { profile } from "./profile";

export type PublicationLink = { label: string; href: string };

export type PublicationType = "Publication" | "Working paper" | "Research project";

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  details: string;
  href: string;
  links?: PublicationLink[];
  type: PublicationType;
  abstract: string;
  cover?: string;
}

// A publication with its links normalised to a guaranteed non-empty array, so
// consumers (pages, PublicationItem) never re-derive the `links ?? href`
// fallback or repair a missing list at render time.
export interface ResolvedPublication extends Publication {
  links: PublicationLink[];
}

export const publications: Publication[] = [
  {
    title: "Efficiency Wages with Motivated Agents",
    authors: "Jesper Armouti-Hansen, Lea Cassar, Anna Dereky, and Florian Engl",
    venue: "Games and Economic Behavior",
    year: "2024",
    cover: "/images/journals/games-economic-behavior.gif",
    details: "145, pp. 66–83",
    href: "https://www.sciencedirect.com/science/article/pii/S0899825624000307",
    links: [
      { label: "Paper", href: "https://www.sciencedirect.com/science/article/pii/S0899825624000307" },
      { label: "Code", href: "https://github.com/armoutihansen/efficiency-wages" }
    ],
    type: "Publication",
    abstract:
      "Many jobs serve a social purpose beyond profit maximization, contributing positively to society. This paper uses a modified principal-agent gift-exchange game with positive externality (prosocial treatment) to study how workers' prosocial motivation interacts with the use of efficiency wages in stimulating effort. We find that prosocial motivation and efficiency wages are independent in stimulating effort: compared to a standard gift-exchange game (GE treatment), the presence of the externality shifts the agents' effort choice function upwards without affecting its slope. Thus, if principals were profit-maximizers, wage offers should be the same in both treatments. However, principals offer higher wages in the prosocial treatment. We show that this is due to principals in the GE treatment highly underestimating agents' reciprocity and thereby offering wages below the profit-maximizing level. Results from robustness-checks further suggest that our findings are unlikely to be driven by a simple efficiency effect."
      // "Many jobs serve a social purpose beyond profit maximization. This paper uses a modified principal-agent gift-exchange game with positive externality to study how workers' prosocial motivation interacts with efficiency wages in stimulating effort. The results show that prosocial motivation and efficiency wages are independent in stimulating effort, while principals offer higher wages in the prosocial treatment because they underestimate reciprocity in the standard gift-exchange environment."
  },
  {
    title: "Managing Anticipation and Reference-Dependent Choice",
    authors: "Jesper Armouti-Hansen and Christopher Kops",
    venue: "Journal of Mathematical Economics",
    year: "2024",
    cover: "/images/journals/j-mathematical-economics.gif",
    details: "112, 102988",
    href: "https://www.sciencedirect.com/science/article/pii/S0304406824000508",
    links: [
      { label: "Paper", href: "https://www.sciencedirect.com/science/article/pii/S0304406824000508" }
    ],
    type: "Publication",
    abstract:
      "Extensive field and experimental evidence shows that reference points shape behavior. But, what shapes the reference point? Candidates put forward in the literature range from the status quo, to rational expectations and the narrow focus of dreaming or worrying about a single possible outcome. This paper develops a model that includes all of these candidate sources. It does so, by allowing the reference point to be any convex combination of the outcomes possible under a consumption lottery. We introduce new solution concepts for reference-dependent choices, characterize these solution concepts on the level of choice data and identify the model’s parameters."
      // "The paper develops a model of reference-dependent choice in which the reference point may be any convex combination of possible outcomes under a consumption lottery. It introduces solution concepts, characterizes them on choice data, and identifies the model's parameters."
  },
  {
    title: "Optimal Contracting with Endogenous Project Mission",
    authors: "Jesper Armouti-Hansen and Lea Cassar",
    venue: "Journal of the European Economic Association",
    year: "2020",
    cover: "/images/journals/jeea.jpg",
    details: "18(5), pp. 2647–2676",
    href: "https://scholar.google.com/scholar?oi=bibs&cluster=9361077569797977679&btnI=1&hl=en",
    links: [
      { label: "Paper", href: "https://scholar.google.com/scholar?oi=bibs&cluster=9361077569797977679&btnI=1&hl=en" }
    ],
    type: "Publication",
    abstract:
      "Empirical evidence suggests that workers care about the mission of their job, in addition to their wage. This paper studies how organizations can choose a mission to attract, incentivize, and screen their workers. We analyze a model in which a principal offers a contract to an agent for the development of a project and can influence the agent’s marginal return of effort through the choice of project mission. The principal’s and the agents’ mission preferences are misaligned and the agents vary in the intensity of their mission drive. Our main results highlight that how far the organization chooses to move from its preferred mission depends on the contractual environment in which it operates. Missions will be more agent-preferred in environments in which effort is noncontractible. In environments in which agents’ drive is unknown, missions will be less agent-preferred and the organization will find it optimal to offer contract menus that may be implemented via scoring auctions when there are competing agents. Our analysis applies to the design and allocation of aid contracts, research funding, and creative jobs."
      // "The paper studies how organizations can choose a project mission to attract, incentivize, and screen workers. It analyzes how contractual environments shape the optimal distance between the organization's preferred mission and the agents' preferred mission."
  },
  {
    title: "This or That? Sequential Rationalization of Indecisive Choice Behavior",
    authors: "Jesper Armouti-Hansen and Christopher Kops",
    venue: "Theory and Decision",
    year: "2018",
    cover: "/images/journals/theory-and-decision.webp",
    details: "84(4), pp. 507–524",
    href: "https://scholar.google.com/scholar?oi=bibs&cluster=935449046387275988&btnI=1&hl=en",
    links: [
      { label: "Paper", href: "https://scholar.google.com/scholar?oi=bibs&cluster=935449046387275988&btnI=1&hl=en" }
    ],
    type: "Publication",
    abstract:
      "Decision-makers frequently struggle to base their choices on an exhaustive evaluation of all options at stake. This is particularly so when the choice problem at hand is complex, because the available alternatives are hard (if not impossible) to compare. Rather than striving to choose the most valuable alternative, in such situations decision-makers often settle for the choice of an alternative which is not inferior to any other available alternative instead. In this paper, we extend two established models of boundedly rational choice, the categorize then choose heuristic and the rational shortlist method, to incorporate this kind of “indecisive” choice behavior. We study some properties of these extensions and provide full behavioral characterizations."
      // "The paper extends established models of boundedly rational choice to account for indecisive choice behavior in complex choice problems where alternatives are difficult to compare exhaustively."
  },
  {
    title: "On the Optimal Mode of Selling Goods with Uncertain Consumption Quality",
    authors: "Jesper Armouti-Hansen and Matthias Kraekel",
    venue: "Working paper",
    year: "",
    cover: "/images/publications/optimal-selling.png",
    details: "",
    href: "/papers/optimal-selling.pdf",
    links: [{ label: "Manuscript", href: "/papers/optimal-selling.pdf" }],
    type: "Working paper",
    abstract:
      "We show that choosing a non-centralized distribution channel—that is, a retailer or an intermediary (e.g., sales representative, social media influencer)— instead of a centralized channel for selling goods with uncertain consumption quality can be optimal for a manufacturer as a self-commitment device. By this choice, the manufacturer can save costs from interacting with consumers (e.g., costs for sales activities). We derive conditions under which this self-commitment argument holds. In addition, we show that decentralized selling through a retailer can be even optimal if the manufacturer has to reimburse the retailer for the anticipated costs from consumer interaction, and if the manufacturer and the retailer simultaneously exert sales activities, which eliminates the self-commitment property of a retailer. In a second step, we discuss our self-commitment result under product competition, consumer naivety, product innovation, and product quality improvement."
      // "The project studies when decentralized or hybrid sales channels can serve as commitment devices for manufacturers selling goods with uncertain consumption quality."
  },
  {
    title: "Predictive Completeness of Social Preference Theories",
    authors: "Jesper Armouti-Hansen",
    venue: "Work in progress",
    year: "",
    cover: "/images/publications/predictive-completeness.png",
    details: "A machine learning benchmark approach",
    href: "/papers/predictive-completeness.pdf",
    links: [{ label: "Manuscript", href: "/papers/predictive-completeness.pdf" }],
    type: "Research project",
    abstract:
      "This project uses machine learning benchmarks to evaluate how much predictable variation in experimental social preference data is captured by parameterized behavioral models, including extensions with heterogeneous preference types."
  },
  {
    title: "The Informativeness of Frequency-Report Scoring Rules",
    authors: "Jesper Armouti-Hansen",
    venue: "Working paper",
    year: "2026",
    cover: "/images/publications/frequency-beliefs.png",
    details: "Manuscript complete; replication package finalised",
    href: "https://github.com/armoutihansen/frequency-beliefs",
    links: [
      { label: "Manuscript", href: "/papers/frequency-beliefs.pdf" },
      { label: "Replication package", href: "https://github.com/armoutihansen/frequency-beliefs" }
    ],
    type: "Research project",
    abstract:
      "An experimenter elicits a subject's latent multinomial beliefs through an incentivized count report under a scoring rule. We recast the inference as a partial-identification problem: each rule maps the report to the set of beliefs under which it is optimal, from which coordinate and linear-functional bounds follow. We characterize three rules---squared-distance scoring (closed-form coordinate bounds and linear-program means), frequency-guessing (the known closed-form fixed-prize rule), and Manhattan distance (sharp one-dimensional bounds via threshold root-finds)---unified by a single structural condition: separability and discrete convexity of a per-coordinate cost. No rule dominates: squared-distance for concentrated beliefs, frequency-guessing for balanced, with the two closed-form rules' coordinate widths crossing in the number of positive-report coordinates---a crossover the design comparison locates in the Dirichlet concentration. Manhattan is rarely tightest but barely moves across regimes, the robust choice when the regime is unknown. The body assumes risk neutrality; a binary-lottery implementation extends to risk-averse subjects."
      // "This project studies belief elicitation from frequency reports: subjects submit count vectors, and a scoring rule induces an identified set of latent beliefs consistent with each report. The paper characterizes that set for squared-distance, frequency-guessing, and Manhattan-distance rules and compares them by the sharpness of the bounds they yield. The headline result is contingent — no rule dominates. Squared-distance is sharpest when beliefs concentrate on a few categories, frequency-guessing when they are balanced, and Manhattan is the robust choice when concentration cannot be anticipated."
  }
];

const KNOWN_TYPES: PublicationType[] = ["Publication", "Working paper", "Research project"];
const JOURNAL_TYPE: PublicationType = "Publication";

// The home's ordered featured publication set is the first N journal
// publications, in array order.
const DEFAULT_FEATURED_COUNT = 2;

// Resolve the `links ?? href` fallback once: a bare `href` becomes a single
// "Link" entry (the label PublicationItem previously synthesised at render
// time), so every consumer receives a guaranteed non-empty links array.
// Exported so the normalisation rule is testable on both source shapes
// (`links`-present and `href`-only).
export function resolveLinks(pub: Publication): PublicationLink[] {
  return pub.links ?? (pub.href ? [{ label: "Link", href: pub.href }] : []);
}

function resolve(pub: Publication): ResolvedPublication {
  return { ...pub, links: resolveLinks(pub) };
}

// Domain invariants for publication data (see CONTEXT.md), checkable against any
// array so the failure modes can be unit-tested without corrupting the real
// data. The import-time `assertInvariants()` runs this on the live array.
export function checkInvariants(pubs: Publication[], ownerName: string): void {
  const known = new Set<string>(KNOWN_TYPES);
  const unknown = pubs.map((p) => p.type).filter((t) => !known.has(t));
  if (unknown.length > 0) {
    throw new Error(`Unknown publication types: ${[...new Set(unknown)].join(", ")}`);
  }
  const missingAuthor = pubs.filter((p) => !p.authors.includes(ownerName)).map((p) => p.title);
  if (missingAuthor.length > 0) {
    throw new Error(`Publications missing owner name "${ownerName}" in authors: ${missingAuthor.join(", ")}`);
  }
  // Every journal publication must resolve to at least one link. Working papers
  // and research projects can legitimately have nothing to link yet (a draft with
  // no public manuscript), so the link guarantee is scoped to the entries whose
  // rendered shape contract requires explicit links. The current working papers
  // each carry a local "Manuscript" link, but that is data, not an invariant.
  const noLinks = pubs
    .filter((p) => p.type === JOURNAL_TYPE && resolveLinks(p).length === 0)
    .map((p) => p.title);
  if (noLinks.length > 0) {
    throw new Error(`Journal publications resolving to zero links: ${noLinks.join(", ")}`);
  }
}

// Enforced at import so every consumer and the build are protected — not just
// the page that happens to render the publications.
function assertInvariants(): void {
  checkInvariants(publications, profile.name);
}
assertInvariants();

// Peer-reviewed journal publications, in array order.
export function journalPublications(): ResolvedPublication[] {
  return publications.filter((p) => p.type === JOURNAL_TYPE).map(resolve);
}

// The exact complement of journalPublications(): working papers and research
// projects, in array order.
export function otherWork(): ResolvedPublication[] {
  return publications.filter((p) => p.type !== JOURNAL_TYPE).map(resolve);
}

// The home's ordered featured set: the first n journal publications.
export function featuredPublications(n: number = DEFAULT_FEATURED_COUNT): ResolvedPublication[] {
  return journalPublications().slice(0, n);
}
