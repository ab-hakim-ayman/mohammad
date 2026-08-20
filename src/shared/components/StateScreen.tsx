"use client";

import type { ReactNode } from "react";
import { AlertCircle, FileSearch, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type StateScreenType = "loading" | "notFound" | "error";
export type StateScreenVariant =
  | "classic"
  | "glassmorphic"
  | "brutalist"
  | "gradientGlow"
  | "minimal";

interface StateScreenProps {
  state?: StateScreenType;
  variant?: StateScreenVariant;
  title?: string;
  description?: string;
  detail?: string | null;
  code?: string;
  actions?: ReactNode;
  compact?: boolean;
  className?: string;
}

const typeConfig = {
  error: {
    badge: "text-destructive border-destructive/20 bg-destructive/10",
    dot: "bg-destructive shadow-xs",
    icon: AlertCircle,
    defaultTitle: "System Error Occurred",
    defaultDesc: "We encountered an unexpected issue while processing this request.",
  },
  loading: {
    badge: "text-primary border-primary/20 bg-primary/10",
    dot: "bg-primary shadow-xs",
    icon: Loader2,
    defaultTitle: "Loading Workspace...",
    defaultDesc: "Fetching operational records and context details.",
  },
  notFound: {
    badge: "text-muted-foreground border-border bg-muted/50",
    dot: "bg-muted-foreground/60",
    icon: FileSearch,
    defaultTitle: "Resource Not Found",
    defaultDesc: "The requested entity or record does not exist or has been relocated.",
  },
} as const;

export function StateScreen({
  state = "loading",
  variant = "classic",
  title,
  description,
  detail,
  code,
  actions,
  compact = false,
  className,
}: StateScreenProps) {
  const config = typeConfig[state];
  const IconComponent = config.icon;

  const finalTitle = title || config.defaultTitle;
  const finalDescription = description || config.defaultDesc;

  return (
    <section
      className={cn(
        "flex w-full items-center justify-center transition-all",
        compact ? "py-8" : "min-h-[60vh] px-4 py-16",
        className
      )}
    >
      <div className="w-full max-w-2xl">
        <div
          className={cn(
            "border-border/80 bg-card relative w-full overflow-hidden rounded-2xl border p-6 text-center shadow-xs sm:p-8 sm:text-left md:p-10",
            variant === "glassmorphic" && "border-border/40 bg-card/80 shadow-lg",
            variant === "minimal" && "border-0 bg-transparent p-0 shadow-none",
            variant === "brutalist" &&
            "border-border bg-background shadow-brutal rounded-none border-2"
          )}
        >
          {/* Vercel Glow Radial Gradient */}
          {variant === "gradientGlow" && (
            <div
              className="bg-primary/10 pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
              aria-hidden="true"
            />
          )}

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Status Icon Container */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div
                className={cn(
                  "border-border/80 bg-muted/40 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-2xs",
                  state === "error" && "border-destructive/20 bg-destructive/10 text-destructive",
                  state === "loading" && "border-primary/20 bg-primary/10 text-primary"
                )}
              >
                {code ? (
                  <span className="font-mono text-base font-black tracking-tight">{code}</span>
                ) : (
                  <IconComponent className={cn("h-6 w-6", state === "loading" && "animate-spin")} />
                )}
              </div>

              {/* Status Badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase select-none",
                  config.badge
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                <span>{state}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                {finalTitle}
              </h2>

              <p className="text-muted-foreground max-w-lg text-xs leading-relaxed sm:text-sm">
                {finalDescription}
              </p>

              {/* Extra Debug / Detail Info Box */}
              {detail && (
                <div className="border-border/60 bg-muted/30 text-muted-foreground mt-3 rounded-xl border p-3 text-left font-mono text-xs break-all">
                  {detail}
                </div>
              )}

              {/* Action Buttons */}
              {actions && (
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 sm:justify-start">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}