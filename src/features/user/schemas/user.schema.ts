import I18n from "@/shared/components/I18n";
import { z } from "zod";

import { emptyStringToNull } from "@/shared/utils/schema";
import { ACCOUNT_STATUSES, USER_ROLES } from "@/shared/types";
export const UserProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional().nullable(),
  headline: z.string().trim().max(180).optional().nullable(),
  bio: z.string().trim().max(5000).optional().nullable(),
  avatar: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  coverImage: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  designation: z.string().trim().max(120).optional().nullable(),
  experienceYears: z.coerce.number().int().min(0).optional().nullable(),
  skills: z.array(z.string().trim().min(1).max(120)).default([]),
  githubUrl: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  linkedinUrl: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  portfolioUrl: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  isPublic: z.boolean().default(false),

  avatarAlt: z.string().max(500).optional().nullable(),
  coverImageAlt: z.string().max(500).optional().nullable(),
});
export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().trim().min(2).max(120).optional().nullable(),
  avatar: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  phone: z.string().trim().min(3).max(30).optional().nullable(),
  role: z.enum(USER_ROLES).default("EMPLOYEE"),
  status: z.enum(ACCOUNT_STATUSES).default("INVITED"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().nullable(),
  profile: UserProfileSchema.optional(),

  avatarAlt: z.string().max(500).optional().nullable(),
  coverImageAlt: z.string().max(500).optional().nullable(),
});
export const UpdateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional().nullable(),
  avatar: z.preprocess(emptyStringToNull, z.string().trim().optional().nullable()),
  phone: z.string().trim().min(3).max(30).optional().nullable(),
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(ACCOUNT_STATUSES).optional(),
  isVerified: z.boolean().optional(),
  profile: UserProfileSchema.optional(),

  avatarAlt: z.string().max(500).optional().nullable(),
  coverImageAlt: z.string().max(500).optional().nullable(),
});
export const InviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(USER_ROLES),
  name: z.string().trim().min(2).max(120).optional().nullable(),
  phone: z.string().trim().min(3).max(30).optional().nullable(),
});
export const UpdateUserRoleSchema = z.object({ role: z.enum(USER_ROLES) });
export const UpdateUserStatusSchema = z.object({
  status: z.enum(ACCOUNT_STATUSES),
});
export const UserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "email_asc",
      "email_desc",
      "name_asc",
      "name_desc",
      "role_asc",
      "role_desc",
      "status_asc",
      "status_desc",
      "lastLoginAt_desc",
      "lastLoginAt_asc",
    ])
    .default("createdAt_desc"),
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(ACCOUNT_STATUSES).optional(),
});
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
export type InviteUserSchemaType = z.infer<typeof InviteUserSchema>;
export type UpdateUserRoleSchemaType = z.infer<typeof UpdateUserRoleSchema>;
export type UpdateUserStatusSchemaType = z.infer<typeof UpdateUserStatusSchema>;
export type UserQuerySchemaType = z.infer<typeof UserQuerySchema>;
