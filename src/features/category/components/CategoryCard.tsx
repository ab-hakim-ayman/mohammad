import React from "react";
import { FileText } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    title: string;
    slug: string;
    scope: string;
    shortDesc?: string | null;
    blogs?: { id: string }[];
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function CategoryCard({ category, className, size = "md", layout }: CategoryCardProps) {
  return (
    <CardEngine
      data={category}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "title",
        descriptionKey: "shortDesc",
        href: (item) => `/categories/${item.slug}`,
        actionLabel: "Browse",
        getBadges: (item) => [{ label: item.scope }],
        getMetaItems: (item) =>
          item.blogs && item.blogs.length > 0
            ? [
                {
                  icon: <FileText className="h-3.5 w-3.5" />,
                  text: `${item.blogs.length} blogs`,
                },
              ]
            : [],
      }}
    />
  );
}
