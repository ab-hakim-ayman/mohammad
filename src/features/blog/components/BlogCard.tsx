import React from "react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    readTime?: number | null;
    cardImage?: string | null;
    publishedAt?: Date | string | null;
    categories?: { title: string; slug: string }[];
    tags?: { title: string; slug: string }[];
    createdBy?: { name: string | null } | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function BlogCard({ blog, className, size = "md", layout }: BlogCardProps) {
  return (
    <CardEngine
      data={blog}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        // 1. Core mapping based on Blog model fields
        titleKey: "title",
        descriptionKey: "excerpt",
        imageKey: "cardImage",

        // 2. Dynamic route configuration
        href: (item) => `/blogs/${item.slug}`,
        actionLabel: "Read More",

        // 3. Meta items (Read Time & Published Date)
        getMetaItems: (item) => {
          const items = [];
          if (item.readTime) {
            items.push({ text: `${item.readTime} min read` });
          }
          if (item.publishedAt) {
            items.push({
              text: new Date(item.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            });
          }
          return items;
        },

        // 4. Badges mapping (Categories & Tags)
        getBadges: (item) => {
          const categoryBadges = item.categories?.map((cat) => ({
            label: cat.title,
            href: `/categories/${cat.slug}`,
          })) || [];

          const tagBadges = item.tags?.slice(0, 2).map((tag) => ({
            label: tag.title,
            href: `/tags/${tag.slug}`,
          })) || [];

          return [...categoryBadges, ...tagBadges];
        },
      }}
    />
  );
}