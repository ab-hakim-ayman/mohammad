import I18n from "@/shared/components/I18n";
import { z } from "zod";
import { AUDIT_ACTIONS, type AuditAction } from "../types/audit.types";
const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") return undefined;
    return value;
  });
export const AuditLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: optionalString,
  actorId: optionalString,
  action: z.enum(AUDIT_ACTIONS as unknown as [AuditAction, ...AuditAction[]]).optional(),
  entityType: optionalString,
  entityId: optionalString,
  from: optionalString,
  to: optionalString,
  sort: z.enum(["createdAt_desc", "createdAt_asc"]).default("createdAt_desc"),
});
export const CreateAuditLogSchema = z.object({
  actorId: z.string().trim().optional().nullable(),
  action: z.enum(AUDIT_ACTIONS as unknown as [AuditAction, ...AuditAction[]]),
  entityType: z.string().trim().min(1).max(120),
  entityId: z.string().trim().optional().nullable(),
  oldValues: z.record(z.string(), z.unknown()).optional().nullable(),
  newValues: z.record(z.string(), z.unknown()).optional().nullable(),
  ipAddress: z.string().trim().optional().nullable(),
  userAgent: z.string().trim().optional().nullable(),
});
export type AuditLogQuerySchemaType = z.infer<typeof AuditLogQuerySchema>;
export type CreateAuditLogSchemaType = z.infer<typeof CreateAuditLogSchema>;
