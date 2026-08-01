"use client";

import { useParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuditLog } from "@/features/audit";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { enumLabel } from "@/shared/utils/enum-label";

export default function ViewAuditLogPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useAuditLog(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading audit log" compact />;
  if (error) return <StateScreen state="error" title="Failed to load audit log" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Audit log not found" compact />;

  const auditLog = data.data;

  const item = {
    ...auditLog,
    title: `Audit Log - ${auditLog.id.slice(0, 8)}`,
  };

  const config: DetailEngineConfig<typeof item> = {
    titleKey: "title",
    subtitleKey: "action",
    headerIcon: ShieldAlert,
    eyebrow: "Security Telemetry",
    actions: {
      backHref: "/admin/audit-logs",
    },
    mainSections: [
      {
        title: "Log Specifications",
        fields: [
          { label: "ID", key: "id", type: "text", gridSpan: 12 },
          { label: "Action", key: "action", type: "text", gridSpan: 6, render: (rec) => enumLabel(rec.action) },
          { label: "Entity Type", key: "entityType", type: "text", gridSpan: 6, render: (rec) => rec.entityType ? enumLabel(rec.entityType) : "—" },
          { label: "Entity ID", key: "entityId", type: "text", gridSpan: 6 },
          { label: "Actor ID", key: "actorId", type: "text", gridSpan: 6 },
          { label: "IP Address", key: "ipAddress", type: "text", gridSpan: 6 },
          { label: "Timestamp", key: "createdAt", type: "datetime", gridSpan: 6 },
          {
            label: "Actor",
            key: "actor",
            type: "user",
            gridSpan: 12,
            render: (rec) =>
              (rec as any).actor?.name ||
              (rec as any).actor?.email ||
              "System / Anon",
          },
        ],
      },
      {
        title: "Client Metadata",
        fields: [
          {
            label: "User Agent",
            key: "userAgent",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <p className="text-foreground/90 bg-muted/20 border border-border rounded-lg p-4 font-mono text-xs leading-relaxed break-all">
                {item.userAgent || "—"}
              </p>
            ),
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Old Values",
        fields: [
          {
            label: "Previous Data State",
            key: "oldValues",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <pre className="bg-background/80 border border-border text-foreground/90 max-h-64 overflow-auto rounded-xl p-4 font-mono text-xs leading-relaxed shadow-inner">
                {item.oldValues ? JSON.stringify(item.oldValues, null, 2) : "No previous data available."}
              </pre>
            ),
          },
        ],
      },
      {
        title: "New Values",
        fields: [
          {
            label: "New Data State",
            key: "newValues",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <pre className="bg-background/80 border border-border text-foreground/90 max-h-64 overflow-auto rounded-xl p-4 font-mono text-xs leading-relaxed shadow-inner">
                {item.newValues ? JSON.stringify(item.newValues, null, 2) : "No new data recorded."}
              </pre>
            ),
          },
        ],
      },
    ],
  };

  return <DetailEngine data={item} config={config as any} />;
}
