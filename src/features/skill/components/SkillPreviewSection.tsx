"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PreviewSectionHeader } from "@/shared/components";
import { Link } from "@/shared/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Marquee } from "@/components/ui/marquee";
import { usePublishedSkills } from "../hooks/useSkill";
import { Skill } from "../types/skill.types";

const sectionVariants = cva(
  "relative w-full transition-all duration-300 overflow-hidden flex justify-center items-center mx-auto",
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
  "container-custom flex flex-col justify-center items-center text-center",
  {
    variants: {
      size: {
        sm: "py-6",
        default: "py-10",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface SkillPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
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

function isImageLike(value: string | null | undefined) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value);
}

function getFallbackLabel(skill: Skill) {
  const rawIcon = skill.icon?.trim();
  if (rawIcon && !isImageLike(rawIcon) && rawIcon.length <= 3 && !/\s/.test(rawIcon)) {
    return rawIcon;
  }
  return (
    skill.title
      .split(/[\s./_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item.charAt(0).toUpperCase())
      .join("") || "S"
  );
}

function splitIntoRows(skills: Skill[]) {
  const middle = Math.ceil(skills.length / 2);
  return [skills.slice(0, middle), skills.slice(middle)] as const;
}

function SkillCard({ skill }: { skill: Skill }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = isImageLike(skill.icon) && !imageFailed;
  const fallbackLabel = getFallbackLabel(skill);

  return (
    <Link
      href={`/skills/${skill.id}`}
      className="group border-border bg-surface-elevated/60 shadow-3xs hover:border-primary/40 hover:bg-primary-subtle flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xs sm:w-44"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-105">
        {hasImage ? (
          <Image
            src={skill.icon || ""}
            alt={skill.title}
            fill
            sizes="40px"
            unoptimized
            className="object-contain p-0.5 opacity-80 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="text-muted-foreground group-hover:text-primary max-w-full truncate px-1 text-xs font-bold tracking-wider">
            {fallbackLabel}
          </span>
        )}
      </div>
      <p className="text-foreground/80 group-hover:text-primary w-full truncate text-xs font-semibold transition-colors">
        {skill.title}
      </p>
    </Link>
  );
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

  const rows = useMemo(() => splitIntoRows(skills), [skills]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={sectionVariants({ variant })}>
        <div className={cn(containerVariants({ size }))}>
          {!hideHeader && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Skeleton className="h-5 w-28 self-center rounded" />
              <Skeleton className="h-11 w-full max-w-2xl self-center rounded" />
            </div>
          )}
          <div className="mt-10 w-full space-y-4">
            {Array.from({ length: 2 }).map((_, rIndex) => (
              <div key={rIndex} className="flex justify-center gap-4 overflow-hidden py-1">
                {Array.from({ length: Math.min(Math.ceil(requestedLimit / 2), 6) }).map(
                  (__, index) => (
                    <Skeleton key={index} className="h-24 w-44 shrink-0 rounded-xl" />
                  )
                )}
              </div>
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

        <div className="relative mx-auto mt-10 flex w-full flex-col items-center justify-center overflow-hidden py-1">
          <div className="from-background via-background/60 pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent lg:w-24" />
          <div className="from-background via-background/60 pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent lg:w-24" />

          <div className="flex w-full flex-col items-center justify-center space-y-4">
            <Marquee pauseOnHover className="w-full justify-center [--duration:35s] [--gap:1rem]">
              {rows[0].map((skill, index) => (
                <SkillCard key={`row1-${skill.id ? String(skill.id) : index}`} skill={skill} />
              ))}
            </Marquee>

            {rows[1].length > 0 && (
              <Marquee
                reverse
                pauseOnHover
                className="w-full justify-center [--duration:40s] [--gap:1rem]"
              >
                {rows[1].map((skill, index) => (
                  <SkillCard key={`row2-${skill.id ? String(skill.id) : index}`} skill={skill} />
                ))}
              </Marquee>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
