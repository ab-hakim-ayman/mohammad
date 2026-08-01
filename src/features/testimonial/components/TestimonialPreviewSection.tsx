"use client";

import Image from "next/image";
import { MapPin, Tag, Quote } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/shared/i18n";
import { PreviewSectionHeader } from "@/shared/components";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { usePublishedTestimonials } from "../hooks/useTestimonial";
import type { Testimonial } from "../types/testimonial.types"; // 👈 আপনার প্রজেক্টের Testimonial টাইপ নিশ্চিত করুন

interface TestimonialPreviewSectionProps {
  limit?: number;
  featured?: boolean;

  // 🟢 ১. যেকোনো Details Page থেকে কাস্টম টেস্টিনোমিয়াল অ্যারে পাস করার প্রপ্স
  items?: Testimonial[];
  testimonials?: Testimonial[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

type TestimonialMeta = Testimonial & {
  location?: string | null;
  clientLocation?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  address?: string | null;
  tag?: string | null;
  clientTag?: string | null;
  testimonialTag?: string | null;
  industry?: string | null;
  category?: string | null;
  service?: string | null;
  tags?: string | string[] | null;
  avatar?: string | null;
  authorImage?: string | null;
  profileImage?: string | null;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getFirstText(...values: Array<string | string[] | null | undefined>) {
  for (const value of values) {
    if (Array.isArray(value)) {
      const firstValue = value.find((item) => typeof item === "string" && item.trim());
      if (firstValue) return firstValue.trim();
      continue;
    }
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function getShortLabel(value: string, maxLength = 22) {
  if (!value) return "";
  return value.length <= maxLength ? value : `${value.slice(0, maxLength).trim()}…`;
}

function AuthorAvatar({ testimonial }: { testimonial: Testimonial }) {
  const meta = testimonial as TestimonialMeta;
  const avatarSource = getFirstText(
    testimonial.authorImage,
    meta.avatar,
    meta.authorImage,
    meta.profileImage
  );

  const [imageError, setImageError] = useState(false);

  if (!avatarSource || imageError) {
    return (
      <div className="border-primary/20 bg-primary/10 text-primary shadow-3xs flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
        {getInitials(testimonial.authorName)}
      </div>
    );
  }

  return (
    <div className="border-border bg-surface-elevated relative h-12 w-12 shrink-0 overflow-hidden rounded-full border">
      <Image
        src={avatarSource}
        alt={testimonial.authorName}
        fill
        sizes="48px"
        unoptimized
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

function QuoteTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const meta = testimonial as TestimonialMeta;

  const locationValue = getFirstText(
    meta.location,
    meta.clientLocation,
    meta.city,
    meta.region,
    meta.country,
    meta.address
  );

  const tagValue = getFirstText(
    meta.tag,
    meta.clientTag,
    meta.testimonialTag,
    meta.industry,
    meta.category,
    meta.service,
    meta.tags
  );

  const locationLabel = getShortLabel(locationValue || "Global");
  const tagLabel = getShortLabel(tagValue || "Client");
  const authorMeta = [testimonial.authorPosition].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/testimonials/${testimonial.id}`}
      className="group border-border bg-card/50 text-foreground shadow-3xs hover:border-primary/30 hover:bg-card focus-visible:ring-primary/20 block w-full rounded-none border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:outline-hidden sm:rounded-lg xl:p-6"
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="border-border bg-background/50 text-muted-foreground shadow-3xs inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-bold">
              <MapPin className="text-primary/70 h-3 w-3" />
              <span>{locationLabel}</span>
            </span>

            <span className="border-border bg-background/50 text-muted-foreground shadow-3xs inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-bold">
              <Tag className="text-primary/70 h-3 w-3" />
              <span>{tagLabel}</span>
            </span>
          </div>

          <div className="relative mt-3 xl:mt-4">
            <Quote className="text-primary/5 pointer-events-none absolute -top-2 -left-2 h-7 w-7 opacity-40" />
            <p className="text-foreground/90 relative z-10 text-sm leading-relaxed font-semibold tracking-tight break-words">
              &ldquo;{testimonial.message?.trim()}&rdquo;
            </p>
          </div>
        </div>

        <div className="border-border mt-4 flex items-center gap-3 border-t pt-3 xl:mt-6 xl:pt-4">
          <AuthorAvatar testimonial={testimonial} />
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-xs font-bold">{testimonial.authorName}</p>
            {authorMeta && (
              <p className="text-muted-foreground mt-0.5 truncate text-xs font-medium">
                {authorMeta}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function TestimonialMarqueeColumn({
  testimonials,
  reverse = false,
  className,
}: {
  testimonials: Testimonial[];
  reverse?: boolean;
  className?: string;
}) {
  if (!testimonials.length) return null;

  const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={cn("group/marquee relative h-full overflow-hidden", className)}>
      <div
        className={cn(
          "animate-marquee-vertical flex min-h-full transform-gpu flex-col gap-3 will-change-transform [--duration:45s] backface-hidden xl:gap-4",
          reverse && "[animation-direction:reverse]",
          "group-hover/marquee:[animation-play-state:paused]"
        )}
      >
        {marqueeItems.map((testimonial, index) => (
          <QuoteTestimonialCard
            key={`${testimonial.id ? String(testimonial.id) : index}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}

export function TestimonialPreviewSection({
  limit = 8,
  featured = true,
  items: externalItems,
  testimonials: legacyTestimonials,
  eyebrow = "Testimonials",
  title = "Client voices across recent delivery work",
  description = "A simplified testimonial preview surface that can later evolve independently from the full testimonial experience.",
  href = "/testimonials",
  ctaLabel = "All testimonials",
  hideHeader = false,
}: TestimonialPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyTestimonials;

  // 🎯 বাইর থেকে items/testimonials পাস করা থাকলে API ফেচ স্কিপ হবে
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

  const columns = useMemo(() => {
    const cols = [[], [], []] as [Testimonial[], Testimonial[], Testimonial[]];
    testimonials.forEach((item, idx) => {
      cols[idx % 3].push(item);
    });
    return cols;
  }, [testimonials]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className="bg-background/50 3xl:py-24 5xl:py-28 relative isolate overflow-hidden py-12 md:py-16 xl:py-20">
        <div className="container-custom 3xl:gap-12 3xl:grid-cols-5 5xl:grid-cols-8 grid items-center gap-8 lg:grid-cols-[0.38fr_0.62fr] xl:gap-10">
          <div className="animate-pulse space-y-4">
            {!hideHeader && (
              <>
                <div className="bg-surface-elevated/50 h-3 w-20 rounded" />
                <div className="bg-surface-elevated/50 h-10 max-w-sm rounded" />
                <div className="bg-surface-elevated/50 h-16 max-w-xs rounded" />
              </>
            )}
          </div>
          <div className="3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 grid h-128 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-surface-elevated/40 h-full w-full animate-pulse rounded-none sm:rounded-lg" />
            <div className="bg-surface-elevated/40 hidden h-full w-full animate-pulse rounded-md sm:block" />
            <div className="bg-surface-elevated/40 hidden h-full w-full animate-pulse rounded-md lg:block" />
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা কোনো টেস্টিনোমিয়াল ডাটা না থাকলে সেকশনটি অটোমেটিক হাইড থাকবে
  if ((shouldFetch && error) || testimonials.length === 0) return null;

  return (
    <section className="text-foreground bg-background 3xl:py-24 5xl:py-28 relative isolate overflow-hidden py-12 md:py-16 xl:py-20">
      <div
        aria-hidden="true"
        className="bg-primary/5 pointer-events-none absolute top-1/4 -right-40 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/5 pointer-events-none absolute bottom-1/4 -left-40 h-80 w-80 rounded-full blur-3xl"
      />

      <div className="container-custom 3xl:gap-12 3xl:grid-cols-5 5xl:grid-cols-8 relative z-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-center xl:gap-10">
        {!hideHeader && (
          <div className="flex items-center">
            <PreviewSectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
              className="flex-col sm:flex-col sm:items-start lg:flex-col"
            />
          </div>
        )}

        <div className={cn("relative h-[560px] overflow-hidden", hideHeader && "lg:col-span-2")}>
          <div className="from-background via-background/60 pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b to-transparent" />
          <div className="from-background via-background/60 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t to-transparent" />

          <div className="3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 box-border grid h-full grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:gap-4">
            <TestimonialMarqueeColumn testimonials={columns[0]} />
            <TestimonialMarqueeColumn
              testimonials={columns[1]}
              reverse
              className="hidden sm:block"
            />
            <TestimonialMarqueeColumn testimonials={columns[2]} className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
