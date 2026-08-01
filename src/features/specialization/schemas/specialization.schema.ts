import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";
export const CreateSpecializationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  shortDesc: z.string().min(10, "Description must be at least 10 characters").max(1000),
  contentJson: richContentDocumentSchema.nullable().optional(),
  icon: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  demoVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  galleryImages: z.array(z.string()).default([]),

  heroImageAlt: z.string().max(500).optional().nullable(),
  cardImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
});
export const UpdateSpecializationSchema = CreateSpecializationSchema.partial();
export const SpecializationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["createdAt_desc", "createdAt_asc", "title_asc", "title_desc", "order_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});
export type CreateSpecializationSchemaType = z.infer<typeof CreateSpecializationSchema>;
export type UpdateSpecializationSchemaType = z.infer<typeof UpdateSpecializationSchema>;
export type SpecializationQuerySchemaType = z.infer<typeof SpecializationQuerySchema>;
