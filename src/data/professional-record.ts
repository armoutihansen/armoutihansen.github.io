import { z } from "zod";
import recordData from "./professional-record.json" with { type: "json" };

const partialDateSchema = z
  .string()
  .regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/, "must be YYYY or YYYY-MM");

const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

type PartialDateSpan = { start: string; end: string | null };

function partialDateIndex(value: string, boundary: "start" | "end"): number {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month ? month - 1 : boundary === "start" ? 0 : 11);
}

function rejectOverlappingTeachingSpans(
  spans: PartialDateSpan[],
  context: z.core.$RefinementCtx
): void {
  spans.forEach((span, index) => {
    const start = partialDateIndex(span.start, "start");
    const end =
      span.end === null
        ? Number.POSITIVE_INFINITY
        : partialDateIndex(span.end, "end");
    if (end < start) {
      context.addIssue({
        code: "custom",
        message: "must not end before it starts",
        path: [index, "end"]
      });
      return;
    }
    for (let priorIndex = 0; priorIndex < index; priorIndex += 1) {
      const prior = spans[priorIndex];
      const priorStart = partialDateIndex(prior.start, "start");
      const priorEnd =
        prior.end === null
          ? Number.POSITIVE_INFINITY
          : partialDateIndex(prior.end, "end");
      if (start <= priorEnd && priorStart <= end) {
        context.addIssue({
          code: "custom",
          message: "overlaps an earlier teaching date span",
          path: [index]
        });
        return;
      }
    }
  });
}

function requireUniqueIds(domain: string) {
  return (entries: { id: string }[], context: z.core.$RefinementCtx) => {
    const seen = new Set<string>();
    entries.forEach((entry, index) => {
      if (seen.has(entry.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate ${domain} id: ${entry.id}`,
          path: [index, "id"]
        });
      }
      seen.add(entry.id);
    });
  };
}

const professionalLinksSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      url: z.url().refine((url) => /^https?:\/\//.test(url), "must be an HTTP(S) URL")
    })
  )
  .superRefine(requireUniqueIds("professional link"));

const identitySchema = z.strictObject({
  name: z.string().min(1),
  email: z.email(),
  location: z.string().min(1),
  phone: z.string().min(1),
  links: professionalLinksSchema
});

const experienceSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      role: z.string().min(1),
      organization: z.string().min(1),
      location: z.string().min(1),
      dates: z.strictObject({
        start: partialDateSchema,
        end: partialDateSchema.nullable()
      })
    })
  )
  .superRefine(requireUniqueIds("experience"));

const educationSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      degree: z.string().min(1),
      institution: z.string().min(1),
      location: z.string().min(1),
      distinctions: z.array(z.string().min(1)),
      dates: z.strictObject({
        start: partialDateSchema,
        end: partialDateSchema
      })
    })
  )
  .superRefine(requireUniqueIds("education"));

const teachingSchema = z.strictObject({
  supervision: z.strictObject({
    minimumTheses: z.number().int().positive(),
    degreeLevels: z.array(z.enum(["bachelor", "master"])).min(1)
  }),
  courses: z
    .array(
      z.strictObject({
        id: stableIdSchema,
        title: z.string().min(1),
        level: z.enum(["undergraduate", "graduate"]),
        roles: z.array(z.enum(["lecturer", "tutor"])).min(1),
        dateSpans: z
          .array(
            z.strictObject({
              start: partialDateSchema,
              end: partialDateSchema.nullable()
            })
          )
          .min(1)
          .superRefine(rejectOverlappingTeachingSpans)
      })
    )
    .superRefine(requireUniqueIds("teaching course"))
});

const skillCategorySchema = z.strictObject({
  id: stableIdSchema,
  name: z.string().min(1)
});

const skillSchema = z.strictObject({
  id: stableIdSchema,
  name: z.string().min(1),
  categoryId: stableIdSchema
});

const skillsSchema = z
  .strictObject({
    categories: z
      .array(skillCategorySchema)
      .min(1)
      .superRefine(requireUniqueIds("skill category")),
    items: z.array(skillSchema).min(1).superRefine(requireUniqueIds("skill"))
  })
  .superRefine((skills, context) => {
    const categoryIds = new Set(skills.categories.map((category) => category.id));
    skills.items.forEach((skill, index) => {
      if (!categoryIds.has(skill.categoryId)) {
        context.addIssue({
          code: "custom",
          message: `Unknown skill category id: ${skill.categoryId}`,
          path: ["items", index, "categoryId"]
        });
      }
    });
  });

const spokenLanguagesSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      name: z.string().min(1),
      proficiency: z.string().min(1).optional()
    })
  )
  .min(1)
  .superRefine(requireUniqueIds("spoken language"));

const professionalRecordSchema = z.strictObject({
  identity: identitySchema,
  experience: experienceSchema,
  education: educationSchema,
  teaching: teachingSchema,
  skills: skillsSchema,
  spokenLanguages: spokenLanguagesSchema
});

export type ProfessionalRecord = z.infer<typeof professionalRecordSchema>;
export type ProfessionalIdentity = ProfessionalRecord["identity"];
export type ProfessionalLink = ProfessionalIdentity["links"][number];
export type ProfessionalExperience = ProfessionalRecord["experience"][number];
export type ProfessionalEducation = ProfessionalRecord["education"][number];
export type ProfessionalTeaching = ProfessionalRecord["teaching"];
export type ProfessionalTeachingCourse = ProfessionalTeaching["courses"][number];
export type ProfessionalSkills = ProfessionalRecord["skills"];
export type ProfessionalSkill = ProfessionalSkills["items"][number];
export type ProfessionalSpokenLanguage = ProfessionalRecord["spokenLanguages"][number];

export function parseProfessionalRecord(input: unknown): ProfessionalRecord {
  const result = professionalRecordSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid Professional record:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const professionalRecord = parseProfessionalRecord(recordData);
