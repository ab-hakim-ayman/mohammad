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
    const clients = new Set<string>();
    const techs = new Set<string>();

    caseStudies.forEach((item) => {
      if (item.project?.client?.title) {
        clients.add(item.project.client.title);
      }
      item.project?.technologies?.forEach((tech) => {
        if (tech.title) {
          techs.add(tech.title);
        }
      });
    });

    const configs = [];

    if (clients.size > 0) {
      configs.push({
        key: "project.client.title",
        placeholder: "Client",
        options: Array.from(clients).map((c) => ({ label: c, value: c })),
      });
    }

    if (techs.size > 0) {
      configs.push({
        key: "project.technologies",
        placeholder: "Technology",
        options: Array.from(techs).map((t) => ({ label: t, value: t })),
      });
    }

    return configs;
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
