import I18n from "@/shared/components/I18n";
import { z } from "zod";
import { UserProfileSchema } from "@/features/user";
export const ProfileSchema = UserProfileSchema;
export const ProfileVisibilitySchema = z.object({
  isPublic: z.boolean().optional(),
});
const visibilityQueryValue = z
  .union([z.literal("true"), z.literal("false")])
  .optional()
  .transform((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  });
export const ProfileQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  isPublic: visibilityQueryValue,
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "fullName_asc",
      "fullName_desc",
      "designation_asc",
      "designation_desc",
      "experienceYears_asc",
      "experienceYears_desc",
    ])
    .default("createdAt_desc"),
});
export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
export type ProfileVisibilitySchemaType = z.infer<typeof ProfileVisibilitySchema>;
export type ProfileQuerySchemaType = z.infer<typeof ProfileQuerySchema>;
