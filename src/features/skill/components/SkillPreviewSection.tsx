"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedSkills } from "../hooks/useSkill";
import type { Skill } from "../types/skill.types";
import { SkillCard } from "./SkillCard";

const sectionVariants = cva("relative w-full transition-all duration-500 overflow-hidden", {
  variants: {
    variant: {
      classic: "bg-transparent",
      glassmorphic: "bg-transparent",
      brutalist: "bg-transparent",
      "gradient-glow": "bg-transparent",
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

const containerVariants = cva(
  "container-custom mx-auto w-full flex flex-col justify-center items-center text-center"
);

interface SkillPreviewSectionProps
  extends VariantProps<typeof sectionVariants> {
  limit?: number;

  // 🟢 ১. কাস্টম স্কিল ডাটা পাস করার প্রপ্স
  items?: Skill[];
  skills?: Skill[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function SkillPreviewSection({
  limit = 16,
  items: externalItems,
  skills: legacySkills,
  eyebrow = "Skills",
  title = "Capabilities across the current delivery stack",
  description = "A curated selection of practical skills shaping our product, engineering, design, and delivery work.",
  href = "/skills",
  ctaLabel = "All skills",
  hideHeader = false,
  variant,
  size,
}: SkillPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacySkills;

  // 🎯 বাইর থেকে items/skills পাস করা থাকলে API ফেচ স্কিপ হবে
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedSkills(undefined, shouldFetch ? requestedLimit : undefined);

  const skills = useMemo<Skill[]>(() => {
    if (initialItems) {
      return [...initialItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title))
        .slice(0, requestedLimit);
    }

    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Skill[];
    return [...rawList]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title))
      .slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={cn("bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6", sectionVariants({ variant, size }))}>
        <div className={cn(containerVariants())}>
          {!hideHeader && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Skeleton className="h-5 w-28 self-center rounded" />
              <Skeleton className="h-11 w-full max-w-2xl self-center rounded" />
            </div>
          )}
          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {Array.from({ length: Math.min(requestedLimit, 8) }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-40 sm:w-44 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা কোনো স্কিল ডাটা না থাকলে সেকশনটি অটোমেটিক হাইড থাকবে
  if ((shouldFetch && error) || skills.length === 0) return null;

  return (
    <section
      className={cn(
        "bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6",
        sectionVariants({ variant, size })
      )}
    >
      <div className={containerVariants()}>
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
              variant="split"
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </div>
        )}

        {/* 🟢 FULL WIDTH GRID MATRIX */}
        <div className="mx-auto mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:mt-14 md:grid-cols-4 lg:mt-16 lg:grid-cols-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id ? String(skill.id) : index}
              size="sm"
              layout="horizontal"
              alignment="center"
              skill={skill}
              className="h-16 w-full rounded-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
}