import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
export const CreateSkillSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  shortDesc: z.string().max(500).optional().nullable(),
  icon: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  order: z.coerce.number().int().min(0).default(0),

  iconAlt: z.string().max(500).optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  profileIds: z.array(z.string()).default([]),
});
export const UpdateSkillSchema = CreateSkillSchema.partial();
export const SkillQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(["title_asc", "title_desc", "order_asc", "createdAt_desc"]).default("order_asc"),
  status: z.nativeEnum(Status).optional(),
});
export type CreateSkillSchemaType = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillSchemaType = z.infer<typeof UpdateSkillSchema>;
export type SkillQuerySchemaType = z.infer<typeof SkillQuerySchema>;
