"use client";

import { useMemo } from "react";

import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedProjects } from "../hooks/useProject";
import { Project } from "../types/project.types";
import { ProjectCard } from "./ProjectCard";

interface ProjectPreviewSectionProps {
  limit?: number;
  featured?: boolean;

  // 🟢 ১. যেকোনো Details Page থেকে কাস্টম প্রজেক্ট অ্যারে পাস করার প্রপস
  items?: Project[];

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন এবং হাইড করার প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function ProjectPreviewSection({
  limit = 8,
  featured = true,
  items: externalItems,
  eyebrow = "Projects",
  title = "Selected project work across product and engineering",
  description = "Explore featured delivery stories in a cinematic preview surface, then open each project for the full case-study detail.",
  href = "/projects",
  ctaLabel = "All projects",
  hideHeader = false,
}: ProjectPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);

  // 🎯 যদি বাইর থেকে items না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !externalItems;

  const { data: featuredData, isLoading: isFeaturedLoading } = usePublishedProjects(
    shouldFetch ? { page: 1, limit: requestedLimit, featured } : undefined
  );

  const { data: fallbackData, isLoading: isFallbackLoading } = usePublishedProjects(
    shouldFetch ? { page: 1, limit: Math.max(requestedLimit, 12) } : undefined
  );

  const projects = useMemo<Project[]>(() => {
    // 🎯 বাইর থেকে সরাসরি items পাস করলে সেটি প্রাধান্য পাবে
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

  if (isLoading) {
    return (
      <section className="bg-background 3xl:py-32 5xl:py-40 relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="container-custom">
          {!hideHeader && (
            <div className="bg-surface-elevated/50 h-10 w-56 animate-pulse rounded-sm" />
          )}

          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {/* 🎯 React Key Undefined Error এড়াতে (_, index) ব্যবহার করা হয়েছে */}
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface-elevated/50 h-[430px] w-full shrink-0 animate-pulse rounded-none border sm:w-[calc(50%-12px)] sm:rounded-lg lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if (!projects.length) return null;

  return (
    <section className="bg-background 3xl:py-32 5xl:py-40 relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="container-custom">
        {/* 🎯 hideHeader = false হলেই কেবল হেডার দেখাবে */}
        {!hideHeader && (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        )}

        {/* 🔧 REUSABLE PROJECT CARD MATRIX */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {projects.map((project, index) => (
            <div
              key={project.id ? String(project.id) : index}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] flex"
            >
              <ProjectCard
                project={project}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}