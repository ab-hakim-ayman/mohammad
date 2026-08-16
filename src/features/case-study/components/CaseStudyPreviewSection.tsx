"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedCaseStudies } from "../hooks/useCaseStudy";
import { CaseStudy } from "../types/case-study.types";
import { CaseStudyCard } from "./CaseStudyCard"; // 👈 আপনার তৈরি করা CaseStudyCard ইমপোর্ট করা হলো

const sectionVariants = cva("relative w-full transition-all duration-500 overflow-hidden", {
  variants: {
    variant: {
      classic: "bg-transparent",
      glassmorphic: "bg-transparent",
      minimal: "bg-transparent",
    },
    size: {
      sm: "py-6",
      default: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    variant: "classic",
    size: "default",
  },
});

const containerVariants = cva("container-custom mx-auto w-full flex flex-col justify-center items-center");

interface CaseStudyPreviewSectionProps
  extends VariantProps<typeof sectionVariants> {
  limit?: number;
  items?: CaseStudy[];
  caseStudies?: CaseStudy[]; // Legacy prop alias
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function CaseStudyPreviewSection({
  limit = 4,
  items: externalItems,
  caseStudies: legacyCaseStudies,
  eyebrow = "Case Studies",
  title = "Success Stories",
  description = "Discover how we've helped businesses achieve their goals.",
  href = "/case-studies",
  ctaLabel = "All Case Studies",
  hideHeader = false,
  variant,
  size,
}: CaseStudyPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyCaseStudies;

  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedCaseStudies(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const caseStudies = useMemo<CaseStudy[]>(() => {
    if (initialItems) {
      return [...initialItems].slice(0, requestedLimit);
    }

    const rawList = (data?.data?.data || (Array.isArray(data) ? data : [])) as CaseStudy[];
    return [...rawList]
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      .slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const loading = shouldFetch && isLoading;

  if (loading) {
    return (
      <section className={cn("bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6", sectionVariants({ variant, size }))}>
        <div className={containerVariants()}>
          {!hideHeader && (
            <div className="bg-surface-elevated/50 mb-10 h-10 w-56 animate-pulse rounded-none sm:rounded-lg" />
          )}

          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface-elevated/50 h-[430px] w-full shrink-0 animate-pulse rounded-none border sm:w-[calc(50%-12px)] sm:rounded-xl lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if ((shouldFetch && error) || caseStudies.length === 0) return null;

  return (
    <section className={cn("bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6", sectionVariants({ variant, size }))}>
      <div className={containerVariants()}>
        {!hideHeader && (
          <PreviewSectionHeader
            variant="split"
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        )}

        {/* 🔧 REUSABLE CASE STUDY CARD MATRIX */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {caseStudies.map((caseStudy, index) => (
            <div
              key={caseStudy.id ? String(caseStudy.id) : index}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] flex"
            >
              <CaseStudyCard
                caseStudy={caseStudy}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}