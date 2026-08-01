"use client";

import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { Link } from "@/shared/i18n";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { usePublishedSpecializations } from "../hooks/useSpecialization";
import type { Specialization } from "../types/specialization.types"; // 👈 আপনার প্রজেক্টের Specialization টাইপ নিশ্চিত করুন

const sectionVariants = cva(
  "relative w-full transition-all duration-300 overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-background border-border shadow-xs",
        glassmorphic: "bg-background/60 backdrop-blur-md border-border shadow-xs",
        brutalist: "bg-background border-3 border-foreground shadow-brutal rounded-none",
        "gradient-glow":
          "bg-background border-border shadow-brand relative after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent",
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
        sm: "py-12",
        default: "py-16",
        lg: "py-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface SpecializationPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে কাস্টম স্পেশালাইজেশন অ্যারে পাস করার প্রপ্স
  items?: Specialization[];
  specializations?: Specialization[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

function isMediaUrl(value?: string | null) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value.trim());
}

function truncate(input: string, maxLength: number) {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength).trimEnd() + "...";
}

function cleanExcerpt(input: string | null | undefined) {
  return (input || "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|\/)[^)]+\)/gi, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/\b(?:https?:\/\/|www\.)[^\s<]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function SpecializationPreviewSection({
  limit = 8,
  items: externalItems,
  specializations: legacySpecializations,
  eyebrow = "Specializations",
  title = "Deep technical expertise across modern systems",
  description = "Public specialization tracks presented as a compact preview layer, independent from the full archive.",
  href = "/specializations",
  ctaLabel = "All specializations",
  hideHeader = false,
  variant,
  size,
}: SpecializationPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacySpecializations;

  // 🎯 যদি বাইর থেকে items না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !initialItems;

  const { data, isLoading: isApiLoading, error } = usePublishedSpecializations();

  const specializations = useMemo<Specialization[]>(() => {
    if (initialItems) {
      return [...initialItems].slice(0, requestedLimit);
    }

    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Specialization[];
    return [...rawList].slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={sectionVariants({ variant })}>
        <div className={containerVariants({ size })}>
          {!hideHeader && (
            <div className="bg-surface-elevated/50 mb-8 h-10 w-64 animate-pulse rounded" />
          )}
          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-6">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <div
                key={index}
                className="flex w-full shrink-0 flex-col sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <div className="border-border bg-surface-elevated/30 mx-auto h-[420px] w-full animate-pulse rounded-xl border" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা কোনো স্পেশালাইজেশন ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if ((shouldFetch && error) || specializations.length === 0) return null;

  return (
    <section
      className={cn(
        "relative isolate mx-auto justify-center overflow-hidden",
        sectionVariants({ variant })
      )}
    >
      <div className={containerVariants({ size })}>
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

        <div className="mx-auto mt-12 flex w-full flex-wrap items-stretch justify-center gap-6">
          {specializations.map((spec, index) => {
            const excerpt = cleanExcerpt(spec.shortDesc);
            const rawImage = spec.heroImage?.trim();
            const imageUrl = rawImage && isMediaUrl(rawImage) ? rawImage : null;
            const rawIcon = spec.icon?.trim();
            const iconText = rawIcon && !isMediaUrl(rawIcon) ? rawIcon : null;
            const specHref = `/specializations/${spec.slug || spec.id}`;
            const imageAlt = spec.heroImageAlt || spec.title;

            return (
              <div
                key={spec.id ? String(spec.id) : index}
                className="flex w-full shrink-0 flex-col sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <article className="group border-border bg-card shadow-3xs relative isolate z-0 mx-auto h-[420px] w-full cursor-pointer overflow-hidden rounded-none border transition-all duration-400 ease-out sm:rounded-lg lg:hover:-translate-y-1.5 lg:hover:shadow-md">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-all duration-700 ease-out motion-reduce:transition-none lg:group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-surface-elevated/40 absolute inset-0 transition-all duration-700 ease-out lg:group-hover:scale-105" />
                  )}

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/85 transition-opacity duration-500 lg:group-hover:opacity-90"
                  />

                  {!imageUrl && (
                    <Sparkles className="text-background/20 absolute right-6 bottom-6 h-9 w-9 transition-opacity duration-500 lg:group-hover:opacity-0" />
                  )}

                  <div className="relative flex h-full flex-col p-6">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-white/75 uppercase transition-colors duration-500 lg:group-hover:text-white/90">
                        {iconText || "Specialization"}
                      </p>
                      <h3 className="mt-5 text-2xl leading-[1.12] font-semibold tracking-[-0.045em] text-white transition-colors duration-500 sm:text-[1.7rem] lg:group-hover:text-white">
                        {spec.title}
                      </h3>
                    </div>

                    <div className="mt-auto">
                      <div className="transition-all duration-500 ease-out motion-reduce:transition-none lg:translate-y-6 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                        <p className="text-sm leading-6 text-white/80 transition-colors duration-500 lg:group-hover:text-white/90">
                          {truncate(excerpt || "No Description", 120)}
                        </p>
                      </div>

                      <Link
                        href={specHref}
                        className="group/expand focus-visible:ring-primary focus-visible:ring-offset-background mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white outline-hidden transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-4 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:text-white lg:group-hover:opacity-100"
                      >
                        <I18n>Explore Spec</I18n>
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/expand:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
