import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateIndustrySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  shortDesc: z.string().max(250).optional().nullable(),
  contentJson: richContentDocumentSchema.optional().nullable(),
  icon: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  galleryImages: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string()).default([])),
  demoVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),

  cardImageAlt: z.string().max(500).optional().nullable(),
  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  iconAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
});
export const UpdateIndustrySchema = CreateIndustrySchema.partial();
export const IndustryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "order_asc", "order_desc", "createdAt_desc", "createdAt_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});
export type CreateIndustrySchemaType = z.infer<typeof CreateIndustrySchema>;
export type UpdateIndustrySchemaType = z.infer<typeof UpdateIndustrySchema>;
export type IndustryQuerySchemaType = z.infer<typeof IndustryQuerySchema>;
