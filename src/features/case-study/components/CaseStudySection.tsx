"use client";

import { useMemo } from "react";
import { usePublishedCaseStudies } from "../hooks/useCaseStudy";
import { CaseStudyCard } from "./CaseStudyCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { CaseStudy } from "../types/case-study.types";

export function CaseStudySection() {
  const { data, isLoading, error } = usePublishedCaseStudies();

  const caseStudies = useMemo<CaseStudy[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.data?.data || data.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const categories = new Set<string>();

    caseStudies.forEach((item) => {
      item.categories?.forEach((cat) => {
        if (cat.title) categories.add(cat.title);
      });
    });

    if (categories.size === 0) return [];

    return [
      {
        key: "categories",
        placeholder: "Category",
        options: Array.from(categories).map((c) => ({ label: c, value: c })),
      },
    ];
  }, [caseStudies]);

  return (
    <SectionEngine<CaseStudy>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter case studies by keyword..."
      filters={filters}
      renderCard={(item) => (
        <CaseStudyCard caseStudy={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
