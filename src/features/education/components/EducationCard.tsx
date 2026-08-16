import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";
import { Education } from "../types/education.types";

interface EducationCardProps {
  education: Education;
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
}

export function EducationCard({ education, className, size = "md", layout }: EducationCardProps) {
  return (
    <CardEngine
      data={education}
      size={size}
      layout={layout}
      mediaPosition="left"
      imageBleed="padded"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "institution",
        descriptionKey: "shortDesc",
        imageKey: "logo",
        href: (item: any) => `/educations/${item.slug || item.id}`,
        actionLabel: "View Details",
        getMetaItems: (item) => {
          const items = [];
          if (item.degree) {
            items.push({ text: item.fieldOfStudy ? `${item.degree} in ${item.fieldOfStudy}` : item.degree });
          }
          if (item.grade) {
            items.push({ text: `Grade: ${item.grade}` });
          }
          const start = new Date(item.startDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          const end = item.isCurrent
            ? "Present"
            : item.endDate
            ? new Date(item.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "";
          items.push({ text: `${start} - ${end}` });
          return items;
        },
        getBadges: (item) => {
          const badges = [];
          if (item.certificateUrl) {
            badges.push({ label: "Certificate Available", href: item.certificateUrl });
          }
          return badges;
        },
      }}
    />
  );
}
