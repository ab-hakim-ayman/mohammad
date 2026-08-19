"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { SkillRadarChart } from "./SkillRadarChart";
import { usePublishedSkills } from "../hooks/useSkill";
import type { Skill } from "../types/skill.types";

export interface SkillPreviewSectionProps {
  items?: Skill[];
  skills?: Skill[];
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

export function SkillPreviewSection({
  items: externalItems,
  skills: legacySkills,
  limit = 10,
  eyebrow = "Skills Overview",
  title = "At a glance",
  description = "A bird's-eye view of technical capabilities, system engineering stack, and architectural depth.",
  href = "/skills",
  ctaLabel = "Explore All Skills",
  hideHeader = false,
  headerVariant = "split",
  className,
}: SkillPreviewSectionProps) {
  const initialData = externalItems || legacySkills;
  const shouldFetch = !initialData;

  const { data: apiData, isLoading: isApiLoading, error } = usePublishedSkills();

  const rawData: Skill[] = useMemo(() => {
    if (initialData) return initialData;
    if (Array.isArray(apiData)) return apiData;
    return apiData?.data || [];
  }, [initialData, apiData]);

  const visibleData = useMemo(() => {
    return rawData.slice(0, limit);
  }, [rawData, limit]);

  const isLoading = shouldFetch && isApiLoading;

  return (
    <SectionEngine<Skill>
      data={visibleData}
      isLoading={isLoading}
      error={error}
      layout="chart"
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
      renderChart={(chartItems) => <SkillRadarChart skills={chartItems} />}
    />
  );
}