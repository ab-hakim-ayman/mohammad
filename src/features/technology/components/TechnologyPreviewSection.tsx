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

  const finalData = useMemo(() => {
    if (initialItems) return initialItems;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  }, [initialItems, data]);

  return (
    <SectionEngine<Technology>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={limit}
      layout="flex"
      gap="sm"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-8"
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
      renderChip={(technology) => (
        <TechnologyChip
          technology={technology}
          variant="default"
          size="default"
          showLogo={false}
        />
      )}
    />
  );
}