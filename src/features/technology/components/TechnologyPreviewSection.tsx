"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedTechnologies } from "../hooks/useTechnology";
import type { Technology } from "../types/technology.types";
import { TechnologyChip } from "./TechnologyChip";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface TechnologyPreviewSectionProps {
  limit?: number;
  items?: Technology[];
  technologies?: Technology[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

interface GroupedCategory {
  id: string;
  category: string;
  items: Technology[];
}

export function TechnologyPreviewSection({
  limit = 24,
  items: externalItems,
  technologies: legacyTechnologies,
  eyebrow = "Tech Stack",
  title = "Tools I work with",
  description = "Technologies and platforms used across production systems — selected for reliability, not trends.",
  href = "/technologies",
  ctaLabel = "All technologies",
  hideHeader = false,
}: TechnologyPreviewSectionProps) {
  const initialItems = externalItems || legacyTechnologies;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedTechnologies(
    undefined,
    shouldFetch ? limit : undefined
  );

  // ১. এপিআই ডাটা আনর‌্যাপ করা
  const rawData = useMemo<Technology[]>(() => {
    if (initialItems) return initialItems;
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res?.data?.data || res?.data || [];
  }, [initialItems, data]);

  // ২. item.categories অনুযায়ী ক্যাটাগরিভিত্তিক গ্রুপিং
  const groupedCategories = useMemo<GroupedCategory[]>(() => {
    if (!rawData.length) return [];

    const map = new Map<string, Technology[]>();

    rawData.forEach((tech: any) => {
      // যদি categories অ্যারে থাকে
      if (Array.isArray(tech.categories) && tech.categories.length > 0) {
        tech.categories.forEach((cat: any) => {
          const catTitle = cat?.title || cat?.name;
          if (catTitle) {
            const categoryName = String(catTitle).trim();
            if (!map.has(categoryName)) {
              map.set(categoryName, []);
            }
            map.get(categoryName)!.push(tech);
          }
        });
      } else {
        // ফলব্যাক: যদি categories অ্যারে না থাকে
        const fallbackCat =
          tech.category?.title ||
          tech.category?.name ||
          (typeof tech.category === "string" ? tech.category : "Other");

        const categoryName = String(fallbackCat).trim();
        if (!map.has(categoryName)) {
          map.set(categoryName, []);
        }
        map.get(categoryName)!.push(tech);
      }
    });

    return Array.from(map.entries()).map(([category, items]) => ({
      id: category,
      category,
      items,
    }));
  }, [rawData]);

  return (
    <SectionEngine<GroupedCategory>
      data={groupedCategories}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={groupedCategories.length || 10}
      layout="list"
      gap="lg"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-20"
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
      renderListItem={(group) => (
        <div key={group.id} className="space-y-3">
          <h3 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            {group.category}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {group.items.map((tech) => (
              <TechnologyChip
                key={`${group.category}-${tech.id || tech.title}`}
                technology={tech}
                variant="default"
                size="default"
                showLogo={false}
              />
            ))}
          </div>
        </div>
      )}
    />
  );
}