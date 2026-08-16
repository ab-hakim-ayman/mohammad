"use client";

import { useMemo } from "react";
import { usePublishedProjects } from "../hooks/useProject";
import { ProjectCard } from "./ProjectCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Project } from "../types/project.types";

export function ProjectSection() {
  const { data, isLoading, error } = usePublishedProjects();

  const projects = useMemo<Project[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.data?.data || data.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const categories = new Set<string>();

    projects.forEach((item) => {
      item.categories?.forEach((cat) => {
        if (cat.title) {
          categories.add(cat.title);
        }
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
  }, [projects]);

  return (
    <SectionEngine<Project>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter projects by keyword..."
      filters={filters}
      renderCard={(item) => (
        <ProjectCard project={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
