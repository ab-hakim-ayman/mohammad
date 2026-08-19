"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { SpecializationItem } from "./SpecializationItem";
import { usePublishedSpecializations } from "../hooks/useSpecialization";
import type { Specialization } from "../types/specialization.types";

export interface SpecializationPreviewSectionProps {
  items?: Specialization[];
  specializations?: Specialization[]; // Legacy prop support
  limit?: number;
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  headerVariant?: "split" | "center" | "stacked" | "minimal";
  className?: string;
}

export function SpecializationPreviewSection({
  items: externalItems,
  specializations: legacySpecializations,
  limit = 6,
  eyebrow = "Core Competencies",
  title = "What I bring to the table",
  description = "A deep dive into architecture decisions, security practices, and delivery across government and enterprise environments.",
  href = "/services",
  ctaLabel = "Explore All Competencies",
  hideHeader = false,
  headerVariant = "split",
  className,
}: SpecializationPreviewSectionProps) {
  const initialData = externalItems || legacySpecializations;
  const shouldFetch = !initialData;

  const { data: apiData, isLoading: isApiLoading, error } = usePublishedSpecializations();

  const rawData: Specialization[] = useMemo(() => {
    if (initialData) return initialData;
    if (Array.isArray(apiData)) return apiData;
    return (apiData as any)?.data || [];
  }, [initialData, apiData]);

  const visibleData = useMemo(() => {
    return rawData.slice(0, limit);
  }, [rawData, limit]);

  const isLoading = shouldFetch && isApiLoading;

  return (
    <SectionEngine<Specialization>
      data={visibleData}
      isLoading={isLoading}
      error={error}
      layout="accordion"
      accordionType="single"
      pageSize={limit}
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      className={className}
      header={
        !hideHeader ? (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
            variant={headerVariant}
          />
        ) : undefined
      }
      renderCard={(item) => (
        <SpecializationItem key={item.id} specialization={item} />
      )}
    />
  );
}