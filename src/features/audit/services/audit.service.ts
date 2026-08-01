import I18n from "@/shared/components/I18n";
import { logger } from "@/core/logger/logger";
import { AppError } from "@/core/server/http/errors";
import { auditRepository } from "../repositories/audit.repository";
import { CreateAuditLogSchema, AuditLogQuerySchema } from "../schemas/audit.schema";
import type { AuditLogFilters, CreateAuditLogInput } from "../types/audit.types";
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "authToken",
  "accessToken",
  "refreshToken",
  "inviteToken",
  "resetToken",
  "authorization",
  "cookie",
  "secret",
  "hash",
]);
function sanitizeValue(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (depth > 4) return "[Truncated]";
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, depth + 1));
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, item]) => {
      if (SENSITIVE_KEYS.has(key)) return [key, "[Redacted]"];
      return [key, sanitizeValue(item, depth + 1)];
    });
    return Object.fromEntries(entries);
  }
  return value;
}
function sanitizeAuditPayload(data: CreateAuditLogInput): CreateAuditLogInput {
  return {
    ...data,
    oldValues: data.oldValues ? (sanitizeValue(data.oldValues) as Record<string, unknown>) : null,
    newValues: data.newValues ? (sanitizeValue(data.newValues) as Record<string, unknown>) : null,
  };
}
export const auditService = {
  async getAll(filters: AuditLogFilters) {
    const validated = AuditLogQuerySchema.parse(filters);
    return auditRepository.findAll(validated as AuditLogFilters);
  },
  async getById(id: string) {
    const auditLog = await auditRepository.findById(id);
    if (!auditLog) throw AppError.notFound("Audit log not found");
    return auditLog;
  },
  async create(data: CreateAuditLogInput) {
    const validated = CreateAuditLogSchema.parse(data);
    return auditRepository.create(sanitizeAuditPayload(validated));
  },
  async safeCreate(data: CreateAuditLogInput) {
    try {
      return await this.create(data);
    } catch (error) {
      logger.error("Failed to create audit log", error, {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
      });
      return null;
    }
  },
  async delete(id: string) {
    return auditRepository.delete(id);
  },
};
