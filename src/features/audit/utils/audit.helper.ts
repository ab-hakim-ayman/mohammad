import { getRequestIP, getUserAgent } from "@/core/server/http/handler";
import { auditService } from "../services/audit.service";
import type { CurrentUser } from "@/core/server/security/auth";
import type { AuditAction } from "../types/audit.types";
export interface AuditEventInput {
  actor?: Pick<CurrentUser, "id"> | null;
  actorId?: string | null;
  request?: Request | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
}
export interface AuditTrailContext {
  actorId?: string | null;
  actor?: Pick<CurrentUser, "id"> | null;
  request?: Request | null;
}
export async function recordAuditEvent(input: AuditEventInput) {
  return auditService.safeCreate({
    actorId: input.actor?.id ?? input.actorId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    oldValues: input.oldValues ?? null,
    newValues: input.newValues ?? null,
    ipAddress: input.request ? getRequestIP(input.request) : null,
    userAgent: input.request ? getUserAgent(input.request) : null,
  });
}
