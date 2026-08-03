"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePublishedClients } from "../hooks/useClient";
import type { Client } from "../types/client.types";
import { ClientCard } from "./ClientCard"; // 👈 আপনার তৈরি করা ClientCard ইম্পোর্ট করা হলো

interface ClientPreviewSectionProps {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে ম্যানুয়ালি ক্লায়েন্ট অ্যারে পাস করার ব্যবস্থা
  items?: Client[];

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function ClientPreviewSection({
  limit = 14,
  items: externalItems,
  eyebrow = "Client roster",
  title = "Trusted by ambitious teams and growing businesses",
  description = "A selection of organizations we are proud to support through meaningful digital work.",
  href = "/clients",
  ctaLabel = "View all clients",
  hideHeader = false,
}: ClientPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);

  // 🎯 যদি বাইর থেকে items না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !externalItems;

  const { data, isLoading: isApiLoading } = usePublishedClients(
    shouldFetch ? { limit: requestedLimit } : undefined
  );

  const visibleClients = useMemo(() => {
    // 🎯 বাইর থেকে সরাসরি items পাস করলে সেটি প্রাধান্য পাবে
    if (externalItems) {
      return [...externalItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawData = data?.data || (Array.isArray(data) ? data : []);
    return [...rawData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, requestedLimit);
  }, [externalItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  // 🟢 স্কেলেটন লেআউট
  if (isLoading) {
    return (
      <section className="bg-background 3xl:py-24 relative isolate w-full overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          {!hideHeader && (
            <div className="mb-8 space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-72 rounded" />
              <Skeleton className="h-5 w-96 rounded" />
            </div>
          )}

          <div className="flex w-full flex-wrap items-stretch justify-center gap-3">
            {Array.from({ length: requestedLimit }).map((_, i) => (
              <div
                key={i}
                className="flex w-[calc(50%-0.5rem)] max-w-[200px] shrink-0 flex-col sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.05rem)]"
              >
                <Skeleton className="h-[130px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if (!visibleClients.length) return null;

  return (
    <section className="bg-background 3xl:py-24 relative isolate w-full overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />

      <div className="container-custom relative">
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

        {/* 🔧 REUSABLE CLIENT CARD MATRIX */}
        <div className="flex w-full flex-wrap items-stretch justify-center gap-3">
          {visibleClients.map((client, index) => (
            <ScrollReveal
              key={client.id ? String(client.id) : index}
              delay={(index % 7) * 40}
              className="flex w-[calc(50%-0.5rem)] max-w-[200px] shrink-0 flex-col sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.05rem)]"
            >
              <ClientCard
                client={client}
                className="h-full w-full"
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}