"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedTags } from "../hooks/useTag";
import type { Tag } from "../types/tag.types";
import { TagCard } from "./TagCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface TagPreviewSectionProps {
  limit?: number;
  items?: Tag[];
  tags?: Tag[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function TagPreviewSection({
  limit = 6,
  items: externalItems,
  tags: legacyTags,
  eyebrow = "Tags",
  title = "Topics & Technologies",
  description = "Browse content, code samples, and articles grouped by technical tags.",
  href = "/tags",
  ctaLabel = "All tags",
  hideHeader = false,
  className,
}: TagPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyTags;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedTags();

  const finalData = useMemo(() => {
    if (initialItems) return initialItems;
    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Tag[];
    return rawList;
  }, [initialItems, data]);

  return (
    <SectionEngine<Tag>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={requestedLimit}
      columns={6}
      gap="sm"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-16"
      className={className}
      header={
        !hideHeader ? (
          <PreviewSectionHeader
            variant="split"
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        ) : undefined
      }
      renderCard={(tag) => (
        <TagCard
          tag={tag}
          size="sm"
          className="h-full w-full"
        />
      )}
    />
  );
}
