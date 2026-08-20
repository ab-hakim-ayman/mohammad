"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedGalleries } from "../hooks/useGallery";
import type { Gallery } from "../types/gallery.types";
import { GalleryCard } from "./GalleryCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface GalleryPreviewSectionProps {
  limit?: number;
  items?: Gallery[];
  galleries?: Gallery[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  cardVariant?: "classic" | "glassmorphic" | "brutalist" | "gradientGlow" | "banner";
  className?: string;
}

export function GalleryPreviewSection({
  limit = 4,
  items: externalItems,
  galleries: legacyGalleries,
  eyebrow = "Gallery",
  title = "Visual Highlights",
  description = "Explore snapshots of our latest innovations and events.",
  href = "/galleries",
  ctaLabel = "All galleries",
  hideHeader = false,
  cardVariant = "classic",
  className,
}: GalleryPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyGalleries;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedGalleries(
    shouldFetch ? { limit: requestedLimit } : undefined
  );

  const finalData = useMemo(() => {
    if (initialItems) {
      return [...initialItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Gallery[];
    return [...rawList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [initialItems, data]);

  return (
    <SectionEngine<Gallery>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={requestedLimit}
      columns={4}
      gap="default"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-[360px]"
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
      renderCard={(gallery) => (
        <GalleryCard
          gallery={gallery}
          variant={cardVariant}
          size="md"
          className="h-full w-full"
        />
      )}
    />
  );
}
