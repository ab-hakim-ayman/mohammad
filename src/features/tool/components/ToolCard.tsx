"use client";

import React from "react";
import { useLocale } from "next-intl";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";
import type { Tool } from "../types/tool.types";

interface ToolCardProps {
  tool: Tool;
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
}

function isImageLike(value: string | null | undefined) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value);
}

export function ToolCard({
  tool,
  className,
  size = "md",
  layout = "vertical",
}: ToolCardProps) {
  const locale = useLocale();

  return (
    <CardEngine
      data={tool}
      size={size}
      layout={layout}
      mediaPosition="top"
      shadow="md"
      className={cn(
        "border border-border/80 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
      config={{
        href: `/${locale}/tools/${tool.slug}`,
        titleKey: "title",
        getDescription: (item) =>
          item.shortDesc || "Client-side developer tool designed for high-performance workflow efficiency.",
        imageKey: isImageLike(tool.cardImage) ? "cardImage" : undefined,
        iconKey: isImageLike(tool.icon) ? "icon" : undefined,
        actionLabel: "Run Tool",
        getBadges: (item) => {
          const catTitles = item.categories?.map((c) => c.title) || [];
          const badges = catTitles.map((label) => ({ label }));
          if (item.engineType === "CUSTOM") {
            badges.push({ label: "Interactive" });
          }
          return badges;
        },
        getMetaItems: (item) => [
          {
            text:
              item.engineType === "CUSTOM"
                ? item.componentKey || "Custom Engine"
                : item.actionKey || "Schema Engine",
          },
        ],
      }}
    />
  );
}
