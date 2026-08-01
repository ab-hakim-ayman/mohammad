import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
export const CreateTagSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  shortDesc: z.string().max(500).optional().nullable(),
  status: z.nativeEnum(Status).default(Status.DRAFT),
});
export const UpdateTagSchema = CreateTagSchema.partial();
export const TagQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(["title_asc", "title_desc", "createdAt_desc", "createdAt_asc"]).default("title_asc"),
  status: z.nativeEnum(Status).optional(),
});
export type CreateTagSchemaType = z.infer<typeof CreateTagSchema>;
export type UpdateTagSchemaType = z.infer<typeof UpdateTagSchema>;
export type TagQuerySchemaType = z.infer<typeof TagQuerySchema>;
