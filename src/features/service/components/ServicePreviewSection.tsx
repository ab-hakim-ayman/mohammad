"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedServices } from "../hooks/useService";
import type { Service } from "../types/service.types";
import { ServiceCard } from "./ServiceCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface ServicePreviewSectionProps {
  limit?: number;
  items?: Service[];
  services?: Service[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function ServicePreviewSection({
  limit = 4,
  items: externalItems,
  services: legacyServices,
  eyebrow = "Services",
  title = "How we can help",
  description = "Explore the service pillars we use to shape reliable launches, faster iteration cycles, and cleaner product operations.",
  href = "/services",
  ctaLabel = "All services",
  hideHeader = false,
  className,
}: ServicePreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyServices;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedServices(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const finalData = useMemo(() => {
    if (initialItems) {
      return [...initialItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    const rawList = (data?.data?.data || (Array.isArray(data) ? data : [])) as Service[];
    return [...rawList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [initialItems, data]);

  return (
    <SectionEngine<Service>
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
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        ) : undefined
      }
      renderCard={(service) => (
        <ServiceCard
          service={service}
          className="h-full w-full"
        />
      )}
    />
  );
}