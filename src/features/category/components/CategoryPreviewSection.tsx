"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedCategories } from "../hooks/useCategory";
import type { Category } from "../types/category.types";
import { CategoryCard } from "./CategoryCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface CategoryPreviewSectionProps {
  limit?: number;
  items?: Category[];
  categories?: Category[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function CategoryPreviewSection({
  limit = 4,
  items: externalItems,
  categories: legacyCategories,
  eyebrow = "Categories",
  title = "Explore by Domain & Scope",
  description = "Organized categories spanning engineering, architecture, and technology domains.",
  href = "/categories",
  ctaLabel = "All categories",
  hideHeader = false,
  className,
}: CategoryPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyCategories;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedCategories();

  const finalData = useMemo(() => {
    if (initialItems) return initialItems;
    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Category[];
    return rawList;
  }, [initialItems, data]);

  return (
    <SectionEngine<Category>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={requestedLimit}
      columns={4}
      gap="default"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-36"
      className={className}
      header={
        !hideHeader ? (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        ) : undefined
      }
      renderCard={(category) => (
        <CategoryCard
          category={category}
          className="h-full w-full"
        />
      )}
    />
  );
}
