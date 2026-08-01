import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface AboutCardProps {
  about: {
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

export function AboutCard({ about, className, size = "md", layout }: AboutCardProps) {
  return (
    <CardEngine
      data={about}
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
        href: (item) => `/about/${item.id}`,
        actionLabel: "View Details",
      }}
    />
  );
}
