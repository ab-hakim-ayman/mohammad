"use client";

import { useMemo } from "react";
import { usePublishedEducations } from "../hooks/useEducation";
import { EducationCard } from "./EducationCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Education } from "../types/education.types";

export function EducationSection() {
  const { data, isLoading, error } = usePublishedEducations();

  const educations = useMemo<Education[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return (data as any).data?.data || (data as any).data || [];
  }, [data]);

  return (
    <SectionEngine<Education>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="institution"
      searchPlaceholder="Filter educations by institution..."
      filters={[]}
      renderCard={(education) => (
        <EducationCard
          education={education}
          className="h-full w-full"
        />
      )}
    />
  );
}
