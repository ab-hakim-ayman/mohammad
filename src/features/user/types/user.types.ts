import type { z } from "zod";
import type {
  CreateUserSchema,
  UpdateUserSchema,
  InviteUserSchema,
  UpdateUserRoleSchema,
  UpdateUserStatusSchema,
  UserQuerySchema,
  UserProfileSchema,
} from "../schemas/user.schema";
import type { AccountStatus, UserRole } from "@/shared/types";
export type CreateUserPayload = z.infer<typeof CreateUserSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>;
export type InviteUserPayload = z.infer<typeof InviteUserSchema>;
export type UpdateUserRolePayload = z.infer<typeof UpdateUserRoleSchema>;
export type UpdateUserStatusPayload = z.infer<typeof UpdateUserStatusSchema>;
export type UserQueryValidated = z.infer<typeof UserQuerySchema>;
export type UserProfilePayload = z.infer<typeof UserProfileSchema>;
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  role?: UserRole;
  status?: AccountStatus;
}
export interface UserProfileRecord {
  id: string;
  userId: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  designation: string | null;
  experienceYears: number | null;
  skills: Array<{ id: string; title: string; icon: string | null }>;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfileRecord | null;
}
export interface UserInvitationRecord {
  id: string;
  email: string;
  token: string;
  role: UserRole;
  invitedById: string | null;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}
export interface PasswordResetTokenRecord {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}
export interface PublicTeamProfileRecord {
  id: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  designation: string | null;
  experienceYears: number | null;
  skills: Array<{ id: string; title: string; icon: string | null }>;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    role: UserRole;
  };
}
