import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
export const CreateGallerySchema = z.object({
  title: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDesc: z.string().max(500).optional().nullable(),
  contentJson: z.any().optional().nullable(),
  coverImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  order: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(Status).default(Status.DRAFT),

  coverImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
});
export const UpdateGallerySchema = CreateGallerySchema.partial();
export const CreateGalleryItemSchema = z.object({
  galleryId: z.string().min(1),
  title: z.string().min(2).max(150),
  shortDesc: z.string().max(500).optional().nullable(),
  image: z.string(),
  type: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
  videoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  thumbnail: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  order: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(Status).default(Status.DRAFT),

  imageAlt: z.string().max(500).optional().nullable(),
  thumbnailAlt: z.string().max(500).optional().nullable(),
});
export const UpdateGalleryItemSchema = CreateGalleryItemSchema.partial();
export const GalleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "order_asc", "order_desc", "createdAt_desc", "createdAt_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
});
export type CreateGallerySchemaType = z.infer<typeof CreateGallerySchema>;
export type UpdateGallerySchemaType = z.infer<typeof UpdateGallerySchema>;
export type CreateGalleryItemSchemaType = z.infer<typeof CreateGalleryItemSchema>;
export type UpdateGalleryItemSchemaType = z.infer<typeof UpdateGalleryItemSchema>;
export type GalleryQuerySchemaType = z.infer<typeof GalleryQuerySchema>;
