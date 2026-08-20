import { Status } from "@/shared/types/enums";
import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";

export const createToolSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  slug: z.string().max(100).optional().nullable(),
  shortDesc: z.string().max(500).optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
  icon: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  engineType: z.enum(["SCHEMA", "CUSTOM"]).default("SCHEMA"),
  actionKey: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  componentKey: z.preprocess(emptyStringToNull, z.string().optional().nullable()),

  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  galleryImages: z.array(z.string()).default([]),
  demoVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),

  seoTitle: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  seoDescription: z.preprocess(emptyStringToNull, z.string().optional().nullable()),

  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

export const updateToolSchema = createToolSchema.partial();

export const toolQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  categories: z.string().optional(),
  sort: z.enum(["title_asc", "title_desc", "order_asc", "createdAt_desc"]).default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
  engineType: z.enum(["SCHEMA", "CUSTOM"]).optional(),
});

export type CreateToolSchemaType = z.infer<typeof createToolSchema>;
export type UpdateToolSchemaType = z.infer<typeof updateToolSchema>;
export type ToolQuerySchemaType = z.infer<typeof toolQuerySchema>;
