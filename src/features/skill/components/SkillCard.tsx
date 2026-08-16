import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  skill: {
    id: string;
    slug?: string | null;
    title: string;
    icon?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  alignment?: "start" | "center" | "right";
  variant?: any;
}

export function SkillCard({
  skill,
  className,
  size = "md",
  layout = "vertical",
  alignment = "center",
}: SkillCardProps) {
  return (
    <CardEngine
      data={skill}
      size={size}
      layout={layout}
      alignment={alignment}
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        iconKey: "icon",
        href: (item: any) => `/skills/${item.slug || item.id}`,
      }}
    />
  );
}