import { z } from "zod";
import recordData from "./professional-record.json" with { type: "json" };

const partialDateSchema = z
  .string()
  .regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/, "must be YYYY or YYYY-MM");

const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

const professionalLinksSchema = z
  .array(
    z.strictObject({
      id: stableIdSchema,
      url: z.url().refine((url) => /^https?:\/\//.test(url), "must be an HTTP(S) URL")
    })
  )
  .superRefine((links, context) => {
    const seen = new Set<string>();
    links.forEach((link, index) => {
      if (seen.has(link.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate professional link id: ${link.id}`,
          path: [index, "id"]
        });
      }
      seen.add(link.id);
    });
  });

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
      id: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case"),
      role: z.string().min(1),
      organization: z.string().min(1),
      location: z.string().min(1),
      dates: z.strictObject({
        start: partialDateSchema,
        end: partialDateSchema.nullable()
      })
    })
  )
  .superRefine((experience, context) => {
    const seen = new Set<string>();
    experience.forEach((entry, index) => {
      if (seen.has(entry.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate experience id: ${entry.id}`,
          path: [index, "id"]
        });
      }
      seen.add(entry.id);
    });
  });

const professionalRecordSchema = z.strictObject({
  identity: identitySchema,
  experience: experienceSchema
});

export type ProfessionalRecord = z.infer<typeof professionalRecordSchema>;
export type ProfessionalIdentity = ProfessionalRecord["identity"];
export type ProfessionalLink = ProfessionalIdentity["links"][number];
export type ProfessionalExperience = ProfessionalRecord["experience"][number];

export function parseProfessionalRecord(input: unknown): ProfessionalRecord {
  const result = professionalRecordSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid Professional record:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const professionalRecord = parseProfessionalRecord(recordData);
