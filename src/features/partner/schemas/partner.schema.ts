import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";

export const CreatePartnerSchema = z.object({
  title: z.string().min(2).max(120),
  logo: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  website: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  shortDesc: z.string().max(500).optional().nullable(),
  type: z.enum(["TECHNOLOGY", "RESELLER", "ALLIANCE", "AFFILIATE"]).default("TECHNOLOGY"),
  order: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(Status).default(Status.DRAFT),

  logoAlt: z.string().max(500).optional().nullable(),
});
export const UpdatePartnerSchema = CreatePartnerSchema.partial();
export const PartnerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "order_asc", "order_desc", "createdAt_desc", "createdAt_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  type: z.enum(["TECHNOLOGY", "RESELLER", "ALLIANCE", "AFFILIATE"]).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});
export type CreatePartnerSchemaType = z.infer<typeof CreatePartnerSchema>;
export type UpdatePartnerSchemaType = z.infer<typeof UpdatePartnerSchema>;
export type PartnerQuerySchemaType = z.infer<typeof PartnerQuerySchema>;
