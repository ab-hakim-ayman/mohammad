import React from "react";
import { FileText } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface TagCardProps {
  tag: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    blogs?: { id: string }[];
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function TagCard({ tag, className, size = "md", layout }: TagCardProps) {
  return (
    <CardEngine
      data={tag}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: (item) => `/tags/${item.slug}`,
        getTitle: (item) => `#${item.title}`,
        titleKey: "title",
        descriptionKey: "shortDesc",
        actionLabel: "Browse",
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
