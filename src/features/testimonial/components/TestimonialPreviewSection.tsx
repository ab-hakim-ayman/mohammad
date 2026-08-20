"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
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
  featured = false,
  items: externalItems,
  testimonials: legacyTestimonials,
  eyebrow = "Testimonials",
  title = "What clients say",
  description = "Feedback from engineering teams and founders I've collaborated with.",
  href = "/testimonials",
  ctaLabel = "All reviews",
  hideHeader = false,
}: TestimonialPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyTestimonials;
  const shouldFetch = !initialItems;

  const { data, isLoading, error } = usePublishedTestimonials(
    shouldFetch && featured ? true : undefined,
    shouldFetch ? requestedLimit : undefined
  );

  const testimonials = useMemo<Testimonial[]>(() => {
    if (initialItems) {
      return [...initialItems].slice(0, requestedLimit);
    }
    const list = (data?.data || (Array.isArray(data) ? data : [])) as Testimonial[];
    return list.slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // আইটেম লেন্থ কমে গেলে স্টেট রিসেট
  useEffect(() => {
    if (currentIndex >= testimonials.length && testimonials.length > 0) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  const handlePrev = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (shouldFetch && isLoading) {
    return (
      <section className="bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6 py-12 sm:py-16">
        <div className="container-custom mx-auto w-full">
          <div className="relative w-full flex flex-col md:flex-row items-center gap-8 lg:gap-14 animate-pulse">
            <div className="relative aspect-square w-52 sm:w-60 lg:w-72 shrink-0 bg-muted/60 rounded-2xl border border-border/60" />
            <div className="flex flex-col justify-between flex-1 space-y-6 w-full text-left">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-muted/70 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2.5">
                  <div className="h-6 bg-muted/70 rounded-md w-full" />
                  <div className="h-6 bg-muted/70 rounded-md w-5/6" />
                  <div className="h-6 bg-muted/70 rounded-md w-2/3" />
                </div>
              </div>
              <div className="flex items-end justify-between w-full pt-2">
                <div className="space-y-2">
                  <div className="h-5 bg-muted/70 rounded-md w-36" />
                  <div className="h-3.5 bg-muted/70 rounded-md w-24" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-muted/60 rounded-xl border border-border/60" />
                  <div className="h-10 w-10 bg-muted/60 rounded-xl border border-border/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if ((shouldFetch && error) || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];
  if (!currentTestimonial) return null;

  const meta = currentTestimonial as TestimonialMeta;
  const avatarSource = currentTestimonial.authorImage || meta.avatar || meta.profileImage;
  const authorMeta = currentTestimonial.authorPosition || "Client Partner";

  return (
    <section className="bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6 py-12 sm:py-16">
      <div className="container-custom mx-auto w-full">
        {!hideHeader && (
          <div className="mb-12 text-center">
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

        <div className="relative w-full flex flex-col md:flex-row items-center gap-8 lg:gap-14">
          {/* Avatar / Profile */}
          <div className="relative aspect-square w-52 sm:w-60 lg:w-72 shrink-0 overflow-hidden rounded-2xl bg-muted/50 border border-border/80 shadow-xs">
            {avatarSource ? (
              <Image
                src={avatarSource}
                alt={currentTestimonial.authorName}
                fill
                sizes="(max-width: 768px) 240px, 280px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground/60 font-bold text-2xl">
                {currentTestimonial.authorName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Testimonial Details */}
          <div className="flex flex-col justify-between flex-1 space-y-6 w-full text-left">
            <div className="space-y-4">
              {/* Rating Stars */}
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isFilled = i < (currentTestimonial.rating || 5);
                  return (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isFilled
                          ? "fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400"
                          : "text-muted-foreground/20 fill-transparent"
                      )}
                    />
                  );
                })}
              </div>

              {/* Quote Message */}
              <p className="text-foreground text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed tracking-tight">
                &ldquo;{currentTestimonial.message?.trim()}&rdquo;
              </p>
            </div>

            {/* Bottom Row */}
            <div className="flex items-end justify-between w-full pt-2">
              <div>
                <h4 className="text-foreground font-semibold text-base sm:text-lg">
                  {currentTestimonial.authorName}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 font-medium">
                  {authorMeta}
                </p>
              </div>

              {/* Navigation Controls */}
              {testimonials.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-card/65 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border-strong transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-card/65 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border-strong transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}