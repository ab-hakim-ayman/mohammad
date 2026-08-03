import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    icon?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function SkillCard({ skill, className, size = "md", layout }: SkillCardProps) {
  return (
    <CardEngine
      data={skill}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      alignment="center"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        iconKey: "icon",
        href: (item) => `/skills/${item.id}`,
      }}
    />
  );
}
