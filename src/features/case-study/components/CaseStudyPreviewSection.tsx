"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedCaseStudies } from "../hooks/useCaseStudy";
import type { CaseStudy } from "../types/case-study.types";
import { CaseStudyCard } from "./CaseStudyCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface CaseStudyPreviewSectionProps {
  limit?: number;
  items?: CaseStudy[];
  caseStudies?: CaseStudy[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function CaseStudyPreviewSection({
  limit = 4,
  items: externalItems,
  caseStudies: legacyCaseStudies,
  eyebrow = "Case Studies",
  title = "Success Stories",
  description = "Discover how we've helped businesses achieve their goals.",
  href = "/case-studies",
  ctaLabel = "All Case Studies",
  hideHeader = false,
  className,
}: CaseStudyPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyCaseStudies;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedCaseStudies(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const finalData = useMemo(() => {
    if (initialItems) return initialItems;
    const rawList = (data?.data?.data || (Array.isArray(data) ? data : [])) as CaseStudy[];
    return [...rawList].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }, [initialItems, data]);

  return (
    <SectionEngine<CaseStudy>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={requestedLimit}
      columns={4}
      gap="default"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-[430px]"
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
      renderCard={(caseStudy) => (
        <CaseStudyCard
          caseStudy={caseStudy}
          className="h-full w-full"
        />
      )}
    />
  );
}