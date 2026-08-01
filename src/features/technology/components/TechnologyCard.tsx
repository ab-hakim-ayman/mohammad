import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface TechnologyCardProps {
  technology: {
    title: string;
    logo?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function TechnologyCard({ technology, className, size = "md", layout }: TechnologyCardProps) {
  return (
    <CardEngine
      data={technology}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        logoKey: "logo",
        href: (item) => `/technologies/${item.title}`,
        actionLabel: "View details",
      }}
    />
  );
}
