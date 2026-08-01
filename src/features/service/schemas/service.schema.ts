import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateServiceSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDesc: z.preprocess(emptyStringToNull, z.string().max(220).optional().nullable()),
  contentJson: richContentDocumentSchema.optional().nullable(),
  icon: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  galleryImages: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string()).default([])),
  demoVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  order: z.preprocess(
    (val) =>
      val === "" || Number.isNaN(val) || val === null || val === undefined ? 0 : Number(val),
    z.number().int().min(0).default(0)
  ),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  industryIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  technologyIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  projectIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  faqIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  testimonialIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  categoryIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  tagIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  specializationIds: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(Boolean) : []),
    z.array(z.string()).default([])
  ),
  isFeatured: z.boolean().default(false),

  // Alt text fields for media sync — request-only, not stored in DB
  cardImageAlt: z.string().max(500).optional().nullable(),
  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  iconAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
});
export const UpdateServiceSchema = CreateServiceSchema.partial();
export const ServiceQuerySchema = z.object({
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
export type CreateServiceSchemaType = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceSchemaType = z.infer<typeof UpdateServiceSchema>;
export type ServiceQuerySchemaType = z.infer<typeof ServiceQuerySchema>;
