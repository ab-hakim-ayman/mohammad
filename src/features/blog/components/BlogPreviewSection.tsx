"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { BlogCard } from "./BlogCard";
import { usePublishedBlogs } from "../hooks/useBlog";
import type { Blog } from "../types/blog.types";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface BlogPreviewSectionProps {
  limit?: number;
  featured?: boolean;
  items?: Blog[] | any[];
  blogs?: Blog[] | any[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function BlogPreviewSection({
  limit = 4,
  featured = false,
  items: externalItems,
  blogs: legacyBlogs,
  eyebrow = "Insights Engine",
  title = "Latest updates & engineering logs",
  description = "Practical knowledge, architectural workflows, and perspectives from our core architecture team.",
  href = "/blogs",
  ctaLabel = "All posts",
  hideHeader = false,
  className,
}: BlogPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyBlogs;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedBlogs(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const finalData = useMemo(() => {
    return initialItems || data;
  }, [initialItems, data]);

  return (
    <SectionEngine<Blog>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={requestedLimit}
      columns={4}
      gap="default"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-[380px]"
      className={className}
      header={
        !hideHeader ? (
          <PreviewSectionHeader
            variant="center"
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        ) : undefined
      }
      renderCard={(blog) => (
        <BlogCard
          blog={blog}
          variant="classic"
          layout="vertical"
          className="w-full shadow-xs"
        />
      )}
    />
  );
}