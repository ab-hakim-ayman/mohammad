import type { AuditLogRecord } from "../types/audit.types";
import I18n from "@/shared/components/I18n";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
function prettyJson(value: Record<string, unknown> | null, fallback: string) {
  if (!value) return fallback;
  return JSON.stringify(value, null, 2);
}
export interface AuditLogDetailProps {
  auditLog: AuditLogRecord;
}
export function AuditLogDetail({ auditLog }: AuditLogDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] 3xl:grid-cols-5 5xl:grid-cols-8">
      {" "}
      <div className="border-border bg-card ui-card-hover rounded-none sm:rounded-lg border p-6 shadow-xs">
        {" "}
        <h2 className="text-foreground text-lg font-semibold">
          <>
            <I18n>Log Details</I18n>
          </>
        </h2>{" "}
        <dl className="mt-4 space-y-4 text-sm">
          {" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>Action</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium">{auditLog.action}</dd>{" "}
          </div>{" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>Entity</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium">{auditLog.entityType}</dd>{" "}
          </div>{" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>Entity ID</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium">{auditLog.entityId || "—"}</dd>{" "}
          </div>{" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>User</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium">
              {auditLog.user?.name || auditLog.user?.email || "—"}
            </dd>{" "}
          </div>{" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>Timestamp</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium">
              {formatDate(auditLog.createdAt)}
            </dd>{" "}
          </div>{" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>IP Address</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium">{auditLog.ipAddress || "—"}</dd>{" "}
          </div>{" "}
          <div>
            {" "}
            <dt className="text-muted-foreground">
              <I18n>User Agent</I18n>
            </dt>
            <dd className="text-foreground mt-1 font-medium wrap-break-word">
              {auditLog.userAgent || "—"}
            </dd>{" "}
          </div>{" "}
        </dl>{" "}
      </div>{" "}
      <div className="space-y-6">
        {" "}
        <div className="border-border bg-card ui-card-hover rounded-none sm:rounded-lg border p-6 shadow-xs">
          {" "}
          <h2 className="text-foreground text-lg font-semibold">
            <>
              <I18n>Old Values</I18n>
            </>
          </h2>{" "}
          <pre className="bg-background text-foreground mt-4 overflow-auto rounded-xl p-4 text-xs leading-6">
            {prettyJson(auditLog.oldValues, "No values")}
          </pre>{" "}
        </div>{" "}
        <div className="border-border bg-card ui-card-hover rounded-none sm:rounded-lg border p-6 shadow-xs">
          {" "}
          <h2 className="text-foreground text-lg font-semibold">
            <>
              <I18n>New Values</I18n>
            </>
          </h2>{" "}
          <pre className="bg-background text-foreground mt-4 overflow-auto rounded-xl p-4 text-xs leading-6">
            {prettyJson(auditLog.newValues, "No values")}
          </pre>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
