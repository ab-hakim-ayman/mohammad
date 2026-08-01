import type { z } from "zod";
import type {
  AcceptInviteSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  InviteUserSchema,
  LoginSchema,
  ResetPasswordSchema,
  VerifyTokenSchema,
} from "../schemas/auth.schema";
import type { AccountStatus, UserRole } from "@/shared/types";
export type LoginPayload = z.infer<typeof LoginSchema>;
export type InviteUserPayload = z.infer<typeof InviteUserSchema>;
export type AcceptInvitePayload = z.infer<typeof AcceptInviteSchema>;
export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;
export type VerifyTokenPayload = z.infer<typeof VerifyTokenSchema>;
export interface AuthProfile {
  id: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  designation: string | null;
  experienceYears: number | null;
  skills: Array<{
    id: string;
    title: string;
    icon: string | null;
  }>;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
  isVerified: boolean;
  lastLoginAt: Date | null;
  profile: AuthProfile | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface LoginResponse {
  user: AuthUser;
}
export interface ForgotPasswordResponse {
  success: boolean;
}
export interface AuthTokenVerification {
  valid: boolean;
  type: "invitation" | "reset" | null;
  email?: string | null;
  role?: UserRole | null;
  expiresAt?: Date | null;
  acceptedAt?: Date | null;
  usedAt?: Date | null;
}
