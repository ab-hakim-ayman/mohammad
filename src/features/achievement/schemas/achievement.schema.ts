import { Status } from "@/shared/types/enums";
import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";

// ✅ Prisma Schema এর সাথে মিলিয়ে Native Zod Enum
export const AchievementTypeEnum = z.enum([
  "AWARD",
  "CERTIFICATION",
  "RECOGNITION",
  "MILESTONE",
  "OTHER",
]);

export const CreateAchievementSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),

  // ✅ প্রিজমা ছাড়া Zod enum ব্যবহার
  type: AchievementTypeEnum.default("AWARD"),

  issuer: z.string().min(2).max(150),
  achievedAt: z.preprocess(emptyStringToNull, z.coerce.date().optional().nullable()),
  shortDesc: z.string().max(2000).optional().nullable(),
  contentJson: z.any().optional().nullable(),
  icon: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  image: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  certificateUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  order: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(Status).default(Status.DRAFT),

  cardImageAlt: z.string().max(500).optional().nullable(),
  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  imageAlt: z.string().max(500).optional().nullable(),
  iconAlt: z.string().max(500).optional().nullable(),
});

export const UpdateAchievementSchema = CreateAchievementSchema.partial();

export const AchievementQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["title_asc", "title_desc", "order_asc", "order_desc", "createdAt_desc", "createdAt_asc"])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  type: AchievementTypeEnum.optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});

export type CreateAchievementSchemaType = z.infer<typeof CreateAchievementSchema>;
export type UpdateAchievementSchemaType = z.infer<typeof UpdateAchievementSchema>;
export type AchievementQuerySchemaType = z.infer<typeof AchievementQuerySchema>;