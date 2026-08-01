import React from "react";
import { Briefcase, Star } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    cardImage?: string | null;
    isFeatured: boolean;
    client?: { title: string } | null;
    technologies?: { title: string }[];
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function ProjectCard({ project, className, size = "md", layout }: ProjectCardProps) {
  return (
    <CardEngine
      data={project}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: (item) => `/projects/${item.slug}`,
        titleKey: "title",
        descriptionKey: "shortDesc",
        imageKey: "cardImage",
        actionLabel: "View details",
        getMetaItems: (item) => [
          ...(item.client?.title
            ? [
                {
                  icon: <Briefcase className="h-3.5 w-3.5" />,
                  text: item.client.title,
                },
              ]
            : []),
          ...(item.isFeatured
            ? [
                {
                  icon: <Star className="fill-warning text-warning h-3.5 w-3.5" />,
                  text: "Featured",
                },
              ]
            : []),
        ],
        getBadges: (item) =>
          item.technologies?.slice(0, 4).map((t) => ({
            label: t.title,
          })) || [],
      }}
    />
  );
}
