import {
  professionalRecord,
  type ProfessionalTeachingCourse
} from "./professional-record";

export interface TeachingCourse {
  title: string;
  role: string;
  years: string;
}

export interface TeachingPresentation {
  id: string;
}

export interface Teaching {
  summary: string;
  courses: TeachingCourse[];
}

const presentation: TeachingPresentation[] = [
  { id: "current-topics-microeconomics" },
  { id: "applied-microeconomics-management-research-module" },
  { id: "empirical-evaluation-management-practices" },
  { id: "economics-incentives-organisations" },
  { id: "behavioral-management-science" },
  { id: "strategic-human-resource-management" },
  { id: "human-resource-management-seminar" }
];

function formatSpan(
  span: ProfessionalTeachingCourse["dateSpans"][number]
): string {
  if (span.end === span.start) return span.start;
  return `${span.start}–${span.end ?? "present"}`;
}

function formatRole(course: ProfessionalTeachingCourse): string {
  const level = course.level[0].toUpperCase() + course.level.slice(1);
  return `${level} ${course.roles.join(" & ")}`;
}

function formatSupervision(): string {
  const { minimumTheses, degreeLevels } = professionalRecord.teaching.supervision;
  const levels = degreeLevels.map((level) => `${level}'s`).join(" and ");
  return `Supervised ${minimumTheses}+ ${levels} theses along the way.`;
}

export function resolveTeaching(selected: TeachingPresentation[]): Teaching {
  const selectedIds = new Set<string>();
  for (const { id } of selected) {
    if (selectedIds.has(id)) {
      throw new Error(`Duplicate website teaching selection id: ${id}`);
    }
    selectedIds.add(id);
  }
  const byId = new Map(
    professionalRecord.teaching.courses.map((course) => [course.id, course])
  );
  const courses = selected.map(({ id }) => {
    const fact = byId.get(id);
    if (!fact) {
      throw new Error(`Unknown Professional record teaching course id: ${id}`);
    }
    return {
      title: fact.title,
      role: formatRole(fact),
      years: fact.dateSpans.map(formatSpan).join(", ")
    };
  });

  return {
    summary:
      "University lecturer and tutor in applied, behavioral, personnel, and organizational economics. " +
      formatSupervision(),
    courses
  };
}

export const teaching = resolveTeaching(presentation);
