import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";

export const CreateClientSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDesc: z.string().max(500).optional().nullable(),
  contentJson: z.any().optional().nullable(),
  logo: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  website: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  order: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(Status).default(Status.DRAFT),

  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  logoAlt: z.string().max(500).optional().nullable(),
});
export const UpdateClientSchema = CreateClientSchema.partial();
export const ClientQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "order_asc", "order_desc", "createdAt_desc", "createdAt_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.coerce.boolean().optional(),
});
export type CreateClientSchemaType = z.infer<typeof CreateClientSchema>;
export type UpdateClientSchemaType = z.infer<typeof UpdateClientSchema>;
export type ClientQuerySchemaType = z.infer<typeof ClientQuerySchema>;
