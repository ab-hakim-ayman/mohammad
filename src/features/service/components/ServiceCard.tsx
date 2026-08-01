import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    heroImage?: string | null;
    icon?: string | null;
  };
  description?: string;
  detailHref?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

function isImageLike(value: string | null | undefined) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value);
}

export function ServiceCard({
  service,
  description,
  detailHref,
  actionHref,
  actionLabel,
  className,
  size = "md",
  layout,
}: ServiceCardProps) {
  return (
    <CardEngine
      data={service}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: actionHref || detailHref || `/services/${service.slug}`,
        titleKey: "title",
        getDescription: (item) => description || item.shortDesc || "",
        imageKey: "heroImage",
        actionLabel: actionLabel || "View details",
        getBadges: (item) =>
          item.icon && !isImageLike(item.icon) && item.icon.length <= 3
            ? [{ label: item.icon }]
            : [],
      }}
    />
  );
}
