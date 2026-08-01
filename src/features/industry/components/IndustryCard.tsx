import React from "react";
import { Briefcase, Layers } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface IndustryCardProps {
  industry: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    cardImage?: string | null;
    _count?: {
      services: number;
      projects: number;
    } | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function IndustryCard({ industry, className, size = "md", layout }: IndustryCardProps) {
  return (
    <CardEngine
      data={industry}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        descriptionKey: "shortDesc",
        imageKey: "cardImage",
        href: (item) => `/industries/${item.slug}`,
        actionLabel: "Explore",
        getMetaItems: (item) =>
          item._count
            ? [
                {
                  icon: <Layers className="h-3.5 w-3.5" />,
                  text: `${item._count.services} services`,
                },
                {
                  icon: <Briefcase className="h-3.5 w-3.5" />,
                  text: `${item._count.projects} projects`,
                },
              ]
            : [],
      }}
    />
  );
}
