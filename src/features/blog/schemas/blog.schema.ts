import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  contentJson: richContentDocumentSchema.optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  galleryImages: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string()).default([])),
  demoVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  readTime: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined || Number.isNaN(Number(val))
        ? null
        : Number(val),
    z.number().int().min(1).max(60).optional().nullable()
  ),
  status: z.nativeEnum(Status).default(Status.DRAFT),

  isFeatured: z.boolean().default(false),

  // Alt text fields for media sync — request-only, not stored in DB
  heroImageAlt: z.string().max(500).optional().nullable(),
  cardImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});
export const UpdateBlogSchema = CreateBlogSchema.partial();
export const BlogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["createdAt_desc", "createdAt_asc", "title_asc", "title_desc", "publishedAt_desc"])
    .default("createdAt_desc"),
  status: z.nativeEnum(Status).optional(),

  isFeatured: z.coerce.boolean().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});
export type CreateBlogSchemaType = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogSchemaType = z.infer<typeof UpdateBlogSchema>;
export type BlogQuerySchemaType = z.infer<typeof BlogQuerySchema>;
