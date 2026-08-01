"use client";

import { useMemo } from "react";
import { usePublishedAchievements } from "../hooks/useAchievement";
import { AchievementCard } from "./AchievementCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Achievement } from "../types/achievement.types";

export function AchievementSection() {
  const { data, isLoading, error } = usePublishedAchievements();

  const achievements = useMemo<Achievement[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const types = new Set<string>();
    const issuers = new Set<string>();

    achievements.forEach((item) => {
      if (item.type) types.add(item.type);
      if (item.issuer) issuers.add(item.issuer);
    });

    const configs = [];

    if (types.size > 0) {
      configs.push({
        key: "type",
        placeholder: "Type",
        options: Array.from(types).map((t) => ({ label: t.replace("_", " "), value: t })),
      });
    }

    if (issuers.size > 0) {
      configs.push({
        key: "issuer",
        placeholder: "Issuer",
        options: Array.from(issuers).map((i) => ({ label: i, value: i })),
      });
    }

    return configs;
  }, [achievements]);

  return (
    <SectionEngine<Achievement>
      data={data}
      isLoading={isLoading}
      error={error}
      searchPlaceholder="Filter achievements by keyword..."
      searchFields={(item) => [item.title, item.issuer, item.shortDesc || ""]}
      filters={filters}
      renderCard={(item) => (
        <AchievementCard achievement={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
