import React from "react";
import { Layers3 } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface GalleryCardProps {
  gallery: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    coverImage?: string | null;
    items?: { id: string }[];
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function GalleryCard({ gallery, className, size = "md", layout }: GalleryCardProps) {
  return (
    <CardEngine
      data={gallery}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        descriptionKey: "shortDesc",
        imageKey: "coverImage",
        href: (item) => `/galleries/${item.slug}`,
        actionLabel: "View Collection",
        getMetaItems: (item) =>
          item.items && item.items.length > 0
            ? [
                {
                  icon: <Layers3 className="h-3.5 w-3.5" />,
                  text: `${item.items.length} Assets`,
                },
              ]
            : [],
      }}
    />
  );
}
