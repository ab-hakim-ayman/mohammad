import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";
import { z } from "zod";

import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  shortDesc: z.string().optional().nullable(),
  contentJson: richContentDocumentSchema.optional().nullable(),
  cardImage: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  heroImage: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  heroVideoUrl: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  galleryImages: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string()).default([])),
  demoVideoUrl: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  ogImage: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  githubUrl: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  liveUrl: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  startDate: z.preprocess((v) => (v === "" ? null : v), z.coerce.date().optional().nullable()),
  endDate: z.preprocess((v) => (v === "" ? null : v), z.coerce.date().optional().nullable()),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),

  // Alt text fields for media sync — request-only, not stored in DB
  heroImageAlt: z.string().max(500).optional().nullable(),
  cardImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
  order: z.coerce.number().int().min(0).default(0),
  clientId: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  industryId: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  technologyIds: z.array(z.string()).default([]),
  serviceIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const ProjectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "title_asc",
      "title_desc",
      "order_asc",
      "startDate_desc",
    ])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
  technology: z.string().optional(),
  clientId: z.string().optional(),
  industryId: z.string().optional(),
  serviceId: z.string().optional(),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof UpdateProjectSchema>;
export type ProjectQuerySchemaType = z.infer<typeof ProjectQuerySchema>;
