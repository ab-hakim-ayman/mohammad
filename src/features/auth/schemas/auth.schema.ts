import { z } from "zod";

import { ACCOUNT_STATUSES, USER_ROLES } from "@/shared/types";
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export const InviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(USER_ROLES),
  name: z.string().min(2).max(120).optional().nullable(),
  phone: z.string().min(3).max(30).optional().nullable(),
});
export const AcceptInviteSchema = z
  .object({
    token: z.string().min(10, "Invitation token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    name: z.string().min(2).max(120).optional().nullable(),
    phone: z.string().min(3).max(30).optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(10, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const VerifyTokenSchema = z.object({
  token: z.string().min(10, "Token is required"),
  type: z.enum(["invitation", "reset"]).optional(),
});
export const AuthStatusSchema = z.enum(ACCOUNT_STATUSES);
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type InviteUserSchemaType = z.infer<typeof InviteUserSchema>;
export type AcceptInviteSchemaType = z.infer<typeof AcceptInviteSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
export type VerifyTokenSchemaType = z.infer<typeof VerifyTokenSchema>;
