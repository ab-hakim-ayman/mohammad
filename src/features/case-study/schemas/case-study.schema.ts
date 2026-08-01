import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";
import { z } from "zod";

import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateCaseStudySchema = z.object({
  title: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDesc: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  seoTitle: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  seoDescription: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  ogImage: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  contentJson: z.preprocess((v) => {
    if (!v) return null;
    if (typeof v === "object" && Object.keys(v).length === 0) return null;
    return v;
  }, richContentDocumentSchema.optional().nullable()),
  cardImage: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  heroImage: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  heroVideoUrl: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  galleryImages: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string()).default([])),
  demoVideoUrl: z.preprocess((v) => (v === "" ? null : v), z.string().optional().nullable()),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  projectId: z.string().min(1, "Project ID is required"),
  testimonialIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),

  cardImageAlt: z.string().max(500).optional().nullable(),
  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
});

export const UpdateCaseStudySchema = CreateCaseStudySchema.partial();

export const CaseStudyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "createdAt_desc", "createdAt_asc", "featured_desc"])
    .default("createdAt_desc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});

export type CreateCaseStudySchemaType = z.infer<typeof CreateCaseStudySchema>;
export type UpdateCaseStudySchemaType = z.infer<typeof UpdateCaseStudySchema>;
export type CaseStudyQuerySchemaType = z.infer<typeof CaseStudyQuerySchema>;
