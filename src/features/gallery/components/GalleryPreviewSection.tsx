"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { GalleryCard } from "./GalleryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedGalleries } from "../hooks/useGallery";
import type { Gallery } from "../types/gallery.types"; // 👈 আপনার প্রজেক্টের Gallery টাইপ ফাইল ইম্পোর্ট করুন

const sectionVariants = cva(
  "relative w-full transition-all duration-500 overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-transparent border-0 shadow-none",
        glassmorphic: "bg-transparent border-0 shadow-none",
        brutalist: "bg-transparent border-0 shadow-none",
        "gradient-glow": "bg-transparent border-0 shadow-none",
        minimal: "bg-transparent border-0 shadow-none",
      },
      size: {
        sm: "py-2",
        default: "py-4",
        lg: "py-6",
      },
    },
    defaultVariants: {
      variant: "classic",
      size: "default",
    },
  }
);

const containerVariants = cva(
  "container-custom flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-6",
        default: "py-12",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface GalleryPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
  limit?: number;

  // 🟢 ১. কাস্টম গ্যালারি ডাটা পাস করার প্রপস
  items?: Gallery[];
  galleries?: Gallery[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;

  cardVariant?: "classic" | "glassmorphic" | "brutalist" | "gradient-glow" | "banner";
}

export function GalleryPreviewSection({
  limit = 4,
  items: externalItems,
  galleries: legacyGalleries,
  eyebrow = "Gallery",
  title = "Visual Highlights",
  description = "Explore snapshots of our latest innovations and events.",
  href = "/galleries",
  ctaLabel = "All galleries",
  variant = "classic",
  size,
  hideHeader = false,
  cardVariant = "classic",
}: GalleryPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyGalleries;

  // 🎯 বাইর থেকে items পাস করা হলে API ফেচ স্কিপ হবে
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedGalleries(shouldFetch ? { limit: requestedLimit } : undefined);

  const galleries = useMemo<Gallery[]>(() => {
    if (initialItems) {
      return [...initialItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Gallery[];
    return [...rawList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={cn("relative w-full px-4 sm:px-6", sectionVariants({ variant, size }))}>
        <div className={containerVariants({ size })}>
          {!hideHeader && (
            <div className="mb-10 flex w-full flex-col items-center justify-center space-y-3 text-center">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-9 w-64 rounded-lg" />
            </div>
          )}

          <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[360px] w-full shrink-0 rounded-xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ডাটা না থাকলে অটোমেটিক পুরো সেকশন হাইড হবে
  if ((shouldFetch && error) || !galleries.length) return null;

  return (
    <section
      className={cn(
        "bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6",
        sectionVariants({ variant, size })
      )}
    >
      <div className={containerVariants({ size })}>
        {variant !== "minimal" && variant !== "brutalist" && (
          <div
            aria-hidden="true"
            className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          />
        )}

        {!hideHeader && (
          <div className="mb-6 flex w-full flex-col items-center justify-center text-center">
            <ScrollReveal className="w-full">
              <PreviewSectionHeader
                variant="center"
                eyebrow={eyebrow}
                title={title}
                description={description}
                href={href}
                ctaLabel={ctaLabel}
              />
            </ScrollReveal>
          </div>
        )}

        <div className="mt-6 w-full">
          {/* 🎯 Centered + Fluid Responsive Matrix Grid */}
          <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
            {galleries.map((gallery, index) => (
              <ScrollReveal
                key={gallery.id ? String(gallery.id) : index}
                delay={(index % 4) * 60}
                className="flex w-full shrink-0 flex-col sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <GalleryCard
                  gallery={gallery}
                  variant={cardVariant || "classic"}
                  size="md"
                  className="h-full w-full"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
