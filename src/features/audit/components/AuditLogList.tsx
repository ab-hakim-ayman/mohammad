"use client";
import { useMemo } from "react";
import type { AuditLogRecord } from "../types/audit.types";
import I18n from "@/shared/components/I18n";

export interface AuditLogListProps {
  auditLogs: AuditLogRecord[];
  onSelect?: (id: string) => void;
}
function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
export function AuditLogList({ auditLogs, onSelect }: AuditLogListProps) {
  const rows = useMemo(() => auditLogs, [auditLogs]);
  return (
    <div className="border-border bg-card ui-card-hover overflow-hidden rounded-none sm:rounded-lg border p-0 shadow-xs">
      {" "}
      <div className="overflow-x-auto">
        <table className="border-border min-w-full divide-y">
          <thead>
            <tr>
              <th>
                <>
                  <I18n>Action</I18n>
                </>
              </th>{" "}
              <th>
                <>
                  <I18n>Entity</I18n>
                </>
              </th>{" "}
              <th>
                <>
                  <I18n>User</I18n>
                </>
              </th>
              <th>
                <>
                  <I18n>Date & Time</I18n>
                </>
              </th>
              <th className="text-right">
                <I18n>Actions</I18n>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((log) => (
              <tr key={log.id}>
                <td>
                  <span className="border-border bg-muted/50 text-foreground inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
                    {" "}
                    {log.action}{" "}
                  </span>
                </td>
                <td>
                  <div className="text-foreground font-medium">{log.entityType}</div>{" "}
                  <div className="text-muted-foreground text-xs">{log.entityId || "—"}</div>
                </td>
                <td>
                  <div className="text-foreground font-medium">
                    {log.user?.name || log.user?.email || "—"}
                  </div>{" "}
                  <div className="text-muted-foreground text-xs">{log.ipAddress || "—"}</div>
                </td>
                <td className="text-foreground text-sm">{formatDate(log.createdAt)}</td>
                <td className="text-right">
                  {onSelect ? (
                    <button
                      type="button"
                      className="border-border bg-surface-elevated text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-none sm:rounded-xl border px-4 py-3 text-sm font-semibold shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => onSelect(log.id)}
                    >
                      {" "}
                      <I18n>View</I18n>{" "}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "}
    </div>
  );
}
