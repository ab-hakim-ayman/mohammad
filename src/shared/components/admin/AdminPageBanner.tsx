"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminPageBannerProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  eyebrow?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageBanner({
  title,
  description,
  icon: Icon,
  eyebrow,
  badges,
  actions,
  className,
}: AdminPageBannerProps) {
  return (
    <div
      className={cn(
        "w-full space-y-4 border-b border-border/60 pb-5 select-none",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left Side: Icon & Titles */}
        <div className="flex items-start gap-3.5 min-w-0">
          {Icon && (
            <div className="bg-primary/10 text-primary border-primary/20 shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border shadow-2xs">
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}

          <div className="space-y-0.5 min-w-0">
            {/* Eyebrow Label */}
            {eyebrow && (
              <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
                {eyebrow}
              </p>
            )}

            {/* Title & Badges Inline Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl break-words">
                {title}
              </h1>
              {badges && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {badges}
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-muted-foreground max-w-3xl text-xs leading-relaxed pt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Banner Action Controls */}
        {actions && (
          <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}