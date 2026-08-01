"use client";

import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { PreviewSectionHeader } from "@/shared/components";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";
import { usePublishedProjects } from "../hooks/useProject";
import { Project } from "../types/project.types";

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

function truncateDescription(description: string | null | undefined, maxLength: number) {
  const cleanDescription = (description || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanDescription.length <= maxLength) {
    return cleanDescription;
  }

  return `${cleanDescription.slice(0, maxLength).trimEnd()}...`;
}

function isMediaUrl(value?: string | null) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value.trim());
}

function getProjectLabel(project: Project) {
  return project.client?.title?.trim() || "Project";
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
            {/* 🎯 React Key Undefined Error এড়াতে (_, index) ব্যবহার করা হয়েছে */}
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

        {/* 🔧 EXACT SAME CARD MATRIX & HOVER STYLES */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {projects.map((project, index) => {
            const technologies = project.technologies?.slice(0, 3) || [];
            const rawImage = project.cardImage?.trim();
            const imageUrl = rawImage && isMediaUrl(rawImage) ? rawImage : null;
            const projectHref = project.slug ? `/projects/${project.slug}` : "/projects";
            const imageAlt = (project as any).cardImageAlt || project.title;

            return (
              <article
                key={project.id ? String(project.id) : index}
                className="group border-border bg-card relative isolate z-0 h-[430px] w-full shrink-0 cursor-pointer overflow-hidden rounded-none border transition-all duration-500 ease-out focus-within:z-10 hover:z-10 sm:w-[calc(50%-12px)] sm:rounded-lg lg:w-[calc(33.333%-16px)] lg:focus-within:scale-[1.025] lg:focus-within:shadow-2xl lg:hover:scale-[1.025] lg:hover:shadow-2xl xl:w-[calc(25%-18px)]"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-all duration-700 ease-out motion-reduce:transition-none lg:group-focus-within:scale-105 lg:group-focus-within:opacity-0 lg:group-focus-within:blur-xs lg:group-hover:scale-105 lg:group-hover:opacity-0 lg:group-hover:blur-xs"
                  />
                ) : (
                  <div className="bg-surface-elevated/40 absolute inset-0 transition-all duration-700 ease-out lg:group-focus-within:scale-105 lg:group-focus-within:opacity-0 lg:group-focus-within:blur-xs lg:group-hover:scale-105 lg:group-hover:opacity-0 lg:group-hover:blur-xs" />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/85 transition-opacity duration-500 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0"
                />

                {!imageUrl ? (
                  <Sparkles className="text-background/20 absolute right-6 bottom-6 h-9 w-9 transition-opacity duration-500 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0" />
                ) : null}

                <div className="relative flex h-full flex-col p-6 sm:p-7">
                  <div>
                    <p className="lg:group-hover:text-muted-foreground lg:group-focus-within:text-muted-foreground text-xs font-semibold tracking-[0.18em] text-white/75 uppercase transition-colors duration-500">
                      {getProjectLabel(project)}
                    </p>

                    <h3 className="lg:group-hover:text-foreground lg:group-focus-within:text-foreground mt-5 text-2xl leading-[1.12] font-semibold tracking-[-0.045em] text-white transition-colors duration-500 sm:text-[1.7rem]">
                      {project.title}
                    </h3>
                  </div>

                  <div className="mt-auto">
                    <div className="transition-all duration-500 ease-out motion-reduce:transition-none lg:translate-y-6 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                      <p className="lg:group-hover:text-muted-foreground lg:group-focus-within:text-muted-foreground text-sm leading-6 text-white/80 transition-colors duration-500">
                        {truncateDescription(project.shortDesc, 155) ||
                          "Explore the project scope, delivery process, and outcomes behind this work."}
                      </p>

                      <div className="lg:group-hover:text-muted-foreground lg:group-focus-within:text-muted-foreground mt-4 flex flex-wrap gap-2 text-xs font-medium text-white/70 transition-colors duration-500">
                        {technologies.length ? (
                          technologies.map((technology, techIndex) => (
                            <span
                              key={technology.id ? String(technology.id) : techIndex}
                              className="lg:group-hover:border-border lg:group-focus-within:border-border rounded-xs border border-white/20 px-3 py-1 transition-colors duration-500"
                            >
                              {technology.title}
                            </span>
                          ))
                        ) : (
                          <span className="lg:group-hover:border-border lg:group-focus-within:border-border rounded-xs border border-white/20 px-3 py-1 transition-colors duration-500">
                            {project.isFeatured ? "Featured work" : "Case study"}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={projectHref}
                      className="group/expand lg:group-hover:text-foreground lg:group-focus-within:text-foreground focus-visible:ring-primary focus-visible:ring-offset-background mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white outline-hidden transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-4 lg:translate-y-4 lg:opacity-0 lg:group-focus-visible/expand:translate-y-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    >
                      <span className="relative">
                        <I18n>View project</I18n>
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/expand:scale-x-100 group-focus-visible/expand:scale-x-100" />
                      </span>

                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/expand:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}