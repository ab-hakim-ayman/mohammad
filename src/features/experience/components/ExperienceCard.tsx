import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";
import { Experience } from "../types/experience.types";

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
}

export function ExperienceCard({ experience, className, size = "md", layout }: ExperienceCardProps) {
  return (
    <CardEngine
      data={experience}
      size={size}
      layout={layout}
      mediaPosition="left"
      imageBleed="padded"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "companyName",
        descriptionKey: "shortDesc",
        imageKey: "logo",
        href: (item) => `/experiences/${item.id}`,
        actionLabel: "View Details",
        getMetaItems: (item) => {
          const items = [];
          if (item.position) {
            items.push({ text: item.position });
          }
          if (item.location) {
            items.push({ text: `${item.location} (${item.locationType || "Onsite"})` });
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
          if (item.employmentType) {
            badges.push({ label: item.employmentType.replace("_", " ") });
          }
          if (item.technologies) {
            item.technologies.slice(0, 3).forEach((tech) => {
              badges.push({ label: tech.title, href: `/technologies/${tech.id}` });
            });
          }
          return badges;
        },
      }}
    />
  );
}
