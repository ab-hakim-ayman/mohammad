"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedPartners } from "../hooks/usePartner";
import type { Partner } from "../types/partner.types";
import { PartnerCard } from "./PartnerCard";

const sectionVariants = cva(
  "relative w-full transition-all duration-300 overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-background border-border shadow-2xs",
        glassmorphic: "bg-card/40 backdrop-blur-md border-border shadow-xs",
        minimal: "bg-transparent border-0 shadow-none py-0",
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
        sm: "py-8",
        default: "py-12",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface PartnerPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
  limit?: number;

  // 🟢 ১. কাস্টম ডাটা পাস করার প্রপস
  items?: Partner[];
  partners?: Partner[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function PartnerPreviewSection({
  limit = 16,
  items: externalItems,
  partners: legacyPartners,
  eyebrow = "Our partners",
  title = "Stronger outcomes through meaningful partnerships",
  description = "We collaborate with trusted organizations, platforms, and ecosystem partners to deliver greater value.",
  href = "/partners",
  ctaLabel = "View all partners",
  hideHeader = false,
  variant,
  size,
}: PartnerPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyPartners;

  // 🎯 বাইর থেকে items পাস করা থাকলে API ফেচ স্কিপ হবে
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedPartners(shouldFetch ? { limit: requestedLimit } : undefined);

  const partners = useMemo<Partner[]>(() => {
    if (initialItems) {
      return [...initialItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Partner[];
    return [...rawList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={sectionVariants({ variant })}>
        <div className={containerVariants({ size })}>
          {!hideHeader && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Skeleton className="h-5 w-28 self-center rounded" />
              <Skeleton className="h-11 w-full max-w-2xl self-center rounded" />
            </div>
          )}
          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {Array.from({ length: Math.min(requestedLimit, 8) }).map((_, index) => (
              <Skeleton key={index} className="h-[200px] w-48 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ডাটা না থাকলে অটোমেটিক সেকশন লুকানো থাকবে
  if ((shouldFetch && error) || partners.length === 0) return null;

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

        {/* 🔧 REUSABLE PARTNER CARD STANDARD GRID MATRIX (Marquee Removed) */}
        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {partners.map((partner, index) => (
            <div
              key={partner.id ? String(partner.id) : index}
              className="flex shrink-0"
            >
              <PartnerCard
                partner={partner}
                className="w-48 h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}