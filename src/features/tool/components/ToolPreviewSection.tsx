"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedTools } from "../hooks/useTool";
import type { Tool } from "../types/tool.types";
import { ToolCard } from "./ToolCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface ToolPreviewSectionProps {
  limit?: number;
  items?: Tool[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function ToolPreviewSection({
  limit = 6,
  items: externalItems,
  eyebrow = "Developer Utilities",
  title = "Interactive Developer Tools",
  description = "High-efficiency, zero-server-overhead developer utilities running directly in your browser.",
  href = "/tools",
  ctaLabel = "Explore All Tools",
  hideHeader = false,
}: ToolPreviewSectionProps) {
  const shouldFetch = !externalItems;

  const { data, isLoading, error } = usePublishedTools({
    limit: shouldFetch ? limit : undefined,
    featured: true,
  });

  const finalData = useMemo(() => {
    if (externalItems) return externalItems;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  }, [externalItems, data]);

  return (
    <SectionEngine<Tool>
      data={finalData}
      isLoading={shouldFetch && isLoading}
      error={error}
      pageSize={limit}
      layout="grid"
      columns={3}
      gap="default"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={false}
      skeletonHeightClassName="h-[220px]"
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
      renderCard={(tool) => <ToolCard key={tool.id} tool={tool} />}
    />
  );
}
