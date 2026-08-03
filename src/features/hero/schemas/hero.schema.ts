import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
const HeroBaseSchema = z.object({
  key: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed")
    .max(50)
    .default("main"),
  title: z.string().min(1, "Title is required").max(200),
  shortDesc: z.string().max(500).optional().nullable(),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ctaText: z.string().max(100).optional().nullable(),
  ctaLink: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  secondaryCtaText: z.string().max(100).optional().nullable(),
  secondaryCtaLink: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  isActive: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),

  heroImageAlt: z.string().max(500).optional().nullable(),
});
export const CreateHeroSchema = HeroBaseSchema.superRefine((data, ctx) => {
  if (data.isActive && data.status !== "PUBLISHED") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Hero must be PUBLISHED before it can be set as Active",
      path: ["isActive"],
    });
  }
});
export const UpdateHeroSchema = HeroBaseSchema.partial().superRefine((data, ctx) => {
  if (data.isActive && data.status !== "PUBLISHED") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Hero must be PUBLISHED before it can be set as Active",
      path: ["isActive"],
    });
  }
});
export const HeroQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["createdAt_desc", "createdAt_asc", "title_asc", "title_desc"])
    .default("createdAt_desc"),
  status: z.nativeEnum(Status).optional(),
  isActive: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});
export type CreateHeroSchemaType = z.infer<typeof CreateHeroSchema>;
export type UpdateHeroSchemaType = z.infer<typeof UpdateHeroSchema>;
export type HeroQuerySchemaType = z.infer<typeof HeroQuerySchema>;
