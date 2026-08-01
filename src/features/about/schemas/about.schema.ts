import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
export const CreateAboutSchema = z.object({
  key: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed")
    .max(50)
    .default("main"),
  title: z.string().min(1, "Title is required").max(200),
  shortDesc: z.string().optional().nullable(),
  contentJson: z.any().optional().nullable(),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  galleryImages: z.array(z.string()).default([]),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
});
export const UpdateAboutSchema = CreateAboutSchema.partial();
export const AboutQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["createdAt_desc", "createdAt_asc", "title_asc", "title_desc"])
    .default("createdAt_desc"),
  status: z.nativeEnum(Status).optional(),
});
export type CreateAboutSchemaType = z.infer<typeof CreateAboutSchema>;
export type UpdateAboutSchemaType = z.infer<typeof UpdateAboutSchema>;
export type AboutQuerySchemaType = z.infer<typeof AboutQuerySchema>;
