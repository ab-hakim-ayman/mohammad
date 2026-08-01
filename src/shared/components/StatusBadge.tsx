"use client";

import { cn } from "@/lib/utils";
import { enumLabel } from "@/shared/utils/enum-label";

export type StatusType =
  | "PUBLISHED"
  | "ACTIVE"
  | "DRAFT"
  | "PENDING"
  | "ARCHIVED"
  | "INACTIVE"
  | "REJECTED"
  | "DELETED"
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showDot?: boolean;
}

interface StatusConfig {
  badge: string;
  dot: string;
  pulse?: boolean;
}

const statusStyleMap: Record<string, StatusConfig> = {
  // 🟢 Success Statuses
  PUBLISHED: {
    badge: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
    pulse: true,
  },
  ACTIVE: {
    badge: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
    pulse: true,
  },

  // 🟡 Warning / Draft Statuses
  DRAFT: {
    badge: "bg-muted/80 text-muted-foreground border-border/80",
    dot: "bg-muted-foreground/60",
  },
  PENDING: {
    badge: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
    pulse: true,
  },

  // ⚪ Neutral / Muted Statuses
  ARCHIVED: {
    badge: "bg-muted/80 text-muted-foreground border-border/80",
    dot: "bg-muted-foreground/60",
  },
  INACTIVE: {
    badge: "bg-muted/80 text-muted-foreground border-border/80",
    dot: "bg-muted-foreground/60",
  },

  // 🔴 Error / Danger Statuses
  REJECTED: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  DELETED: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
};

const defaultStyleConfig: StatusConfig = {
  badge: "bg-muted/80 text-muted-foreground border-border/80",
  dot: "bg-muted-foreground/60",
};

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const normalizedStatus = (status || "").toUpperCase();
  const config = statusStyleMap[normalizedStatus] || defaultStyleConfig;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs backdrop-blur-md transition-all select-none sm:text-[11px]",
        config.badge,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          {config.pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                config.dot
              )}
            />
          )}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dot)} />
        </span>
      )}
      <span>{enumLabel(status)}</span>
    </span>
  );
}
