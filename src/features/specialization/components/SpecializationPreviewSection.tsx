"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePublishedSpecializations } from "../hooks/useSpecialization";
import type { Specialization } from "../types/specialization.types";
import { SpecializationCard } from "./SpecializationCard"; // 👈 আপনার তৈরি করা SpecializationCard ইমপোর্ট করা হলো

const sectionVariants = cva("relative w-full transition-all duration-500 overflow-hidden", {
  variants: {
    variant: {
      classic: "bg-transparent",
      glassmorphic: "bg-transparent",
      brutalist: "bg-transparent",
      "gradient-glow": "bg-transparent",
      minimal: "bg-transparent",
    },
    size: {
      sm: "py-6",
      default: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    variant: "classic",
    size: "default",
  },
});

const containerVariants = cva(
  "container-custom mx-auto w-full flex flex-col items-center justify-center text-center"
);

interface SpecializationPreviewSectionProps
  extends VariantProps<typeof sectionVariants> {
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

export function SpecializationPreviewSection({
  limit = 4,
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
      <section className={cn("bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6", sectionVariants({ variant, size }))}>
        <div className={cn(containerVariants())}>
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
        "bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6",
        sectionVariants({ variant, size })
      )}
    >
      <div className={containerVariants()}>
        {!hideHeader && (
          <div className="flex w-full flex-col items-center justify-center text-center">
            <PreviewSectionHeader
              variant="split"
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </div>
        )}

        {/* 🔧 REUSABLE SPECIALIZATION CARD MATRIX */}
        <div className="mx-auto mt-12 flex w-full flex-wrap items-stretch justify-center gap-6">
          {specializations.map((spec, index) => (
            <div
              key={spec.id ? String(spec.id) : index}
              className="flex w-full shrink-0 flex-col sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
            >
              <SpecializationCard
                specialization={spec}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}