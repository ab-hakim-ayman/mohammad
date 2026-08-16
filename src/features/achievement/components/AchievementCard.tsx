import React from "react";
import { Award, CalendarDays } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  achievement: {
    id: string;
    slug?: string | null;
    title: string;
    issuer: string;
    achievedAt?: Date | string | null;
    shortDesc?: string | null;
    icon?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function AchievementCard({ achievement, className, size = "md", layout }: AchievementCardProps) {
  return (
    <CardEngine
      data={achievement}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: (item: any) => `/achievements/${item.slug || item.id}`,
        titleKey: "title",
        descriptionKey: "shortDesc",
        iconKey: "icon",
        actionLabel: "View details",
        getMetaItems: (item) => [
          {
            icon: <Award className="text-primary h-3.5 w-3.5" />,
            text: item.icon || "Achievement",
          },
          ...(item.achievedAt
            ? [
                {
                  icon: <CalendarDays className="h-3.5 w-3.5" />,
                  text: new Date(item.achievedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                },
              ]
            : []),
        ],
        getBadges: (item) => (item.issuer ? [{ label: item.issuer }] : []),
      }}
    />
  );
}
