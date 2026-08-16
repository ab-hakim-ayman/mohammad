"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedServices } from "../hooks/useService";
import type { Service } from "../types/service.types";
import { ServiceCard } from "./ServiceCard"; // 👈 আপনার তৈরি করা ServiceCard ইমপোর্ট করা হলো

interface ServicePreviewSectionProps {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে কাস্টম সার্ভিস অ্যারে পাস করার প্রপ্স
  items?: Service[];
  services?: Service[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function ServicePreviewSection({
  limit = 4,
  items: externalItems,
  services: legacyServices,
  eyebrow = "Services",
  title = "How we can help",
  description = "Explore the service pillars we use to shape reliable launches, faster iteration cycles, and cleaner product operations.",
  href = "/services",
  ctaLabel = "All services",
  hideHeader = false,
}: ServicePreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyServices;

  // 🎯 যদি বাইর থেকে items/services না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !initialItems;

  const { data, isLoading: isApiLoading, error } = usePublishedServices(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const services = useMemo<Service[]>(() => {
    if (initialItems) {
      return [...initialItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawList = (data?.data?.data || (Array.isArray(data) ? data : [])) as Service[];
    return [...rawList]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className="bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6 py-12 sm:py-16">
        <div className="container-custom mx-auto w-full">
          {!hideHeader && (
            <div className="bg-surface-elevated/50 mb-10 h-10 w-56 animate-pulse rounded-none sm:rounded-lg" />
          )}

          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface-elevated/50 h-[430px] w-full shrink-0 animate-pulse rounded-none border sm:w-[calc(50%-12px)] sm:rounded-xl lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা কোনো সার্ভিস ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if ((shouldFetch && error) || services.length === 0) return null;

  return (
    <section className="bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6 py-12 sm:py-16">
      <div className="container-custom mx-auto w-full">
        {!hideHeader && (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        )}

        {/* 🔧 REUSABLE SERVICE CARD MATRIX */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {services.map((service, index) => (
            <div
              key={service.id ? String(service.id) : index}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] flex"
            >
              <ServiceCard
                service={service}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}