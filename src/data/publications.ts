import {
  professionalRecord,
  type ProfessionalRecord,
  type ProfessionalPublication
} from "./professional-record";

export type PublicationLink = { label: string; href: string };

export type PublicationType = "Publication" | "Working paper" | "Research project";

export interface Publication {
  id: string;
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

export interface PublicationPresentation {
  id: string;
  primaryLinkId: string;
  links: { id: string; label: string }[];
  abstract: string;
  cover?: string;
}

export const publicationPresentation: PublicationPresentation[] = [
  {
    id: "efficiency-wages-motivated-agents",
    primaryLinkId: "paper",
    cover: "/images/journals/games-economic-behavior.gif",
    links: [
      { id: "paper", label: "Paper" },
      { id: "code", label: "Code" }
    ],
    abstract:
      "Many jobs serve a social purpose beyond profit maximization, contributing positively to society. This paper uses a modified principal-agent gift-exchange game with positive externality (prosocial treatment) to study how workers' prosocial motivation interacts with the use of efficiency wages in stimulating effort. We find that prosocial motivation and efficiency wages are independent in stimulating effort: compared to a standard gift-exchange game (GE treatment), the presence of the externality shifts the agents' effort choice function upwards without affecting its slope. Thus, if principals were profit-maximizers, wage offers should be the same in both treatments. However, principals offer higher wages in the prosocial treatment. We show that this is due to principals in the GE treatment highly underestimating agents' reciprocity and thereby offering wages below the profit-maximizing level. Results from robustness-checks further suggest that our findings are unlikely to be driven by a simple efficiency effect."
      // "Many jobs serve a social purpose beyond profit maximization. This paper uses a modified principal-agent gift-exchange game with positive externality to study how workers' prosocial motivation interacts with efficiency wages in stimulating effort. The results show that prosocial motivation and efficiency wages are independent in stimulating effort, while principals offer higher wages in the prosocial treatment because they underestimate reciprocity in the standard gift-exchange environment."
  },
  {
    id: "managing-anticipation-reference-dependent-choice",
    primaryLinkId: "paper",
    cover: "/images/journals/j-mathematical-economics.gif",
    links: [{ id: "paper", label: "Paper" }],
    abstract:
      "Extensive field and experimental evidence shows that reference points shape behavior. But, what shapes the reference point? Candidates put forward in the literature range from the status quo, to rational expectations and the narrow focus of dreaming or worrying about a single possible outcome. This paper develops a model that includes all of these candidate sources. It does so, by allowing the reference point to be any convex combination of the outcomes possible under a consumption lottery. We introduce new solution concepts for reference-dependent choices, characterize these solution concepts on the level of choice data and identify the model’s parameters."
      // "The paper develops a model of reference-dependent choice in which the reference point may be any convex combination of possible outcomes under a consumption lottery. It introduces solution concepts, characterizes them on choice data, and identifies the model's parameters."
  },
  {
    id: "optimal-contracting-endogenous-project-mission",
    primaryLinkId: "paper",
    cover: "/images/journals/jeea.jpg",
    links: [{ id: "paper", label: "Paper" }],
    abstract:
      "Empirical evidence suggests that workers care about the mission of their job, in addition to their wage. This paper studies how organizations can choose a mission to attract, incentivize, and screen their workers. We analyze a model in which a principal offers a contract to an agent for the development of a project and can influence the agent’s marginal return of effort through the choice of project mission. The principal’s and the agents’ mission preferences are misaligned and the agents vary in the intensity of their mission drive. Our main results highlight that how far the organization chooses to move from its preferred mission depends on the contractual environment in which it operates. Missions will be more agent-preferred in environments in which effort is noncontractible. In environments in which agents’ drive is unknown, missions will be less agent-preferred and the organization will find it optimal to offer contract menus that may be implemented via scoring auctions when there are competing agents. Our analysis applies to the design and allocation of aid contracts, research funding, and creative jobs."
      // "The paper studies how organizations can choose a project mission to attract, incentivize, and screen workers. It analyzes how contractual environments shape the optimal distance between the organization's preferred mission and the agents' preferred mission."
  },
  {
    id: "sequential-rationalization-indecisive-choice",
    primaryLinkId: "paper",
    cover: "/images/journals/theory-and-decision.webp",
    links: [{ id: "paper", label: "Paper" }],
    abstract:
      "Decision-makers frequently struggle to base their choices on an exhaustive evaluation of all options at stake. This is particularly so when the choice problem at hand is complex, because the available alternatives are hard (if not impossible) to compare. Rather than striving to choose the most valuable alternative, in such situations decision-makers often settle for the choice of an alternative which is not inferior to any other available alternative instead. In this paper, we extend two established models of boundedly rational choice, the categorize then choose heuristic and the rational shortlist method, to incorporate this kind of “indecisive” choice behavior. We study some properties of these extensions and provide full behavioral characterizations."
      // "The paper extends established models of boundedly rational choice to account for indecisive choice behavior in complex choice problems where alternatives are difficult to compare exhaustively."
  },
  {
    id: "optimal-selling-uncertain-consumption-quality",
    primaryLinkId: "manuscript",
    cover: "/images/publications/optimal-selling.png",
    links: [{ id: "manuscript", label: "Manuscript" }],
    abstract:
      "We show that choosing a non-centralized distribution channel—that is, a retailer or an intermediary (e.g., sales representative, social media influencer)— instead of a centralized channel for selling goods with uncertain consumption quality can be optimal for a manufacturer as a self-commitment device. By this choice, the manufacturer can save costs from interacting with consumers (e.g., costs for sales activities). We derive conditions under which this self-commitment argument holds. In addition, we show that decentralized selling through a retailer can be even optimal if the manufacturer has to reimburse the retailer for the anticipated costs from consumer interaction, and if the manufacturer and the retailer simultaneously exert sales activities, which eliminates the self-commitment property of a retailer. In a second step, we discuss our self-commitment result under product competition, consumer naivety, product innovation, and product quality improvement."
      // "The project studies when decentralized or hybrid sales channels can serve as commitment devices for manufacturers selling goods with uncertain consumption quality."
  },
  {
    id: "predictive-completeness-social-preference-theories",
    primaryLinkId: "manuscript",
    cover: "/images/publications/predictive-completeness.png",
    links: [{ id: "manuscript", label: "Manuscript" }],
    abstract:
      "This project uses machine learning benchmarks to evaluate how much predictable variation in experimental social preference data is captured by parameterized behavioral models, including extensions with heterogeneous preference types."
  },
  {
    id: "informativeness-frequency-report-scoring-rules",
    primaryLinkId: "replication-package",
    cover: "/images/publications/frequency-beliefs.png",
    links: [
      { id: "manuscript", label: "Manuscript" },
      { id: "replication-package", label: "Replication package" }
    ],
    abstract:
      "An experimenter elicits a subject's latent multinomial beliefs through an incentivized count report under a scoring rule. We recast the inference as a partial-identification problem: each rule maps the report to the set of beliefs under which it is optimal, from which coordinate and linear-functional bounds follow. We characterize three rules---squared-distance scoring (closed-form coordinate bounds and linear-program means), frequency-guessing (the known closed-form fixed-prize rule), and Manhattan distance (sharp one-dimensional bounds via threshold root-finds)---unified by a single structural condition: separability and discrete convexity of a per-coordinate cost. No rule dominates: squared-distance for concentrated beliefs, frequency-guessing for balanced, with the two closed-form rules' coordinate widths crossing in the number of positive-report coordinates---a crossover the design comparison locates in the Dirichlet concentration. Manhattan is rarely tightest but barely moves across regimes, the robust choice when the regime is unknown. The body assumes risk neutrality; a binary-lottery implementation extends to risk-averse subjects."
      // "This project studies belief elicitation from frequency reports: subjects submit count vectors, and a scoring rule induces an identified set of latent beliefs consistent with each report. The paper characterizes that set for squared-distance, frequency-guessing, and Manhattan-distance rules and compares them by the sharpness of the bounds they yield. The headline result is contingent — no rule dominates. Squared-distance is sharpest when beliefs concentrate on a few categories, frequency-guessing when they are balanced, and Manhattan is the robust choice when concentration cannot be anticipated."
  }
];

const JOURNAL_TYPE: PublicationType = "Publication";
const FEATURED_PUBLICATION_IDS = [
  "efficiency-wages-motivated-agents",
  "managing-anticipation-reference-dependent-choice"
];

function authorList(names: string[]): string {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

function websiteType(type: ProfessionalPublication["type"]): PublicationType {
  if (type === "journal-publication") return "Publication";
  if (type === "working-paper") return "Working paper";
  return "Research project";
}

export function resolveResearch(
  record: Pick<ProfessionalRecord, "people" | "publications">,
  presentation: PublicationPresentation[]
): ResolvedPublication[] {
  const factsById = new Map(record.publications.map((publication) => [publication.id, publication]));
  const peopleById = new Map(record.people.map((person) => [person.id, person]));
  const presentationById = new Map<string, PublicationPresentation>();

  for (const entry of presentation) {
    if (!factsById.has(entry.id)) {
      throw new Error(`Unknown Research presentation publication id: ${entry.id}`);
    }
    if (presentationById.has(entry.id)) {
      throw new Error(`Duplicate Research presentation publication id: ${entry.id}`);
    }
    presentationById.set(entry.id, entry);
  }

  for (const fact of record.publications) {
    if (!presentationById.has(fact.id)) {
      throw new Error(`Missing Research presentation publication id: ${fact.id}`);
    }
  }

  return presentation.map((local) => {
    const fact = factsById.get(local.id)!;
    const factualLinks = new Map(fact.links.map((link) => [link.id, link.url]));
    const links = local.links.map(({ id, label }) => {
      const href = factualLinks.get(id);
      if (!href) {
        throw new Error(`Unknown publication link id "${id}" for ${fact.id}`);
      }
      return { label, href };
    });
    const href = factualLinks.get(local.primaryLinkId);
    if (!href) {
      throw new Error(
        `Unknown primary publication link id "${local.primaryLinkId}" for ${fact.id}`
      );
    }
    const authors = fact.authorIds.map((authorId) => {
      const person = peopleById.get(authorId);
      if (!person) {
        throw new Error(`Unknown publication author id "${authorId}" for ${fact.id}`);
      }
      return person.fullName;
    });
    return {
      id: fact.id,
      title: fact.title,
      authors: authorList(authors),
      venue: fact.venue,
      year: fact.year ?? "",
      details: fact.details ?? "",
      href,
      links,
      type: websiteType(fact.type),
      abstract: local.abstract,
      ...(local.cover ? { cover: local.cover } : {})
    };
  });
}

export const publications = resolveResearch(professionalRecord, publicationPresentation);

export function selectPublications(
  ids: string[],
  source: ResolvedPublication[] = publications
): ResolvedPublication[] {
  const byId = new Map(source.map((publication) => [publication.id, publication]));
  const seen = new Set<string>();
  return ids.map((id) => {
    if (seen.has(id)) throw new Error(`Duplicate publication selection id: ${id}`);
    seen.add(id);
    const publication = byId.get(id);
    if (!publication) throw new Error(`Unknown publication selection id: ${id}`);
    return publication;
  });
}

// Peer-reviewed journal publications, in array order.
export function journalPublications(): ResolvedPublication[] {
  return publications.filter((p) => p.type === JOURNAL_TYPE);
}

// The exact complement of journalPublications(): working papers and research
// projects, in array order.
export function otherWork(): ResolvedPublication[] {
  return publications.filter((p) => p.type !== JOURNAL_TYPE);
}

// The home's ordered featured set is local presentation selected by stable id.
export function featuredPublications(n = FEATURED_PUBLICATION_IDS.length): ResolvedPublication[] {
  return selectPublications(FEATURED_PUBLICATION_IDS.slice(0, n));
}
