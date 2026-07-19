import {
  professionalRecord,
  type ProfessionalEducation
} from "./professional-record";

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  location: string;
  detail: string;
  logo?: string;
}

export interface EducationPresentation {
  id: string;
  detailSuffix?: string;
  logo?: string;
}

const presentation: EducationPresentation[] = [
  {
    id: "cologne-economics-phd",
    detailSuffix: "Focus on microeconomics, statistics, and econometrics.",
    logo: "/images/logos/university-of-cologne-wordmark.jpg"
  },
  {
    id: "mainz-international-economics-msc",
    logo: "/images/logos/university-of-mainz.svg"
  },
  {
    id: "copenhagen-financial-management-ba",
    logo: "/images/logos/copenhagen-business-academy.png"
  },
  {
    id: "cyprus-exchange-semester",
    logo: "/images/logos/european-university-of-cyprus.png"
  }
];

function formatPeriod(dates: ProfessionalEducation["dates"]): string {
  return dates.start === dates.end ? dates.start : `${dates.start} – ${dates.end}`;
}

function formatDetail(
  distinctions: ProfessionalEducation["distinctions"],
  suffix?: string
): string {
  const parts = distinctions.map((distinction) => `${distinction}.`);
  if (suffix) parts.push(suffix);
  return parts.join(" ");
}

export function resolveEducation(
  selected: EducationPresentation[]
): EducationEntry[] {
  const byId = new Map(professionalRecord.education.map((entry) => [entry.id, entry]));
  return selected.map(({ id, detailSuffix, logo }) => {
    const fact = byId.get(id);
    if (!fact) {
      throw new Error(`Unknown Professional record education id: ${id}`);
    }
    return {
      degree: fact.degree,
      institution: fact.institution,
      period: formatPeriod(fact.dates),
      location: fact.location,
      detail: formatDetail(fact.distinctions, detailSuffix),
      logo
    };
  });
}

export const education = resolveEducation(presentation);
