import { apiClient } from "@/shared/lib";
import { AcceptInvitePayload, AuthTokenVerification, ChangePasswordPayload, ForgotPasswordPayload, InviteUserPayload, LoginPayload, LoginResponse, ResetPasswordPayload, VerifyTokenPayload, AuthUser } from "../types/auth.types";

export const authApi = {
  login: (data: LoginPayload) => apiClient.post<LoginResponse>("/api/auth/login", data),
  logout: () => apiClient.post<null>("/api/auth/logout"),
  getMe: () => apiClient.get<{ user: AuthUser }>("/api/auth/me"),
  invite: (data: InviteUserPayload) =>
    apiClient.post<{ user: AuthUser; token: string; expiresAt: string }>("/api/auth/invite", data),
  acceptInvite: (data: AcceptInvitePayload) =>
    apiClient.post<LoginResponse>("/api/auth/accept-invite", data),
  forgotPassword: (data: ForgotPasswordPayload) =>
    apiClient.post<null>("/api/auth/forgot-password", data),
  resetPassword: (data: ResetPasswordPayload) =>
    apiClient.post<{ success: boolean }>("/api/auth/reset-password", data),
  changePassword: (data: ChangePasswordPayload) =>
    apiClient.post<{ success: boolean }>("/api/auth/change-password", data),
  verifyToken: (data: VerifyTokenPayload) =>
    apiClient.post<AuthTokenVerification>("/api/auth/verify-token", data),
};
