import I18n from "@/shared/components/I18n";
import { Status, CategoryScope } from "@/shared/types/enums";

import { z } from "zod";
export const CreateCategorySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  scope: z.nativeEnum(CategoryScope),
  shortDesc: z.string().max(500).optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(Status).default(Status.DRAFT),
});
export const UpdateCategorySchema = CreateCategorySchema.partial();
export const CategoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "order_asc", "order_desc", "createdAt_desc", "createdAt_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  scope: z.nativeEnum(CategoryScope).optional(),
});
export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof UpdateCategorySchema>;
export type CategoryQuerySchemaType = z.infer<typeof CategoryQuerySchema>;
