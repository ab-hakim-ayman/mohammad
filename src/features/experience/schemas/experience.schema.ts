import { Status, EmploymentType } from "@/shared/types/enums";
import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateExperienceSchema = z.object({
  companyName: z.string().min(2, "Company Name must be at least 2 characters").max(200),
  companyUrl: z.preprocess(emptyStringToNull, z.string().url("Invalid company URL").optional().nullable()),
  position: z.string().min(2, "Position must be at least 2 characters").max(200),
  employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
  location: z.preprocess(emptyStringToNull, z.string().max(200).optional().nullable()),
  locationType: z.preprocess(emptyStringToNull, z.string().max(100).optional().nullable()),
  startDate: z.coerce.date(),
  endDate: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.coerce.date().optional().nullable()
  ),
  isCurrent: z.boolean().default(false),
  shortDesc: z.string().max(500).optional().nullable(),
  contentJson: richContentDocumentSchema.optional().nullable(),
  logo: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),
  order: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  projects: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  logoAlt: z.string().max(500).optional().nullable(),
  cardImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial();

export const ExperienceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(["startDate_desc", "startDate_asc", "order_asc", "order_desc", "createdAt_desc"]).default("startDate_desc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.coerce.boolean().optional(),
});

export type CreateExperienceSchemaType = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceSchemaType = z.infer<typeof UpdateExperienceSchema>;
export type ExperienceQuerySchemaType = z.infer<typeof ExperienceQuerySchema>;
