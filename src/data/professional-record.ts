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

const peopleSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      fullName: z.string().min(1)
    })
  )
  .min(1)
  .superRefine(requireUniqueIds("person"));

const publicationUrlSchema = z.union([
  z.url().refine((url) => /^https?:\/\//.test(url), "must be an HTTP(S) URL"),
  z.string().regex(/^\/(?!\/)\S+$/, "must be a root-relative URL")
]);

const publicationSchema = z
  .strictObject({
    id: stableIdSchema,
    title: z.string().min(1),
    authorIds: z.array(stableIdSchema).min(1),
    venue: z.string().min(1),
    year: z.string().regex(/^\d{4}$/, "must be YYYY").nullable(),
    details: z.string().min(1).nullable(),
    type: z.enum(["journal-publication", "working-paper", "research-project"]),
    links: z
      .array(
        z.strictObject({
          id: stableIdSchema,
          url: publicationUrlSchema
        })
      )
      .min(1)
      .superRefine(requireUniqueIds("publication link"))
  })
  .superRefine((publication, context) => {
    const seen = new Set<string>();
    publication.authorIds.forEach((authorId, index) => {
      if (seen.has(authorId)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate publication author id: ${authorId}`,
          path: ["authorIds", index]
        });
      }
      seen.add(authorId);
    });
  });

const publicationsSchema = z
  .array(publicationSchema)
  .min(1)
  .superRefine(requireUniqueIds("publication"));

const selectedWorkHrefSchema = z.union([
  z.url().refine((url) => /^https?:\/\//.test(url), "must be an HTTP(S) URL"),
  z.string().regex(/^\/(?!\/)\S+$/, "must be a root-relative URL"),
  z.strictObject({
    publicationId: stableIdSchema,
    linkId: stableIdSchema
  })
]);

const selectedWorkTitleSchema = z.union([
  z.string().min(1),
  z.strictObject({ publicationId: stableIdSchema })
]);

const selectedWorkSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      title: selectedWorkTitleSchema,
      category: z.string().min(1),
      status: z.string().min(1),
      tools: z
        .array(z.strictObject({ id: stableIdSchema, name: z.string().min(1) }))
        .min(1)
        .superRefine(requireUniqueIds("selected work tool")),
      href: selectedWorkHrefSchema
    })
  )
  .min(1)
  .superRefine(requireUniqueIds("selected work"));

const professionalRecordSchema = z
  .strictObject({
    identity: identitySchema,
    experience: experienceSchema,
    education: educationSchema,
    teaching: teachingSchema,
    skills: skillsSchema,
    spokenLanguages: spokenLanguagesSchema,
    people: peopleSchema,
    publications: publicationsSchema,
    selectedWork: selectedWorkSchema
  })
  .superRefine((record, context) => {
    const personIds = new Set(record.people.map((person) => person.id));
    record.publications.forEach((publication, publicationIndex) => {
      publication.authorIds.forEach((authorId, authorIndex) => {
        if (!personIds.has(authorId)) {
          context.addIssue({
            code: "custom",
            message: `Unknown publication author id: ${authorId}`,
            path: ["publications", publicationIndex, "authorIds", authorIndex]
          });
        }
      });
    });
    const publicationsById = new Map(
      record.publications.map((publication) => [publication.id, publication])
    );
    record.selectedWork.forEach((project, projectIndex) => {
      const title = project.title;
      if (typeof title !== "string" && !publicationsById.has(title.publicationId)) {
        context.addIssue({
          code: "custom",
          message: `Unknown selected work title publication id: ${title.publicationId}`,
          path: ["selectedWork", projectIndex, "title", "publicationId"]
        });
      }
      const href = project.href;
      if (typeof href === "string") return;
      const publication = publicationsById.get(href.publicationId);
      if (!publication) {
        context.addIssue({
          code: "custom",
          message: `Unknown selected work publication id: ${href.publicationId}`,
          path: ["selectedWork", projectIndex, "href", "publicationId"]
        });
        return;
      }
      if (!publication.links.some((link) => link.id === href.linkId)) {
        context.addIssue({
          code: "custom",
          message: `Unknown selected work publication link id: ${href.linkId}`,
          path: ["selectedWork", projectIndex, "href", "linkId"]
        });
      }
    });
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
export type ProfessionalPerson = ProfessionalRecord["people"][number];
export type ProfessionalPublication = ProfessionalRecord["publications"][number];
export type ProfessionalSelectedWork = ProfessionalRecord["selectedWork"][number];

export function parseProfessionalRecord(input: unknown): ProfessionalRecord {
  const result = professionalRecordSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid Professional record:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const professionalRecord = parseProfessionalRecord(recordData);
