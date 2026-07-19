import { z } from "zod";
import recordData from "./professional-record.json" with { type: "json" };

const partialDateSchema = z
  .string()
  .regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/, "must be YYYY or YYYY-MM");

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
  experience: experienceSchema
});

export type ProfessionalRecord = z.infer<typeof professionalRecordSchema>;
export type ProfessionalExperience = ProfessionalRecord["experience"][number];

export function parseProfessionalRecord(input: unknown): ProfessionalRecord {
  const result = professionalRecordSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid Professional record:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const professionalRecord = parseProfessionalRecord(recordData);
