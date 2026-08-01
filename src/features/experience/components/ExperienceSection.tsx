"use client";

import { useMemo } from "react";
import { usePublishedExperiences } from "../hooks/useExperience";
import { ExperienceCard } from "./ExperienceCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Experience } from "../types/experience.types";

export function ExperienceSection() {
  const { data, isLoading, error } = usePublishedExperiences();

  const experiences = useMemo<Experience[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return (data as any).data?.data || (data as any).data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    experiences.forEach((exp) => {
      if (exp.employmentType) {
        list.add(exp.employmentType);
      }
    });

    if (list.size === 0) return [];

    return [
      {
        key: "employmentType",
        placeholder: "Employment Type",
        options: Array.from(list).map((type) => ({
          label: type.replace("_", " "),
          value: type,
        })),
      },
    ];
  }, [experiences]);

  return (
    <SectionEngine<Experience>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="companyName"
      searchPlaceholder="Filter experiences by company..."
      filters={filters}
      renderCard={(experience) => (
        <ExperienceCard
          experience={experience}
          className="h-full w-full"
        />
      )}
    />
  );
}
