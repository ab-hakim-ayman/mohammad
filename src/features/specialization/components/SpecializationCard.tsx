import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface SpecializationCardProps {
  specialization: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    icon?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

function isImageLike(value: string | null | undefined) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value);
}

export function SpecializationCard({ specialization, className, size = "md", layout }: SpecializationCardProps) {
  return (
    <CardEngine
      data={specialization}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        descriptionKey: "shortDesc",
        imageKey: "icon",
        href: (item) => `/specializations/${item.slug}`,
        actionLabel: "Learn more",
        getBadges: (item) =>
          item.icon && !isImageLike(item.icon) && item.icon.length <= 3
            ? [{ label: item.icon }]
            : [],
      }}
    />
  );
}
