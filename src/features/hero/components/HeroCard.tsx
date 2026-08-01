import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface HeroCardProps {
  hero: {
    id: string;
    title: string;
    shortDesc?: string | null;
    heroImage?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function HeroCard({ hero, className, size = "md", layout }: HeroCardProps) {
  return (
    <CardEngine
      data={hero}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        descriptionKey: "shortDesc",
        imageKey: "heroImage",
        href: (item) => `/heroes/${item.id}`,
        actionLabel: "View details",
      }}
    />
  );
}
