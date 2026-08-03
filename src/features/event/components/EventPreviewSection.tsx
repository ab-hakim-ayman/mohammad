"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { usePublishedEvents } from "../hooks/useEvent";
import { Event } from "../types/event.types";
import { EventCard } from "./EventCard"; // 👈 আপনার তৈরি করা EventCard ইম্পোর্ট করা হলো

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

        {/* 🔧 REUSABLE EVENT CARD MATRIX */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {events.map((event, index) => (
            <div
              key={event.id ? String(event.id) : index}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] flex"
            >
              <EventCard
                event={event}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}