import {
  professionalRecord,
  type ProfessionalExperience
} from "./professional-record";

export interface ExperienceItem {
  role: string;
  organization: string;
  logo?: string;
  period: string;
  location: string;
  bullets: string[];
}

interface ExperiencePresentation {
  id: string;
  logo?: string;
  bullets: string[];
}

const presentation: ExperiencePresentation[] = [
  {
    id: "axa-data-scientist",
    logo: "/images/logos/axa.svg",
    bullets: [
      "Work on a production document-understanding pipeline that segments stacks of scanned pages into documents (boundary detection) and classifies each — hundreds of thousands of stacks per month — flagging low-confidence cases for human review.",
      "Built document-class-specific confidence thresholds that automate more documents while holding at least 95% precision per class, cutting manual review by around 30% in production.",
      "Researching pipeline upgrades: an LLM post-processing step for frequently-confused class pairs, and a single vision-language model (Qwen3.5-4B) to replace the existing two-stage BERT+CLIP and RNN stack."
    ]
  },
  {
    id: "bonn-postdoctoral-researcher",
    logo: "/images/logos/university-of-bonn.svg",
    bullets: [
      "Ran empirical and computational economics research — statistical and econometric modeling, machine-learning benchmarking, and partial-identification with simulation.",
      "Developed theoretical models and built reproducible analysis pipelines in Python and R; benchmarked economic theories against machine-learning models to quantify how much predictable variation each captures.",
      "Published peer-reviewed research and presented at international conferences."
    ]
  },
  {
    id: "cologne-research-assistant",
    logo: "/images/logos/university-of-cologne-wordmark.jpg",
    bullets: [
      "Conducted PhD research in microeconomic theory and experimental economics — decision-theory and contract-theory modeling, with empirical analysis of experimental data."
    ]
  },
  {
    id: "airplus-intern",
    logo: "/images/logos/airplus.svg",
    bullets: ["Built VBA tools for data management and process automation."]
  }
];

const months = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec."
];

function formatPartialDate(date: string): string {
  const [year, month] = date.split("-");
  return month ? `${months[Number(month) - 1]} ${year}` : year;
}

function formatPeriod(dates: ProfessionalExperience["dates"]): string {
  return `${formatPartialDate(dates.start)} – ${dates.end ? formatPartialDate(dates.end) : "present"}`;
}

export function resolveExperience(
  selected: ExperiencePresentation[]
): ExperienceItem[] {
  const byId = new Map(professionalRecord.experience.map((entry) => [entry.id, entry]));
  return selected.map(({ id, ...display }) => {
    const fact = byId.get(id);
    if (!fact) {
      throw new Error(`Unknown Professional record experience id: ${id}`);
    }
    return {
      role: fact.role,
      organization: fact.organization,
      ...display,
      period: formatPeriod(fact.dates),
      location: fact.location
    };
  });
}

export const experience = resolveExperience(presentation);
