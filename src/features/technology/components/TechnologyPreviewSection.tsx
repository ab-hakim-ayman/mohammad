"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedTechnologies } from "../hooks/useTechnology";
import type { Technology } from "../types/technology.types";
import { TechnologyCard } from "./TechnologyCard";
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
  eyebrow = "Technologies",
  title = "Our technology capabilities",
  description = "We use a practical mix of proven platforms, modern frameworks, cloud tools, and quality practices to build dependable digital products.",
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
    return initialItems || data;
  }, [initialItems, data]);

  return (
    <SectionEngine<Technology>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={limit}
      columns={6}
      gap="sm"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-16"
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
      renderCard={(technology) => (
        <TechnologyCard
          technology={technology}
          size="sm"
          layout="horizontal"
          alignment="center"
          className="h-16 w-full rounded-lg"
        />
      )}
    />
  );
}