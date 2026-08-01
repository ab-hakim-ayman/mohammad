import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import type { AuditLogRecord } from "../types/audit.types";
import { enumLabel } from "@/shared/utils/enum-label";

const actionColorMap: Record<string, string> = {
  CREATE: "bg-success/10 text-success border-success/20",
  UPDATE: "bg-warning/10 text-warning border-warning/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
};

export const auditLogTableColumns: ColumnConfig<AuditLogRecord>[] = [
  {
    key: "action",
    header: "Action",
    render: (item) => {
      const colorClass = actionColorMap[item.action] || "bg-muted text-muted-foreground";
      return (
        <span
          className={`${colorClass} inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wider uppercase`}
        >
          {enumLabel(item.action)}
        </span>
      );
    },
  },
  {
    key: "user",
    header: "Actor",
    render: (item) => {
      const actor = item.user;
      if (!actor) return <span className="text-muted-foreground/40">—</span>;
      return (
        <Link
          href={`/admin/users/${actor.id}`}
          className="text-primary hover:text-primary/80 text-xs font-semibold underline-offset-2 hover:underline"
        >
          {actor.name || actor.email}
        </Link>
      );
    },
  },
  {
    key: "entity",
    header: "Target",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground/80 text-xs font-medium">{item.entityType}</span>
        <span className="text-muted-foreground font-mono text-[10px]">{item.entityId}</span>
      </div>
    ),
  },
  {
    key: "ipAddress",
    header: "IP Address",
    type: "text",
  },
  {
    key: "userAgent",
    header: "User Agent",
    type: "text",
  },
  {
    key: "createdAt",
    header: "Timestamp",
    type: "datetime",
    sortable: true,
  },
];
