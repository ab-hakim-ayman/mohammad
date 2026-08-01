"use client";

import Image from "next/image";
import { ChevronRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";
import { usePublishedEvents } from "../hooks/useEvent";
import { Event } from "../types/event.types"; // 👈 আপনার প্রজেক্টের Event টাইপ ইম্পোর্ট করুন

function formatDate(value: Date | string | null | undefined, locale: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function stripHtml(input: string | null | undefined) {
  return (input || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, maxLength: number) {
  if (input.length <= maxLength) {
    return input;
  }

  return `${input.slice(0, maxLength).trimEnd()}...`;
}

interface EventPreviewSectionProps {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে ম্যানুয়ালি ইভেন্ট অ্যারে পাস করার ব্যবস্থা
  items?: Event[];

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function EventPreviewSection({
  limit = 4,
  items: externalItems,
  eyebrow = "Events",
  title = "Discover our upcoming events",
  description = "Explore and participate in our latest tech workshops and meetups.",
  href = "/events",
  ctaLabel = "All events",
  hideHeader = false,
}: EventPreviewSectionProps) {
  const locale = useLocale();
  const requestedLimit = Math.max(limit, 1);

  // 🎯 যদি বাইর থেকে items না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !externalItems;

  const { data, isLoading: isApiLoading, error } = usePublishedEvents(
    shouldFetch ? { limit: requestedLimit } : undefined
  );

  const events = useMemo(() => {
    // 🎯 বাইর থেকে সরাসরি items পাস করলে সেটি প্রাধান্য পাবে
    if (externalItems) {
      return [...externalItems]
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
        .slice(0, requestedLimit);
    }

    const rawList = data?.data || (Array.isArray(data) ? data : []);
    return [...rawList]
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, requestedLimit);
  }, [externalItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className="bg-background 3xl:py-24 5xl:py-32 relative isolate w-full overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          {!hideHeader && (
            <div className="mb-10 space-y-2">
              <div className="bg-surface-elevated/50 h-8 w-48 animate-pulse rounded" />
              <div className="bg-surface-elevated/50 h-4 w-72 animate-pulse rounded" />
            </div>
          )}

          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface-elevated/40 min-h-[430px] w-full shrink-0 animate-pulse rounded-none border sm:w-[calc(50%-12px)] sm:rounded-xl lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা ইভেন্ট না থাকলে সেকশনটি অটোমেটিক হাইড হবে
  if ((shouldFetch && error) || events.length === 0) {
    return null;
  }

  return (
    <section className="bg-background 3xl:py-28 5xl:py-36 relative isolate w-full overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="container-custom">
        {/* 🎯 hideHeader = false হলেই কেবল হেডার দেখাবে */}
        {!hideHeader && (
          <ScrollReveal className="mb-10">
            <PreviewSectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </ScrollReveal>
        )}

        {/* 🔧 EXACT SAME CARD MATRIX & HOVER STYLES */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {events.map((event) => {
            const dateLabel = formatDate(event.startsAt, locale);
            const eventDescription = truncate(stripHtml(event.shortDesc) || "No Description", 150);

            return (
              <article
                key={event.id}
                className={cn(
                  "group border-border bg-background relative isolate z-0 min-h-[430px] w-full shrink-0 cursor-pointer overflow-hidden rounded-none border transition-all duration-500 ease-out focus-within:z-10 hover:z-10 sm:w-[calc(50%-12px)] sm:rounded-xl lg:w-[calc(33.333%-16px)] lg:focus-within:scale-[1.025] lg:focus-within:shadow-lg lg:hover:scale-[1.025] lg:hover:shadow-lg xl:w-[calc(25%-18px)]"
                )}
              >
                {event.cardImage ? (
                  <Image
                    src={event.cardImage}
                    alt={event.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-all duration-700 ease-out motion-reduce:transition-none lg:group-focus-within:scale-105 lg:group-focus-within:opacity-0 lg:group-focus-within:blur-xs lg:group-hover:scale-105 lg:group-hover:opacity-0 lg:group-hover:blur-xs"
                  />
                ) : (
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out lg:group-focus-within:scale-105 lg:group-focus-within:opacity-0 lg:group-focus-within:blur-xs lg:group-hover:scale-105 lg:group-hover:opacity-0 lg:group-hover:blur-xs",
                      "bg-surface-elevated/40"
                    )}
                  />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/85 transition-opacity duration-500 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0"
                />

                {!event.cardImage ? (
                  <Sparkles className="text-muted-foreground/20 absolute right-6 bottom-6 h-9 w-9 transition-opacity duration-500 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0" />
                ) : null}

                <div className="relative flex h-full flex-col p-6 sm:p-7">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-white/75 uppercase transition-colors duration-500 lg:group-focus-within:text-white lg:group-hover:text-white">
                      {dateLabel || "Upcoming"}
                    </p>

                    <h3 className="mt-5 text-2xl leading-[1.12] font-semibold tracking-[-0.045em] text-white transition-colors duration-500 sm:text-[1.7rem] lg:group-focus-within:text-white lg:group-hover:text-white">
                      {event.title}
                    </h3>
                  </div>

                  <div className="mt-auto">
                    <div className="transition-all duration-500 ease-out motion-reduce:transition-none lg:translate-y-6 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                      <p className="text-sm leading-6 text-white/80 transition-colors duration-500 lg:group-focus-within:text-white lg:group-hover:text-white">
                        {eventDescription}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70 transition-colors duration-500 lg:group-focus-within:text-white lg:group-hover:text-white">
                        {dateLabel ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {dateLabel}
                          </span>
                        ) : null}

                        {event.location ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <Link
                      href={`/events/${event.slug}`}
                      className="group/expand focus-visible:ring-primary focus-visible:ring-offset-background mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white outline-hidden transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-4 lg:translate-y-4 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:text-white lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:text-white lg:group-hover:opacity-100"
                    >
                      <span className="relative">
                        <I18n>Expand</I18n>
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/expand:scale-x-100 group-focus-visible/expand:scale-x-100" />
                      </span>

                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/expand:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}