import { z } from "zod";
import recordData from "./professional-record.json" with { type: "json" };

const partialDateSchema = z
  .string()
  .regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/, "must be YYYY or YYYY-MM");

const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

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

const professionalRecordSchema = z.strictObject({
  identity: identitySchema,
  experience: experienceSchema,
  education: educationSchema
});

export type ProfessionalRecord = z.infer<typeof professionalRecordSchema>;
export type ProfessionalIdentity = ProfessionalRecord["identity"];
export type ProfessionalLink = ProfessionalIdentity["links"][number];
export type ProfessionalExperience = ProfessionalRecord["experience"][number];
export type ProfessionalEducation = ProfessionalRecord["education"][number];

export function parseProfessionalRecord(input: unknown): ProfessionalRecord {
  const result = professionalRecordSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid Professional record:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const professionalRecord = parseProfessionalRecord(recordData);
