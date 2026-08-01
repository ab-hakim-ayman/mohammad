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
    const clients = new Set<string>();
    const techs = new Set<string>();

    projects.forEach((item) => {
      if (item.client?.title) {
        clients.add(item.client.title);
      }
      item.technologies?.forEach((tech) => {
        if (tech.title) {
          techs.add(tech.title);
        }
      });
    });

    const configs = [];

    if (clients.size > 0) {
      configs.push({
        key: "client.title",
        placeholder: "Client",
        options: Array.from(clients).map((c) => ({ label: c, value: c })),
      });
    }

    if (techs.size > 0) {
      configs.push({
        key: "technologies",
        placeholder: "Technology",
        options: Array.from(techs).map((t) => ({ label: t, value: t })),
      });
    }

    return configs;
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
