import { apiClient } from "@/shared/lib";
import type { AuditLogRecord, AuditLogQueryParams } from "../types/audit.types";
export const auditApi = {
  getAll: (params?: AuditLogQueryParams) =>
    apiClient.paginated<AuditLogRecord>("/api/admin/audit-logs", params),

  getById: (id: string) => apiClient.get<AuditLogRecord>(`/api/admin/audit-logs/${id}`),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/audit-logs/${id}`),
};
