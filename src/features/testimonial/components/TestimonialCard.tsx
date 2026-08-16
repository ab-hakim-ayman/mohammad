import React from "react";
import { Star } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    slug?: string | null;
    message: string;
    rating: number;
    authorName?: string | null;
    authorPosition?: string | null;
    authorImage?: string | null;
    isFeatured: boolean;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function TestimonialCard({ testimonial, className, size = "md", layout }: TestimonialCardProps) {
  return (
    <CardEngine
      data={testimonial}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "authorName",
        getDescription: (item) => `"${item.message}"`,
        imageKey: "authorImage",
        href: (item: any) => `/testimonials/${item.slug || item.id}`,
        actionLabel: "Details",
        getMetaItems: (item) => [
          ...(item.authorPosition
            ? [
                {
                  icon: <Star className="h-3.5 w-3.5" />,
                  text: item.authorPosition,
                },
              ]
            : []),
        ],
        getBadges: (item) => [
          {
            label: `${item.rating}/5`,
          },
          ...(item.isFeatured ? [{ label: "Featured" }] : []),
        ],
      }}
    />
  );
}
