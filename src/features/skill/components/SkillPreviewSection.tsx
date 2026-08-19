"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { usePublishedSkills } from "../hooks/useSkill";
import type { Skill } from "../types/skill.types";
import { SkillCard } from "./SkillCard";

interface SkillPreviewSectionProps {
  limit?: number;
  items?: Skill[];
  skills?: Skill[]; // Legacy alias
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function SkillPreviewSection({
  limit = 16,
  items: externalItems,
  skills: legacySkills,
  eyebrow = "Skills",
  title = "Capabilities across the current delivery stack",
  description = "A curated selection of practical skills shaping our product, engineering, design, and delivery work.",
  href = "/skills",
  ctaLabel = "All skills",
  hideHeader = false,
  className,
}: SkillPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacySkills;
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedSkills(undefined, shouldFetch ? requestedLimit : undefined);

  // কাস্টম সর্টিং (order অনুযায়ী, তারপর টাইটেল)
  const processedData = useMemo(() => {
    const rawList = initialItems || (data?.data || (Array.isArray(data) ? data : []));
    if (!Array.isArray(rawList)) return [];

    return [...rawList]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title))
      .slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  return (
    <SectionEngine<Skill>
      data={processedData}
      isLoading={shouldFetch && isApiLoading}
      error={error}
      pageSize={requestedLimit}
      columns={6} // 👈 প্রিভিউ গ্রিডে ৬ কলাম
      gap="sm"
      showToolbar={false}    // 👈 প্রিভিউতে সার্চ/ফিল্টার টুলবার অফ
      showPagination={false} // 👈 প্রিভিউতে পেজিনেশন অফ
      hideEmptyState={true}  // 👈 ডেটা না থাকলে অটো হাইড
      skeletonHeightClassName="h-16"
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
      renderCard={(skill) => (
        <SkillCard
          skill={skill}
          size="sm"
          layout="horizontal"
          alignment="center"
          className="h-16 w-full rounded-lg"
        />
      )}
    />
  );
}