import React from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    cardImage?: string | null;
    startsAt: Date | string;
    location?: string | null;
    isFree: boolean;
    format: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function EventCard({ event, className, size = "md", layout }: EventCardProps) {
  return (
    <CardEngine
      data={event}
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
        href: (item) => `/events/${item.slug}`,
        actionLabel: "View details",
        getMetaItems: (item) => [
          {
            icon: <CalendarDays className="text-primary h-3.5 w-3.5" />,
            text: new Date(item.startsAt).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          },
          ...(item.location
            ? [
                {
                  icon: <MapPin className="h-3.5 w-3.5" />,
                  text: item.location,
                },
              ]
            : []),
        ],
        getBadges: (item) => [
          ...(item.isFree ? [{ label: "Free" }] : []),
          ...(item.format ? [{ label: item.format }] : []),
        ],
      }}
    />
  );
}
