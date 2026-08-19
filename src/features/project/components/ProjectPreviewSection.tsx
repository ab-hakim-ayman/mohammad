"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedProjects } from "../hooks/useProject";
import type { Project } from "../types/project.types";
import { ProjectCard } from "./ProjectCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

interface ProjectPreviewSectionProps {
  limit?: number;
  featured?: boolean;
  items?: Project[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  className?: string;
}

export function ProjectPreviewSection({
  limit = 4,
  featured = true,
  items: externalItems,
  eyebrow = "Projects",
  title = "Selected project work across product and engineering",
  description = "Explore featured delivery stories in a cinematic preview surface, then open each project for the full case-study detail.",
  href = "/projects",
  ctaLabel = "All projects",
  hideHeader = false,
  className,
}: ProjectPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const shouldFetch = !externalItems;

  const { data: featuredData, isLoading: isFeaturedLoading } = usePublishedProjects(
    shouldFetch ? { page: 1, limit: requestedLimit, featured } : undefined
  );

  const { data: fallbackData, isLoading: isFallbackLoading } = usePublishedProjects(
    shouldFetch ? { page: 1, limit: Math.max(requestedLimit, 12) } : undefined
  );

  const projects = useMemo<Project[]>(() => {
    if (externalItems) {
      return externalItems.slice(0, requestedLimit);
    }

    const featuredProjects = (featuredData?.data?.data || []) as Project[];
    const fallbackProjects = (fallbackData?.data?.data || []) as Project[];

    if (!featured) {
      return fallbackProjects.slice(0, requestedLimit);
    }

    if (featuredProjects.length >= requestedLimit) {
      return featuredProjects.slice(0, requestedLimit);
    }

    const seenIds = new Set<string>();

    return [...featuredProjects, ...fallbackProjects]
      .filter((project) => {
        if (seenIds.has(project.id)) return false;
        seenIds.add(project.id);
        return true;
      })
      .slice(0, requestedLimit);
  }, [externalItems, fallbackData?.data?.data, featured, featuredData?.data?.data, requestedLimit]);

  const isLoading = shouldFetch && (featured ? isFeaturedLoading || isFallbackLoading : isFallbackLoading);

  return (
    <SectionEngine<Project>
      data={projects}
      isLoading={isLoading}
      pageSize={requestedLimit}
      columns={4}
      gap="default"
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      skeletonHeightClassName="h-[430px]"
      className={className}
      header={
        !hideHeader ? (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        ) : undefined
      }
      renderCard={(project) => (
        <ProjectCard
          project={project}
          className="h-full w-full"
        />
      )}
    />
  );
}