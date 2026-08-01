import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface CaseStudyCardProps {
  caseStudy: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    cardImage?: string | null;
    project?: {
      client?: { title: string } | null;
      industry?: { title: string } | null;
    } | null;
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

export function CaseStudyCard({
  caseStudy,
  description,
  detailHref,
  actionHref,
  actionLabel,
  className,
  size = "md",
  layout,
}: CaseStudyCardProps) {
  return (
    <CardEngine
      data={caseStudy}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: actionHref || detailHref || `/case-studies/${caseStudy.slug}`,
        titleKey: "title",
        imageKey: "cardImage",
        actionLabel: actionLabel || "View details",
        getDescription: (item) => description || item.shortDesc || "",
        getBadges: (item) =>
          item.project?.client?.title
            ? [{ label: item.project.client.title }]
            : item.project?.industry?.title
              ? [{ label: item.project.industry.title }]
              : [],
      }}
    />
  );
}
