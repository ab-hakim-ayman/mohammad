"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { cn } from "@/lib/utils";
import { usePublishedTestimonials } from "../hooks/useTestimonial";
import type { Testimonial } from "../types/testimonial.types";

interface TestimonialPreviewSectionProps {
  limit?: number;
  featured?: boolean;
  items?: Testimonial[];
  testimonials?: Testimonial[];
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

type TestimonialMeta = Testimonial & {
  avatar?: string | null;
  authorImage?: string | null;
  profileImage?: string | null;
};

export function TestimonialPreviewSection({
  limit = 8,
  featured = true,
  items: externalItems,
  testimonials: legacyTestimonials,
  eyebrow = "Testimonial",
  title = "This is title",
  description = "This is description",
  href = "",
  ctaLabel = "",
  hideHeader = true,
}: TestimonialPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyTestimonials;
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedTestimonials(
    shouldFetch ? featured : undefined,
    shouldFetch ? requestedLimit : undefined
  );

  const testimonials = useMemo<Testimonial[]>(() => {
    if (initialItems) {
      return [...initialItems].slice(0, requestedLimit);
    }
    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Testimonial[];
    return [...rawList].slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className="bg-background py-16 w-full border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-muted h-64 w-full animate-pulse rounded-xl" />
        </div>
      </section>
    );
  }

  if ((shouldFetch && error) || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];
  const meta = currentTestimonial as TestimonialMeta;
  const avatarSource = currentTestimonial.authorImage || meta.avatar || meta.profileImage;
  const authorMeta = currentTestimonial.authorPosition || "Client Partner";

  return (
    <section className="relative w-full bg-background/50 border-t border-border/40 py-16 lg:py-20 overflow-hidden">
      {/* Standard Container matching other sections (max-w-7xl) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

        {!hideHeader && (
          <div className="mb-12 text-center">
            <PreviewSectionHeader
              variant="center"
              eyebrow={eyebrow || undefined}
              title={title}
              description={description || undefined}
              href={href || undefined}
              ctaLabel={ctaLabel || undefined}
            />
          </div>
        )}

        {/* Testimonial Content Wrapper */}
        <div className="relative w-full flex flex-col md:flex-row items-center gap-8 lg:gap-14">

          {/* Left Side: Client Image (Sharp/Square corners as per screenshot) */}
          <div className="relative aspect-square w-52 sm:w-60 lg:w-72 shrink-0 overflow-hidden rounded-none bg-muted border border-border/80">
            {avatarSource ? (
              <Image
                src={avatarSource}
                alt={currentTestimonial.authorName}
                fill
                sizes="(max-width: 768px) 240px, 280px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground/60 font-bold text-2xl">
                {currentTestimonial.authorName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Right Side: Stars, Message, Author Name & Aligned Buttons */}
          <div className="flex flex-col justify-between flex-1 space-y-6 w-full text-left">

            <div className="space-y-4">
              {/* Rating Stars */}
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              {/* Message */}
              <p className="text-foreground text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed tracking-tight">
                &ldquo;{currentTestimonial.message?.trim()}&rdquo;
              </p>
            </div>

            {/* Bottom Row: Author Details + Nav Buttons Aligned */}
            <div className="flex items-end justify-between w-full pt-2">
              <div>
                <h4 className="text-foreground font-semibold text-base sm:text-lg">
                  {currentTestimonial.authorName}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                  {authorMeta}
                </p>
              </div>

              {/* Navigation Buttons (Slightly rounded, positioned alongside author info) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border-strong transition cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border-strong transition cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
