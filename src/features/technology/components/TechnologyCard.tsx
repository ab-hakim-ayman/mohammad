import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface TechnologyCardProps {
  technology: {
    id?: string;
    slug?: string;
    title: string;
    logo?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  alignment?: "start" | "center" | "right";
  variant?: any;
}

export function TechnologyCard({
  technology,
  className,
  size = "md",
  layout = "vertical",
  alignment = "center",
}: TechnologyCardProps) {
  return (
    <CardEngine
      data={technology}
      size={size}
      layout={layout}
      alignment={alignment}
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        logoKey: "logo",
        href: (item: any) => `/technologies/${item.slug || item.id || item.title}`,
      }}
    />
  );
}