import I18n from "@/shared/components/I18n";
import { z } from "zod";
const mediaProviderValues = ["CLOUDINARY"] as const;
const mediaResourceTypeValues = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"] as const;
const mediaUsageTypeValues = [
  "LOGO",
  "FAVICON",
  "HERO",
  "HERO_VIDEO",
  "BANNER",
  "COVER",
  "CARD",
  "OG_IMAGE",
  "GALLERY",
  "AVATAR",
  "THUMBNAIL",
  "VIDEO",
  "DOCUMENT",
  "INLINE",
  "OTHER",
] as const;
const mediaEntityTypeValues = [
  "SITE_INFO",
  "ABOUT",
  "HERO",
  "PROFILE",
  "BLOG",
  "PROJECT",
  "CASE_STUDY",
  "SERVICE",
  "SPECIALIZATION",
  "ACHIEVEMENT",
  "GALLERY",
  "GALLERY_ITEM",
  "TECHNOLOGY",
  "SKILL",
  "CATEGORY",
  "TAG",
  "TESTIMONIAL",
] as const;
export const MediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "resourceType_asc",
      "resourceType_desc",
      "filename_asc",
      "filename_desc",
    ])
    .optional(),
  provider: z.enum(mediaProviderValues).optional(),
  resourceType: z.enum(mediaResourceTypeValues).optional(),
  folder: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  isArchived: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
});
export const MediaUpdateSchema = z.object({
  altText: z
    .string()
    .trim()
    .max(250)
    .nullish()
    .transform((value) => value || null),
  folder: z
    .string()
    .trim()
    .max(250)
    .nullish()
    .transform((value) => value || null),
  isArchived: z.boolean().optional(),
});
export const MediaAttachmentSchema = z.object({
  entityType: z.enum(mediaEntityTypeValues),
  entityId: z.string().trim().min(1),
  fieldName: z.string().trim().min(1).max(100).default("default"),
  usageType: z.enum(mediaUsageTypeValues).default("OTHER"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isPrimary: z.coerce.boolean().default(false),
  altText: z
    .string()
    .trim()
    .max(500)
    .nullish()
    .transform((value) => value || null),
});
export const MediaUploadMetaSchema = z.object({
  folder: z
    .string()
    .trim()
    .max(250)
    .nullish()
    .transform((value) => value || null),
  altText: z
    .string()
    .trim()
    .max(250)
    .nullish()
    .transform((value) => value || null),
  entityType: z
    .enum(mediaEntityTypeValues)
    .nullish()
    .transform((value) => value || null),
  entityId: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || null),
  fieldName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .nullish()
    .transform((value) => value || "default"),
  usageType: z.enum(mediaUsageTypeValues).default("OTHER"),
  isPrimary: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
export type MediaQuerySchemaType = z.infer<typeof MediaQuerySchema>;
export type MediaUpdateSchemaType = z.infer<typeof MediaUpdateSchema>;
export type MediaAttachmentSchemaType = z.infer<typeof MediaAttachmentSchema>;
export type MediaUploadMetaSchemaType = z.infer<typeof MediaUploadMetaSchema>;
export type MediaProviderValue = (typeof mediaProviderValues)[number];
export type MediaResourceTypeValue = (typeof mediaResourceTypeValues)[number];
export type MediaUsageTypeValue = (typeof mediaUsageTypeValues)[number];
