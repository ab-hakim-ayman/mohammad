"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedTechnologies } from "../hooks/useTechnology";
import type { Technology } from "../types/technology.types";
import { TechnologyCard } from "./TechnologyCard"; // 👈 আপনার তৈরি করা TechnologyCard ইমপোর্ট করা হলো

const sectionVariants = cva(
  "relative w-full container-custom transition-all duration-300 overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-background border-border shadow-2xs",
        glassmorphic: "bg-card/40 backdrop-blur-md border-border shadow-xs",
        brutalist: "bg-background border-3 border-foreground shadow-brutal rounded-none",
        "gradient-glow":
          "bg-background border-border shadow-glow-lg relative after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent",
        minimal: "bg-transparent border-0 shadow-none p-0",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const containerVariants = cva(
  "container-custom flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-8 md:py-12 lg:py-16 3xl:py-20 5xl:py-24",
        default: "py-12 md:py-16 lg:py-20 3xl:py-24 5xl:py-28",
        lg: "py-16 md:py-24 lg:py-28 3xl:py-32 5xl:py-36",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface TechnologyPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে কাস্টম টেকনোলজি অ্যারে পাস করার প্রপ্স
  items?: Technology[];
  technologies?: Technology[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function TechnologyPreviewSection({
  limit = 56,
  items: externalItems,
  technologies: legacyTechnologies,
  eyebrow = "Technologies",
  title = "Our technology capabilities",
  description = "We use a practical mix of proven platforms, modern frameworks, cloud tools, and quality practices to build dependable digital products.",
  href = "/technologies",
  ctaLabel = "All technologies",
  hideHeader = false,
  variant,
  size,
}: TechnologyPreviewSectionProps) {
  const safeLimit = Math.min(Math.max(limit, 1), 56);
  const initialItems = externalItems || legacyTechnologies;

  // 🎯 বাইর থেকে items/technologies পাস করা না থাকলে কেবল তখনই API ফেচ হবে
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedTechnologies(undefined, shouldFetch ? safeLimit : undefined);

  const technologies = useMemo<Technology[]>(() => {
    if (initialItems) {
      return [...initialItems].slice(0, safeLimit);
    }

    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Technology[];
    return [...rawList].slice(0, safeLimit);
  }, [initialItems, data, safeLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={sectionVariants({ variant })}>
        <div className={containerVariants({ size })}>
          {!hideHeader && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Skeleton className="h-5 w-28 self-center rounded" />
              <Skeleton className="h-11 w-full max-w-2xl self-center rounded" />
            </div>
          )}

          <div className="3xl:mt-20 5xl:mt-24 mt-10 flex w-full flex-wrap items-stretch justify-center gap-3 md:mt-14 lg:mt-16">
            {Array.from({ length: Math.min(safeLimit, 16) }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface-elevated/20 mx-auto flex h-[104px] w-[calc(50%-0.5rem)] max-w-[200px] flex-col items-center justify-center gap-3 rounded-none border p-4 sm:w-[calc(33.333%-0.85rem)] sm:rounded-lg md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.05rem)]"
              >
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা কোনো টেকনোলজি ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if ((shouldFetch && error) || technologies.length === 0) return null;

  return (
    <section
      className={cn(
        "relative isolate mx-auto w-full justify-center overflow-hidden",
        sectionVariants({ variant })
      )}
    >
      <div className={containerVariants({ size })}>
        <div
          aria-hidden="true"
          className="bg-primary/5 pointer-events-none absolute top-12 -left-28 h-64 w-64 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-primary/5 pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full blur-3xl"
        />

        {!hideHeader && (
          <div className="flex w-full flex-col items-center justify-center text-center">
            <PreviewSectionHeader
              variant="center"
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </div>
        )}

        {/* 🔧 REUSABLE TECHNOLOGY CARD MATRIX */}
        <div className="3xl:mt-20 5xl:mt-24 mx-auto mt-10 flex w-full flex-wrap items-stretch justify-center gap-3 md:mt-14 lg:mt-16">
          {technologies.map((technology, index) => (
            <div
              key={technology.id ? String(technology.id) : index}
              className="flex w-[calc(50%-0.5rem)] max-w-[200px] shrink-0 flex-col sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.05rem)]"
            >
              <TechnologyCard
                technology={technology}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}