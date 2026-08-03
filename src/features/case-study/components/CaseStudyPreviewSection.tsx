"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedCaseStudies } from "../hooks/useCaseStudy";
import { CaseStudy } from "../types/case-study.types";
import { CaseStudyCard } from "./CaseStudyCard"; // 👈 আপনার তৈরি করা CaseStudyCard ইমপোর্ট করা হলো

const sectionVariants = cva(
  "relative w-full transition-all duration-300 border overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-background text-foreground border-border shadow-2xs",
        glassmorphic:
          "bg-background/80 text-foreground backdrop-blur-md border-border shadow-xs",
        minimal: "bg-transparent text-foreground border-0 shadow-none py-0",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const containerVariants = cva("container-custom flex flex-col justify-center items-center", {
  variants: {
    size: {
      sm: "py-8",
      default: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface CaseStudyPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
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
  limit = 8,
  items: externalItems,
  caseStudies: legacyCaseStudies,
  eyebrow = "Case Studies",
  title = "Success Stories",
  description = "Discover how we've helped businesses achieve their goals.",
  href = "/case-studies",
  ctaLabel = "Check All Industries",
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
      <section className={cn("w-full overflow-x-hidden", sectionVariants({ variant }))}>
        <div className={containerVariants({ size })}>
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
    <section className={cn("w-full overflow-x-hidden", sectionVariants({ variant }))}>
      <div className={containerVariants({ size })}>
        {!hideHeader && (
          <PreviewSectionHeader
            variant="center"
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