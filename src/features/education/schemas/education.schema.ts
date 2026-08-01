import { Status } from "@/shared/types/enums";
import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateEducationSchema = z.object({
  institution: z.string().min(2, "Institution must be at least 2 characters").max(200),
  institutionUrl: z.preprocess(emptyStringToNull, z.string().url("Invalid institution URL").optional().nullable()),
  degree: z.string().min(2, "Degree must be at least 2 characters").max(200),
  fieldOfStudy: z.preprocess(emptyStringToNull, z.string().max(200).optional().nullable()),
  grade: z.preprocess(emptyStringToNull, z.string().max(50).optional().nullable()),
  startDate: z.coerce.date(),
  endDate: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.coerce.date().optional().nullable()
  ),
  isCurrent: z.boolean().default(false),
  shortDesc: z.string().max(500).optional().nullable(),
  contentJson: richContentDocumentSchema.optional().nullable(),
  logo: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  certificateUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),
  order: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  logoAlt: z.string().max(500).optional().nullable(),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

export const EducationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(["startDate_desc", "startDate_asc", "order_asc", "order_desc", "createdAt_desc"]).default("startDate_desc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.coerce.boolean().optional(),
});

export type CreateEducationSchemaType = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationSchemaType = z.infer<typeof UpdateEducationSchema>;
export type EducationQuerySchemaType = z.infer<typeof EducationQuerySchema>;
