import type { ApiResponseMeta } from "@/shared/types";
export const AUDIT_ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "PUBLISH",
  "UNPUBLISH",
  "ARCHIVE",
  "RESTORE",
  "FEATURE",
  "UNFEATURE",
  "LOGIN",
  "LOGOUT",
  "ROLE_CHANGE",
  "STATUS_CHANGE",
  "PASSWORD_CHANGE",
  "INVITE",
  "ACCEPT_INVITE",
  "RESET_PASSWORD",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLogUserRecord {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

export interface AuditLogRecord {
  id: string;
  actorId: string | null;
  user: AuditLogUserRecord | null;
  action: AuditAction;
  entityType: string | null;
  entityId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  actorId?: string;
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  from?: string;
  to?: string;
  sort?: "createdAt_desc" | "createdAt_asc";
}

export interface AuditLogListResponse {
  data: AuditLogRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AuditLogApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  errors?: any;
  meta?: ApiResponseMeta;
}

export interface CreateAuditLogInput {
  actorId?: string | null;
  action: AuditAction;
  entityType: string | null;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuditLogFilters extends AuditLogQueryParams {
  page: number;
  limit: number;
  sort: "createdAt_desc" | "createdAt_asc";
}
