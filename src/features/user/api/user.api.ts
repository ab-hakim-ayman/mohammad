import { apiClient } from "@/shared/lib";
import type { UserRole } from "@/shared/types";
import { UserQueryParams, CreateUserPayload, UpdateUserPayload, UpdateUserRolePayload, UpdateUserStatusPayload, UserRecord } from "../types/user.types";

export const userApi = {
  getAll: (params?: UserQueryParams) => apiClient.paginated<UserRecord>("/api/admin/users", params),

  getById: (id: string) => apiClient.get<UserRecord>(`/api/admin/users/${id}`),

  create: (data: CreateUserPayload) => apiClient.post<UserRecord>("/api/admin/users", data),

  update: (id: string, data: UpdateUserPayload) =>
    apiClient.patch<UserRecord>(`/api/admin/users/${id}`, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/users/${id}`),
  updateRole: (id: string, data: UpdateUserRolePayload) =>
    apiClient.patch<UserRecord>(`/api/admin/users/${id}/role`, data),
  updateStatus: (id: string, data: UpdateUserStatusPayload) =>
    apiClient.patch<UserRecord>(`/api/admin/users/${id}/status`, data),
  resendInvite: (id: string) =>
    apiClient.post<{ user: UserRecord; token: string; expiresAt: string }>(
      `/api/admin/users/${id}/resend-invite`
    ),
  invite: (data: { email: string; role: UserRole; name?: string | null; phone?: string | null }) =>
    apiClient.post<{ user: UserRecord; token: string; expiresAt: string }>(
      `/api/auth/invite`,
      data
    ),
  verifyToken: (data: { token: string; type?: "invitation" | "reset" }) =>
    apiClient.post<{
      valid: boolean;
      type: "invitation" | "reset" | null;
      email?: string | null;
      role?: UserRole | null;
      expiresAt?: string | null;
      acceptedAt?: string | null;
      usedAt?: string | null;
    }>(`/api/auth/verify-token`, data),
};
